import * as fs from "node:fs";

let inputFile: string | null = null;
let outputFile: string | null = null;

for (const arg of process.argv) {
  if (!arg.startsWith("--")) continue;

   const [name, value] = arg.substring(2).split("=");

   switch (name) {
     case "input": {
       inputFile = value;
       break;
     }

     case "output": {
       outputFile = value;
       break;
     }
   }
}

if (inputFile === null || outputFile === null) throw new Error("missing arguments");

const file = fs.readFileSync(inputFile, "utf8");
const json = JSON.parse(file);

function removeComments(obj: any) {
  for (const key of Object.keys(obj)) {
    if (key.startsWith("__comment")) {
      delete obj[key];
      continue;
    }

    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      removeComments(obj[key]);
    }
  }
}

removeComments(json);

fs.writeFileSync(outputFile, JSON.stringify(json), {encoding: "utf8"});
