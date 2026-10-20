import type { CategorySlug, Product, ProductImage } from './types'
import { DEFAULT_COLORS, DEFAULT_SIZES } from './types'
import { slugify } from '../utils'

type SeedItem = {
  name: string
  category: CategorySlug
  subcategory: string
  image: string
  featured?: boolean
}

const img = (file: string) => `/products/${file}`

const seedItems: SeedItem[] = [
  // TOPS — Hoodies
  { name: 'Pullover Hoodie', category: 'tops', subcategory: 'Hoodies', image: img('pullover-hoodie-custom-1.png'), featured: true },
  { name: 'Zip-Up Hoodie', category: 'tops', subcategory: 'Hoodies', image: img('zip-hoodie-main.png'), featured: true },
  { name: 'Oversized Hoodie', category: 'tops', subcategory: 'Hoodies', image: img('oversized-hoodie-custom-1.png'), featured: true },
  { name: 'Cropped Hoodie', category: 'tops', subcategory: 'Hoodies', image: img('crop-hoodie-custom-1.png') },
  { name: 'Boxy Hoodie', category: 'tops', subcategory: 'Hoodies', image: img('boxy-hoodie-custom-1.png') },
  { name: 'Heavyweight Hoodie', category: 'tops', subcategory: 'Hoodies', image: img('heavy-hoodie-custom-1.png'), featured: true },
  { name: 'Lightweight Hoodie', category: 'tops', subcategory: 'Hoodies', image: img('light-hoodie-custom-1.png') },
  { name: 'Graphic Hoodie', category: 'tops', subcategory: 'Hoodies', image: img('graphic-hoodie-custom-1.png') },
  { name: 'Embroidered Hoodie', category: 'tops', subcategory: 'Hoodies', image: img('embroidered-hoodie-custom-1.png') },
  { name: 'Fleece Hoodie', category: 'tops', subcategory: 'Hoodies', image: img('fleece-hoodie-custom-1.png') },
  // TOPS — Sweatshirts
  { name: 'Sweatshirt', category: 'tops', subcategory: 'Sweatshirts', image: img('sweatshirt-custom-1.png') },
  { name: 'Crewneck Sweatshirt', category: 'tops', subcategory: 'Sweatshirts', image: img('crewneck-sweatshirt-custom-1.png'), featured: true },
  { name: 'Oversized Sweatshirt', category: 'tops', subcategory: 'Sweatshirts', image: img('oversized-sweatshirt-custom-1.png') },
  { name: 'Half-Zip Sweatshirt', category: 'tops', subcategory: 'Sweatshirts', image: img('half-zip-sweatshirt-custom-1.png') },
  { name: 'Quarter-Zip Pullover', category: 'tops', subcategory: 'Sweatshirts', image: img('quarter-zip-pullover-custom-1.png') },
  // TOPS — T-Shirts
  { name: 'Long-Sleeve T-Shirt', category: 'tops', subcategory: 'T-Shirts', image: img('tee-long-custom-1.png') },
  { name: 'Oversized T-Shirt', category: 'tops', subcategory: 'T-Shirts', image: img('tee-oversized-custom-1.png'), featured: true },
  { name: 'Boxy T-Shirt', category: 'tops', subcategory: 'T-Shirts', image: img('boxy-tshirt-custom-1.png') },
  { name: 'Graphic T-Shirt', category: 'tops', subcategory: 'T-Shirts', image: img('graphic-tshirt-custom-1.png') },
  { name: 'Basic/Essential T-Shirt', category: 'tops', subcategory: 'T-Shirts', image: img('basic-tee-custom-1.png') },
  { name: 'Drop-Shoulder T-Shirt', category: 'tops', subcategory: 'T-Shirts', image: img('drop-shoulder-tee-custom-1.png') },
  // TOPS — Shirts
  { name: 'Polo Shirt', category: 'tops', subcategory: 'Shirts', image: img('polo-shirt-custom-1.png') },
  { name: 'Henley Shirt', category: 'tops', subcategory: 'Shirts', image: img('henley-shirt-custom-1.png') },
  { name: 'Flannel Shirt', category: 'tops', subcategory: 'Shirts', image: img('flannel-shirt-custom-1.png') },
  { name: 'Overshirt', category: 'tops', subcategory: 'Shirts', image: img('overshirt-custom-1.png') },
  { name: 'Shacket', category: 'tops', subcategory: 'Shirts', image: img('shacket-custom-1.png') },
  { name: 'Tank Top', category: 'tops', subcategory: 'Other Tops', image: img('tank-top-custom-1.png') },

  // BOTTOMS
  { name: 'Cargo Joggers', category: 'bottoms', subcategory: 'Cargo Joggers', image: img('cargo-joggers-custom-1.png'), featured: true },
  { name: 'Basketball shorts', category: 'bottoms', subcategory: 'Basketball shorts', image: img('basketball-shorts-custom-1.png'), featured: true },
  { name: 'Cargo Pants', category: 'bottoms', subcategory: 'Cargo Pants', image: img('cargo-pants-custom-1.png'), featured: true },
  { name: 'cargo shorts', category: 'bottoms', subcategory: 'cargo shorts', image: img('cargo-shorts-custom-1.png'), featured: true },
  { name: 'denim shorts', category: 'bottoms', subcategory: 'denim shorts', image: img('denim-shorts-custom-1.png'), featured: true },
  { name: 'Jogger Pants', category: 'bottoms', subcategory: 'Jogger Pants', image: img('jogger-pants-custom-1.png'), featured: true },
  { name: 'Lounge Pants', category: 'bottoms', subcategory: 'Lounge Pants', image: img('lounge-pants-custom-1.png'), featured: true },
  { name: 'Parachute Pants', category: 'bottoms', subcategory: 'Parachute Pants', image: img('parachute-pants-custom-1.png'), featured: true },
  { name: 'shorts', category: 'bottoms', subcategory: 'shorts', image: img('shorts-custom-1.png'), featured: true },
  { name: 'straight leg pants', category: 'bottoms', subcategory: 'straight leg pants', image: img('straight-leg-pants-custom-1.png'), featured: true },
  { name: 'Sweat pants', category: 'bottoms', subcategory: 'Sweat pants', image: img('sweat-pants-custom-1.png'), featured: true },
  { name: 'sweat shorts', category: 'bottoms', subcategory: 'sweat shorts', image: img('sweat-shorts-custom-1.png'), featured: true },
  { name: 'wide legs pants', category: 'bottoms', subcategory: 'wide legs pants', image: img('wide-legs-pants-custom-1.png'), featured: true },

  // JACKETS & OUTERWEAR
  { name: 'Bomber jackets', category: 'jackets-outerwear', subcategory: 'Bomber jackets', image: img('bomber-jackets-custom-1.png'), featured: true },
  { name: 'Coach jacket', category: 'jackets-outerwear', subcategory: 'Coach jacket', image: img('coach-jacket-custom-1.png'), featured: true },
  { name: 'denim jacket', category: 'jackets-outerwear', subcategory: 'denim jacket', image: img('denim-jacket-custom-1.png'), featured: true },
  { name: 'Fleece jacket', category: 'jackets-outerwear', subcategory: 'Fleece jacket', image: img('fleece-jacket-custom-1.png'), featured: true },
  { name: 'Lightweight jacket', category: 'jackets-outerwear', subcategory: 'Lightweight jacket', image: img('lightweight-jacket-custom-1.png'), featured: true },

  // SETS
  { name: 'Cargo Set', category: 'sets', subcategory: 'Cargo Sets', image: img('cargo-set-custom-1.png'), featured: true },
  { name: 'Hoodie + Jogger Set', category: 'sets', subcategory: 'Casual Sets', image: img('hoodie-jogger-set-custom-1.png'), featured: true },
  { name: 'Lounge Set', category: 'sets', subcategory: 'Lounge Sets', image: img('lounge-set-custom-1.png'), featured: true },
  { name: 'Sweatshirt + Jogger Set', category: 'sets', subcategory: 'Casual Sets', image: img('sweatshirt-jogger-set-custom-1.png'), featured: true },
  { name: 'Tracksuit', category: 'sets', subcategory: 'Tracksuits', image: img('tracksuit-custom-1.png'), featured: true },
  { name: 'T-Shirt + Shorts Set', category: 'sets', subcategory: 'Casual Sets', image: img('tee-shorts-set-custom-1.png'), featured: true },
  { name: 'Oversized Co-ord Set', category: 'sets', subcategory: 'Co-ord Sets', image: img('oversized-coord-set-custom-1.png'), featured: true },
]

