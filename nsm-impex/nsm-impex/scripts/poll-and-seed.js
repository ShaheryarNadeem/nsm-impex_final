const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')

function getEnvVal(key) {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'))
  return match ? match[1].trim() : ''
}

const supabaseUrl = getEnvVal('NEXT_PUBLIC_SUPABASE_URL')
const serviceKey = getEnvVal('SUPABASE_SERVICE_ROLE_KEY')

if (!serviceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const maxAttempts = 120 // 10 minutes (checking every 5 seconds)
let attempt = 0

async function checkTables() {
  try {
    const [catRes, prodRes] = await Promise.all([
      supabase.from('categories').select('*').limit(1),
      supabase.from('products').select('*').limit(1),
    ])

    const catOk = !catRes.error
    const prodOk = !prodRes.error

    if (catOk && prodOk) {
      return true
    }

    if (catRes.error) {
      console.log(`[Attempt ${attempt}/${maxAttempts}] Waiting for categories table (${catRes.error.message})...`)
    }
    return false
  } catch (err) {
    console.log(`[Attempt ${attempt}/${maxAttempts}] Connection check error:`, err.message)
    return false
  }
}

async function seedData() {
  console.log('\n=============================================')
  console.log('✓ Tables detected! Starting data seed...')
  console.log('=============================================')

  // 1. Categories
  const catRaw = fs.readFileSync(path.join(__dirname, '..', 'data', 'categories.json'), 'utf8')
  const categories = JSON.parse(catRaw)
  console.log(`Found ${categories.length} categories to seed.`)

  for (const cat of categories) {
    const row = {
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      description: cat.description || null,
      image: cat.image || null,
      subcategories: cat.subcategories || [],
      updated_at: new Date().toISOString(),
    }
    const { error } = await supabase.from('categories').upsert(row, { onConflict: 'slug' })
    if (error) {
      console.error(`Error syncing category ${cat.slug}:`, error.message)
    } else {
      console.log(`✓ Category synced: ${cat.name} (${cat.slug})`)
    }
  }

  // 2. Products
  const prodRaw = fs.readFileSync(path.join(__dirname, '..', 'data', 'catalog.json'), 'utf8')
  const products = JSON.parse(prodRaw)
  console.log(`Found ${products.length} products to seed.`)

  const batchSize = 25
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      subcategory: p.subcategory || null,
      product_code: p.productCode || null,
      description: p.description || null,
      short_description: p.shortDescription || null,
      images: p.images || [],
      fabric: p.fabric || null,
      composition: p.composition || null,
      gsm: p.gsm || null,
      fit: p.fit || null,
      sizes: p.sizes || null,
      colors: p.colors || null,
      size_options: p.sizeOptions || [],
      color_options: p.colorOptions || [],
      season: p.season || null,
      customization: p.customization || null,
      packaging: p.packaging || null,
      moq: p.moq || null,
      lead_time: p.leadTime || null,
      featured: Boolean(p.featured),
      published: p.published !== false,
      sort_order: p.sortOrder ?? 0,
      updated_at: new Date().toISOString(),
    }))

    const { error } = await supabase.from('products').upsert(batch, { onConflict: 'id' })
    if (error) {
      console.error(`Error syncing products batch ${i}-${i + batch.length}:`, error.message)
    } else {
      console.log(`✓ Products batch ${i + 1} - ${Math.min(i + batchSize, products.length)} synced`)
    }
  }

  // Verification Counts
  const [catCountRes, prodCountRes] = await Promise.all([
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
  ])

  console.log('\n=============================================')
  console.log('SEEDING COMPLETE & VERIFIED!')
  console.log(`Categories in Supabase: ${catCountRes.count}`)
  console.log(`Products in Supabase: ${prodCountRes.count}`)
  console.log('=============================================\n')
}

async function poll() {
  console.log('Starting Supabase table polling (checking every 5 seconds)...')
  while (attempt < maxAttempts) {
    attempt++
    const ready = await checkTables()
    if (ready) {
      await seedData()
      process.exit(0)
    }
    await new Promise((res) => setTimeout(res, 5000))
  }

  console.error('\nPolling timed out after 2 minutes. Please verify that the SQL script was executed in Supabase.')
  process.exit(1)
}

poll().catch((err) => {
  console.error('Fatal error in poll script:', err)
  process.exit(1)
})
