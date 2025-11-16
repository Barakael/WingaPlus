import 'package:intl/intl.dart';

class Sale {
  final int id;
  final int salesmanId;
  final String? salesmanName;
  final int productId;
  final String productName;
  final String? customerName;
  final String? customerContact;
  final int quantity;
  final double costPrice;
  final double unitPrice;
  final double? offers;
  final double totalPrice;
  final double profit;
  final String? storeName;
  final DateTime saleDate;
  final DateTime createdAt;
  final DateTime? updatedAt;

  Sale({
    required this.id,
    required this.salesmanId,
    this.salesmanName,
    required this.productId,
    required this.productName,
    this.customerName,
    this.customerContact,
    required this.quantity,
    required this.costPrice,
    required this.unitPrice,
    this.offers,
    required this.totalPrice,
    required this.profit,
    this.storeName,
    required this.saleDate,
    required this.createdAt,
    this.updatedAt,
  });

  factory Sale.fromJson(Map<String, dynamic> json) {
    // Parse numeric values safely
    final quantity = int.tryParse(json['quantity']?.toString() ?? '1') ?? 1;
    final costPrice = double.tryParse(json['cost_price']?.toString() ?? '0') ?? 0.0;
    final unitPrice = double.tryParse(json['unit_price']?.toString() ?? '0') ?? 0.0;
    final offers = double.tryParse(json['offers']?.toString() ?? '0') ?? 0.0;
    
    // Calculate total and profit
    final totalPrice = unitPrice * quantity;
    final profit = (unitPrice - costPrice) * quantity - offers;

    return Sale(
      id: json['id'] ?? 0,
      salesmanId: json['salesman_id'] ?? json['user_id'] ?? 0,
      salesmanName: json['salesman_name'] ?? json['user_name'],
      productId: json['product_id'] ?? 0,
      productName: json['product_name'] ?? 'Unknown Product',
      customerName: json['customer_name'],
      customerContact: json['customer_contact'],
      quantity: quantity,
      costPrice: costPrice,
      unitPrice: unitPrice,
      offers: offers > 0 ? offers : null,
      totalPrice: totalPrice,
      profit: profit,
      storeName: json['store_name'],
      saleDate: json['sale_date'] != null 
          ? DateTime.parse(json['sale_date']) 
          : DateTime.now(),
      createdAt: json['created_at'] != null 
          ? DateTime.parse(json['created_at']) 
          : DateTime.now(),
      updatedAt: json['updated_at'] != null 
          ? DateTime.parse(json['updated_at']) 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'salesman_id': salesmanId,
      'product_id': productId,
      'product_name': productName,
      'customer_name': customerName,
      'customer_contact': customerContact,
      'quantity': quantity,
      'cost_price': costPrice,
      'unit_price': unitPrice,
      'offers': offers,
      'total_price': totalPrice,
      'profit': profit,
      'store_name': storeName,
      'sale_date': saleDate.toIso8601String(),
    };
  }

  // Helper method to format currency
  String formatCurrency(double amount) {
    return amount.toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (Match m) => '${m[1]},',
    );
  }

  String get formattedTotalPrice => formatCurrency(totalPrice);
  String get formattedProfit => formatCurrency(profit);
  String get formattedUnitPrice => formatCurrency(unitPrice);
  String get formattedCostPrice => formatCurrency(costPrice);
  String get formattedCreatedAt =>
      DateFormat('dd MMM yyyy').format(createdAt);
}
