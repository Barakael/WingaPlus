import 'package:flutter/foundation.dart';
import '../models/sale.dart';
import '../models/target.dart';
import '../models/service.dart';
import '../models/product.dart';
import '../services/sales_service.dart';

class SalesProvider with ChangeNotifier {
  final SalesService _salesService = SalesService();

  List<Sale> _sales = [];
  List<Target> _targets = [];
  List<ServiceRecord> _services = [];
  List<Product> _products = [];
  
  bool _isLoading = false;
  String? _error;

  // Getters
  List<Sale> get sales => _sales;
  List<Target> get targets => _targets;
  List<ServiceRecord> get services => _services;
  List<Product> get products => _products;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Load sales
  Future<void> loadSales({
    String? filterType,
    String? dateFilter,
    String? monthFilter,
    String? yearFilter,
    String? startDate,
    String? endDate,
    String? searchTerm,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _sales = await _salesService.getMySales(
        filterType: filterType,
        dateFilter: dateFilter,
        monthFilter: monthFilter,
        yearFilter: yearFilter,
        startDate: startDate,
        endDate: endDate,
        searchTerm: searchTerm,
      );
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Create sale
  Future<bool> createSale({
    required int productId,
    required String productName,
    required int quantity,
    required double costPrice,
    required double unitPrice,
    String? customerName,
    String? customerContact,
    double? offers,
    String? storeName,
    DateTime? saleDate,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final newSale = await _salesService.createSale(
        productId: productId,
        productName: productName,
        quantity: quantity,
        costPrice: costPrice,
        unitPrice: unitPrice,
        customerName: customerName,
        customerContact: customerContact,
        offers: offers,
        storeName: storeName,
        saleDate: saleDate,
      );
      
      _sales.insert(0, newSale); // Add to beginning of list
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Update sale
  Future<bool> updateSale({
    required int saleId,
    int? productId,
    String? productName,
    int? quantity,
    double? costPrice,
    double? unitPrice,
    String? customerName,
    String? customerContact,
    double? offers,
    String? storeName,
    DateTime? saleDate,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final updatedSale = await _salesService.updateSale(
        saleId: saleId,
        productId: productId,
        productName: productName,
        quantity: quantity,
        costPrice: costPrice,
        unitPrice: unitPrice,
        customerName: customerName,
        customerContact: customerContact,
        offers: offers,
        storeName: storeName,
        saleDate: saleDate,
      );

      // Update in list
      final index = _sales.indexWhere((s) => s.id == saleId);
      if (index != -1) {
        _sales[index] = updatedSale;
      }

      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Delete sale
  Future<bool> deleteSale(int saleId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _salesService.deleteSale(saleId);
      _sales.removeWhere((s) => s.id == saleId);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Load targets
  Future<void> loadTargets() async {
    try {
      _targets = await _salesService.getTargets();
      notifyListeners();
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      notifyListeners();
    }
  }

  // Load services
  Future<void> loadServices({String? filterType, String? dateFilter}) async {
    try {
      _services = await _salesService.getServices(
        filterType: filterType,
        dateFilter: dateFilter,
      );
      notifyListeners();
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      notifyListeners();
    }
  }

  // Load products
  Future<void> loadProducts({String? searchTerm}) async {
    try {
      _products = await _salesService.getProducts(searchTerm: searchTerm);
      notifyListeners();
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      notifyListeners();
    }
  }

  // Calculate statistics
  double get totalRevenue {
    return _sales.fold(0.0, (sum, sale) => sum + sale.totalPrice);
  }

  double get totalProfit {
    return _sales.fold(0.0, (sum, sale) => sum + sale.profit);
  }

  int get totalSalesCount => _sales.length;

  int get totalItemsSold {
    return _sales.fold(0, (sum, sale) => sum + sale.quantity);
  }

  // Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }
}
