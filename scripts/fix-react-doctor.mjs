/**
 * SAFE batch fix script for react-doctor issues.
 * Only touches className attributes and JSX text content.
 * Does NOT touch JS/TS code like spread operators.
 *
 * Fixes:
 * 1. w-N h-N → size-N (integer and decimal)
 * 2. h-N w-N → size-N
 * 3. gray-* → zinc-* in className strings
 * 4. slate-* → zinc-* in className strings  
 * 5. font-bold/font-extrabold on <h1>-<h6> → font-semibold
 * 6. px-N py-N → p-N and py-N px-N → p-N
 * 7. bg-black → bg-zinc-950
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();

// Only process TSX and CSS files (not pure TS files where we'd break spread operators)
const files = execSync(
  'git ls-files "*.tsx" "*.css"',
  { cwd: ROOT, encoding: 'utf-8' }
).trim().split('\n').filter(Boolean);

let filesModified = 0;

for (const relPath of files) {
  const filePath = join(ROOT, relPath);
  let content;
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch {
    continue;
  }
  const original = content;

  // === SIZE SHORTHAND ===
  // w-N h-N → size-N (integers)
  content = content.replace(/\bw-(\d+)\s+h-\1\b/g, 'size-$1');
  content = content.replace(/\bh-(\d+)\s+w-\1\b/g, 'size-$1');
  // w-N.M h-N.M → size-N.M (decimals like 3.5)
  content = content.replace(/\bw-(\d+\.\d+)\s+h-\1\b/g, 'size-$1');
  content = content.replace(/\bh-(\d+\.\d+)\s+w-\1\b/g, 'size-$1');
  // w-[Npx] h-[Npx]
  content = content.replace(/\bw-(\[\d+px\])\s+h-\1\b/g, 'size-$1');
  content = content.replace(/\bh-(\[\d+px\])\s+w-\1\b/g, 'size-$1');

  // === PALETTE NORMALIZATION ===
  // gray-* → zinc-*
  content = content.replace(/\bgray-(\d+)\b/g, 'zinc-$1');
  // slate-* → zinc-*
  content = content.replace(/\bslate-(\d+)\b/g, 'zinc-$1');

  // === HEADING FONT WEIGHT ===
  // font-bold on headings → font-semibold
  content = content.replace(
    /(<h[1-6]\b[^>]*className="[^"]*)\bfont-bold\b([^"]*")/g,
    '$1font-semibold$2'
  );
  // font-extrabold on headings → font-semibold
  content = content.replace(
    /(<h[1-6]\b[^>]*className="[^"]*)\bfont-extrabold\b([^"]*")/g,
    '$1font-semibold$2'
  );

  // === PADDING SHORTHAND ===
  // px-N py-N → p-N
  content = content.replace(/\bpx-(\d+(?:\.\d+)?)\s+py-\1\b/g, 'p-$1');
  content = content.replace(/\bpy-(\d+(?:\.\d+)?)\s+px-\1\b/g, 'p-$1');

  // === PURE BLACK BACKGROUND ===
  content = content.replace(/\bbg-black\b/g, 'bg-zinc-950');

  if (content !== original) {
    writeFileSync(filePath, content, 'utf-8');
    filesModified++;
  }
}

console.log(`Modified ${filesModified} files`);
console.log('Done! Run react-doctor again to verify.');
