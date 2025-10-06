import { Sale } from '../types';

const API_BASE = 'http://localhost:8000/api'; // Adjust if different port

export interface CreateSalePayload {
  product_id?: string;
  product_name?: string;
  salesman_id?: string;
  customer_name?: string;
  customer_phone?: string;
  quantity: number;
  unit_price: number;
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
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
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
    headers: { 'Accept': 'application/json' },
    credentials: 'include'
  });
  const data = await handleResponse<{ data: { data: Sale[] } }>(res);
  return data.data.data;
}

export async function updateSale(id: string | number, payload: Partial<CreateSalePayload>): Promise<Sale> {
  const res = await fetch(`${API_BASE}/sales/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<{ data: Sale }>(res);
  return data.data;
}

export async function deleteSale(id: string | number): Promise<void> {
  const res = await fetch(`${API_BASE}/sales/${id}`, {
    method: 'DELETE',
    headers: { 'Accept': 'application/json' },
    credentials: 'include'
  });
  await handleResponse<void>(res);
}
