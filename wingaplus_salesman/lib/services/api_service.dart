import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/constants.dart';
import 'storage_service.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  final _storage = StorageService();
  String? _token;

  // Get stored token
  Future<String?> getToken() async {
    _token ??= await _storage.read(AppConstants.tokenKey);
    return _token;
  }

  // Save token
  Future<void> saveToken(String token) async {
    _token = token;
    await _storage.write(AppConstants.tokenKey, token);
  }

  // Clear token
  Future<void> clearToken() async {
    _token = null;
    await _storage.delete(AppConstants.tokenKey);
  }

  // Get headers with authentication
  Future<Map<String, String>> _getHeaders({bool includeAuth = true}) async {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      final token = await getToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  // Handle API response
  dynamic _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) return null;
      return json.decode(response.body);
    } else if (response.statusCode == 401) {
      throw ApiException('Unauthorized', 401);
    } else if (response.statusCode == 404) {
      throw ApiException('Not found', 404);
    } else if (response.statusCode == 422) {
      final data = json.decode(response.body);
      throw ApiException(
        data['message'] ?? 'Validation error',
        422,
        errors: data['errors'],
      );
    } else {
      try {
        final data = json.decode(response.body);
        throw ApiException(
          data['message'] ?? 'Server error',
          response.statusCode,
        );
      } catch (e) {
        throw ApiException('Server error', response.statusCode);
      }
    }
  }

  // GET request
  Future<dynamic> get(String endpoint, {Map<String, String>? queryParams}) async {
    int retries = 2;
    Exception? lastException;
    
    while (retries >= 0) {
      try {
        var uri = Uri.parse('${AppConstants.baseUrl}$endpoint');
        if (queryParams != null) {
          uri = uri.replace(queryParameters: queryParams);
        }

        final headers = await _getHeaders();
        final response = await http.get(uri, headers: headers)
            .timeout(
              const Duration(seconds: AppConstants.requestTimeout),
              onTimeout: () {
                throw ApiException('Request timeout. Please check your connection.', 0);
              },
            );

        return _handleResponse(response);
      } catch (e) {
        lastException = e is ApiException ? e : ApiException('Network error: ${e.toString()}', 0);
        
        // Retry on connection errors
        if (retries > 0 && (e.toString().contains('Connection') || 
            e.toString().contains('reset') || 
            e.toString().contains('Socket'))) {
          retries--;
          await Future.delayed(const Duration(milliseconds: 500));
          continue;
        }
        
        if (e is ApiException) rethrow;
        throw ApiException('Network error: ${e.toString()}', 0);
      }
    }
    
    throw lastException ?? ApiException('Network error: Connection failed', 0);
  }

  // POST request
  Future<dynamic> post(String endpoint, {Map<String, dynamic>? body, bool includeAuth = true}) async {
    int retries = 2;
    Exception? lastException;
    
    while (retries >= 0) {
      try {
        final uri = Uri.parse('${AppConstants.baseUrl}$endpoint');
        final headers = await _getHeaders(includeAuth: includeAuth);
        
        final response = await http.post(
          uri,
          headers: headers,
          body: body != null ? json.encode(body) : null,
        ).timeout(
          const Duration(seconds: AppConstants.requestTimeout),
          onTimeout: () {
            throw ApiException('Request timeout. Please check your connection.', 0);
          },
        );

        return _handleResponse(response);
      } catch (e) {
        lastException = e is ApiException ? e : ApiException('Network error: ${e.toString()}', 0);
        
        // Retry on connection errors
        if (retries > 0 && (e.toString().contains('Connection') || 
            e.toString().contains('reset') || 
            e.toString().contains('Socket'))) {
          retries--;
          await Future.delayed(const Duration(milliseconds: 500));
          continue;
        }
        
        if (e is ApiException) rethrow;
        throw ApiException('Network error: ${e.toString()}', 0);
      }
    }
    
    throw lastException ?? ApiException('Network error: Connection failed', 0);
  }

  // PUT request
  Future<dynamic> put(String endpoint, {Map<String, dynamic>? body}) async {
    try {
      final uri = Uri.parse('${AppConstants.baseUrl}$endpoint');
      final headers = await _getHeaders();
      
      final response = await http.put(
        uri,
        headers: headers,
        body: body != null ? json.encode(body) : null,
      ).timeout(const Duration(seconds: AppConstants.requestTimeout));

      return _handleResponse(response);
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Network error: ${e.toString()}', 0);
    }
  }

  // DELETE request
  Future<dynamic> delete(String endpoint) async {
    try {
      final uri = Uri.parse('${AppConstants.baseUrl}$endpoint');
      final headers = await _getHeaders();
      
      final response = await http.delete(uri, headers: headers)
          .timeout(const Duration(seconds: AppConstants.requestTimeout));

      return _handleResponse(response);
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Network error: ${e.toString()}', 0);
    }
  }
}

// Custom exception class
class ApiException implements Exception {
  final String message;
  final int statusCode;
  final Map<String, dynamic>? errors;

  ApiException(this.message, this.statusCode, {this.errors});

  @override
  String toString() => message;
}
