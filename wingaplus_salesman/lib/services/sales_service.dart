import '../models/sale.dart';
import '../models/target.dart';
import '../models/service.dart';
import '../models/product.dart';
import '../config/constants.dart';
import 'api_service.dart';

class SalesService {
  static final SalesService _instance = SalesService._internal();
  factory SalesService() => _instance;
  SalesService._internal();

  final ApiService _apiService = ApiService();

  // Get all sales for current salesman
  Future<List<Sale>> getMySales({
    String? filterType,
    String? dateFilter,
    String? monthFilter,
    String? yearFilter,
    String? startDate,
    String? endDate,
    String? searchTerm,
  }) async {
    try {
      final queryParams = <String, String>{};
      
      if (filterType != null) queryParams['filter_type'] = filterType;
      if (dateFilter != null) queryParams['date'] = dateFilter;
      if (monthFilter != null) queryParams['month'] = monthFilter;
      if (yearFilter != null) queryParams['year'] = yearFilter;
      if (startDate != null) queryParams['start_date'] = startDate;
      if (endDate != null) queryParams['end_date'] = endDate;
      if (searchTerm != null && searchTerm.isNotEmpty) {
        queryParams['search'] = searchTerm;
      }

      final response = await _apiService.get(
        AppConstants.salesEndpoint,
        queryParams: queryParams,
      );

      final List<dynamic> salesData = response['data'] ?? response ?? [];
      return salesData.map((json) => Sale.fromJson(json)).toList();
    } catch (e) {
      throw _handleError(e, 'Failed to load sales');
    }
  }

  // Create new sale
  Future<Sale> createSale({
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
    try {
      final body = {
        'product_id': productId,
        'product_name': productName,
        'quantity': quantity,
        'cost_price': costPrice,
        'unit_price': unitPrice,
        'customer_name': customerName,
        'customer_contact': customerContact,
        'offers': offers ?? 0,
        'store_name': storeName,
        'sale_date': (saleDate ?? DateTime.now()).toIso8601String(),
      };

      final response = await _apiService.post(
        AppConstants.salesEndpoint,
        body: body,
      );

      final saleData = response['data'] ?? response;
      return Sale.fromJson(saleData);
    } catch (e) {
      throw _handleError(e, 'Failed to create sale');
    }
  }

  // Update sale
  Future<Sale> updateSale({
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
    try {
      final body = <String, dynamic>{};
      
      if (productId != null) body['product_id'] = productId;
      if (productName != null) body['product_name'] = productName;
      if (quantity != null) body['quantity'] = quantity;
      if (costPrice != null) body['cost_price'] = costPrice;
      if (unitPrice != null) body['unit_price'] = unitPrice;
      if (customerName != null) body['customer_name'] = customerName;
      if (customerContact != null) body['customer_contact'] = customerContact;
      if (offers != null) body['offers'] = offers;
      if (storeName != null) body['store_name'] = storeName;
      if (saleDate != null) body['sale_date'] = saleDate.toIso8601String();

      final response = await _apiService.put(
        '${AppConstants.salesEndpoint}/$saleId',
        body: body,
      );

      final saleData = response['data'] ?? response;
      return Sale.fromJson(saleData);
    } catch (e) {
      throw _handleError(e, 'Failed to update sale');
    }
  }

  // Delete sale
  Future<void> deleteSale(int saleId) async {
    try {
      await _apiService.delete('${AppConstants.salesEndpoint}/$saleId');
    } catch (e) {
      throw _handleError(e, 'Failed to delete sale');
    }
  }

  // Get targets
  Future<List<Target>> getTargets() async {
    try {
      final response = await _apiService.get(AppConstants.targetsEndpoint);
      final List<dynamic> targetsData = response['data'] ?? response ?? [];
      return targetsData.map((json) => Target.fromJson(json)).toList();
    } catch (e) {
      throw _handleError(e, 'Failed to load targets');
    }
  }

  // Get services
  Future<List<ServiceRecord>> getServices({
    String? filterType,
    String? dateFilter,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (filterType != null) queryParams['filter_type'] = filterType;
      if (dateFilter != null) queryParams['date'] = dateFilter;

      final response = await _apiService.get(
        AppConstants.servicesEndpoint,
        queryParams: queryParams,
      );

      final List<dynamic> servicesData = response['data'] ?? response ?? [];
      return servicesData.map((json) => ServiceRecord.fromJson(json)).toList();
    } catch (e) {
      throw _handleError(e, 'Failed to load services');
    }
  }

  // Get products (for sale form)
  Future<List<Product>> getProducts({String? searchTerm}) async {
    try {
      final queryParams = <String, String>{};
      if (searchTerm != null && searchTerm.isNotEmpty) {
        queryParams['search'] = searchTerm;
      }

      final response = await _apiService.get(
        AppConstants.productsEndpoint,
        queryParams: queryParams,
      );

      final List<dynamic> productsData = response['data'] ?? response ?? [];
      return productsData.map((json) => Product.fromJson(json)).toList();
    } catch (e) {
      throw _handleError(e, 'Failed to load products');
    }
  }

  // Handle errors
  Exception _handleError(dynamic error, String defaultMessage) {
    if (error is ApiException) {
      return Exception(error.message);
    }
    return Exception(defaultMessage);
  }
}
