import { watch } from "chokidar";

import fs from "fs";
import lzstring from "lz-string";

import * as parse from "@xstate/machine-extractor";

export const getScreenshotUrl = (fileContent: string) => {
  const parsed = parse.extractMachinesFromFile(fileContent);

  const machine = parsed?.machines.at(0);

  const compressed = lzstring.compressToEncodedURIComponent(
    JSON.stringify(machine?.toConfig())
  );

  const machineUrl = `https://xstate-screenshot.vercel.app/machine/${compressed}`;

  const params = new URLSearchParams({
    url: machineUrl,
    element: "#canvas > div:nth-child(1) > div:nth-child(2)",
  });

  const screenshotApiUrl = `https://browser-screenshots.vercel.app/api?${params}`;

  return {
    url: machineUrl,
    screenshotUrl: screenshotApiUrl,
  };
};

export const readFileAndGetScreenshotUrl = async (filePath: string) => {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const filename = filePath.split("/").pop();

  if (!filename) {
    return;
  }

  if (!fileContent.includes("createMachine")) {
    return;
  }

  const data = getScreenshotUrl(fileContent);

  return { ...data, filename, filePath };
};

export const generateScreenshots = async (filesPattern: string) => {
  const tasks: ReturnType<typeof readFileAndGetScreenshotUrl>[] = [];

  const doneTasks = await new Promise<Awaited<(typeof tasks)[number]>[]>(
    (res) =>
      watch(filesPattern, { persistent: false })
        .on("add", (path) => {
          if (path.endsWith(".typegen.ts")) {
            return;
          }
          if (
            !path.endsWith(".ts") &&
            !path.endsWith(".tsx") &&
            !path.endsWith(".js") &&
            !path.endsWith(".jsx")
          ) {
            return;
          }
          tasks.push(readFileAndGetScreenshotUrl(path));
        })
        .on("ready", async () => {
          res(Promise.all(tasks));
        })
  );

  return doneTasks.filter(
    (task): task is NonNullable<(typeof doneTasks)[number]> => Boolean(task)
  );
};
