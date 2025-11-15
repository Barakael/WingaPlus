class User {
  final int id;
  final String name;
  final String email;
  final String? phone;
  final String role;
  final int? shopId;
  final String? shopName;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    required this.role,
    this.shopId,
    this.shopName,
    this.createdAt,
    this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'],
      role: json['role'] ?? '',
      shopId: json['shop_id'],
      shopName: json['shop_name'],
      createdAt: json['created_at'] != null 
          ? DateTime.parse(json['created_at']) 
          : null,
      updatedAt: json['updated_at'] != null 
          ? DateTime.parse(json['updated_at']) 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'role': role,
      'shop_id': shopId,
      'shop_name': shopName,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }

  bool get isSalesman => role == 'salesman';
  bool get isShopOwner => role == 'shop_owner';
  bool get isSuperAdmin => role == 'super_admin';
  bool get isStorekeeper => role == 'storekeeper';
}
