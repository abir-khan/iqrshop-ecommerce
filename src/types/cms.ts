import type { Product, Category, Testimonial } from './index';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  image: string;
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryArea: 'inside_dhaka' | 'outside_dhaka';
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string; // ISO format or formatted
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoIcon: string;
  logoImageUrl?: string;
  announcementText: string;
  showAnnouncement: boolean;
  announcementArabic: string;
  helplinePhone: string;
  helplineDisplay: string;
  supportEmail: string;
  whatsappNumber: string;
  workingHours: string;
  address: string;
  copyrightText: string;
  currencySymbol: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
    whatsapp: string;
  };
}

export interface HeaderNavLink {
  id: string;
  name: string;
  categoryId?: string;
  url?: string;
  showSparkle?: boolean;
}

export interface HeroFeatureCard {
  id: string;
  categoryId: string;
  badge: string;
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
  imageAlt: string;
}

export interface HeroData {
  badgeText: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  ctaButtonText: string;
  trustBadgeText: string;
  mainImage: string;
  mainImageAlt: string;
  mainImageTitle: string;
  externalButtonText?: string;
  externalButtonUrl?: string;
  showExternalButton?: boolean;
  featureCards: HeroFeatureCard[];
}

export interface PromoBannerItem {
  id: string;
  categoryId: string;
  badge: string;
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
  imageAlt: string;
}

export interface DualBannerData {
  banner1: PromoBannerItem;
  banner2: PromoBannerItem;
}

export interface TrustItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'truck' | 'shield' | 'refresh' | 'sparkles' | 'heart';
}

export interface PolicySectionItem {
  title: string;
  description: string;
  badge?: string;
}

export interface PolicyData {
  shipping: {
    title: string;
    subtitle: string;
    items: PolicySectionItem[];
  };
  return: {
    title: string;
    subtitle: string;
    items: PolicySectionItem[];
  };
  refund: {
    title: string;
    subtitle: string;
    items: PolicySectionItem[];
  };
  quality: {
    title: string;
    subtitle: string;
    items: PolicySectionItem[];
  };
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  lastSyncedAt?: string;
}

export interface CategoryShowcaseBanner {
  id: string;
  categoryId: string;
  englishTitle: string;
  banglaTitle: string;
  tagline: string;
  badge: string;
  image: string;
  bgGradient: string;
  accentColor: string;
  textColor: string;
  badgeBg: string;
  buttonText: string;
  enabled: boolean;
}

export interface ShowroomStripData {
  title: string;
  badge: string;
  subtitle: string;
  buttonText: string;
  categoryId: string;
  enabled: boolean;
}

export interface CmsStoreData {
  siteSettings: SiteSettings;
  headerNavLinks: HeaderNavLink[];
  heroData: HeroData;
  dualBanners: DualBannerData;
  trustItems: TrustItem[];
  categories: Category[];
  products: Product[];
  testimonials: Testimonial[];
  policies: PolicyData;
  orders: CustomerOrder[];
  categoryBanners: CategoryShowcaseBanner[];
  showroomStrip: ShowroomStripData;
}
