
// Styles for clothes and background logic
export enum FashionStyle {
  CASUAL = '休闲风',
  BUSINESS = '商务风',
  PARTY = '晚宴/派对',
  SPORT = '运动风',
}

// Application Views
export enum AppView {
  EXPLORE = 'explore',
  TRY_ON = 'try_on', // Main Dressing Room (Path 2)
  PROFILE = 'profile',
  PRODUCT_DETAIL = 'product_detail', // Product Detail (Path 1)
  MERCHANT = 'merchant', // Merchant Dashboard
}

// Processing States for Try-On
export enum TryOnState {
  IDLE = 'idle',
  UPLOADING = 'uploading', // Phase 1: Uploading user photo
  SELECTING = 'selecting', // Phase 2: Selecting clothes (Main Room only)
  PROCESSING = 'processing', // Phase 3: AI Generating
  RESULT = 'result', // Phase 4: Showing Result
}

export enum ProductCategory {
  TOP = 'top',      // 上衣
  BOTTOM = 'bottom', // 下装
  DRESS = 'dress',   // 裙装/连体
  OUTER = 'outer',   // 外套
  SHOES = 'shoes',   // 鞋履
}

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  tags: FashionStyle[];
  category?: ProductCategory; // New: Category for matching logic
  description?: string;
  stock?: number;
  sales?: number;
  storeName?: string;
  storeAddress?: string;
}

export interface BodyStats {
  height: number; // cm
  weight: number; // kg
  bust?: number; // cm
  waist?: number; // cm
  hips?: number; // cm
}

export interface UserProfile {
  name: string;
  avatar: string;
  isMerchant: boolean;
  stats: {
    works: number;
    likes: number;
    orders: number;
  };
  bodyStats: BodyStats; // New: Body measurements
}

export interface FashionAdvice {
  title: string;
  description: string;
  score: number;
}

export interface SizeRecommendation {
  size: string; // S, M, L, XL
  reason: string;
}

// New interfaces for Main Dressing Room
export interface UserAvatar {
  id: string;
  image: string; // Base64 or URL
  label: string;
}

export interface UserGarment {
  id: string;
  image: string;
  isCustom: boolean; // True if uploaded by user
  sourceId?: string; // If from shop, the product ID
}

// Order Management
export type OrderStatus = 'pending' | 'shipped' | 'delivered';

export interface ShippingInfo {
  name: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  items: {
    productId: string;
    title: string;
    image: string;
    price: number;
  }[];
  total: number;
  status: OrderStatus;
  shippingInfo: ShippingInfo;
  trackingNumber?: string;
  date: string;
}