function codeFor(name: string, index: number) {
  const prefix = name
    .replace(/[^A-Za-z0-9]+/g, '')
    .slice(0, 4)
    .toUpperCase()
  return `NSM-${prefix}-${String(index + 1).padStart(3, '0')}`
}

function galleryFor(item: SeedItem, pool: SeedItem[]): ProductImage[] {
  // Custom multi-image galleries for flagship hoodies
  if (item.name === 'Pullover Hoodie') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('pullover-hoodie-custom-1.png'), alt: `${item.name} — navy colorblock`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('pullover-hoodie-custom-2.png'), alt: `${item.name} — olive`, kind: 'detail' },
    ]
  }
  if (item.name === 'Embroidered Hoodie') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('embroidered-hoodie-custom-1.png'), alt: `${item.name} — bird floral maroon`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('embroidered-hoodie-custom-2.png'), alt: `${item.name} — floral black zip`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('embroidered-hoodie-custom-3.png'), alt: `${item.name} — insect motifs black`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('embroidered-hoodie-custom-4.png'), alt: `${item.name} — floral cream`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('embroidered-hoodie-custom-5.png'), alt: `${item.name} — cat motifs beige`, kind: 'additional' },
    ]
  }

  if (item.name === 'Graphic Hoodie') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('graphic-hoodie-custom-1.png'), alt: `${item.name} — split face print`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('graphic-hoodie-custom-2.png'), alt: `${item.name} — ink splatter crest`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('graphic-hoodie-custom-3.png'), alt: `${item.name} — star S graphic`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('graphic-hoodie-custom-4.png'), alt: `${item.name} — lava tile print`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('graphic-hoodie-custom-5.png'), alt: `${item.name} — skull graphic`, kind: 'additional' },
    ]
  }

  if (item.name === 'Fleece Hoodie') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('fleece-hoodie-custom-1.png'), alt: `${item.name} — teal waffle zip`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('fleece-hoodie-custom-2.png'), alt: `${item.name} — light blue tech zip`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('fleece-hoodie-custom-3.png'), alt: `${item.name} — black sherpa lined`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('fleece-hoodie-custom-4.png'), alt: `${item.name} — terracotta zip`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('fleece-hoodie-custom-5.png'), alt: `${item.name} — heather grey waffle`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-4`, url: img('fleece-hoodie-custom-6.png'), alt: `${item.name} — olive half-zip sherpa`, kind: 'additional' },
    ]
  }

  if (item.name === 'Sweatshirt') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('sweatshirt-custom-1.png'), alt: `${item.name} — black`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('sweatshirt-custom-2.png'), alt: `${item.name} — charcoal`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('sweatshirt-custom-3.png'), alt: `${item.name} — heather grey`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('sweatshirt-custom-4.png'), alt: `${item.name} — navy`, kind: 'additional' },
    ]
  }

  if (item.name === 'Oversized Sweatshirt') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('oversized-sweatshirt-custom-1.png'), alt: `${item.name} — burgundy`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('oversized-sweatshirt-custom-2.png'), alt: `${item.name} — light blue`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('oversized-sweatshirt-custom-3.png'), alt: `${item.name} — washed grey`, kind: 'additional' },
    ]
  }

  if (item.name === 'Crewneck Sweatshirt') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('crewneck-sweatshirt-custom-1.png'), alt: `${item.name} — charcoal sleeve stripe`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('crewneck-sweatshirt-custom-2.png'), alt: `${item.name} — forest green floral A`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('crewneck-sweatshirt-custom-3.png'), alt: `${item.name} — heather grey logo`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('crewneck-sweatshirt-custom-4.png'), alt: `${item.name} — navy plain`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('crewneck-sweatshirt-custom-5.png'), alt: `${item.name} — dusty rose`, kind: 'additional' },
    ]
  }

  if (item.name === 'Half-Zip Sweatshirt') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('half-zip-sweatshirt-custom-1.png'), alt: `${item.name} — black laurel tip`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('half-zip-sweatshirt-custom-2.png'), alt: `${item.name} — black mock neck`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('half-zip-sweatshirt-custom-3.png'), alt: `${item.name} — lavender tech`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('half-zip-sweatshirt-custom-4.png'), alt: `${item.name} — navy mock neck`, kind: 'additional' },
    ]
  }

  if (item.name === 'Quarter-Zip Pullover') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('quarter-zip-pullover-custom-1.png'), alt: `${item.name} — medium blue athletic`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('quarter-zip-pullover-custom-2.png'), alt: `${item.name} — ivory cable knit`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('quarter-zip-pullover-custom-3.png'), alt: `${item.name} — cream ribbed`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('quarter-zip-pullover-custom-4.png'), alt: `${item.name} — heather green`, kind: 'additional' },
    ]
  }

  if (item.name === 'Boxy T-Shirt') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('boxy-tshirt-custom-1.png'), alt: `${item.name} — cream brown stripe`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('boxy-tshirt-custom-2.png'), alt: `${item.name} — chocolate brown`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('boxy-tshirt-custom-3.png'), alt: `${item.name} — black BNDS back`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('boxy-tshirt-custom-4.png'), alt: `${item.name} — dusty pink raglan`, kind: 'additional' },
    ]
  }

  if (item.name === 'Graphic T-Shirt') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('graphic-tshirt-custom-1.png'), alt: `${item.name} — graffiti teddy back`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('graphic-tshirt-custom-2.png'), alt: `${item.name} — floral skull print`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('graphic-tshirt-custom-3.png'), alt: `${item.name} — simulation cyan`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('graphic-tshirt-custom-4.png'), alt: `${item.name} — patience portrait`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('graphic-tshirt-custom-5.png'), alt: `${item.name} — athletic chevron`, kind: 'additional' },
    ]
  }

  if (item.name === 'Basic/Essential T-Shirt') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('basic-tee-custom-1.png'), alt: `${item.name} — view 1`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('basic-tee-custom-2.png'), alt: `${item.name} — view 2`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('basic-tee-custom-3.png'), alt: `${item.name} — view 3`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('basic-tee-custom-4.png'), alt: `${item.name} — view 4`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('basic-tee-custom-5.png'), alt: `${item.name} — view 5`, kind: 'additional' },
    ]
  }

  if (item.name === 'Drop-Shoulder T-Shirt') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('drop-shoulder-tee-custom-1.png'), alt: `${item.name} — view 1`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('drop-shoulder-tee-custom-2.png'), alt: `${item.name} — view 2`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('drop-shoulder-tee-custom-3.png'), alt: `${item.name} — view 3`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('drop-shoulder-tee-custom-4.png'), alt: `${item.name} — view 4`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('drop-shoulder-tee-custom-5.png'), alt: `${item.name} — view 5`, kind: 'additional' },
    ]
  }

  if (item.name === 'Polo Shirt') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('polo-shirt-custom-1.png'), alt: `${item.name} — view 1`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('polo-shirt-custom-2.png'), alt: `${item.name} — view 2`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('polo-shirt-custom-3.png'), alt: `${item.name} — view 3`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('polo-shirt-custom-4.png'), alt: `${item.name} — view 4`, kind: 'additional' },
    ]
  }

  if (item.name === 'Henley Shirt') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('henley-shirt-custom-1.png'), alt: `${item.name} — view 1`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('henley-shirt-custom-2.png'), alt: `${item.name} — view 2`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('henley-shirt-custom-3.png'), alt: `${item.name} — view 3`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('henley-shirt-custom-4.png'), alt: `${item.name} — view 4`, kind: 'additional' },
    ]
  }

  if (item.name === 'Flannel Shirt') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('flannel-shirt-custom-1.png'), alt: `${item.name} — view 1`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('flannel-shirt-custom-2.png'), alt: `${item.name} — view 2`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('flannel-shirt-custom-3.png'), alt: `${item.name} — view 3`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('flannel-shirt-custom-4.png'), alt: `${item.name} — view 4`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('flannel-shirt-custom-5.png'), alt: `${item.name} — view 5`, kind: 'additional' },
    ]
  }

  if (item.name === 'Shacket') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('shacket-custom-1.png'), alt: `${item.name} — view 1`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('shacket-custom-2.png'), alt: `${item.name} — view 2`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('shacket-custom-3.png'), alt: `${item.name} — view 3`, kind: 'additional' },
    ]
  }

  if (item.name === 'Tank Top') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('tank-top-custom-1.png'), alt: `${item.name} — view 1`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('tank-top-custom-2.png'), alt: `${item.name} — view 2`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('tank-top-custom-3.png'), alt: `${item.name} — view 3`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('tank-top-custom-4.png'), alt: `${item.name} — view 4`, kind: 'additional' },
    ]
  }

  if (item.name === 'Overshirt') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('overshirt-custom-1.png'), alt: `${item.name} — navy utility`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('overshirt-custom-2.png'), alt: `${item.name} — black coach`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('overshirt-custom-3.png'), alt: `${item.name} — navy work`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('overshirt-custom-4.png'), alt: `${item.name} — cream snap`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('overshirt-custom-5.png'), alt: `${item.name} — navy chore`, kind: 'additional' },
    ]
  }

  if (item.name === 'Long-Sleeve T-Shirt') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('tee-long-custom-1.png'), alt: `${item.name} — light blue`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('tee-long-custom-2.png'), alt: `${item.name} — navy`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('tee-long-custom-3.png'), alt: `${item.name} — black`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('tee-long-custom-4.png'), alt: `${item.name} — mustard`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('tee-long-custom-5.png'), alt: `${item.name} — dark grey`, kind: 'additional' },
    ]
  }

  if (item.name === 'Oversized T-Shirt') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('tee-oversized-custom-1.png'), alt: `${item.name} — washed tan`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('tee-oversized-custom-2.png'), alt: `${item.name} — white`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('tee-oversized-custom-3.png'), alt: `${item.name} — black`, kind: 'additional' },
    ]
  }

  if (item.name === 'Lightweight Hoodie') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('light-hoodie-custom-1.png'), alt: `${item.name} — beige zip`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('light-hoodie-custom-2.png'), alt: `${item.name} — grey marl zip`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('light-hoodie-custom-3.png'), alt: `${item.name} — slate blue`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('light-hoodie-custom-4.png'), alt: `${item.name} — navy colorblock`, kind: 'additional' },
    ]
  }

  if (item.name === 'Heavyweight Hoodie') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('heavy-hoodie-custom-1.png'), alt: `${item.name} — charcoal black sleeves`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('heavy-hoodie-custom-2.png'), alt: `${item.name} — chocolate brown`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('heavy-hoodie-custom-3.png'), alt: `${item.name} — rust zip`, kind: 'additional' },
    ]
  }

  if (item.name === 'Boxy Hoodie') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('boxy-hoodie-custom-1.png'), alt: `${item.name} — dusty rose`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('boxy-hoodie-custom-2.png'), alt: `${item.name} — black`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('boxy-hoodie-custom-3.png'), alt: `${item.name} — charcoal`, kind: 'additional' },
    ]
  }

  if (item.name === 'Cropped Hoodie') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('crop-hoodie-custom-1.png'), alt: `${item.name} — black`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('crop-hoodie-custom-2.png'), alt: `${item.name} — wrap black`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('crop-hoodie-custom-3.png'), alt: `${item.name} — heather grey`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('crop-hoodie-custom-4.png'), alt: `${item.name} — magenta zip`, kind: 'additional' },
    ]
  }

  if (item.name === 'Oversized Hoodie') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('oversized-hoodie-custom-1.png'), alt: `${item.name} — black`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('oversized-hoodie-custom-2.png'), alt: `${item.name} — charcoal`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('oversized-hoodie-custom-3.png'), alt: `${item.name} — light grey`, kind: 'additional' },
    ]
  }

  if (item.name === 'Zip-Up Hoodie') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('zip-hoodie-main.png'), alt: `${item.name} — charcoal grey`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('zip-hoodie-custom-5-front.png'), alt: `${item.name} — black front`, kind: 'front' },
      { id: `extra-${slugify(item.name)}-1`, url: img('zip-hoodie-custom-5-back.png'), alt: `${item.name} — black back`, kind: 'back' },
      { id: `extra-${slugify(item.name)}-2`, url: img('zip-hoodie-custom-1.png'), alt: `${item.name} — maroon`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('zip-hoodie-custom-4.png'), alt: `${item.name} — off white`, kind: 'additional' },
    ]
  }

  if (item.name === 'Cargo Joggers') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('cargo-joggers-custom-1.png'), alt: `${item.name} — sage green`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('cargo-joggers-custom-2.png'), alt: `${item.name} — olive`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('cargo-joggers-custom-3.png'), alt: `${item.name} — charcoal`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('cargo-joggers-custom-4.png'), alt: `${item.name} — light blue`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('cargo-joggers-custom-5.png'), alt: `${item.name} — black`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-4`, url: img('cargo-joggers-custom-6.png'), alt: `${item.name} — tan`, kind: 'additional' },
    ]
  }

  if (item.name === 'Basketball shorts') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('basketball-shorts-custom-1.png'), alt: `${item.name} — white red trim`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('basketball-shorts-custom-2.png'), alt: `${item.name} — red yellow stripe`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('basketball-shorts-custom-3.png'), alt: `${item.name} — white mountain graphic`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('basketball-shorts-custom-4.png'), alt: `${item.name} — navy Michigan`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('basketball-shorts-custom-5.png'), alt: `${item.name} — orange Tennessee`, kind: 'additional' },
    ]
  }

  if (item.name === 'Cargo Pants') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('cargo-pants-custom-1.png'), alt: `${item.name} — camel`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('cargo-pants-custom-2.png'), alt: `${item.name} — dark grey tactical`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('cargo-pants-custom-3.png'), alt: `${item.name} — olive straight`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('cargo-pants-custom-4.png'), alt: `${item.name} — olive multi-pocket`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('cargo-pants-custom-5.png'), alt: `${item.name} — khaki baggy`, kind: 'additional' },
    ]
  }

  if (item.name === 'cargo shorts') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('cargo-shorts-custom-1.png'), alt: `${item.name} — multi color set`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('cargo-shorts-custom-2.png'), alt: `${item.name} — charcoal grey`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('cargo-shorts-custom-3.png'), alt: `${item.name} — olive`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('cargo-shorts-custom-4.png'), alt: `${item.name} — black`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('cargo-shorts-custom-5.png'), alt: `${item.name} — khaki back`, kind: 'additional' },
    ]
  }

  if (item.name === 'denim shorts') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('denim-shorts-custom-1.png'), alt: `${item.name} — light wash cargo`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('denim-shorts-custom-2.png'), alt: `${item.name} — dark wash cargo`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('denim-shorts-custom-3.png'), alt: `${item.name} — light wash classic`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('denim-shorts-custom-4.png'), alt: `${item.name} — dark indigo`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('denim-shorts-custom-5.png'), alt: `${item.name} — light wash slim`, kind: 'additional' },
    ]
  }

  if (item.name === 'Jogger Pants') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('jogger-pants-custom-1.png'), alt: `${item.name} — black Y-3 back`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('jogger-pants-custom-2.png'), alt: `${item.name} — black athletic`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('jogger-pants-custom-3.png'), alt: `${item.name} — black fleece`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('jogger-pants-custom-4.png'), alt: `${item.name} — black track`, kind: 'additional' },
    ]
  }

  if (item.name === 'Lounge Pants') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('lounge-pants-custom-1.png'), alt: `${item.name} — cream wide leg`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('lounge-pants-custom-2.png'), alt: `${item.name} — navy track`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('lounge-pants-custom-3.png'), alt: `${item.name} — black red plaid`, kind: 'additional' },
    ]
  }

  if (item.name === 'Parachute Pants') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('parachute-pants-custom-1.png'), alt: `${item.name} — khaki cargo`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('parachute-pants-custom-2.png'), alt: `${item.name} — beige belt`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('parachute-pants-custom-3.png'), alt: `${item.name} — tan gathered`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('parachute-pants-custom-4.png'), alt: `${item.name} — cream back`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('parachute-pants-custom-5.png'), alt: `${item.name} — taupe balloon`, kind: 'additional' },
    ]
  }

  if (item.name === 'shorts') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('shorts-custom-1.png'), alt: `${item.name} — black athletic`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('shorts-custom-2.png'), alt: `${item.name} — charcoal chino`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('shorts-custom-3.png'), alt: `${item.name} — slate blue`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('shorts-custom-4.png'), alt: `${item.name} — dark grey lounge`, kind: 'additional' },
    ]
  }

  if (item.name === 'straight leg pants') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('straight-leg-pants-custom-1.png'), alt: `${item.name} — black dress`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('straight-leg-pants-custom-2.png'), alt: `${item.name} — heather grey`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('straight-leg-pants-custom-3.png'), alt: `${item.name} — white`, kind: 'additional' },
    ]
  }

  if (item.name === 'Sweat pants') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('sweat-pants-custom-1.png'), alt: `${item.name} — light grey wide`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('sweat-pants-custom-2.png'), alt: `${item.name} — grey NORMS`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('sweat-pants-custom-3.png'), alt: `${item.name} — washed grey cuffed`, kind: 'additional' },
    ]
  }

  if (item.name === 'sweat shorts') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('sweat-shorts-custom-1.png'), alt: `${item.name} — light grey marle`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('sweat-shorts-custom-2.png'), alt: `${item.name} — dark grey back`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('sweat-shorts-custom-3.png'), alt: `${item.name} — navy charcoal black`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('sweat-shorts-custom-4.png'), alt: `${item.name} — beige`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('sweat-shorts-custom-5.png'), alt: `${item.name} — mustard textured`, kind: 'additional' },
    ]
  }

  if (item.name === 'wide legs pants') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('wide-legs-pants-custom-1.png'), alt: `${item.name} — olive`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('wide-legs-pants-custom-2.png'), alt: `${item.name} — black`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('wide-legs-pants-custom-3.png'), alt: `${item.name} — taupe`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('wide-legs-pants-custom-4.png'), alt: `${item.name} — ivory`, kind: 'additional' },
    ]
  }

  if (item.name === 'Bomber jackets') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('bomber-jackets-custom-1.png'), alt: `${item.name} — olive CP`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('bomber-jackets-custom-2.png'), alt: `${item.name} — olive Saint Laurent`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('bomber-jackets-custom-3.png'), alt: `${item.name} — olive MA-1`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('bomber-jackets-custom-4.png'), alt: `${item.name} — olive wool`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('bomber-jackets-custom-5.png'), alt: `${item.name} — monogram tan`, kind: 'additional' },
    ]
  }

  if (item.name === 'Coach jacket') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('coach-jacket-custom-1.png'), alt: `${item.name} — quilted monogram`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('coach-jacket-custom-2.png'), alt: `${item.name} — teal`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('coach-jacket-custom-3.png'), alt: `${item.name} — black hooded puffer`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('coach-jacket-custom-4.png'), alt: `${item.name} — navy varsity`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('coach-jacket-custom-5.png'), alt: `${item.name} — blue plaid hood`, kind: 'additional' },
    ]
  }

  if (item.name === 'denim jacket') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('denim-jacket-custom-1.png'), alt: `${item.name} — dark wash distressed`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('denim-jacket-custom-2.png'), alt: `${item.name} — medium blue`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('denim-jacket-custom-3.png'), alt: `${item.name} — black wash Diesel`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('denim-jacket-custom-4.png'), alt: `${item.name} — dark zip trucker`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('denim-jacket-custom-5.png'), alt: `${item.name} — olive tint wash`, kind: 'additional' },
    ]
  }

  if (item.name === 'Fleece jacket') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('fleece-jacket-custom-1.png'), alt: `${item.name} — cream blue Patagonia`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('fleece-jacket-custom-2.png'), alt: `${item.name} — olive quilt yoke`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('fleece-jacket-custom-3.png'), alt: `${item.name} — brown hooded`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('fleece-jacket-custom-4.png'), alt: `${item.name} — navy LL Bean`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('fleece-jacket-custom-5.png'), alt: `${item.name} — mustard Element`, kind: 'additional' },
    ]
  }

  if (item.name === 'Lightweight jacket') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('lightweight-jacket-custom-1.png'), alt: `${item.name} — view 1`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('lightweight-jacket-custom-2.png'), alt: `${item.name} — view 2`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('lightweight-jacket-custom-3.png'), alt: `${item.name} — view 3`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('lightweight-jacket-custom-4.png'), alt: `${item.name} — view 4`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('lightweight-jacket-custom-5.png'), alt: `${item.name} — view 5`, kind: 'additional' },
    ]
  }

  if (item.name === 'Cargo Set') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('cargo-set-custom-1.png'), alt: `${item.name} — brown utility`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('cargo-set-custom-2.png'), alt: `${item.name} — grey windbreaker`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('cargo-set-custom-3.png'), alt: `${item.name} — black athleisure`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('cargo-set-custom-4.png'), alt: `${item.name} — grey tactical`, kind: 'additional' },
    ]
  }

  if (item.name === 'Hoodie + Jogger Set') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('hoodie-jogger-set-custom-1.png'), alt: `${item.name} — black red block`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('hoodie-jogger-set-custom-2.png'), alt: `${item.name} — beige colorblock`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('hoodie-jogger-set-custom-3.png'), alt: `${item.name} — cream textured`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('hoodie-jogger-set-custom-4.png'), alt: `${item.name} — black neon zip`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('hoodie-jogger-set-custom-5.png'), alt: `${item.name} — heather grey block`, kind: 'additional' },
    ]
  }

  if (item.name === 'Lounge Set') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('lounge-set-custom-1.png'), alt: `${item.name} — heather grey`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('lounge-set-custom-2.png'), alt: `${item.name} — grey black joggers`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('lounge-set-custom-3.png'), alt: `${item.name} — dark grey tee`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('lounge-set-custom-4.png'), alt: `${item.name} — periwinkle pj`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('lounge-set-custom-5.png'), alt: `${item.name} — waffle navy`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-4`, url: img('lounge-set-custom-6.png'), alt: `${item.name} — black plaid`, kind: 'additional' },
    ]
  }

  if (item.name === 'Sweatshirt + Jogger Set') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('sweatshirt-jogger-set-custom-1.png'), alt: `${item.name} — cream simple`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('sweatshirt-jogger-set-custom-2.png'), alt: `${item.name} — camel black block`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('sweatshirt-jogger-set-custom-3.png'), alt: `${item.name} — teal back`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('sweatshirt-jogger-set-custom-4.png'), alt: `${item.name} — dusty blue`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('sweatshirt-jogger-set-custom-5.png'), alt: `${item.name} — grey black logo`, kind: 'additional' },
    ]
  }

  if (item.name === 'Tracksuit') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('tracksuit-custom-1.png'), alt: `${item.name} — navy white zip`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('tracksuit-custom-2.png'), alt: `${item.name} — black burgundy`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('tracksuit-custom-3.png'), alt: `${item.name} — charcoal sports`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('tracksuit-custom-4.png'), alt: `${item.name} — maroon sports`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-3`, url: img('tracksuit-custom-5.png'), alt: `${item.name} — teal white`, kind: 'additional' },
    ]
  }

  if (item.name === 'T-Shirt + Shorts Set') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('tee-shorts-set-custom-1.png'), alt: `${item.name} — green white block`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('tee-shorts-set-custom-2.png'), alt: `${item.name} — forest green`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('tee-shorts-set-custom-3.png'), alt: `${item.name} — slate waffle`, kind: 'additional' },
    ]
  }

  if (item.name === 'Oversized Co-ord Set') {
    return [
      { id: `main-${slugify(item.name)}`, url: img('oversized-coord-set-custom-1.png'), alt: `${item.name} — black grey taupe`, kind: 'main' },
      { id: `extra-${slugify(item.name)}-0`, url: img('oversized-coord-set-custom-2.png'), alt: `${item.name} — dusty blue wash`, kind: 'detail' },
      { id: `extra-${slugify(item.name)}-1`, url: img('oversized-coord-set-custom-3.png'), alt: `${item.name} — brown print shirt`, kind: 'additional' },
      { id: `extra-${slugify(item.name)}-2`, url: img('oversized-coord-set-custom-4.png'), alt: `${item.name} — olive graphic`, kind: 'additional' },
    ]
  }

  const related = pool
    .filter((p) => p.subcategory === item.subcategory && p.name !== item.name && p.image !== item.image)
    .slice(0, 3)
  const images: ProductImage[] = [
    { id: `main-${slugify(item.name)}`, url: item.image, alt: `${item.name} — main view`, kind: 'main' },
  ]
  related.forEach((r, i) => {
    images.push({
      id: `extra-${slugify(item.name)}-${i}`,
      url: r.image,
      alt: `${r.name} — related style`,
      kind: i === 0 ? 'detail' : 'additional',
    })
  })
  return images
}

