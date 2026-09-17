const fs = require('fs');

const productsPath = 'D:\\ETEC CENTER\\vuetypescrit\\my-project\\src\\data\\products.ts';
const menImagesDir = 'D:\\ETEC CENTER\\vuetypescrit\\my-project\\public\\images\\men';

const menFiles = fs.readdirSync(menImagesDir)
  .filter(f => f.startsWith('m') && (f.endsWith('.jpg') || f.endsWith('.png')))
  .sort();

console.log(`Found ${menFiles.length} men images`);

let content = fs.readFileSync(productsPath, 'utf8');

// Find the men section boundaries
const menStartMarker = "const SEEDS: Seed[] = [";
const womenStartMarker = "// ── WOMEN";
const menStartIdx = content.indexOf(menStartMarker);
const womenStartIdx = content.indexOf(womenStartMarker);

// Extract men section
const beforeMen = content.slice(0, menStartIdx);
const menSection = content.slice(menStartIdx, womenStartIdx);
const afterWomen = content.slice(womenStartIdx);

// Process men section: replace each images array with local paths
// Keep the product structure intact, just replace image URLs
let newMenSection = menSection;
let imgIdx = 0;

// Replace each images: [...] array
newMenSection = newMenSection.replace(
  /images:\s*\[([^\]]*)\]/g,
  (match, originalContent) => {
    // Generate 3-5 local image paths
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

// Now add the new batch images (m001-m060) as additional images
// Find the last men product and add images to it
const lastProductMatch = newMenSection.match(/createdDaysAgo: \d+\s*\n\s*\}/);
if (lastProductMatch) {
  const lastProductEnd = lastProductMatch.index + lastProductMatch[0].length;
  const additionalImages = [];
  for (let i = 0; i < 10; i++) {
    additionalImages.push(`/images/men/${menFiles[(imgIdx + i) % menFiles.length]}`);
  }
  imgIdx += 10;
  // Insert additional images before the closing brace of the last product
  const insertPos = lastProductEnd - 2; // before \n  }
  newMenSection = newMenSection.slice(0, insertPos) +
    `    images: [${additionalImages.map(i => `'${i}'`).join(', ')}],\n` +
    newMenSection.slice(insertPos);
}

// Reconstruct the file
const newContent = beforeMen + newMenSection + afterWomen;

fs.writeFileSync(productsPath, newContent);
console.log('Updated products.ts with local image paths');
console.log(`Processed ${imgIdx} image references`);
