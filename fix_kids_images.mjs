import fs from 'fs';

const productsPath = 'D:\\ETEC CENTER\\vuetypescrit\\my-project\\src\\data\\products.ts';
const kidImagesDir = 'D:\\ETEC CENTER\\vuetypescrit\\my-project\\public\\images\\kid';

const kidFiles = fs.readdirSync(kidImagesDir)
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp'))
  .sort();

console.log(`Found ${kidFiles.length} kid images`);

let content = fs.readFileSync(productsPath, 'utf8');

const kidsStartMarker = "// ── KIDS";
const shoesStartMarker = "// ── SHOES";
const kidsStartIdx = content.indexOf(kidsStartMarker);
const sectionEnd = content.indexOf(shoesStartMarker);

if (kidsStartIdx === -1) {
  console.log('Kids section not found');
  process.exit(1);
}

console.log(`Kids section from ${kidsStartIdx} to ${sectionEnd}`);

const beforeKids = content.slice(0, kidsStartIdx);
const kidsSection = content.slice(kidsStartIdx, sectionEnd);
const afterKids = content.slice(sectionEnd);

let newKidsSection = kidsSection;
let imgIdx = 0;

newKidsSection = newKidsSection.replace(
  /images:\s*\[[^\]]*\]/g,
  (match) => {
    if (!match.includes('i.pinimg.com')) {
      return match;
    }
    const count = 3;
    const imgs = [];
    for (let j = 0; j < count; j++) {
      const fileIdx = imgIdx % kidFiles.length;
      imgs.push(`/images/kid/${kidFiles[fileIdx]}`);
      imgIdx++;
    }
    return `images: [${imgs.map(i => `'${i}'`).join(', ')}]`;
  }
);

const newContent = beforeKids + newKidsSection + afterKids;

fs.writeFileSync(productsPath, newContent);
console.log('Updated kids section in products.ts');
console.log(`Processed ${imgIdx} image references`);

// Check for any remaining pinimg
const remaining = newContent.match(/i\.pinimg\.com/g) || [];
console.log('Remaining pinimg URLs:', remaining.length);
