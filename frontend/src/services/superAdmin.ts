import { BASE_URL } from '../components/api/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const getDashboardStats = async () => {
  const response = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  
  return response.json();
};

export const getShops = async (params?: { status?: string; search?: string }) => {
  const queryParams = new URLSearchParams(params as any).toString();
  const url = `${BASE_URL}/api/admin/shops${queryParams ? `?${queryParams}` : ''}`;
  
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch shops');
  }
  
  return response.json();
};

export const createShop = async (shopData: any) => {
  const response = await fetch(`${BASE_URL}/api/admin/shops`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(shopData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create shop');
  }
  
  return response.json();
};

export const updateShop = async (id: number, shopData: any) => {
  const response = await fetch(`${BASE_URL}/api/admin/shops/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(shopData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update shop');
  }
  
  return response.json();
};

export const deleteShop = async (id: number) => {
  const response = await fetch(`${BASE_URL}/api/admin/shops/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete shop');
  }
  
  return response.json();
};

export const getUsers = async (params?: { role?: string; shop_id?: number; search?: string }) => {
  const queryParams = new URLSearchParams(params as any).toString();
  const url = `${BASE_URL}/api/admin/users${queryParams ? `?${queryParams}` : ''}`;
  
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  
  return response.json();
};

export const updateUser = async (id: number, userData: any) => {
  const response = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update user');
  }
  
  return response.json();
};

export const deleteUser = async (id: number) => {
  const response = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete user');
  }
  
  return response.json();
};

export const resetUserPassword = async (id: number, payload: { password: string; password_confirmation: string }) => {
  const response = await fetch(`${BASE_URL}/api/admin/users/${id}/reset-password`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to reset user password');
  }

  return response.json();
};

export const getReports = async () => {
  const response = await fetch(`${BASE_URL}/api/admin/reports`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch reports');
  }
  
  return response.json();
};

export interface ReportsQueryParams {
  date_from?: string;
  date_to?: string;
}

export interface ReportSummary {
  joined_shops: number;
  joined_wingas: number;
  active_shops: number;
  active_wingas: number;
}

export interface ReportSalesByShop {
  shop_id: number;
  total_sales: number;
  total_revenue: number;
  shop: {
    id: number;
    name: string;
    location?: string;
    status?: string;
  } | null;
}

export interface ReportSalesBySalesman {
  salesman_id: number;
  total_sales: number;
  total_revenue: number;
  salesman: {
    id: number;
    name: string;
    email?: string;
    shop?: {
      id: number;
      name: string;
    } | null;
  } | null;
}

export interface ReportActivity {
  id: number;
  action: string;
  model: string;
  description: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email?: string;
  } | null;
}

export interface ReportsResponse {
  period: {
    date_from?: string | null;
    date_to?: string | null;
  };
  summary: ReportSummary;
  sales_by_shop: ReportSalesByShop[];
  sales_by_salesman: ReportSalesBySalesman[];
  recent_activity: ReportActivity[];
}

export const getReportsWithFilters = async (params: ReportsQueryParams = {}) => {
  const queryParams = new URLSearchParams(params as Record<string, string>).toString();
  const response = await fetch(`${BASE_URL}/api/admin/reports${queryParams ? `?${queryParams}` : ''}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch reports');
  }

  return response.json() as Promise<ReportsResponse>;
};

export interface LogsQueryParams {
  action?: string;
  model?: string;
  user_id?: string;
  date_from?: string;
  date_to?: string;
  q?: string;
  page?: string;
  per_page?: string;
}

export const getLogs = async (params: LogsQueryParams = {}) => {
  const queryParams = new URLSearchParams(params as Record<string, string>).toString();
  const response = await fetch(`${BASE_URL}/api/admin/logs${queryParams ? `?${queryParams}` : ''}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch logs');
  }

  return response.json();
};
