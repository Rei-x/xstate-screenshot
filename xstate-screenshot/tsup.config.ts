import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts", "bin.ts"],
  dts: true,
});
