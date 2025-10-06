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
  product_id?: string | null; // Optional now
  product_name?: string | null; // Free-text name when product_id absent
  salesman_id?: string; // May be optional when created automatically from warranty
  customer_name?: string; // Existing data retained if server stores
  customer_phone?: string;
  quantity: number;
  unit_price: number;
  cost_price?: number | null; // New: cost price per unit
  total_amount: number; // Server-calculated (quantity * unit_price)
  ganji?: number | null; // New: profit = (unit_price - cost_price) * quantity
  warranty_id?: string | null; // Links back to warranty if auto-created
  warranty_months?: number; // Might be present for historical data
  warranty_details?: any; // Warranty details object
  warranty_status?: string; // Warranty status
  has_warranty?: boolean; // Whether sale has warranty
  sale_date?: string; // Optional; backend may default
  color?: string; // Product color
  storage?: string; // Product storage capacity
  imei?: string; // IMEI number for phones
  phone_name?: string; // Phone model name
  reference_store?: string; // Reference store
  category?: string; // Product category
  created_at?: string;
  updated_at?: string;
}

export interface CreateSalePayload {
  product_id: string;
  salesman_id: string;
  customer_name: string;
  customer_phone?: string;
  quantity: number;
  unit_price: number;
  warranty_months?: number;
  sale_date?: string; // optional; server defaults to now
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

export interface SalesOrder {
  id: string;
  salesman_id: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  status: 'draft' | 'quoted' | 'confirmed' | 'completed' | 'cancelled';
  items: SalesOrderItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  notes?: string;
  valid_until?: string;
  created_at: string;
  updated_at: string;
}

export interface SalesOrderItem {
  id: string;
  sales_order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  discount_percentage?: number;
  total_amount: number;
}

export interface Receipt {
  id: string;
  sale_id?: string;
  sales_order_id?: string;
  receipt_number: string;
  customer_name: string;
  customer_phone?: string;
  items: ReceiptItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method: 'cash' | 'card' | 'mobile_money' | 'bank_transfer';
  issued_by: string;
  issued_at: string;
}

export interface ReceiptItem {
  id: string;
  receipt_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
}

export interface Commission {
  id: string;
  salesman_id: string;
  sale_id?: string;
  sales_order_id?: string;
  amount: number;
  rate_percentage: number;
  status: 'pending' | 'paid' | 'cancelled';
  paid_at?: string;
  created_at: string;
}

export interface CommissionRule {
  id: string;
  shop_id: string;
  name: string;
  type: 'percentage' | 'tiered' | 'fixed';
  base_rate: number;
  tiers?: CommissionTier[];
  is_active: boolean;
  created_at: string;
}

export interface CommissionTier {
  id: string;
  commission_rule_id: string;
  min_amount: number;
  max_amount?: number;
  rate_percentage: number;
}

export interface Target {
  id: string;
  salesman_id?: string;
  team_id?: string;
  shop_id: string;
  type: 'individual' | 'team';
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  metric: 'revenue' | 'sales_count' | 'products_sold' | 'commission';
  target_value: number;
  current_value: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'failed' | 'cancelled';
  bonus_amount?: number;
  created_at: string;
}

export interface Achievement {
  id: string;
  salesman_id: string;
  type: 'target_met' | 'streak' | 'milestone' | 'performance';
  title: string;
  description: string;
  badge_icon: string;
  points: number;
  unlocked_at: string;
  metadata?: Record<string, any>;
}

export interface Invoice {
  id: string;
  receipt_id: string;
  invoice_number: string;
  customer_name: string;
  customer_address?: string;
  customer_email?: string;
  customer_phone?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  due_date?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  product_name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  discount_percentage?: number;
  total_amount: number;
}