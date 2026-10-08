export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviewsCount: number;
  badge?: string;
  isPopular?: boolean;
  inStock: boolean;
  description: string;
  features?: string[];
  sizes?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count?: number;
  tag?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  comment: string;
  rating: number;
  avatar: string;
  product: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}
