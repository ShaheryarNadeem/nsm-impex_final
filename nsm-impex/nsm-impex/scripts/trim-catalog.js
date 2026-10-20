const fs = require('fs')

const catalogPath = 'data/catalog.json'
const products = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))

const keepNames = [
  'Pullover Hoodie',
  'Zip-Up Hoodie',
  'Oversized Hoodie',
  'Cropped Hoodie',
  'Boxy Hoodie',
  'Heavyweight Hoodie',
  'Lightweight Hoodie',
  'Graphic Hoodie',
  'Embroidered Hoodie',
  'Fleece Hoodie',
  'Crewneck Sweatshirt',
  'Half-Zip Sweatshirt',
  'Quarter-Zip Pullover',
  'Long-Sleeve T-Shirt',
  'Oversized T-Shirt',
  'Boxy T-Shirt',
  'Graphic T-Shirt',
  'Basic/Essential T-Shirt',
  'Drop-Shoulder T-Shirt',
  'Polo Shirt',
  'Henley Shirt',
  'Flannel Shirt',
  'Overshirt',
  'Shacket',
  'Tank Top',
]

function gallery(slug, files, name) {
  return files.map((file, i) => ({
    id: i === 0 ? `main-${slug}` : `extra-${slug}-${i - 1}`,
    url: `/products/${file}`,
    alt: `${name} — view ${i + 1}`,
    kind: i === 0 ? 'main' : i === 1 ? 'detail' : 'additional',
  }))
}

const wire = {
  'Basic/Essential T-Shirt': gallery(
    'basic-essential-t-shirt',
    [
      'basic-tee-custom-1.png',
      'basic-tee-custom-2.png',
      'basic-tee-custom-3.png',
      'basic-tee-custom-4.png',
      'basic-tee-custom-5.png',
    ],
    'Basic/Essential T-Shirt',
  ),
  'Drop-Shoulder T-Shirt': gallery(
    'drop-shoulder-t-shirt',
    [
      'drop-shoulder-tee-custom-1.png',
      'drop-shoulder-tee-custom-2.png',
      'drop-shoulder-tee-custom-3.png',
      'drop-shoulder-tee-custom-4.png',
      'drop-shoulder-tee-custom-5.png',
    ],
    'Drop-Shoulder T-Shirt',
  ),
  'Polo Shirt': gallery(
    'polo-shirt',
    [
      'polo-shirt-custom-1.png',
      'polo-shirt-custom-2.png',
      'polo-shirt-custom-3.png',
      'polo-shirt-custom-4.png',
    ],
    'Polo Shirt',
  ),
  'Henley Shirt': gallery(
    'henley-shirt',
    [
      'henley-shirt-custom-1.png',
      'henley-shirt-custom-2.png',
      'henley-shirt-custom-3.png',
      'henley-shirt-custom-4.png',
    ],
    'Henley Shirt',
  ),
  'Flannel Shirt': gallery(
    'flannel-shirt',
    [
      'flannel-shirt-custom-1.png',
      'flannel-shirt-custom-2.png',
      'flannel-shirt-custom-3.png',
      'flannel-shirt-custom-4.png',
      'flannel-shirt-custom-5.png',
    ],
    'Flannel Shirt',
  ),
  Shacket: gallery(
    'shacket',
    ['shacket-custom-1.png', 'shacket-custom-2.png', 'shacket-custom-3.png'],
    'Shacket',
  ),
  'Tank Top': gallery(
    'tank-top',
    [
      'tank-top-custom-1.png',
      'tank-top-custom-2.png',
      'tank-top-custom-3.png',
      'tank-top-custom-4.png',
    ],
    'Tank Top',
  ),
}

const keepSet = new Set(keepNames)
let kept = products.filter((p) => keepSet.has(p.name))
kept = kept.map((p) => (wire[p.name] ? { ...p, images: wire[p.name] } : p))
kept.sort((a, b) => keepNames.indexOf(a.name) - keepNames.indexOf(b.name))
kept = kept.map((p, i) => ({ ...p, sortOrder: i + 1 }))

fs.writeFileSync(catalogPath, JSON.stringify(kept, null, 2))
console.log('kept', kept.length)
kept.forEach((p) => console.log('-', p.name, p.images.length, p.images[0].url))
