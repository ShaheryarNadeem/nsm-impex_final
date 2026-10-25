const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')

function getEnvVal(key) {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'))
  return match ? match[1].trim() : (process.env[key] || '')
}

const supabaseUrl = getEnvVal('NEXT_PUBLIC_SUPABASE_URL')
const serviceKey = getEnvVal('SUPABASE_SERVICE_ROLE_KEY')
const adminEmail = getEnvVal('ADMIN_EMAIL') || 'admin@nsmimpex.com'
const adminPassword = getEnvVal('ADMIN_PASSWORD') || 'NsmAdmin2026!'

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function run() {
  console.log('--- 1. Setting up Supabase Admin User & Role ---')
  console.log(`Target admin email: ${adminEmail}`)

  let userId = null

  // Check if user exists in auth.users
  const { data: userList, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) {
    console.error('Error listing auth users:', listError)
  } else {
    const existing = userList.users.find((u) => u.email.toLowerCase() === adminEmail.toLowerCase())
    if (existing) {
      userId = existing.id
      console.log(`User already exists in Supabase Auth (ID: ${userId}).`)
      // Update password to ensure it matches .env.local
      await supabase.auth.admin.updateUserById(userId, {
        password: adminPassword,
        email_confirm: true,
      })
      console.log('Password synced with .env.local.')
    }
  }

  // If not found, create the user
  if (!userId) {
    console.log(`Creating user ${adminEmail} in Supabase Auth...`)
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    })
    if (createError) {
      console.error('Failed to create admin user in Supabase Auth:', createError)
    } else {
      userId = newUser.user.id
      console.log(`✓ Created user in Supabase Auth (ID: ${userId})`)
    }
  }

  // Insert into public.admin_users
  if (userId) {
    const { error: adminUserErr } = await supabase.from('admin_users').upsert(
      {
        user_id: userId,
        email: adminEmail.toLowerCase().trim(),
        role: 'admin',
      },
      { onConflict: 'user_id' }
    )
    if (adminUserErr) {
      console.error('Error inserting into public.admin_users:', adminUserErr)
    } else {
      console.log(`✓ Successfully authorized ${adminEmail} in public.admin_users table!`)
    }
  }

  console.log('\n--- 2. Syncing Historical Local Inquiries ---')
  const inqPath = path.join(__dirname, '..', 'data', 'inquiries.json')
  if (fs.existsSync(inqPath)) {
    try {
      const localInquiries = JSON.parse(fs.readFileSync(inqPath, 'utf8'))
      console.log(`Found ${localInquiries.length} local inquiries to sync.`)

      for (const inq of localInquiries) {
        const row = {
          id: inq.id,
          name: inq.name,
          company: inq.company || null,
          email: inq.email,
          phone: inq.phone || null,
          country: inq.country || null,
          product: inq.product || null,
          product_code: inq.productCode || null,
          quantity: inq.quantity || null,
          size: inq.size || null,
          color: inq.color || null,
          message: inq.message || null,
          attachment_url: inq.attachmentUrl || null,
          created_at: inq.createdAt || new Date().toISOString(),
        }

        const { error: inqErr } = await supabase.from('inquiries').upsert(row, { onConflict: 'id' })
        if (inqErr) {
          console.error(`Error syncing inquiry ${inq.id}:`, inqErr)
        } else {
          console.log(`✓ Synced inquiry: ${inq.id} (${inq.name})`)
        }
      }
    } catch (err) {
      console.error('Error reading/syncing inquiries.json:', err)
    }
  }

  console.log('\n--- 3. Fixing Category Titles & Cover Images ---')
  const catPath = path.join(__dirname, '..', 'data', 'categories.json')
  let categories = JSON.parse(fs.readFileSync(catPath, 'utf8'))

  categories = categories.map((cat) => {
    if (cat.slug === 'bottoms' || cat.id === 'cat-bottoms') {
      return { ...cat, name: 'Bottoms' }
    }
    if (cat.slug === 'jackets-outerwear' || cat.id === 'cat-jackets-outerwear') {
      return {
        ...cat,
        name: 'Jackets & Outerwear',
        description: 'Wholesale jackets and outerwear for brands and exporters — from bombers to seasonal layers.',
      }
    }
    if (cat.slug === 'accessories' || cat.id === 'cat-accessories') {
      return {
        ...cat,
        name: 'Accessories',
        description: 'Caps, beanies, socks, gloves, and knitted winter accessories for global wholesale programs.',
        image: '/products/accessories-custom-1.jpg',
      }
    }
    return cat
  })

  // Write back to data/categories.json
  fs.writeFileSync(catPath, JSON.stringify(categories, null, 2), 'utf8')
  console.log('✓ Updated data/categories.json')

  // Upsert all categories to Supabase
  for (const cat of categories) {
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
      console.error(`Error updating Supabase category ${cat.slug}:`, catErr)
    } else {
      console.log(`✓ Supabase category updated: ${cat.name} (${cat.slug}) -> image: ${cat.image}`)
    }
  }

  console.log('\n--- 4. Verification Row Counts ---')
  const [adminCount, inqCount, catCount, prodCount] = await Promise.all([
    supabase.from('admin_users').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
  ])

  console.log('==============================================')
  console.log('FINAL VERIFICATION ROW COUNTS IN SUPABASE:')
  console.log(`public.admin_users: ${adminCount.count}`)
  console.log(`public.inquiries:   ${inqCount.count}`)
  console.log(`public.categories:  ${catCount.count}`)
  console.log(`public.products:    ${prodCount.count}`)
  console.log('==============================================')
}

run().catch((err) => {
  console.error('Fatal post-seed fix error:', err)
  process.exit(1)
})
