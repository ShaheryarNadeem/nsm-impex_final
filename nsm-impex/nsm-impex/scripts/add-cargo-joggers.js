const fs = require('fs')

const path = 'data/catalog.json'
const products = JSON.parse(fs.readFileSync(path, 'utf8'))
const now = new Date().toISOString()

const product = {
  id: 'prod-cargo-joggers',
  name: 'Cargo Joggers',
  slug: 'cargo-joggers',
  category: 'bottoms',
  subcategory: 'Cargo Joggers',
  productCode: 'NSM-CARG-JOG-001',
  shortDescription: 'Cargo Joggers — wholesale ready apparel for brands and exporters.',
  description:
    'Cargo Joggers crafted for comfort and bulk production. Choose size, color and quantity, then send your order inquiry. Custom branding and packaging available on request.',
  images: [
    {
      id: 'main-cargo-joggers',
      url: '/products/cargo-joggers-custom-1.png',
      alt: 'Cargo Joggers — sage green',
      kind: 'main',
    },
    {
      id: 'extra-cargo-joggers-0',
      url: '/products/cargo-joggers-custom-2.png',
      alt: 'Cargo Joggers — olive',
      kind: 'detail',
    },
    {
      id: 'extra-cargo-joggers-1',
      url: '/products/cargo-joggers-custom-3.png',
      alt: 'Cargo Joggers — charcoal',
      kind: 'additional',
    },
    {
      id: 'extra-cargo-joggers-2',
      url: '/products/cargo-joggers-custom-4.png',
      alt: 'Cargo Joggers — light blue',
      kind: 'additional',
    },
    {
      id: 'extra-cargo-joggers-3',
      url: '/products/cargo-joggers-custom-5.png',
      alt: 'Cargo Joggers — black',
      kind: 'additional',
    },
    {
      id: 'extra-cargo-joggers-4',
      url: '/products/cargo-joggers-custom-6.png',
      alt: 'Cargo Joggers — tan',
      kind: 'additional',
    },
  ],
  fabric: 'Available on request',
  composition: 'Available on request',
  gsm: 'Available on request',
  fit: 'Regular',
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
  featured: true,
  published: true,
  sortOrder: products.length + 1,
  createdAt: now,
  updatedAt: now,
}

const existing = products.findIndex((p) => p.id === product.id)
if (existing >= 0) {
  products[existing] = { ...products[existing], ...product, createdAt: products[existing].createdAt }
} else {
  products.push(product)
}

products.forEach((p, i) => {
  p.sortOrder = i + 1
})

fs.writeFileSync(path, JSON.stringify(products, null, 2))
console.log('total', products.length, 'cargo-joggers ok')
