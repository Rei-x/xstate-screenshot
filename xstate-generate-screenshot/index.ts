import { watch } from "chokidar";
import { client } from "./client";
import fs from "fs";
export const getScreenshotUrl = (fileContent: string) => {
  return client.createMachine.mutate({ source: fileContent });
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

  const data = await getScreenshotUrl(fileContent);

  return { ...data, filename };
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
