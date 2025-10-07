import { Sale } from '../types';
import { BASE_URL } from '../components/api/api';

export interface Target {
  id: number;
  salesman_id: number;
  team_id?: number;
  shop_id?: number;
  name: string;
  period: 'monthly' | 'yearly';
  metric: 'profit' | 'items_sold';
  target_value: number;
  status: 'active' | 'completed' | 'failed' | 'cancelled';
  bonus_amount?: number;
  created_at: string;
  updated_at: string;
  salesman?: {
    id: number;
    name: string;
  };
  shop?: {
    id: number;
    name: string;
  };
}

const API_BASE = BASE_URL;

// Function to get auth headers
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Function to ensure CSRF token is set
async function ensureCsrfToken(): Promise<void> {
  try {
    await fetch(`${API_BASE.replace('/api', '')}/sanctum/csrf-cookie`, {
      credentials: 'include'
    });
  } catch (error) {
    console.warn('Failed to fetch CSRF token:', error);
  }
}

export interface CreateSalePayload {
  product_id?: string;
  product_name?: string;
  salesman_id?: string;
  customer_name?: string;
  customer_phone?: string;
  quantity: number;
  unit_price: number;
  selling_price: number;
  cost_price?: number; // added for Ganji calculation
  warranty_months?: number;
  sale_date?: string; // ISO
  reference_store?: string;
  category?: string;
  phone_name?: string;
  imei?: string;
  color?: string;
  storage?: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function createSale(payload: CreateSalePayload): Promise<Sale> {
  const res = await fetch(`${API_BASE}/sales`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include', // allow cookies/session if needed
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<{ data: Sale }>(res);
  return data.data;
}

export async function listSales(params: { salesman_id?: string; date_from?: string; date_to?: string } = {}): Promise<Sale[]> {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) q.append(k, v); });
  const res = await fetch(`${API_BASE}/sales?${q.toString()}`, {
    headers: getAuthHeaders(),
    credentials: 'include'
  });
  const data = await handleResponse<{ data: { data: Sale[] } }>(res);
  return data.data.data;
}

export async function updateSale(id: string | number, payload: Partial<CreateSalePayload>): Promise<Sale> {
  const res = await fetch(`${API_BASE}/sales/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<{ data: Sale }>(res);
  return data.data;
}

export async function deleteSale(id: string | number): Promise<void> {
  const res = await fetch(`${API_BASE}/sales/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include'
  });
  await handleResponse<void>(res);
}

// Target API functions
export interface CreateTargetPayload {
  salesman_id: number;
  team_id?: number;
  shop_id?: number;
  name: string;
  period: 'monthly' | 'yearly';
  metric: 'profit' | 'items_sold';
  target_value: number;
  status?: 'active' | 'completed' | 'failed' | 'cancelled';
  bonus_amount?: number;
}

export async function createTarget(payload: CreateTargetPayload): Promise<Target> {
  await ensureCsrfToken();
  const res = await fetch(`${API_BASE}/targets`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<{ data: Target }>(res);
  return data.data;
}

export async function listTargets(params: { salesman_id?: string; period?: string; metric?: string; status?: string } = {}): Promise<Target[]> {
  await ensureCsrfToken();
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) q.append(k, v); });
  const res = await fetch(`${API_BASE}/targets?${q.toString()}`, {
    headers: getAuthHeaders(),
    credentials: 'include'
  });
  const data = await handleResponse<{ data: { data: Target[] } }>(res);
  return data.data.data;
}

export async function updateTarget(id: string | number, payload: Partial<CreateTargetPayload>): Promise<Target> {
  await ensureCsrfToken();
  const res = await fetch(`${API_BASE}/targets/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<{ data: Target }>(res);
  return data.data;
}

export async function deleteTarget(id: string | number): Promise<void> {
  await ensureCsrfToken();
  const res = await fetch(`${API_BASE}/targets/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include'
  });
  await handleResponse<void>(res);
}
