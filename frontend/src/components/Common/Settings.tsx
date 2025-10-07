import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Phone, Save, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { BASE_URL } from '../api/api';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  username: string;
  phone?: string;
  role: string;
  shop_name?: string;
  created_at: string;
}

interface PasswordChange {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

type TabId = 'profile' | 'password';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Password state
  const [passwordForm, setPasswordForm] = useState<PasswordChange>({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Load user profile
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setProfile(userData);
        setProfileForm({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile information' });
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: profileForm.name,
          phone: profileForm.phone,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Update local storage and context
        localStorage.setItem('user', JSON.stringify(updatedUser));
        showMessage('success', 'Profile updated successfully');
        loadUserProfile(); // Refresh profile data
      } else {
        const error = await response.json();
        showMessage('error', error.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage('error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (passwordForm.new_password.length < 8) {
      showMessage('error', 'New password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/user/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          current_password: passwordForm.current_password,
          password: passwordForm.new_password,
          password_confirmation: passwordForm.confirm_password,
        }),
      });

      if (response.ok) {
        showMessage('success', 'Password changed successfully');
        setPasswordForm({
          current_password: '',
          new_password: '',
          confirm_password: '',
        });
      } else {
        const error = await response.json();
        showMessage('error', error.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showMessage('error', 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const tabs: Tab[] = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'password', label: 'Change Password', icon: Lock },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl  md:text-3xl font-bold text-gray-900 dark:text-white">
            Account Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
            Manage your account information and security settings
          </p>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center space-x-3 ${
          message.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          )}
          <p className={`text-sm ${
            message.type === 'success'
              ? 'text-green-800 dark:text-green-200'
              : 'text-red-800 dark:text-red-200'
          }`}>
            {message.text}
          </p>
        </div>
      )}

      {/* Settings Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-2 md:py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 md:p-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 md:mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 md:mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={profileForm.email}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Contact administrator to change email
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 md:mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className='hidden md:block'>
                  <label className="hiddenblock text-sm font-medium text-gray-700 dark:text-gray-300 md:mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={profile?.role === 'salesman' ? 'Winga' : (profile?.role || '')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Contact administrator to change role
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordForm.current_password}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, current_password: e.target.value }))}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, new_password: e.target.value }))}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter new password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordForm.confirm_password}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm_password: e.target.value }))}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;