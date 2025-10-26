export const salesOrders = [
  {
    id: '1',
    salesman_id: '4',
    customer_name: 'John Doe',
    customer_phone: '+255712345678',
    customer_email: 'john@example.com',
    status: 'draft',
    items: [
      {
        id: '1',
        sales_order_id: '1',
        product_id: '1',
        quantity: 2,
        unit_price: 999,
        discount_percentage: 0,
        total_amount: 1998
      }
    ],
    subtotal: 1998,
    tax_amount: 199.8,
    discount_amount: 0,
    total_amount: 2197.8,
    notes: 'Customer interested in iPhone 15',
    valid_until: '2025-10-27',
    created_at: '2025-09-27T10:00:00Z',
    updated_at: '2025-09-27T10:00:00Z'
  },
  {
    id: '2',
    salesman_id: '4',
    customer_name: 'Jane Smith',
    customer_phone: '+255787654321',
    status: 'completed',
    items: [
      {
        id: '2',
        sales_order_id: '2',
        product_id: '2',
        quantity: 1,
        unit_price: 899,
        discount_percentage: 5,
        total_amount: 854.05
      }
    ],
    subtotal: 854.05,
    tax_amount: 85.41,
    discount_amount: 44.95,
    total_amount: 894.51,
    created_at: '2025-09-26T14:30:00Z',
    updated_at: '2025-09-26T15:00:00Z'
  }
];

export const commissionRules = [
  {
    id: '1',
    shop_id: '1',
    name: 'Standard Commission',
    type: 'percentage',
    base_rate: 5.0,
    is_active: true,
    created_at: '2025-09-01T00:00:00Z'
  },
  {
    id: '2',
    shop_id: '1',
    name: 'Tiered Commission',
    type: 'tiered',
    base_rate: 0,
    tiers: [
      {
        id: '1',
        commission_rule_id: '2',
        min_amount: 0,
        max_amount: 1000,
        rate_percentage: 3.0
      },
      {
        id: '2',
        commission_rule_id: '2',
        min_amount: 1000,
        max_amount: 5000,
        rate_percentage: 5.0
      },
      {
        id: '3',
        commission_rule_id: '2',
        min_amount: 5000,
        rate_percentage: 7.0
      }
    ],
    is_active: true,
    created_at: '2025-09-01T00:00:00Z'
  }
];

export const commissions = [
  {
    id: '1',
    salesman_id: '4',
    sale_id: '1',
    amount: 110,
    rate_percentage: 5.0,
    status: 'paid',
    paid_at: '2025-09-20T10:00:00Z',
    created_at: '2025-09-15T10:00:00Z'
  },
  {
    id: '2',
    salesman_id: '4',
    sale_id: '2',
    amount: 49.5,
    rate_percentage: 5.0,
    status: 'pending',
    created_at: '2025-09-16T14:30:00Z'
  }
];

export const targets = [
  {
    id: '1',
    salesman_id: '4',
    shop_id: '1',
    type: 'individual',
    period: 'monthly',
    metric: 'revenue',
    target_value: 5000,
    current_value: 2099,
    start_date: '2025-09-01',
    end_date: '2025-09-30',
    status: 'active',
    bonus_amount: 500,
    created_at: '2025-09-01T00:00:00Z'
  },
  {
    id: '2',
    salesman_id: '4',
    shop_id: '1',
    type: 'individual',
    period: 'weekly',
    metric: 'sales_count',
    target_value: 10,
    current_value: 2,
    start_date: '2025-09-23',
    end_date: '2025-09-29',
    status: 'active',
    bonus_amount: 100,
    created_at: '2025-09-23T00:00:00Z'
  }
];

export const achievements = [
  {
    id: '1',
    salesman_id: '4',
    type: 'target_met',
    title: 'First Sale Champion',
    description: 'Completed your first sale',
    badge_icon: 'trophy',
    points: 50,
    unlocked_at: '2025-09-15T10:00:00Z',
    metadata: { sale_id: '1' }
  },
  {
    id: '2',
    salesman_id: '4',
    type: 'streak',
    title: 'Consistent Performer',
    description: 'Made sales for 3 consecutive days',
    badge_icon: 'flame',
    points: 75,
    unlocked_at: '2025-09-17T10:00:00Z',
    metadata: { streak_days: 3 }
  }
];

export const receipts = [
  {
    id: '1',
    sale_id: '1',
    receipt_number: 'RCP-2025-001',
    customer_name: 'John Doe',
    customer_phone: '+255712345678',
    items: [
      {
        id: '1',
        receipt_id: '1',
        product_name: 'iPhone 15',
        quantity: 1,
        unit_price: 1000000,
        total_amount: 1000000
      }
    ],
    subtotal: 1000000,
    tax_amount: 180000,
    discount_amount: 0,
    total_amount: 1180000,
    payment_method: 'mobile_money',
    qr_code: 'RCP-QR-001',
    issued_by: 'Salesman User',
    issued_at: '2025-09-15T10:00:00Z'
  }
];

export const invoices = [
  {
    id: '1',
    receipt_id: '1',
    invoice_number: 'INV-2025-001',
    customer_name: 'John Doe',
    customer_address: '123 Main St, Dar es Salaam',
    customer_email: 'john@example.com',
    customer_phone: '+255712345678',
    items: [
      {
        id: '1',
        invoice_id: '1',
        product_name: 'iPhone 15',
        description: 'Latest iPhone model with advanced features',
        quantity: 1,
        unit_price: 1000000,
        tax_rate: 18,
        discount_percentage: 0,
        total_amount: 1000000
      }
    ],
    subtotal: 1000000,
    tax_rate: 18,
    tax_amount: 180000,
    discount_amount: 0,
    total_amount: 1180000,
    due_date: '2025-10-15',
    status: 'paid',
    notes: 'Payment received via mobile money',
    created_at: '2025-09-15T10:00:00Z'
  }
];
