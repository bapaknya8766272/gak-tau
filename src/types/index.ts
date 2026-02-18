export interface Product {
  id: string;
  category: 'vps' | 'panel' | 'other';
  name: string;
  price: number;
  stock?: number;
  desc: string;
  recommend?: boolean;
}

export interface CartItem {
  service: string;
  price: number;
  quantity: number;
  category: 'vps' | 'panel' | 'other';
}

export interface SaleRecord {
  service: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
  timestamp: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface PakasirPayment {
  amount: number;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
}
