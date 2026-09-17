import fs from 'fs';

const productsPath = 'D:\\ETEC CENTER\\vuetypescrit\\my-project\\src\\data\\products.ts';
const shoeImagesDir = 'D:\\ETEC CENTER\\vuetypescrit\\my-project\\public\\images\\shoes';

const shoeFiles = fs.readdirSync(shoeImagesDir)
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp'))
  .sort();

console.log(`Found ${shoeFiles.length} shoe images`);

let content = fs.readFileSync(productsPath, 'utf8');

const shoesStartMarker = "// ── SHOES";
const accessoriesStartMarker = "// ── ACCESSORIES";
const shoesStartIdx = content.indexOf(shoesStartMarker);
const sectionEnd = content.indexOf(accessoriesStartMarker);

if (shoesStartIdx === -1) {
  console.log('Shoes section not found');
  process.exit(1);
}

console.log(`Shoes section from ${shoesStartIdx} to ${sectionEnd}`);

const beforeShoes = content.slice(0, shoesStartIdx);
const shoesSection = content.slice(shoesStartIdx, sectionEnd);
const afterShoes = content.slice(sectionEnd);

let newShoesSection = shoesSection;
let imgIdx = 0;

newShoesSection = newShoesSection.replace(
  /images:\s*\[[^\]]*\]/g,
  (match) => {
    if (!match.includes('i.pinimg.com')) {
      return match;
    }
    const count = 3;
    const imgs = [];
    for (let j = 0; j < count; j++) {
      const fileIdx = imgIdx % shoeFiles.length;
      imgs.push(`/images/shoes/${shoeFiles[fileIdx]}`);
      imgIdx++;
    }
    return `images: [${imgs.map(i => `'${i}'`).join(', ')}]`;
  }
);

const newContent = beforeShoes + newShoesSection + afterShoes;

fs.writeFileSync(productsPath, newContent);
console.log('Updated shoes section in products.ts');
console.log(`Processed ${imgIdx} image references`);

const remaining = newContent.match(/i\.pinimg\.com/g) || [];
console.log('Remaining pinimg URLs:', remaining.length);
