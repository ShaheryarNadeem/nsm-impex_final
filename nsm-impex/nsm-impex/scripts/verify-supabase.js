const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : ''

function getEnvVal(key) {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'))
  return match ? match[1].trim() : (process.env[key] || '')
}

const supabaseUrl = getEnvVal('NEXT_PUBLIC_SUPABASE_URL')
const supabaseServiceKey = getEnvVal('SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function run() {
  console.log('Testing connection to Supabase:', supabaseUrl)

  // 1. Check storage bucket
  console.log('\n--- Checking Storage Bucket ---')
  try {
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    if (bucketError) {
      console.error('Error listing buckets:', bucketError)
    } else {
      const bucketNames = buckets.map((b) => b.name)
      console.log('Existing buckets:', bucketNames)
      if (!bucketNames.includes('product-images')) {
        console.log('Bucket "product-images" not found, creating it...')
        const { data: newBucket, error: createError } = await supabase.storage.createBucket('product-images', {
          public: true,
        })
        if (createError) {
          console.error('Failed to create "product-images" bucket:', createError)
        } else {
          console.log('Created bucket "product-images":', newBucket)
        }
      } else {
        console.log('Bucket "product-images" exists!')
      }
    }
  } catch (err) {
    console.error('Storage bucket check exception:', err)
  }

  // 2. Check Database Tables
  console.log('\n--- Checking Database Tables ---')
  const tables = ['categories', 'products', 'inquiries', 'admin_users']
  const tableStatus = {}

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1)
      if (error) {
        tableStatus[table] = { exists: false, error: error.message, code: error.code }
      } else {
        tableStatus[table] = { exists: true, sampleCount: data ? data.length : 0 }
      }
    } catch (err) {
      tableStatus[table] = { exists: false, error: err.message }
    }
  }

  console.log('Table status summary:', JSON.stringify(tableStatus, null, 2))

  const missingTables = tables.filter((t) => !tableStatus[t].exists)
  if (missingTables.length > 0) {
    console.log('\nMISSING_TABLES_DETECTED:', missingTables.join(', '))
    process.exit(10)
  }

  // 3. If all tables exist, check if seed/sync is needed
  console.log('\n--- Syncing Data from local JSON to Supabase ---')

  // Categories sync
  try {
    const categoriesRaw = fs.readFileSync(path.join(__dirname, '..', 'data', 'categories.json'), 'utf8')
    const localCategories = JSON.parse(categoriesRaw)
    console.log(`Found ${localCategories.length} local categories. Upserting to Supabase...`)

    for (const cat of localCategories) {
      const { error: catErr } = await supabase.from('categories').upsert(
        {
          id: cat.id,
          slug: cat.slug,
          name: cat.name,
          description: cat.description || null,
          image: cat.image || null,
          subcategories: cat.subcategories || [],
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      )
      if (catErr) {
        console.error(`Error upserting category ${cat.slug}:`, catErr)
      } else {
        console.log(`✓ Category synced: ${cat.name} (${cat.slug})`)
      }
    }
  } catch (err) {
    console.error('Categories sync error:', err)
  }

  // Products sync
  try {
    const catalogRaw = fs.readFileSync(path.join(__dirname, '..', 'data', 'catalog.json'), 'utf8')
    const localProducts = JSON.parse(catalogRaw)
    console.log(`Found ${localProducts.length} local products. Upserting to Supabase in batches...`)

    const batchSize = 25
    for (let i = 0; i < localProducts.length; i += batchSize) {
      const batch = localProducts.slice(i, i + batchSize).map((p) => ({
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

      const { error: batchErr } = await supabase.from('products').upsert(batch, { onConflict: 'id' })
      if (batchErr) {
        console.error(`Error upserting product batch ${i}-${i + batch.length}:`, batchErr)
      } else {
        console.log(`✓ Synced products batch ${i + 1} to ${Math.min(i + batchSize, localProducts.length)}`)
      }
    }
  } catch (err) {
    console.error('Products sync error:', err)
  }

  console.log('\nSupabase verification & sync complete!')
}

run().catch((err) => {
  console.error('Fatal script error:', err)
  process.exit(1)
})
