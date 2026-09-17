import fs from 'fs';
import path from 'path';

const accessoriesDir = 'D:\\ETEC CENTER\\vuetypescrit\\my-project\\accessories';
const publicAccessoriesDir = 'D:\\ETEC CENTER\\vuetypescrit\\my-project\\public\\images\\accessories';

// Ensure directory exists
if (!fs.existsSync(publicAccessoriesDir)) {
  fs.mkdirSync(publicAccessoriesDir, { recursive: true });
}

// Copy all accessories files
const files = fs.readdirSync(accessoriesDir);
let copied = 0;
for (const file of files) {
  const src = path.join(accessoriesDir, file);
  const dst = path.join(publicAccessoriesDir, file);
  fs.copyFileSync(src, dst);
  copied++;
}
console.log(`Copied ${copied} accessories files`);

// Now fix all product images in products.ts
const productsPath = 'D:\\ETEC CENTER\\vuetypescrit\\my-project\\src\\data\\products.ts';
let content = fs.readFileSync(productsPath, 'utf8');

// Read all image directories
const menFiles = fs.readdirSync('D:\\ETEC CENTER\\vuetypescrit\\my-project\\public\\images\\men')
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  .sort();
const accessoriesFiles = fs.readdirSync(publicAccessoriesDir)
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  .sort();
const shoesFiles = fs.readdirSync('D:\\ETEC CENTER\\vuetypescrit\\my-project\\public\\images\\shoes')
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  .sort();

console.log(`Men: ${menFiles.length}, Accessories: ${accessoriesFiles.length}, Shoes: ${shoesFiles.length}`);

// Fix accessories products: replace pinimg URLs with local paths
let accIdx = 0;
content = content.replace(
  /category: 'accessories'[\s\S]{0,500}?images:\s*\[[^\]]*\]/g,
  (match) => {
    const count = Math.min(3, accessoriesFiles.length);
    const imgs = [];
    for (let j = 0; j < count; j++) {
      const fileIdx = accIdx % accessoriesFiles.length;
      imgs.push(`/images/accessories/${accessoriesFiles[fileIdx]}`);
      accIdx++;
    }
    return match.replace(
      /images:\s*\[[^\]]*\]/,
      `images: [${imgs.map(i => `'${i}'`).join(', ')}]`
    );
  }
);

// Fix shoes products: replace pinimg URLs with local paths
let shoeIdx = 0;
content = content.replace(
  /category: 'shoes'[\s\S]{0,500}?images:\s*\[[^\]]*\]/g,
  (match) => {
    if (match.includes('i.pinimg.com')) {
      const count = Math.min(3, shoesFiles.length);
      const imgs = [];
      for (let j = 0; j < count; j++) {
        const fileIdx = shoeIdx % shoesFiles.length;
        imgs.push(`/images/shoes/${shoesFiles[fileIdx]}`);
        shoeIdx++;
      }
      return match.replace(
        /images:\s*\[[^\]]*\]/,
        `images: [${imgs.map(i => `'${i}'`).join(', ')}]`
      );
    }
    return match;
  }
);

// Fix any remaining pinimg URLs in men section
let menIdx = 0;
content = content.replace(
  /category: 'men'[\s\S]{0,500}?images:\s*\[[^\]]*\]/g,
  (match) => {
    if (match.includes('i.pinimg.com')) {
      const count = 3;
      const imgs = [];
      for (let j = 0; j < count; j++) {
        const fileIdx = menIdx % menFiles.length;
        imgs.push(`/images/men/${menFiles[fileIdx]}`);
        menIdx++;
      }
      return match.replace(
        /images:\s*\[[^\]]*\]/,
        `images: [${imgs.map(i => `'${i}'`).join(', ')}]`
      );
    }
    return match;
  }
);

// Fix any remaining pinimg URLs in women section
// Replace pinimg URLs with local paths
let womenIdx = 0;
const womanFiles = fs.readdirSync('D:\\ETEC CENTER\\vuetypescrit\\my-project\\public\\images\\woman')
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  .sort();
content = content.replace(
  /category: 'women'[\s\S]{0,500}?images:\s*\[[^\]]*\]/g,
  (match) => {
    if (match.includes('i.pinimg.com')) {
      const count = Math.min(2, womanFiles.length);
      const imgs = [];
      for (let j = 0; j < count; j++) {
        const fileIdx = womenIdx % womanFiles.length;
        imgs.push(`/images/woman/${womanFiles[fileIdx]}`);
        womenIdx++;
      }
      return match.replace(
        /images:\s*\[[^\]]*\]/,
        `images: [${imgs.map(i => `'${i}'`).join(', ')}]`
      );
    }
    return match;
  }
);

fs.writeFileSync(productsPath, content);
console.log('Fixed all product images!');
console.log(`Accessories: ${accIdx}, Shoes: ${shoeIdx}, Men: ${menIdx}, Women: ${womenIdx}`);
