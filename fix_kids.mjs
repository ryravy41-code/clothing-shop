import fs from 'fs';
import path from 'path';

const kidsSrcDir = 'D:\\ETEC CENTER\\vuetypescrit\\my-project\\kids';
const kidsDstDir = 'D:\\ETEC CENTER\\vuetypescrit\\my-project\\public\\images\\kid';

const kidsFiles = fs.readdirSync(kidsSrcDir)
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp'))
  .sort();
console.log(`Kid files: ${kidsFiles.length}`);

const productsPath = 'D:\\ETEC CENTER\\vuetypescrit\\my-project\\src\\data\\products.ts';
let content = fs.readFileSync(productsPath, 'utf8');

// Replace each pinimg URL with a cycling kid file
let kidsIdx = 0;
const newContent = content.replace(
  /https:\/\/i\.pinimg\.com\/\S+/g,
  () => {
    const fileIdx = kidsIdx % kidsFiles.length;
    kidsIdx++;
    return `/images/kid/${kidsFiles[fileIdx]}`;
  }
);

fs.writeFileSync(productsPath, newContent);
console.log(`Fixed ${kidsIdx} pinimg URLs with kid images`);

// Check for any remaining pinimg URLs
const remaining = newContent.match(/https:\/\/i\.pinimg\.com\/\S+/g);
console.log(`Remaining pinimg URLs: ${remaining ? remaining.length : 0}`);

// Also copy all kids files to public/images/kid/
if (!fs.existsSync(kidsDstDir)) {
  fs.mkdirSync(kidsDstDir, { recursive: true });
}
let copied = 0;
for (const file of kidsFiles) {
  const dst = path.join(kidsDstDir, file);
  if (!fs.existsSync(dst)) {
    fs.copyFileSync(path.join(kidsSrcDir, file), dst);
    copied++;
  }
}
console.log(`Copied ${copied} new kids files`);
console.log(`Total kids files now: ${fs.readdirSync(kidsDstDir).length}`);
