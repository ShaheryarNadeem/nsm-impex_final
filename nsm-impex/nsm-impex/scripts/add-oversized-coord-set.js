const fs = require('fs')

const path = 'data/catalog.json'
const products = JSON.parse(fs.readFileSync(path, 'utf8'))
const now = new Date().toISOString()

const product = {
  id: 'prod-oversized-co-ord-set',
  name: 'Oversized Co-ord Set',
  slug: 'oversized-co-ord-set',
  category: 'sets',
  subcategory: 'Co-ord Sets',
  productCode: 'NSM-OVER-007',
  shortDescription: 'Oversized Co-ord Set — wholesale ready apparel for brands and exporters.',
  description:
    'Oversized Co-ord Set crafted for comfort and bulk production. Choose size, color and quantity, then send your order inquiry. Custom branding and packaging available on request.',
  images: [
    {
      id: 'main-oversized-co-ord-set',
      url: '/products/oversized-coord-set-custom-1.png',
      alt: 'Oversized Co-ord Set — black grey taupe',
      kind: 'main',
    },
    {
      id: 'extra-oversized-co-ord-set-0',
      url: '/products/oversized-coord-set-custom-2.png',
      alt: 'Oversized Co-ord Set — dusty blue wash',
      kind: 'detail',
    },
    {
      id: 'extra-oversized-co-ord-set-1',
      url: '/products/oversized-coord-set-custom-3.png',
      alt: 'Oversized Co-ord Set — brown print shirt',
      kind: 'additional',
    },
    {
      id: 'extra-oversized-co-ord-set-2',
      url: '/products/oversized-coord-set-custom-4.png',
      alt: 'Oversized Co-ord Set — olive graphic',
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
console.log('total', products.length, 'oversized-coord-set ok')
