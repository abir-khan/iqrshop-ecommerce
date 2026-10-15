import type { CmsStoreData, HomeSectionItem, HeaderNavLink } from '../types/cms';
import liveCmsData from './live_cms_data.json';

export const DEFAULT_HOME_SECTIONS: HomeSectionItem[] = [
  {
    id: 'hero',
    name: 'হিরো ব্যানার ও মূল কালেকশন',
    description: 'শীর্ষ ব্যানার, অফার হাইলাইট ও সরাসরি অর্ডার বাটন',
    enabled: true,
    order: 1,
  },
  {
    id: 'combo_chart',
    name: 'সার্কুলার কম্বো চার্ট অফার',
    description: 'পাই-চার্ট ডিজাইনে সাজানো আকর্ষণীয় কম্বো প্যাকেজ ও অফার',
    enabled: true,
    order: 2,
  },
  {
    id: 'category_sections',
    name: 'ফোকাসড কম্বো ক্যাটাগরি প্রোডাক্ট কালেকশন',
    description: 'নির্বাচিত কম্বোর সংশ্লিষ্ট প্রোডাক্ট এবং অন্যান্য ক্যাটাগরি এক্সপ্লোরার (মোবাইল অপ্টিমাইজড)',
    enabled: true,
    order: 3,
  },
  {
    id: 'reviews',
    name: 'কাস্টমার রিভিউ ও মতামত',
    description: 'ভেরিফায়েড কাস্টমারদের রিভিউ ও স্টার রেটিং',
    enabled: true,
    order: 5,
  },
  {
    id: 'trust',
    name: 'বিশ্বস্ততা ও গ্যারান্টি বার',
    description: 'ক্যাশ অন ডেলিভারি, ৭ দিনের রিটার্ন ও ১০০% অরিজিনাল ট্রাস্ট ব্যাজ',
    enabled: true,
    order: 6,
  },
  {
    id: 'newsletter',
    name: 'নিউজলেটার ও অফার সাবস্ক্রিপশন',
    description: 'ডিসকাউন্ট কুপন ও নতুন কালেকশন আপডেট পাওয়ার ফর্ম',
    enabled: true,
    order: 7,
  },
];

export const DEFAULT_HEADER_NAV_LINKS: HeaderNavLink[] = [
  { id: 'all', name: 'সকল পণ্য', categoryId: 'all', enabled: true },
  { id: 'panjabi', name: 'পাঞ্জাবি ও টুপি', categoryId: 'panjabi', enabled: true },
  { id: 'attar', name: 'প্রিমিয়াম আতর', categoryId: 'attar', enabled: true },
  { id: 'janamaz', name: 'তুর্কি জায়নামাজ', categoryId: 'janamaz', enabled: true },
  { id: 'tasbih', name: 'স্মার্ট তসবিহ', categoryId: 'tasbih', enabled: true },
  { id: 'organic', name: 'আজওয়া ও মধু', categoryId: 'organic', enabled: true },
  { id: 'deals', name: 'স্পেশাল ডিল', categoryId: 'deals', showSparkle: true, enabled: true },
];

export const DEFAULT_CMS_DATA: CmsStoreData = {
  ...(liveCmsData as unknown as CmsStoreData),
  homeSections: DEFAULT_HOME_SECTIONS,
  siteSettings: {
    ...((liveCmsData as any).siteSettings || {}),
    featuredComboId: (liveCmsData as any).siteSettings?.featuredComboId || 'combo-sukkari-dates',
  },
  heroData: {
    ...((liveCmsData as any).heroData || {}),
    mainImage: '/hero-hajj-umrah.webp',
    externalButtonUrl: 'https://hajjumrah.iqrshop.com/',
    externalButtonText: 'সাশ্রয়ী দামে হজ্জ উমরাহ সকল পন্য কিনুন',
  },
};
