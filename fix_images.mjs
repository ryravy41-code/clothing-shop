import fs from 'fs';

const productsPath = 'D:\\ETEC CENTER\\vuetypescrit\\my-project\\src\\data\\products.ts';
const menImagesDir = 'D:\\ETEC CENTER\\vuetypescrit\\my-project\\public\\images\\men';

const menFiles = fs.readdirSync(menImagesDir)
  .filter(f => (f.endsWith('.jpg') || f.endsWith('.png')))
  .sort();

console.log(`Found ${menFiles.length} men images`);

let content = fs.readFileSync(productsPath, 'utf8');

// Find the men section boundaries
const menStartMarker = "const SEEDS: Seed[] = [";
const womenStartMarker = "// ── WOMEN";
const menStartIdx = content.indexOf(menStartMarker);
const womenStartIdx = content.indexOf(womenStartMarker);

console.log(`Men section from ${menStartIdx} to ${womenStartIdx}`);

// Extract sections
const beforeMen = content.slice(0, menStartIdx);
const menSection = content.slice(menStartIdx, womenStartIdx);
const afterWomen = content.slice(womenStartIdx);

// Process men section: replace each images array with local paths
let newMenSection = menSection;
let imgIdx = 0;

// Replace each images: [...] array with local paths
newMenSection = newMenSection.replace(
  /images:\s*\[[^\]]*\]/g,
  (match) => {
    const count = 3 + (imgIdx % 3);
    const imgs = [];
    for (let j = 0; j < count; j++) {
      const fileIdx = imgIdx % menFiles.length;
      imgs.push(`/images/men/${menFiles[fileIdx]}`);
      imgIdx++;
    }
    return `images: [${imgs.map(i => `'${i}'`).join(', ')}]`;
  }
);

// Reconstruct the file
const newContent = beforeMen + newMenSection + afterWomen;

fs.writeFileSync(productsPath, newContent);
console.log('Updated products.ts successfully');
console.log(`Processed ${imgIdx} image references`);
