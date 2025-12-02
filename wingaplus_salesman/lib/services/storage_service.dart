import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Platform-aware storage service that uses:
/// - shared_preferences for web
/// - flutter_secure_storage for mobile platforms
class StorageService {
  static final StorageService _instance = StorageService._internal();
  factory StorageService() => _instance;
  StorageService._internal();

  final FlutterSecureStorage? _secureStorage = kIsWeb ? null : const FlutterSecureStorage();
  SharedPreferences? _prefs;

  // Initialize shared preferences for web
  Future<void> _initPrefs() async {
    if (kIsWeb && _prefs == null) {
      _prefs = await SharedPreferences.getInstance();
    }
  }

  // Read value
  Future<String?> read(String key) async {
    try {
      if (kIsWeb) {
        await _initPrefs();
        return _prefs?.getString(key);
      } else {
        return await _secureStorage?.read(key: key);
      }
    } catch (e) {
      // If storage fails, return null (graceful degradation)
      return null;
    }
  }

  // Write value
  Future<void> write(String key, String value) async {
    try {
      if (kIsWeb) {
        await _initPrefs();
        await _prefs?.setString(key, value);
      } else {
        await _secureStorage?.write(key: key, value: value);
      }
    } catch (e) {
      // If storage fails, silently continue (graceful degradation)
    }
  }

  // Delete value
  Future<void> delete(String key) async {
    try {
      if (kIsWeb) {
        await _initPrefs();
        await _prefs?.remove(key);
      } else {
        await _secureStorage?.delete(key: key);
      }
    } catch (e) {
      // If storage fails, silently continue (graceful degradation)
    }
  }

  // Delete all values
  Future<void> deleteAll() async {
    try {
      if (kIsWeb) {
        await _initPrefs();
        await _prefs?.clear();
      } else {
        await _secureStorage?.deleteAll();
      }
    } catch (e) {
      // If storage fails, silently continue (graceful degradation)
    }
  }

  // Check if key exists
  Future<bool> containsKey(String key) async {
    try {
      if (kIsWeb) {
        await _initPrefs();
        return _prefs?.containsKey(key) ?? false;
      } else {
        final value = await _secureStorage?.read(key: key);
        return value != null;
      }
    } catch (e) {
      // If storage fails, return false
      return false;
    }
  }
}

