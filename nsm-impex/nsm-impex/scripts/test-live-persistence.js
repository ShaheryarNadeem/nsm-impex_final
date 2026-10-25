const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Load Environment Variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Error: .env.local not found at', envPath);
  process.exit(1);
}

const rawEnv = fs.readFileSync(envPath, 'utf8');
const env = {};
rawEnv.split(/\r?\n/).forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const eq = trimmed.indexOf('=');
    if (eq > 0) {
      env[trimmed.substring(0, eq).trim()] = trimmed.substring(eq + 1).trim();
    }
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function runLivePersistenceAudit() {
  console.log('=====================================================');
  console.log('🚀 STARTING LIVE SUPABASE PERSISTENCE AUDIT');
  console.log('Supabase URL:', supabaseUrl);
  console.log('=====================================================\n');

  let passedAll = true;

  // -----------------------------------------------------------------
  // TEST A: Product Mutation & Reversion in public.products
  // -----------------------------------------------------------------
  console.log('👉 [Test A] Testing Product Mutation & Immediate Reversion in public.products...');
  try {
    const { data: prods, error: fetchErr } = await supabase
      .from('products')
      .select('id, name, short_description')
      .limit(1);

    if (fetchErr || !prods || prods.length === 0) {
      throw new Error(`Failed to fetch a test product: ${fetchErr?.message || 'No products found'}`);
    }

    const testProd = prods[0];
    const originalDesc = testProd.short_description || '';
    const tempDesc = `[AUDIT_TEST_${Date.now()}] Temporary description update`;

    console.log(`   Target Product: "${testProd.name}" (${testProd.id})`);
    console.log(`   Original short_description: "${originalDesc}"`);

    // 1. Mutate
    const { error: updateErr } = await supabase
      .from('products')
      .update({ short_description: tempDesc, updated_at: new Date().toISOString() })
      .eq('id', testProd.id);

    if (updateErr) throw updateErr;

    // 2. Verify Mutation Persisted
    const { data: updatedProd, error: verifyErr } = await supabase
      .from('products')
      .select('short_description')
      .eq('id', testProd.id)
      .single();

    if (verifyErr || updatedProd.short_description !== tempDesc) {
      throw new Error(`Product mutation did not persist! Found: "${updatedProd?.short_description}"`);
    }
    console.log(`   ✓ Successfully updated and verified in Supabase: "${updatedProd.short_description}"`);

    // 3. Revert
    const { error: revertErr } = await supabase
      .from('products')
      .update({ short_description: originalDesc, updated_at: new Date().toISOString() })
      .eq('id', testProd.id);

    if (revertErr) throw revertErr;

    const { data: revertedProd } = await supabase
      .from('products')
      .select('short_description')
      .eq('id', testProd.id)
      .single();

    if (revertedProd.short_description !== originalDesc) {
      throw new Error(`Product reversion failed!`);
    }
    console.log(`   ✓ Cleanly reverted back to original: "${revertedProd.short_description}"`);
    console.log('✅ [Test A PASSED]\n');
  } catch (err) {
    console.error('❌ [Test A FAILED]:', err.message || err);
    passedAll = false;
  }

  // -----------------------------------------------------------------
  // TEST B: Category Mutation & Reversion in public.categories
  // -----------------------------------------------------------------
  console.log('👉 [Test B] Testing Category Mutation & Reversion in public.categories...');
  try {
    const { data: cats, error: catFetchErr } = await supabase
      .from('categories')
      .select('slug, name, description')
      .eq('slug', 'accessories')
      .single();

    if (catFetchErr || !cats) {
      throw new Error(`Failed to fetch accessories category: ${catFetchErr?.message}`);
    }

    const originalCatDesc = cats.description || '';
    const tempCatDesc = `[AUDIT_TEST_${Date.now()}] Premium accessories test description`;

    console.log(`   Target Category: "${cats.name}" (slug: ${cats.slug})`);

    // 1. Mutate
    const { error: catUpdateErr } = await supabase
      .from('categories')
      .update({ description: tempCatDesc, updated_at: new Date().toISOString() })
      .eq('slug', cats.slug);

    if (catUpdateErr) throw catUpdateErr;

    // 2. Verify
    const { data: updatedCat } = await supabase
      .from('categories')
      .select('description')
      .eq('slug', cats.slug)
      .single();

    if (!updatedCat || updatedCat.description !== tempCatDesc) {
      throw new Error(`Category mutation did not persist!`);
    }
    console.log(`   ✓ Successfully updated and verified in Supabase: "${updatedCat.description}"`);

    // 3. Revert
    const { error: catRevertErr } = await supabase
      .from('categories')
      .update({ description: originalCatDesc, updated_at: new Date().toISOString() })
      .eq('slug', cats.slug);

    if (catRevertErr) throw catRevertErr;

    const { data: revertedCat } = await supabase
      .from('categories')
      .select('description')
      .eq('slug', cats.slug)
      .single();

    if (revertedCat.description !== originalCatDesc) {
      throw new Error(`Category reversion failed!`);
    }
    console.log(`   ✓ Cleanly reverted back to original description.`);
    console.log('✅ [Test B PASSED]\n');
  } catch (err) {
    console.error('❌ [Test B FAILED]:', err.message || err);
    passedAll = false;
  }

  // -----------------------------------------------------------------
  // TEST C: Inserting & Deleting in public.inquiries
  // -----------------------------------------------------------------
  console.log('👉 [Test C] Testing Inquiry Creation & Deletion in public.inquiries...');
  const testInqId = `inq-audit-test-${Date.now()}`;
  try {
    const testInquiry = {
      id: testInqId,
      name: 'Automated Lead Auditor',
      company: 'Audit Corp Global',
      email: 'lead-audit@nsmimpex.com',
      phone: '+1 555 987 6543',
      country: 'United States',
      product: 'Oversized Heavyweight Hoodie',
      product_code: 'HOOD-HVY-001',
      quantity: '500 pcs',
      size: 'L',
      color: 'Charcoal',
      message: 'Automated persistence verification test.',
      attachment_url: 'https://qdnligbsyzbhxdltqqcm.supabase.co/storage/v1/object/public/product-images/audit-sample.pdf',
      created_at: new Date().toISOString(),
    };

    // 1. Insert
    const { error: inqInsertErr } = await supabase.from('inquiries').insert(testInquiry);
    if (inqInsertErr) throw inqInsertErr;
    console.log(`   ✓ Test inquiry inserted: ID "${testInqId}"`);

    // 2. Verify
    const { data: fetchedInq, error: inqFetchErr } = await supabase
      .from('inquiries')
      .select('*')
      .eq('id', testInqId)
      .single();

    if (inqFetchErr || !fetchedInq) {
      throw new Error(`Failed to query test inquiry back from Supabase!`);
    }
    console.log(`   ✓ Verified inquiry exists in Supabase: "${fetchedInq.name}" (${fetchedInq.email})`);

    // 3. Delete
    const { error: inqDeleteErr } = await supabase.from('inquiries').delete().eq('id', testInqId);
    if (inqDeleteErr) throw inqDeleteErr;

    const { data: deletedCheck } = await supabase
      .from('inquiries')
      .select('id')
      .eq('id', testInqId)
      .maybeSingle();

    if (deletedCheck) {
      throw new Error(`Inquiry was not deleted from Supabase!`);
    }
    console.log(`   ✓ Cleanly deleted test inquiry from Supabase.`);
    console.log('✅ [Test C PASSED]\n');
  } catch (err) {
    console.error('❌ [Test C FAILED]:', err.message || err);
    passedAll = false;
  }

  // -----------------------------------------------------------------
  // TEST D: Uploading & Removing Test File in product-images Bucket
  // -----------------------------------------------------------------
  console.log('👉 [Test D] Testing File Upload & Removal in "product-images" Storage Bucket...');
  const testFileName = `audit-test-${Date.now()}.txt`;
  try {
    const fileBuffer = Buffer.from('NSM Impex Supabase Storage Persistence Audit Verified 2026');

    // 1. Upload
    const { error: uploadErr } = await supabase.storage
      .from('product-images')
      .upload(testFileName, fileBuffer, {
        contentType: 'text/plain',
        upsert: true,
      });

    if (uploadErr) throw uploadErr;

    const { data: pubData } = supabase.storage.from('product-images').getPublicUrl(testFileName);
    console.log(`   ✓ File uploaded successfully! Public URL: ${pubData.publicUrl}`);

    // 2. Remove
    const { error: removeErr } = await supabase.storage
      .from('product-images')
      .remove([testFileName]);

    if (removeErr) throw removeErr;
    console.log(`   ✓ File "${testFileName}" cleanly removed from bucket.`);
    console.log('✅ [Test D PASSED]\n');
  } catch (err) {
    console.error('❌ [Test D FAILED]:', err.message || err);
    passedAll = false;
  }

  // -----------------------------------------------------------------
  // SUMMARY
  // -----------------------------------------------------------------
  console.log('=====================================================');
  if (passedAll) {
    console.log('🎉 ALL LIVE SUPABASE PERSISTENCE TESTS PASSED 100%!');
    console.log('Products, Categories, Inquiries, and Storage are fully integrated & verified.');
  } else {
    console.log('⚠️ ONE OR MORE TESTS ENCOUNTERED AN ISSUE.');
  }
  console.log('=====================================================');
}

runLivePersistenceAudit();
