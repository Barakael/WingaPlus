class AppConstants {
  // API Configuration
  // Production API endpoint
  // For localhost/web testing, use: 'http://127.0.0.1:8000/api'
  // For local network testing, use: 'http://YOUR_IP:8000/api'
  static const String baseUrl = 'https://wingapro.app/api';

  // API Endpoints
  static const String loginEndpoint = '/login';
  static const String logoutEndpoint = '/logout';
  static const String salesEndpoint = '/sales';
  static const String targetsEndpoint = '/targets';
  static const String servicesEndpoint = '/services';
  static const String productsEndpoint = '/products';

  // Storage Keys
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';
  static const String themeKey = 'theme_mode';

  // App Settings
  static const int requestTimeout = 30; // seconds
  static const int itemsPerPage = 10;
  static const String currencySymbol = 'TZS';
  static const String dateFormat = 'yyyy-MM-dd';
  static const String timeFormat = 'HH:mm:ss';
  static const String dateTimeFormat = 'yyyy-MM-dd HH:mm';

  // Validation
  static const int minPasswordLength = 6;
  static const int maxNameLength = 100;
  static const int maxDescriptionLength = 500;

  // Filter Types
  static const String filterDaily = 'daily';
  static const String filterMonthly = 'monthly';
  static const String filterYearly = 'yearly';
  static const String filterRange = 'range';

  // Role Types (matching your backend)
  static const String roleSuperAdmin = 'super_admin';
  static const String roleShopOwner = 'shop_owner';
  static const String roleSalesman = 'salesman';
  static const String roleStorekeeper = 'storekeeper';

  // Error Messages
  static const String networkError =
      'Network error. Please check your connection.';
  static const String serverError = 'Server error. Please try again later.';
  static const String authError = 'Authentication failed. Please login again.';
  static const String validationError = 'Please fill all required fields.';

  // Success Messages
  static const String loginSuccess = 'Login successful!';
  static const String saleCreated = 'Sale created successfully!';
  static const String saleUpdated = 'Sale updated successfully!';
  static const String saleDeleted = 'Sale deleted successfully!';
}
