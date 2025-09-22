export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'shop_owner' | 'salesman' | 'storekeeper';
  shop_id?: string;
  created_at: string;
}

export interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  owner_id: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  shop_id: string;
  qr_code: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  category_id: string;
  shop_id: string;
  stock_quantity: number;
  min_stock_level: number;
  price: number;
  created_at: string;
}

export interface Sale {
  id: string;
  product_id: string;
  salesman_id: string;
  customer_name: string;
  customer_phone?: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  warranty_months?: number;
  sale_date: string;
  created_at: string;
}

export interface Warranty {
  id: string;
  sale_id: string;
  customer_name: string;
  customer_phone: string;
  product_name: string;
  issue_description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  created_at: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  user_id: string;
  created_at: string;
}