import { program } from "commander";

import { generateScreenshots } from "./index";

program
  .command("screenshots")
  .description("Generate screenshots")
  .argument("<files>", "Files to generate screenshots for")
  .action(async (filePattern: string) => {
    console.log("Generating screenshots for ", filePattern);
    const result = await generateScreenshots(filePattern);
    console.log("Done");
    result.forEach((ss) => {
      console.log(`- ${ss.filename}: ${ss.screenshotUrl}`);
    });
  });

program.parse(process.argv);
