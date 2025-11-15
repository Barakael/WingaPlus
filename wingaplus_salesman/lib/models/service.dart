class ServiceRecord {
  final int id;
  final int salesmanId;
  final String? salesmanName;
  final String? customerName;
  final String? customerContact;
  final String serviceType;
  final String description;
  final double amount;
  final String status; // 'pending', 'in_progress', 'completed', 'cancelled'
  final DateTime serviceDate;
  final DateTime createdAt;
  final DateTime? updatedAt;

  ServiceRecord({
    required this.id,
    required this.salesmanId,
    this.salesmanName,
    this.customerName,
    this.customerContact,
    required this.serviceType,
    required this.description,
    required this.amount,
    required this.status,
    required this.serviceDate,
    required this.createdAt,
    this.updatedAt,
  });

  factory ServiceRecord.fromJson(Map<String, dynamic> json) {
    return ServiceRecord(
      id: json['id'] ?? 0,
      salesmanId: json['salesman_id'] ?? json['user_id'] ?? 0,
      salesmanName: json['salesman_name'] ?? json['user_name'],
      customerName: json['customer_name'],
      customerContact: json['customer_contact'],
      serviceType: json['service_type'] ?? 'repair',
      description: json['description'] ?? '',
      amount: double.tryParse(json['amount']?.toString() ?? '0') ?? 0.0,
      status: json['status'] ?? 'pending',
      serviceDate: json['service_date'] != null 
          ? DateTime.parse(json['service_date']) 
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
      'customer_name': customerName,
      'customer_contact': customerContact,
      'service_type': serviceType,
      'description': description,
      'amount': amount,
      'status': status,
      'service_date': serviceDate.toIso8601String(),
    };
  }

  // Format currency
  String get formattedAmount {
    return amount.toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (Match m) => '${m[1]},',
    );
  }

  // Status helper methods
  bool get isPending => status == 'pending';
  bool get isInProgress => status == 'in_progress';
  bool get isCompleted => status == 'completed';
  bool get isCancelled => status == 'cancelled';
}
