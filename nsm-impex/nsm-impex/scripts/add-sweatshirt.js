const fs = require('fs')

const path = 'data/catalog.json'
const products = JSON.parse(fs.readFileSync(path, 'utf8'))

const now = new Date().toISOString()
const sweatshirt = {
  id: 'prod-sweatshirt',
  name: 'Sweatshirt',
  slug: 'sweatshirt',
  category: 'tops',
  subcategory: 'Sweatshirts',
  productCode: 'NSM-SWEA-011',
  shortDescription: 'Sweatshirt — wholesale ready apparel for brands and exporters.',
  description:
    'Sweatshirt crafted for comfort and bulk production. Choose size, color and quantity, then send your order inquiry. Custom branding and packaging available on request.',
  images: [
    {
      id: 'main-sweatshirt',
      url: '/products/sweatshirt-custom-1.png',
      alt: 'Sweatshirt — black',
      kind: 'main',
    },
    {
      id: 'extra-sweatshirt-0',
      url: '/products/sweatshirt-custom-2.png',
      alt: 'Sweatshirt — charcoal',
      kind: 'detail',
    },
    {
      id: 'extra-sweatshirt-1',
      url: '/products/sweatshirt-custom-3.png',
      alt: 'Sweatshirt — heather grey',
      kind: 'additional',
    },
    {
      id: 'extra-sweatshirt-2',
      url: '/products/sweatshirt-custom-4.png',
      alt: 'Sweatshirt — navy',
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
  featured: false,
  published: true,
  sortOrder: 11,
  createdAt: now,
  updatedAt: now,
}

const idx = products.findIndex((p) => p.id === 'prod-fleece-hoodie')
if (products.some((p) => p.id === 'prod-sweatshirt')) {
  const i = products.findIndex((p) => p.id === 'prod-sweatshirt')
  products[i] = { ...products[i], ...sweatshirt, createdAt: products[i].createdAt }
} else {
  products.splice(idx + 1, 0, sweatshirt)
}

products.forEach((p, i) => {
  p.sortOrder = i + 1
})

fs.writeFileSync(path, JSON.stringify(products, null, 2))
console.log('total', products.length)
console.log(
  'sweatshirt at',
  products.findIndex((p) => p.name === 'Sweatshirt') + 1,
)
