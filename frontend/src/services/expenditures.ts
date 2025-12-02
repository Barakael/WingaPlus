import { BASE_URL } from '../components/api/api';

export interface Expenditure {
  id: number;
  salesman_id: number;
  name: string;
  amount: number;
  notes?: string;
  expenditure_date: string;
  created_at: string;
  updated_at: string;
  salesman?: {
    id: number;
    name: string;
  };
}

export interface CreateExpenditurePayload {
  salesman_id: number;
  name: string;
  amount: number;
  notes?: string;
  expenditure_date?: string; // ISO date string
}

const API_BASE = `${BASE_URL}/api`;

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

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function createExpenditure(payload: CreateExpenditurePayload): Promise<Expenditure> {
  const res = await fetch(`${API_BASE}/expenditures`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<{ data: Expenditure }>(res);
  return data.data;
}

export async function listExpenditures(params: { salesman_id?: string; date_from?: string; date_to?: string } = {}): Promise<Expenditure[]> {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) q.append(k, v); });
  const res = await fetch(`${API_BASE}/expenditures?${q.toString()}`, {
    headers: getAuthHeaders(),
    credentials: 'include'
  });
  const data = await handleResponse<{ data: { data: Expenditure[] } }>(res);
  return data.data.data;
}

export async function updateExpenditure(id: string | number, payload: Partial<CreateExpenditurePayload>): Promise<Expenditure> {
  const res = await fetch(`${API_BASE}/expenditures/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<{ data: Expenditure }>(res);
  return data.data;
}

export async function deleteExpenditure(id: string | number): Promise<void> {
  const res = await fetch(`${API_BASE}/expenditures/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include'
  });
  await handleResponse<void>(res);
}

