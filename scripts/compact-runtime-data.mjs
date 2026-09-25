import { readdir, readFile, writeFile, rename } from 'node:fs/promises';
import { join } from 'node:path';
import { isDeepStrictEqual } from 'node:util';

// Netlify copies this directory into its server function. Keep source data
// unchanged and remove only insignificant whitespace from the deployment copy.
const root = '.next/standalone/data';
let before = 0;
let after = 0;
let count = 0;

async function compactDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) {
      await compactDirectory(file);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      const original = await readFile(file, 'utf8');
      let compact = '';
      let inString = false;
      let escaped = false;
      for (const character of original) {
        if (inString) {
          compact += character;
          if (escaped) escaped = false;
          else if (character === '\\') escaped = true;
          else if (character === '"') inString = false;
        } else if (character === '"') {
          compact += character;
          inString = true;
        } else if (!/[\t\n\r ]/.test(character)) {
          compact += character;
        }
      }
      if (!isDeepStrictEqual(JSON.parse(original), JSON.parse(compact))) {
        throw new Error(`Runtime data changed while compacting ${file}`);
      }
      before += Buffer.byteLength(original);
      after += Buffer.byteLength(compact);
      count += 1;
      // Atomic replacement also avoids altering a source file if a build
      // system produced hard-linked copies.
      await writeFile(`${file}.compact-tmp`, compact);
      await rename(`${file}.compact-tmp`, file);
    }
  }
}

await compactDirectory(root);
console.log(`Compacted ${count} runtime JSON files: ${before} -> ${after} bytes; values unchanged.`);
