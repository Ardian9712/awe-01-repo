import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { TextDecoder } from "node:util";

const sourceDirectory = dirname(fileURLToPath(import.meta.url));
const outputDirectory = resolve(
  sourceDirectory,
  process.env.MAKEFUN_OUTPUT_DIR ?? "/output",
);
const outputPath = resolve(outputDirectory, "entry.txt");
const text = "The old tree outside has been growing one ring a year since before your grandmother was born. It is not in a hurry. Neither is the rain that finds it, nor the light that leaves it at dusk. Rest against something that slow.";
const expectedBytes = Buffer.from(text, "utf8");

mkdirSync(outputDirectory, { recursive: true });
writeFileSync(outputPath, expectedBytes);

const writtenBytes = readFileSync(outputPath);
let writtenText: string;
try {
  writtenText = new TextDecoder("utf-8", {
    fatal: true,
    ignoreBOM: true,
  }).decode(writtenBytes);
} catch {
  throw new Error(`Invalid entry at ${outputPath}: file must be valid UTF-8 text.`);
}

const characterCount = Array.from(writtenText).length;
if (characterCount < 1 || characterCount > 280) {
  throw new Error(
    `Invalid entry at ${outputPath}: expected 1–280 Unicode code points, got ${characterCount}.`,
  );
}
if (writtenText.trim().length === 0) {
  throw new Error(`Invalid entry at ${outputPath}: text must not be only whitespace.`);
}
if (!writtenBytes.equals(expectedBytes)) {
  throw new Error(`Invalid entry at ${outputPath}: bytes differ from the chosen text.`);
}

console.log(`Wrote ${outputPath} (${characterCount} Unicode code points).`);
