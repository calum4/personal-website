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

json.stripped = true;

async function genKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  );
}

async function encrypt(
  key: CryptoKey,
  text: string,
): Promise<{ iv: Uint8Array<ArrayBuffer>; cipherText: Uint8Array<ArrayBuffer> }> {
  const encoded = new TextEncoder().encode(text);
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const cipherText = new Uint8Array(
    await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      encoded,
    ),
  );

  return {
    iv,
    cipherText,
  };
}

// WARNING - This is not secure
//
// This is solely intended to essentially obfuscate email addresses in the source code as a mitigation against email
// scraping. In my testing, other methods including splitting up the domain levels and encoding with base64 were not
// sufficient to prevent LLMs from reconstructing the original email. In this sense, the use of encryption can be seen
// as a loose proof of work
new Promise<void>(async (resolve) => {
  const key = await genKey();

  const username = await encrypt(key, json.defaultCommands.email.username);
  json.defaultCommands.email.username = Array.from(username.cipherText);
  json.defaultCommands.email.usernameIv = Array.from(username.iv);

  json.defaultCommands.email.domainLevelsIv = [];
  for (let i = 0; i < json.defaultCommands.email.domainLevels.length; i++) {
    const level = await encrypt(key, json.defaultCommands.email.domainLevels[i]);
    json.defaultCommands.email.domainLevels[i] = Array.from(level.cipherText);
    json.defaultCommands.email.domainLevelsIv[i] = Array.from(level.iv);
  }

  json.defaultCommands.email.key = Array.from(
    new Uint8Array(await crypto.subtle.exportKey("raw", key)),
  );

  resolve();
}).then(() => {
  fs.writeFileSync(outputFile, JSON.stringify(json), { encoding: "utf8" });
});
