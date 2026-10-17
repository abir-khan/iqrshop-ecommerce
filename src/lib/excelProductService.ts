import * as XLSX from 'xlsx';
import type { Product, Category } from '../types';

/**
 * Flexible header mapping dictionary.
 * Maps standard Product property keys to potential column names in Excel/CSV
 * supporting English, Bengali, uppercase, lowercase, underscores, and spaces.
 */
const FIELD_ALIASES: Record<keyof Product, string[]> = {
  id: ['id', 'productid', 'product_id', 'আইডি', 'প্রোডাক্ট আইডি', 'কোড', 'code', 'sku'],
  name: ['name', 'productname', 'product_name', 'title', 'নাম', 'প্রোডাক্ট নাম', 'পণ্য', 'পণ্যের নাম'],
  category: ['category', 'categoryid', 'category_id', 'ক্যাটাগরি', 'ক্যাটাগরী', 'বিভাগ'],
  price: ['price', 'saleprice', 'sale_price', 'মূল্য', 'দাম', 'বিক্রয় মূল্য', 'বর্তমান মূল্য'],
  originalPrice: [
    'originalprice',
    'original_price',
    'regularprice',
    'regular_price',
    'oldprice',
    'old_price',
    'আগের দাম',
    'পূর্ব মূল্য',
    'রেগুলার মূল্য',
    'আসল দাম',
  ],
  image: [
    'image',
    'imageurl',
    'image_url',
    'mainimage',
    'main_image',
    'photo',
    'ছবি',
    'প্রধান ছবি',
    'ছবির লিংক',
  ],
  images: [
    'images',
    'additionalimages',
    'additional_images',
    'gallery',
    'galleryimages',
    'gallery_images',
    'গ্যালারি ছবি',
    'অতিরিক্ত ছবি',
    'অন্যান্য ছবি',
  ],
  rating: ['rating', 'star', 'stars', 'রেটিং', 'স্টার'],
  reviewsCount: ['reviewscount', 'reviews_count', 'reviews', 'রিভিউ', 'রিভিউ সংখ্যা', 'মন্তব্য'],
  badge: ['badge', 'tag', 'label', 'ব্যাজ', 'ট্যাগ', 'লেবেল'],
  isPopular: ['ispopular', 'is_popular', 'popular', 'featured', 'জনপ্রিয়', 'পপুলার'],
  inStock: ['instock', 'in_stock', 'stock', 'available', 'স্টক', 'স্টকে আছে'],
  description: ['description', 'desc', 'details', 'বিবরণ', 'বর্ণনা', 'বিস্তারিত'],
  features: ['features', 'highlights', 'bullet_points', 'বৈশিষ্ট্য', 'সুবিধাসমূহ', 'পয়েন্টস'],
  sizes: ['sizes', 'size', 'variants', 'সাইজ', 'মাপ', 'ভ্যারিয়েন্ট'],
};

/**
 * Normalize string key for loose matching
 */
function normalizeKey(str: string): string {
  return str.toLowerCase().replace(/[\s\-_]/g, '').trim();
}

/**
 * Split comma, pipe, or newline delimited string into array
 */
