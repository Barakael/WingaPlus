class Target {
  final int id;
  final int salesmanId;
  final String? salesmanName;
  final String type; // 'sales_count', 'revenue', 'profit', etc.
  final double targetAmount;
  final double currentAmount;
  final String period; // 'daily', 'weekly', 'monthly', 'yearly'
  final DateTime startDate;
  final DateTime endDate;
  final DateTime createdAt;
  final DateTime? updatedAt;

  Target({
    required this.id,
    required this.salesmanId,
    this.salesmanName,
    required this.type,
    required this.targetAmount,
    required this.currentAmount,
    required this.period,
    required this.startDate,
    required this.endDate,
    required this.createdAt,
    this.updatedAt,
  });

  factory Target.fromJson(Map<String, dynamic> json) {
    return Target(
      id: json['id'] ?? 0,
      salesmanId: json['salesman_id'] ?? json['user_id'] ?? 0,
      salesmanName: json['salesman_name'] ?? json['user_name'],
      type: json['type'] ?? 'revenue',
      targetAmount: double.tryParse(json['target_amount']?.toString() ?? '0') ?? 0.0,
      currentAmount: double.tryParse(json['current_amount']?.toString() ?? '0') ?? 0.0,
      period: json['period'] ?? 'monthly',
      startDate: json['start_date'] != null 
          ? DateTime.parse(json['start_date']) 
          : DateTime.now(),
      endDate: json['end_date'] != null 
          ? DateTime.parse(json['end_date']) 
          : DateTime.now().add(const Duration(days: 30)),
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
      'type': type,
      'target_amount': targetAmount,
      'current_amount': currentAmount,
      'period': period,
      'start_date': startDate.toIso8601String(),
      'end_date': endDate.toIso8601String(),
    };
  }

  // Calculate achievement percentage
  double get achievementPercentage {
    if (targetAmount == 0) return 0;
    return (currentAmount / targetAmount) * 100;
  }

  // Check if target is achieved
  bool get isAchieved => currentAmount >= targetAmount;

  // Get remaining amount to achieve target
  double get remainingAmount {
    final remaining = targetAmount - currentAmount;
    return remaining > 0 ? remaining : 0;
  }

  // Format currency
  String formatCurrency(double amount) {
    return amount.toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (Match m) => '${m[1]},',
    );
  }

  String get formattedTargetAmount => formatCurrency(targetAmount);
  String get formattedCurrentAmount => formatCurrency(currentAmount);
  String get formattedRemainingAmount => formatCurrency(remainingAmount);
}
