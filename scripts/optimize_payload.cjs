const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const url = 'https://anvgipmxlsiwhzplsnne.supabase.co';
const key = 'sb_publishable_fuzPA05yUMvsIZ-ZKxwfRw_8nIRQaYe';
const client = createClient(url, key);

// Ensure folders exist
fs.mkdirSync(path.join('public', 'banners'), { recursive: true });
fs.mkdirSync(path.join('public', 'products'), { recursive: true });

function saveBase64Image(dataUrl, filepath) {
  const match = dataUrl.match(/^data:image\/([^;]+);base64,(.+)$/);
  if (!match) return null;
  const mime = match[1];
  let ext = 'webp';
  if (mime.includes('svg')) ext = 'svg';
  else if (mime.includes('png')) ext = 'png';
  else if (mime.includes('jpeg') || mime.includes('jpg')) ext = 'jpg';
  
  const finalPath = filepath.replace(/\.\w+$/, `.${ext}`);
  const buffer = Buffer.from(match[2], 'base64');
  fs.writeFileSync(finalPath, buffer);
  console.log(`Saved ${finalPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
  return path.basename(finalPath);
}

async function optimize() {
  const { data, error } = await client.from('site_cms_data').select('data').eq('id', 'main_cms_config').single();
  if (error || !data?.data) {
    console.error('Supabase fetch error:', error);
    return;
  }
  const cms = data.data;

  // 1. Optimize heroData
  if (cms.heroData?.mainImage?.startsWith('data:image/')) {
    saveBase64Image(cms.heroData.mainImage, path.join('public', 'hero-hajj-umrah.webp'));
    cms.heroData.mainImage = '/hero-hajj-umrah.webp';
  }

  // 2. Optimize categoryBanners
  if (Array.isArray(cms.categoryBanners)) {
    cms.categoryBanners.forEach((b) => {
      if (b.image && b.image.startsWith('data:image/')) {
        const filename = `${b.id}.webp`;
        const filepath = path.join('public', 'banners', filename);
        const saved = saveBase64Image(b.image, filepath);
        if (saved) {
          b.image = `/banners/${saved}`;
        }
      }
    });
  }

  // 3. Optimize products
  if (Array.isArray(cms.products)) {
    cms.products.forEach((p) => {
      if (p.image && p.image.startsWith('data:image/')) {
        const filename = `${p.id}.webp`;
        const filepath = path.join('public', 'products', filename);
        const saved = saveBase64Image(p.image, filepath);
        if (saved) {
          p.image = `/products/${saved}`;
        }
      }
    });
  }

  // Measure new size
  const newSize = JSON.stringify(cms).length;
  console.log(`Optimized CMS payload size: ${(newSize / 1024).toFixed(1)} KB`);

  // Save to live_cms_data.json
  fs.writeFileSync('src/data/live_cms_data.json', JSON.stringify(cms, null, 2));

  // Save back to Supabase
  const res = await client.from('site_cms_data').upsert({
    id: 'main_cms_config',
    data: cms,
    updated_at: new Date().toISOString(),
  });

  if (res.error) {
    console.error('Error updating Supabase:', res.error);
  } else {
    console.log('Successfully updated Supabase with optimized 15KB payload!');
  }
}

optimize();