function parseStringList(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(String).filter(Boolean);
  const str = String(val).trim();
  if (!str) return [];
  // Split on newlines, pipes, or commas
  return str
    .split(/[\n\r|,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Parse boolean loosely from string/number
 */
function parseBoolean(val: any, defaultVal = true): boolean {
  if (val === undefined || val === null || val === '') return defaultVal;
  if (typeof val === 'boolean') return val;
  const s = String(val).trim().toLowerCase();
  if (['true', 'yes', '1', 'y', 'in stock', 'স্টকে আছে', 'হ্যাঁ', 'আছে'].includes(s)) {
    return true;
  }
  if (['false', 'no', '0', 'n', 'out of stock', 'স্টক শেষ', 'না', 'নেই'].includes(s)) {
    return false;
  }
  return defaultVal;
}

/**
 * Parse number safely
 */
function parseNumber(val: any, defaultVal = 0): number {
  if (val === undefined || val === null || val === '') return defaultVal;
  if (typeof val === 'number') return isNaN(val) ? defaultVal : val;
  // Handle Bengali digits if any
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  let str = String(val).trim();
  bengaliDigits.forEach((digit, i) => {
    str = str.replaceAll(digit, String(i));
  });
  // Strip currency symbols and commas
  const cleaned = str.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? defaultVal : parsed;
}

export interface ParseExcelResult {
  products: Product[];
  warnings: string[];
  newCategories: string[];
  totalRows: number;
}

/**
 * Parse an Excel (.xlsx, .xls) or CSV file into typed Product array
 */
export async function parseProductsFromExcel(
  file: File,
  existingCategories: Category[] = []
): Promise<ParseExcelResult> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });

  // Get the first sheet
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error('এক্সেল ফাইলটিতে কোনো শিট পাওয়া যায়নি!');
  }

  const worksheet = workbook.Sheets[firstSheetName];
  // Parse rows as raw JSON objects
  const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });

  if (!rawRows || rawRows.length === 0) {
    throw new Error('এক্সেল ফাইলে কোনো পণ্যের তথ্য পাওয়া যায়নি!');
  }

  const products: Product[] = [];
  const warnings: string[] = [];
  const existingCatIds = new Set(existingCategories.map((c) => c.id.toLowerCase()));
  const detectedCatNames = new Set<string>();

  rawRows.forEach((row, rowIndex) => {
    const rowNum = rowIndex + 2; // Accounting for 1-based index and header row

    // Match columns dynamically
    const rowKeys = Object.keys(row);
    const getVal = (aliases: string[]): any => {
      const aliasNormalized = aliases.map(normalizeKey);
      for (const key of rowKeys) {
        if (aliasNormalized.includes(normalizeKey(key))) {
          const v = row[key];
          if (v !== undefined && v !== null && String(v).trim() !== '') {
            return v;
          }
        }
      }
      return undefined;
    };

    const rawName = getVal(FIELD_ALIASES.name);
    // If no name found, check if entire row is empty or skip with warning
    if (!rawName) {
      const hasAnyVal = rowKeys.some((k) => String(row[k]).trim() !== '');
      if (hasAnyVal) {
        warnings.push(`সারি #${rowNum}: পণ্যের নাম অনুপস্থিত থাকায় বাদ দেওয়া হয়েছে।`);
      }
      return;
    }

    const name = String(rawName).trim();
    const rawId = getVal(FIELD_ALIASES.id);
    const id = rawId ? String(rawId).trim() : `prod-${Date.now()}-${rowIndex}`;

    const rawCategory = getVal(FIELD_ALIASES.category) || 'general';
    const category = String(rawCategory).trim().toLowerCase().replace(/\s+/g, '-');

    if (!existingCatIds.has(category) && category !== 'all') {
      detectedCatNames.add(category);
    }

    const price = parseNumber(getVal(FIELD_ALIASES.price), 0);
    const rawOriginalPrice = getVal(FIELD_ALIASES.originalPrice);
    const originalPrice = rawOriginalPrice ? parseNumber(rawOriginalPrice, 0) : undefined;

    const rawImage = getVal(FIELD_ALIASES.image);
    const defaultPlaceholder =
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80';
    const image = rawImage ? String(rawImage).trim() : defaultPlaceholder;

    const rawImages = getVal(FIELD_ALIASES.images);
    const imagesList = parseStringList(rawImages);
    const images = imagesList.length > 0 ? imagesList : undefined;

    const rating = Math.min(5, Math.max(1, parseNumber(getVal(FIELD_ALIASES.rating), 5.0)));
    const reviewsCount = Math.max(0, Math.round(parseNumber(getVal(FIELD_ALIASES.reviewsCount), 15)));

    const rawBadge = getVal(FIELD_ALIASES.badge);
    const badge = rawBadge ? String(rawBadge).trim() : undefined;

    const isPopular = parseBoolean(getVal(FIELD_ALIASES.isPopular), false);
    const inStock = parseBoolean(getVal(FIELD_ALIASES.inStock), true);

    const rawDesc = getVal(FIELD_ALIASES.description);
    const description = rawDesc ? String(rawDesc).trim() : `${name} - প্রিমিয়াম কোয়ালিটি পণ্য।`;

    const rawFeatures = getVal(FIELD_ALIASES.features);
    const featuresList = parseStringList(rawFeatures);
    const features = featuresList.length > 0 ? featuresList : undefined;

    const rawSizes = getVal(FIELD_ALIASES.sizes);
    const sizesList = parseStringList(rawSizes);
    const sizes = sizesList.length > 0 ? sizesList : undefined;

    const product: Product = {
      id,
      name,
      category,
      price,
      ...(originalPrice ? { originalPrice } : {}),
      image,
      ...(images ? { images } : {}),
      rating,
      reviewsCount,
      ...(badge ? { badge } : {}),
      isPopular,
      inStock,
      description,
      ...(features ? { features } : {}),
      ...(sizes ? { sizes } : {}),
    };

    products.push(product);
  });

  return {
    products,
    warnings,
    newCategories: Array.from(detectedCatNames),
    totalRows: rawRows.length,
  };
}

