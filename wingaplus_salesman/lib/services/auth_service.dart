import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/user.dart';
import '../config/constants.dart';
import 'api_service.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  final ApiService _apiService = ApiService();
  final _storage = const FlutterSecureStorage();

  User? _currentUser;

  // Get current user
  User? get currentUser => _currentUser;

  // Login
  Future<User> login(String email, String password) async {
    try {
      final response = await _apiService.post(
        AppConstants.loginEndpoint,
        body: {
          'email': email,
          'password': password,
        },
        includeAuth: false,
      );

      // Extract token and user data
      final token = response['token'] ?? response['access_token'];
      final userData = response['user'] ?? response['data'];

      if (token == null || userData == null) {
        throw ApiException('Invalid response from server', 500);
      }

      // Save token
      await _apiService.saveToken(token);

      // Parse and save user
      _currentUser = User.fromJson(userData);
      await _saveUser(_currentUser!);

      return _currentUser!;
    } catch (e) {
      throw _handleAuthError(e);
    }
  }

  // Logout
  Future<void> logout() async {
    try {
      // Call logout endpoint (optional, depends on your API)
      await _apiService.post(AppConstants.logoutEndpoint);
    } catch (e) {
      // Ignore logout errors, clear local data anyway
    } finally {
      await _clearUserData();
    }
  }

  // Get saved user
  Future<User?> getSavedUser() async {
    try {
      final userJson = await _storage.read(key: AppConstants.userKey);
      if (userJson != null) {
        _currentUser = User.fromJson(json.decode(userJson));
        return _currentUser;
      }
    } catch (e) {
      // Error reading user data
    }
    return null;
  }

  // Save user
  Future<void> _saveUser(User user) async {
    await _storage.write(
      key: AppConstants.userKey,
      value: json.encode(user.toJson()),
    );
  }

  // Clear user data
  Future<void> _clearUserData() async {
    _currentUser = null;
    await _apiService.clearToken();
    await _storage.delete(key: AppConstants.userKey);
  }

  // Check if logged in
  Future<bool> isLoggedIn() async {
    final token = await _apiService.getToken();
    final user = await getSavedUser();
    return token != null && user != null;
  }

  // Refresh user data
  Future<User?> refreshUser() async {
    try {
      final response = await _apiService.get('/user');
      if (response != null) {
        _currentUser = User.fromJson(response);
        await _saveUser(_currentUser!);
        return _currentUser;
      }
    } catch (e) {
      // Handle error
    }
    return null;
  }

  // Handle auth errors
  Exception _handleAuthError(dynamic error) {
    if (error is ApiException) {
      if (error.statusCode == 401) {
        return Exception('Invalid email or password');
      } else if (error.statusCode == 422) {
        return Exception('Please check your credentials');
      }
      return Exception(error.message);
    }
    return Exception('Login failed. Please try again.');
  }
}
