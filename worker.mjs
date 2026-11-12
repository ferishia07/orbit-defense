import { readFileSync, writeFileSync } from "node:fs";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const api = readFileSync(new URL("./scores.mjs", import.meta.url), "utf8");
writeFileSync(new URL("./dist/server/index.js", import.meta.url),
  "const html = " + JSON.stringify(html) + ";\n" + api);
