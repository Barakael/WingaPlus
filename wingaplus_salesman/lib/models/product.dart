class Product {
  final int id;
  final String name;
  final String? description;
  final String? category;
  final double costPrice;
  final double sellingPrice;
  final int stock;
  final String? imageUrl;
  final int? shopId;
  final DateTime createdAt;
  final DateTime? updatedAt;

  Product({
    required this.id,
    required this.name,
    this.description,
    this.category,
    required this.costPrice,
    required this.sellingPrice,
    required this.stock,
    this.imageUrl,
    this.shopId,
    required this.createdAt,
    this.updatedAt,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? 0,
      name: json['name'] ?? 'Unknown Product',
      description: json['description'],
      category: json['category'],
      costPrice: double.tryParse(json['cost_price']?.toString() ?? '0') ?? 0.0,
      sellingPrice: double.tryParse(json['selling_price']?.toString() ?? '0') ?? 0.0,
      stock: int.tryParse(json['stock']?.toString() ?? '0') ?? 0,
      imageUrl: json['image_url'],
      shopId: json['shop_id'],
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
      'name': name,
      'description': description,
      'category': category,
      'cost_price': costPrice,
      'selling_price': sellingPrice,
      'stock': stock,
      'image_url': imageUrl,
      'shop_id': shopId,
    };
  }

  // Calculate profit margin
  double get profitMargin {
    if (sellingPrice == 0) return 0;
    return ((sellingPrice - costPrice) / sellingPrice) * 100;
  }

  // Check if in stock
  bool get inStock => stock > 0;
  bool get lowStock => stock > 0 && stock <= 10;

  // Format currency
  String formatCurrency(double amount) {
    return amount.toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (Match m) => '${m[1]},',
    );
  }

  String get formattedCostPrice => formatCurrency(costPrice);
  String get formattedSellingPrice => formatCurrency(sellingPrice);
}