export function createSeedProducts(): Product[] {
  const now = new Date().toISOString()
  return seedItems.map((item, index) => ({
    id: `prod-${slugify(item.name)}`,
    name: item.name,
    slug: slugify(item.name),
    category: item.category,
    subcategory: item.subcategory,
    productCode: codeFor(item.name, index),
    shortDescription: `${item.name} — wholesale ready apparel for brands and exporters.`,
    description: `${item.name} crafted for comfort and bulk production. Choose size, color and quantity, then send your order inquiry. Custom branding and packaging available on request.`,
    images: galleryFor(item, seedItems),
    fabric: 'Available on request',
    composition: 'Available on request',
    gsm: 'Available on request',
    fit: item.subcategory.includes('Oversized') || item.name.includes('Oversized') ? 'Oversized' : 'Regular',
    sizes: DEFAULT_SIZES.join(', '),
    colors: DEFAULT_COLORS.map((c) => c.name).join(', '),
    sizeOptions: [...DEFAULT_SIZES],
    colorOptions: [...DEFAULT_COLORS],
    season: 'All season',
    customization: 'Private label, print, embroidery available on request',
    packaging: 'Bulk export packaging available on request',
    moq: '50 pcs',
    leadTime: 'Available on request',
    featured: Boolean(item.featured),
    published: true,
    sortOrder: index + 1,
    createdAt: now,
    updatedAt: now,
  }))
}