/**
 * Export current products list into an Excel file (.xlsx) and trigger browser download
 */
export function exportProductsToExcel(
  products: Product[],
  fileName = 'iqrshop_products_catalog.xlsx'
): void {
  const wb = XLSX.utils.book_new();

  // Prepare table data with clear, intuitive headers
  const rows = products.map((p) => ({
    'ID': p.id,
    'Name': p.name,
    'Category': p.category,
    'Price (BDT)': p.price,
    'Original Price (BDT)': p.originalPrice || '',
    'In Stock': p.inStock ? 'YES' : 'NO',
    'Badge': p.badge || '',
    'Is Popular': p.isPopular ? 'YES' : 'NO',
    'Rating': p.rating,
    'Reviews Count': p.reviewsCount,
    'Main Image URL': p.image,
    'Gallery Images (Comma Separated)': (p.images || []).join(', '),
    'Sizes (Comma Separated)': (p.sizes || []).join(', '),
    'Features (Comma Separated)': (p.features || []).join(' | '),
    'Description': p.description,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);

  // Set column widths for readability
  ws['!cols'] = [
    { wch: 14 }, // ID
    { wch: 32 }, // Name
    { wch: 16 }, // Category
    { wch: 14 }, // Price
    { wch: 18 }, // Original Price
    { wch: 12 }, // In Stock
    { wch: 15 }, // Badge
    { wch: 12 }, // Is Popular
    { wch: 10 }, // Rating
    { wch: 14 }, // Reviews Count
    { wch: 45 }, // Main Image URL
    { wch: 45 }, // Gallery Images
    { wch: 20 }, // Sizes
    { wch: 40 }, // Features
    { wch: 50 }, // Description
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Products');

  // Trigger download
  XLSX.writeFile(wb, fileName);
}

/**
 * Generate a beautifully structured Sample Excel Template with instructions & sample rows
 */
export function downloadSampleExcelTemplate(): void {
  const wb = XLSX.utils.book_new();

  // 1. Sample Products Sheet
  const sampleProducts = [
    {
      'ID': 'attar-001',
      'Name': 'রয়েল আম্বার উদ আতর (১২ মি.লি.)',
      'Category': 'attar',
      'Price (BDT)': 1250,
      'Original Price (BDT)': 1600,
      'In Stock': 'YES',
      'Badge': 'বেস্ট সেলার',
      'Is Popular': 'YES',
      'Rating': 4.9,
      'Reviews Count': 148,
      'Main Image URL': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80',
      'Gallery Images (Comma Separated)': 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80, https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80',
      'Sizes (Comma Separated)': '6ml, 12ml, 25ml',
      'Features (Comma Separated)': '১০০% পিওর অ্যালকোহল মুক্ত | একটানা ২৪ ঘণ্টা লং লাস্টিং সুবাস | আকর্ষণীয় ক্রিস্টাল বোতল',
      'Description': 'উচ্চমানের প্রাকৃতিক উদ ও আম্বারের চমৎকার মিশ্রণে তৈরি সুগন্ধি আতর। প্রতিদিনের ব্যবহার ও উপহারের জন্য অনন্য।',
    },
    {
      'ID': 'panjabi-002',
      'Name': 'এক্সক্লুসিভ কাশ্মীরি কটন পাঞ্জাবি',
      'Category': 'panjabi',
      'Price (BDT)': 2150,
      'Original Price (BDT)': 2800,
      'In Stock': 'YES',
      'Badge': 'নতুন কালেকশন',
      'Is Popular': 'YES',
      'Rating': 4.8,
      'Reviews Count': 95,
      'Main Image URL': 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&auto=format&fit=crop&q=80',
      'Gallery Images (Comma Separated)': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
      'Sizes (Comma Separated)': '38, 40, 42, 44',
      'Features (Comma Separated)': '১০০% সুতি আরামদায়ক কাপড় | নিখুঁত কাশ্মীরি সুতার কাজ | মেটালিক বোতাম',
      'Description': 'সুতি আরামদায়ক ফেব্রিক্সে তৈরি প্রিমিয়াম কাশ্মীরি ডিজাইনের সুন্নতি পাঞ্জাবি। জুমার নামাজ ও উৎসবের সেরা পছন্দ।',
    },
    {
      'ID': 'janamaz-003',
      'Name': 'তুরস্কের ভেলভেট জায়নামাজ (ডাবল ফোম)',
      'Category': 'janamaz',
      'Price (BDT)': 1850,
      'Original Price (BDT)': 2300,
      'In Stock': 'YES',
      'Badge': 'প্রিমিয়াম',
      'Is Popular': 'NO',
      'Rating': 5.0,
      'Reviews Count': 62,
      'Main Image URL': 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&auto=format&fit=crop&q=80',
      'Gallery Images (Comma Separated)': '',
      'Sizes (Comma Separated)': 'Standard (80x120cm)',
      'Features (Comma Separated)': 'অরিজিনাল টার্কিশ ভেলভেট ফেব্রিক্স | নরম ডাবল কুশন ফোম | অ্যান্টি-স্লিপ ব্যাক সাইড',
      'Description': 'নামাজে সর্বোচ্চ স্বস্তি পেতে টার্কিশ সফট ভেলভেট জায়নামাজ। প্রবীণদের ব্যবহারের জন্য অত্যন্ত আরামদায়ক।',
    },
    {
      'ID': 'tasbih-004',
      'Name': 'ডিজিটাল স্মার্ট রিং তসবিহ (এলইডি ডিসপ্লে)',
      'Category': 'tasbih',
      'Price (BDT)': 650,
      'Original Price (BDT)': 950,
      'In Stock': 'YES',
      'Badge': 'হট ডিল',
      'Is Popular': 'YES',
      'Rating': 4.7,
      'Reviews Count': 210,
      'Main Image URL': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      'Gallery Images (Comma Separated)': '',
      'Sizes (Comma Separated)': 'Free Size (Adjustable)',
      'Features (Comma Separated)': 'রিচার্জেবল ব্যাটারি | ভাইব্রেশন অ্যালার্ট | নাইট ভিশন ব্যাকলাইট',
      'Description': 'আঙুলে পরার মতো আরামদায়ক স্মার্ট ডিজিটাল তসবিহ। দীর্ঘস্থায়ী ব্যাটারি ব্যাকআপ ও স্বয়ংক্রিয় কাউন্টিং।',
    },
    {
      'ID': 'gift-005',
      'Name': 'ইসলামিক প্রিমিয়াম লাক্সারি গিফট বক্স',
      'Category': 'gift',
      'Price (BDT)': 3450,
      'Original Price (BDT)': 4200,
      'In Stock': 'YES',
      'Badge': 'উপহার স্পেশাল',
      'Is Popular': 'YES',
      'Rating': 5.0,
      'Reviews Count': 74,
      'Main Image URL': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
      'Gallery Images (Comma Separated)': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
      'Sizes (Comma Separated)': 'Box Set',
      'Features (Comma Separated)': '১টি টার্কিশ জায়নামাজ + ১টি আতর + ১টি কাঠের তসবিহ | প্রিমিয়াম উডেন গিফট বক্স | কাস্টম উইশ কার্ড',
      'Description': 'প্রিয়জনকে বিয়ে, ঈদ বা যেকোনো উপলক্ষে উপহার দেওয়ার জন্য আকর্ষণীয় ইসলামিক গিফট প্যাকেজ।',
    },
  ];

  const wsProducts = XLSX.utils.json_to_sheet(sampleProducts);
  wsProducts['!cols'] = [
    { wch: 15 },
    { wch: 35 },
    { wch: 15 },
    { wch: 14 },
    { wch: 18 },
    { wch: 12 },
    { wch: 16 },
    { wch: 12 },
    { wch: 10 },
    { wch: 14 },
    { wch: 45 },
    { wch: 45 },
    { wch: 22 },
    { wch: 42 },
    { wch: 50 },
  ];
  XLSX.utils.book_append_sheet(wb, wsProducts, 'Products_Template');

  // 2. Instructions Sheet
  const instructions = [
    { 'কলামের নাম (Column)': 'ID', 'প্রয়োজনীয়তা (Required)': 'ঐচ্ছিক (খালি রাখলে স্বয়ংক্রিয় তৈরি হবে)', 'বর্ণনা ও নিয়ম (Instructions)': 'পণ্যের ইউনিক আইডি (যেমন: attar-01)। একই আইডি থাকলে প্রোডাক্ট আপডেট হবে।' },
    { 'কলামের নাম (Column)': 'Name', 'প্রয়োজনীয়তা (Required)': 'অবশ্যই দিতে হবে (Mandatory)', 'বর্ণনা ও নিয়ম (Instructions)': 'পণ্যের সম্পূর্ণ নাম বাংলায় বা ইংরেজিতে লিখুন।' },
    { 'কলামের নাম (Column)': 'Category', 'প্রয়োজনীয়তা (Required)': 'অবশ্যই দিতে হবে (Mandatory)', 'বর্ণনা ও নিয়ম (Instructions)': 'ক্যাটাগরি আইডি (যেমন: panjabi, attar, janamaz, tasbih, gift, organic)। নতুন নাম দিলে নতুন ক্যাটাগরি স্বয়ংক্রিয় যুক্ত হবে।' },
    { 'কলামের নাম (Column)': 'Price (BDT)', 'প্রয়োজনীয়তা (Required)': 'অবশ্যই দিতে হবে (Mandatory)', 'বর্ণনা ও নিয়ম (Instructions)': 'বর্তমান বিক্রয় মূল্য (শুধু সংখ্যা, যেমন: 1250)।' },
    { 'কলামের নাম (Column)': 'Original Price (BDT)', 'প্রয়োজনীয়তা (Required)': 'ঐচ্ছিক', 'বর্ণনা ও নিয়ম (Instructions)': 'ছাড় দেওয়ার পূর্বের মূল্য (কাটা দাগ দেখাবে)।' },
    { 'কলামের নাম (Column)': 'In Stock', 'প্রয়োজনীয়তা (Required)': 'ঐচ্ছিক (ডিফল্ট: YES)', 'বর্ণনা ও নিয়ম (Instructions)': 'স্টকে থাকলে YES বা TRUE বা 1 লিখুন। স্টক শেষ হলে NO বা FALSE বা 0।' },
    { 'কলামের নাম (Column)': 'Badge', 'প্রয়োজনীয়তা (Required)': 'ঐচ্ছিক', 'বর্ণনা ও নিয়ম (Instructions)': 'পণ্যের ওপর ছোট ব্যাজ (যেমন: বেস্ট সেলার, নতুন, অফার, ২০% ছাড়)।' },
    { 'কলামের নাম (Column)': 'Is Popular', 'প্রয়োজনীয়তা (Required)': 'ঐচ্ছিক (ডিফল্ট: NO)', 'বর্ণনা ও নিয়ম (Instructions)': 'জনপ্রিয় তালিকায় দেখাতে YES বা TRUE লিখুন।' },
    { 'কলামের নাম (Column)': 'Rating', 'প্রয়োজনীয়তা (Required)': 'ঐচ্ছিক (ডিফল্ট: 5.0)', 'বর্ণনা ও নিয়ম (Instructions)': 'রেটিং সংখ্যা (যেমন: 4.8 বা 5.0)।' },
    { 'কলামের নাম (Column)': 'Reviews Count', 'প্রয়োজনীয়তা (Required)': 'ঐচ্ছিক (ডিফল্ট: 15)', 'বর্ণনা ও নিয়ম (Instructions)': 'রিভিউ সংখ্যা (যেমন: 120)।' },
    { 'কলামের নাম (Column)': 'Main Image URL', 'প্রয়োজনীয়তা (Required)': 'প্রস্তাবিত', 'বর্ণনা ও নিয়ম (Instructions)': 'প্রধান ছবির পূর্ণ ওয়েব লিংক (https://...)।' },
    { 'কলামের নাম (Column)': 'Gallery Images', 'প্রয়োজনীয়তা (Required)': 'ঐচ্ছিক', 'বর্ণনা ও নিয়ম (Instructions)': 'একাধিক ছবির লিংক থাকলে কমা (,) দিয়ে আলাদা করে লিখুন।' },
    { 'কলামের নাম (Column)': 'Sizes', 'প্রয়োজনীয়তা (Required)': 'ঐচ্ছিক', 'বর্ণনা ও নিয়ম (Instructions)': 'সাইজ বা ভ্যারিয়েন্ট কমা দিয়ে লিখুন (যেমন: 38, 40, 42 বা 6ml, 12ml)।' },
    { 'কলামের নাম (Column)': 'Features', 'প্রয়োজনীয়তা (Required)': 'ঐচ্ছিক', 'বর্ণনা ও নিয়ম (Instructions)': 'পণ্যের বিশেষ বৈশিষ্ট্যসমূহ পাইপ (|) অথবা কমা দিয়ে লিখুন।' },
    { 'কলামের নাম (Column)': 'Description', 'প্রয়োজনীয়তা (Required)': 'ঐচ্ছিক', 'বর্ণনা ও নিয়ম (Instructions)': 'পণ্যের পূর্ণ বিবরণ বা বিস্তারিত বর্ণনা।' },
  ];

  const wsInstructions = XLSX.utils.json_to_sheet(instructions);
  wsInstructions['!cols'] = [{ wch: 22 }, { wch: 32 }, { wch: 65 }];
  XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instructions_দিকনির্দেশনা');

  XLSX.writeFile(wb, 'iqrshop_sample_products_template.xlsx');
}
