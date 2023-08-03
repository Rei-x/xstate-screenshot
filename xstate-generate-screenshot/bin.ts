#!/usr/bin/env node

import { program } from "commander";
import fs from "fs";
import { generateScreenshots } from "./index";
import https from "https";

const download = async (url: string, path: string) => {
  const file = fs.createWriteStream(path);

  return new Promise<void>((resolve, reject) => {
    https
      .get(url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (error) => {
        fs.unlink(path, () => {
          reject(error);
        });
      });
  });
};

program
  .command("gen")
  .description("Generate screenshots")
  .argument("<files>", "Files to generate screenshots for")
  .action(async (filePattern: string) => {
    console.log(`Generating screenshots for ${filePattern.trim()}`);
    const result = await generateScreenshots(filePattern);

    await Promise.all(
      result.map(async (ss) => {
        console.log(`- ${ss.filename}: ${ss.url}`);

        const pathWithoutExtension = ss.filePath.replace(/\.[^.]+$/, "").trim();

        const screenshotPath = `${pathWithoutExtension}.png`;

        console.log("Saving screenshot to ", screenshotPath);

        await download(ss.screenshotUrl, screenshotPath);
      })
    );
    console.log("Done");
    process.exit(0);
  });

program.parse(process.argv);
