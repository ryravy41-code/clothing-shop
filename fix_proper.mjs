import fs from 'fs';
import path from 'path';

const productsPath = 'D:\\ETEC CENTER\\vuetypescrit\\my-project\\src\\data\\products.ts';
const menImagesDir = 'D:\\ETEC CENTER\\vuetypescrit\\my-project\\public\\images\\men';
const accessoriesDir = 'D:\\ETEC CENTER\\vuetypescrit\\my-project\\public\\images\\accessories';
const shoesDir = 'D:\\ETEC CENTER\\vuetypescrit\\my-project\\public\\images\\shoes';
const kidImagesDir = 'D:\\ETEC CENTER\\vuetypescrit\\my-project\\public\\images\\kid';

// Read all image directories
const menFiles = fs.readdirSync(menImagesDir)
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  .sort();
const accessoriesFiles = fs.readdirSync(accessoriesDir)
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  .sort();
const shoesFiles = fs.readdirSync(shoesDir)
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  .sort();
const kidFiles = fs.readdirSync(kidImagesDir)
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp'))
  .sort();

console.log(`Men: ${menFiles.length}, Accessories: ${accessoriesFiles.length}, Shoes: ${shoesFiles.length}, Kids: ${kidFiles.length}`);

let content = fs.readFileSync(productsPath, 'utf8');

// Replace each images: [...] array based on category
// Use a function to process each match
let menIdx = 0, accIdx = 0, shoeIdx = 0, kidsIdx = 0;

// Process men category
content = content.replace(
  /(category: 'men'[\s\S]*?images:\s*\[)[^\]]*(\])/g,
  (match, prefix, suffix) => {
    const count = 3;
    const imgs = [];
    for (let j = 0; j < count; j++) {
      imgs.push(`/images/men/${menFiles[menIdx % menFiles.length]}`);
      menIdx++;
    }
    return prefix + imgs.map(i => `'${i}'`).join(', ') + suffix;
  }
);

// Process accessories category
content = content.replace(
  /(category: 'accessories'[\s\S]*?images:\s*\[)[^\]]*(\])/g,
  (match, prefix, suffix) => {
    const count = 3;
    const imgs = [];
    for (let j = 0; j < count; j++) {
      imgs.push(`/images/accessories/${accessoriesFiles[accIdx % accessoriesFiles.length]}`);
      accIdx++;
    }
    return prefix + imgs.map(i => `'${i}'`).join(', ') + suffix;
  }
);

// Process shoes category
content = content.replace(
  /(category: 'shoes'[\s\S]*?images:\s*\[)[^\]]*(\])/g,
  (match, prefix, suffix) => {
    const count = 3;
    const imgs = [];
    for (let j = 0; j < count; j++) {
      imgs.push(`/images/shoes/${shoesFiles[shoeIdx % shoesFiles.length]}`);
      shoeIdx++;
    }
    return prefix + imgs.map(i => `'${i}'`).join(', ') + suffix;
  }
);

// Process kids category
content = content.replace(
  /(category: 'kids'[\s\S]*?images:\s*\[)[^\]]*(\])/g,
  (match, prefix, suffix) => {
    const count = 3;
    const imgs = [];
    for (let j = 0; j < count; j++) {
      imgs.push(`/images/kid/${kidFiles[kidsIdx % kidFiles.length]}`);
      kidsIdx++;
    }
    return prefix + imgs.map(i => `'${i}'`).join(', ') + suffix;
  }
);

// Process women category - replace pinimg URLs with local paths
content = content.replace(
  /(category: 'women'[\s\S]*?images:\s*\[)[^\]]*(\])/g,
  (match, prefix, suffix) => {
    const count = 2;
    const imgs = [];
    for (let j = 0; j < count; j++) {
      imgs.push(`/images/woman/p-${womenIdx}.jpg`);
      womenIdx++;
    }
    return prefix + imgs.map(i => `'${i}'`).join(', ') + suffix;
  }
);

fs.writeFileSync(productsPath, content);
console.log('Fixed all product images!');
console.log(`Men: ${menIdx}, Accessories: ${accIdx}, Shoes: ${shoeIdx}, Kids: ${kidsIdx}`);

// Verify no pinimg URLs remain
const remaining = content.match(/https:\/\/i\.pinimg\.com\/\S+/g);
console.log(`Remaining pinimg URLs: ${remaining ? remaining.length : 0}`);
