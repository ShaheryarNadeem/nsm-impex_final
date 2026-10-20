const fs = require('fs')

const path = 'data/catalog.json'
const products = JSON.parse(fs.readFileSync(path, 'utf8'))
const now = new Date().toISOString()

const product = {
  id: 'prod-denim-shorts',
  name: 'denim shorts',
  slug: 'denim-shorts',
  category: 'bottoms',
  subcategory: 'denim shorts',
  productCode: 'NSM-DENI-001',
  shortDescription: 'denim shorts — wholesale ready apparel for brands and exporters.',
  description:
    'denim shorts crafted for comfort and bulk production. Choose size, color and quantity, then send your order inquiry. Custom branding and packaging available on request.',
  images: [
    {
      id: 'main-denim-shorts',
      url: '/products/denim-shorts-custom-1.png',
      alt: 'denim shorts — light wash cargo',
      kind: 'main',
    },
    {
      id: 'extra-denim-shorts-0',
      url: '/products/denim-shorts-custom-2.png',
      alt: 'denim shorts — dark wash cargo',
      kind: 'detail',
    },
    {
      id: 'extra-denim-shorts-1',
      url: '/products/denim-shorts-custom-3.png',
      alt: 'denim shorts — light wash classic',
      kind: 'additional',
    },
    {
      id: 'extra-denim-shorts-2',
      url: '/products/denim-shorts-custom-4.png',
      alt: 'denim shorts — dark indigo',
      kind: 'additional',
    },
    {
      id: 'extra-denim-shorts-3',
      url: '/products/denim-shorts-custom-5.png',
      alt: 'denim shorts — light wash slim',
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
console.log('total', products.length, 'denim-shorts ok')
