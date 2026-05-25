import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { showErrorToast, showSuccessToast } from '../../lib/toast';
import { BASE_URL } from '../api/api';

const ShopSetup: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasShop, setHasShop] = useState(false);
  const [shopId, setShopId] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [removeLogo, setRemoveLogo] = useState(false);
  const [form, setForm] = useState({
    name: '',
    location: '',
    address: '',
    phone: '',
    email: '',
    description: '',
  });

  const resolveLogoUrl = (url?: string | null) => {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    const apiAssetBase = BASE_URL || '/api';

    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        const parsed = new URL(url);
        if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
          return `${apiAssetBase}${parsed.pathname}${parsed.search}`;
        }
        return url;
      } catch {
        return url;
      }
    }

    if (url.startsWith('/')) return `${apiAssetBase}${url}`;
    return `${apiAssetBase}/${url}`;
  };

  useEffect(() => {
    const fetchShop = async () => {
      if (!user) return;
      if (user.role !== 'shop_owner') {
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/api/my/shop`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
        });
        const data = await res.json();
        if (data.data) {
          setHasShop(true);
          setShopId(String(data.data.id));
          setForm({
            name: data.data.name || '',
            location: data.data.location || '',
            address: data.data.address || '',
            phone: data.data.phone || '',
            email: data.data.email || data.data.effective_email || '',
            description: data.data.description || '',
          });
          setLogoPreview(resolveLogoUrl(data.data.logo_url || ''));
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const method = hasShop ? 'PUT' : 'POST';

      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      if (logoFile) payload.append('logo', logoFile);
      if (removeLogo) payload.append('remove_logo', '1');

      const res = await fetch(`${BASE_URL}/api/my/shop`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        },
        body: payload
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      if (!hasShop) {
        showSuccessToast(`🏬 Welcome to ${form.name}!`);
        localStorage.removeItem('needs_shop_setup');
        window.location.reload();
        return;
      }

      showSuccessToast('Shop branding updated successfully.');
      setHasShop(true);
      setShopId(data?.data?.id ? String(data.data.id) : shopId);
      if (data?.data?.logo_url) {
        setLogoPreview(resolveLogoUrl(data.data.logo_url));
      } else if (removeLogo) {
        setLogoPreview('');
      }
      setLogoFile(null);
      setRemoveLogo(false);
    } catch (e: any) {
      showErrorToast(e.message || 'Failed to save shop');
    } finally {
      setLoading(false);
    }
  };

  const onLogoChange = (file?: File) => {
    if (!file) {
      setLogoFile(null);
      return;
    }
    setLogoFile(file);
    setRemoveLogo(false);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(typeof reader.result === 'string' ? reader.result : '');
    reader.readAsDataURL(file);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1973AE]/10 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {hasShop ? 'Update Shop Branding' : 'Set Up Your Shop'}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {hasShop ? 'Keep your logo and contact details up to date for warranty cards.' : 'Provide your shop details to continue.'}
        </p>
        {shopId && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Shop ID: {shopId}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Shop Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Ex: Mawinga Electronics"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={e => handleChange('location', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="City / Area"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Contact number"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Support Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="support@yourshop.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Shop Logo</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={e => onLogoChange(e.target.files?.[0])}
              className="w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#1973AE]/10 file:text-[#1973AE] hover:file:bg-[#1973AE]/20"
            />
            {logoPreview && (
              <div className="mt-3 space-y-2">
                <img src={logoPreview} alt="Shop logo preview" className="h-16 w-auto rounded border border-gray-300 dark:border-gray-600 bg-white p-1" />
                <button
                  type="button"
                  onClick={() => {
                    setLogoFile(null);
                    setLogoPreview('');
                    setRemoveLogo(true);
                  }}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Remove logo
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Address (Optional)</label>
            <input
              type="text"
              value={form.address}
              onChange={e => handleChange('address', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Street / Building"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
            <textarea
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              placeholder="Brief summary of your shop"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1973AE] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[#0d5a8a] focus:outline-none focus:ring-2 focus:ring-[#1973AE] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
          >
            {loading ? 'Saving...' : hasShop ? 'Save Branding Changes' : 'Create Shop'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShopSetup;
