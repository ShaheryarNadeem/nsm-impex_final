const fs = require('fs')

const path = 'data/catalog.json'
const products = JSON.parse(fs.readFileSync(path, 'utf8'))
const now = new Date().toISOString()

const product = {
  id: 'prod-oversized-sweatshirt',
  name: 'Oversized Sweatshirt',
  slug: 'oversized-sweatshirt',
  category: 'tops',
  subcategory: 'Sweatshirts',
  productCode: 'NSM-OVER-013',
  shortDescription: 'Oversized Sweatshirt — wholesale ready apparel for brands and exporters.',
  description:
    'Oversized Sweatshirt crafted for comfort and bulk production. Choose size, color and quantity, then send your order inquiry. Custom branding and packaging available on request.',
  images: [
    {
      id: 'main-oversized-sweatshirt',
      url: '/products/oversized-sweatshirt-custom-1.png',
      alt: 'Oversized Sweatshirt — burgundy',
      kind: 'main',
    },
    {
      id: 'extra-oversized-sweatshirt-0',
      url: '/products/oversized-sweatshirt-custom-2.png',
      alt: 'Oversized Sweatshirt — light blue',
      kind: 'detail',
    },
    {
      id: 'extra-oversized-sweatshirt-1',
      url: '/products/oversized-sweatshirt-custom-3.png',
      alt: 'Oversized Sweatshirt — washed grey',
      kind: 'additional',
    },
  ],
  fabric: 'Available on request',
  composition: 'Available on request',
  gsm: 'Available on request',
  fit: 'Oversized',
  sizes: 'XS, S, M, L, XL, XXL, XXXL',
  colors: 'Black, White, Charcoal, Grey, Navy, Beige, Olive',
  sizeOptions: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  colorOptions: [
    { name: 'Black', hex: '#111111' },
    { name: 'White', hex: '#f5f5f5' },
    { name: 'Charcoal', hex: '#3a3a3a' },
    { name: 'Grey', hex: '#8a8a8a' },
    { name: 'Navy', hex: '#1f2a44' },
    { name: 'Beige', hex: '#d6c6a8' },
    { name: 'Olive', hex: '#5c6b5a' },
  ],
  season: 'All season',
  customization: 'Private label, print, embroidery available on request',
  packaging: 'Bulk export packaging available on request',
  moq: '50 pcs',
  leadTime: 'Available on request',
  featured: false,
  published: true,
  sortOrder: 13,
  createdAt: now,
  updatedAt: now,
}

const existing = products.findIndex((p) => p.id === product.id)
if (existing >= 0) {
  products[existing] = { ...products[existing], ...product, createdAt: products[existing].createdAt }
} else {
  const after = products.findIndex((p) => p.id === 'prod-crewneck-sweatshirt')
  products.splice(after + 1, 0, product)
}

products.forEach((p, i) => {
  p.sortOrder = i + 1
})

fs.writeFileSync(path, JSON.stringify(products, null, 2))
console.log('total', products.length, 'at', products.findIndex((p) => p.name === 'Oversized Sweatshirt') + 1)
