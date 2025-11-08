import React, { useState } from 'react';
import { LogIn, Mail, Lock, Eye, EyeOff, UserPlus, User, HelpCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { showSuccessToast, showErrorToast } from '../../lib/toast';

const LoginForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    account_type: 'winga'
  });
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetRequested, setResetRequested] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, register, loading } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate confirm password for registration
    if (!isLogin && formData.password !== formData.confirmPassword) {
      const errorMsg = '❌ Passwords do not match. Please try again.';
      setError(errorMsg);
      showErrorToast(errorMsg);
      return;
    }
    
    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
        showSuccessToast('✅ Welcome back! You are now logged in.');
      } else {
        const payload = { ...formData };
        delete (payload as any).confirmPassword;
        await register(payload);
        showSuccessToast('🎉 Account created! Welcome to WingaPlus.');
      }
    } catch (err: any) {
      // Convert technical errors to user-friendly messages
      let userMessage = '';
      const technicalError = err.message || '';
      
      if (isLogin) {
        // Login error messages
        if (technicalError.includes('Invalid') || technicalError.includes('password') || technicalError.includes('401')) {
          userMessage = '❌ Incorrect email or password. Please try again.';
        } else if (technicalError.includes('network') || technicalError.includes('fetch')) {
          userMessage = '📡 Connection problem. Please check your internet.';
        } else if (technicalError.includes('not found') || technicalError.includes('404')) {
          userMessage = '❌ Account not found. Please sign up first.';
        } else {
          userMessage = '❌ Login failed. Please check your credentials.';
        }
      } else {
        // Registration error messages
        if (technicalError.includes('exists') || technicalError.includes('already')) {
          userMessage = '⚠️ This email is already registered. Try logging in.';
        } else if (technicalError.includes('email')) {
          userMessage = '❌ Please enter a valid email address.';
        } else if (technicalError.includes('password')) {
          userMessage = '❌ Password must be at least 6 characters.';
        } else if (technicalError.includes('network') || technicalError.includes('fetch')) {
          userMessage = '📡 Connection problem. Please check your internet.';
        } else {
          userMessage = '❌ Registration failed. Please try again.';
        }
      }
      
      setError(userMessage);
      showErrorToast(userMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#1973AE] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-r from-[#1973AE] to-[#0d5a8a] rounded-2xl flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold text-xl">WP</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              WingaPlus
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && !showForgot && (
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {formData.account_type === 'winga' ? 'Store Name' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder={formData.account_type === 'winga' ? 'Enter store name' : 'Enter your full name'}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {!showForgot && <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>}

            {!showForgot && <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>}

            {!isLogin && !showForgot && (
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Confirm your password"
                    required={!isLogin}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {!isLogin && !showForgot && (
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleInputChange('account_type', 'winga')}
                    className={`text-xs px-3 py-2 rounded-lg border ${formData.account_type === 'winga' ? 'bg-[#1973AE] text-white border-[#1973AE]' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600'}`}
                  >
                    Winga
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('account_type', 'shop_owner')}
                    className={`text-xs px-3 py-2 rounded-lg border ${formData.account_type === 'shop_owner' ? 'bg-[#1973AE] text-white border-[#1973AE]' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600'}`}
                  >
                    Shop Owner
                  </button>
                </div>
              </div>
            )}

            {showForgot && (
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Enter your email to reset password</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                {resetRequested && (
                  <p className="mt-2 text-xs text-green-600 dark:text-green-400">If the email exists, a reset link was generated (check mail or admin logs).</p>
                )}
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2">
                <p className="text-red-600 dark:text-red-400 text-xs">{error}</p>
              </div>
            )}

            {!showForgot && (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1973AE] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[#0d5a8a] focus:outline-none focus:ring-2 focus:ring-[#1973AE] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-sm"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? <LogIn className="h-4 w-4 mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                    {isLogin ? 'Sign In' : 'Sign Up'}
                  </>
                )}
              </button>
            )}
            {showForgot && (
              <button
                type="button"
                onClick={async () => {
                  setError('');
                  try {
                    const { requestPasswordReset } = await import('../../services/auth');
                    await requestPasswordReset(resetEmail);
                    setResetRequested(true);
                    showSuccessToast('📧 If the email exists, a reset link was generated.');
                  } catch (e: any) {
                    showErrorToast(e.message || 'Failed to request reset');
                  }
                }}
                disabled={loading || !resetEmail}
                className="w-full bg-[#1973AE] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[#0d5a8a] focus:outline-none focus:ring-2 focus:ring-[#1973AE] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-sm"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Request Reset Link'}
              </button>
            )}
          </form>

          <div className="mt-4 text-center">
            {!showForgot && (
              <>
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#1973AE] dark:text-[#1973AE] hover:text-[#0d5a8a] dark:hover:text-[#0d5a8a] text-xs font-medium block w-full"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
                {isLogin && (
                  <button
                    onClick={() => { setShowForgot(true); setResetRequested(false); }}
                    className="mt-2 text-[#1973AE] hover:text-[#0d5a8a] dark:text-[#1973AE] dark:hover:text-[#0d5a8a] text-xs font-medium flex items-center justify-center"
                  >
                    <HelpCircle className="h-3 w-3 mr-1" /> Forgot password?
                  </button>
                )}
              </>
            )}
            {showForgot && (
              <button
                onClick={() => { setShowForgot(false); setResetEmail(''); setResetRequested(false); }}
                className="text-[#1973AE] hover:text-[#0d5a8a] dark:text-[#1973AE] dark:hover:text-[#0d5a8a] text-xs font-medium flex items-center justify-center"
              >
                <ArrowLeft className="h-3 w-3 mr-1" /> Back to login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
