import 'package:flutter/material.dart';

import '../../config/theme.dart';
import '../../design/tokens.dart';

class RecentSaleItem {
  final String title;
  final String subtitle;
  final String amount;
  final String profit;

  const RecentSaleItem({
    required this.title,
    required this.subtitle,
    required this.amount,
    required this.profit,
  });
}

class RecentSalesList extends StatelessWidget {
  final List<RecentSaleItem> items;

  const RecentSalesList({
    super.key,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Recent Sales',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: WingaplusSpacing.md),
        if (items.isEmpty)
          Center(
            child: Padding(
              padding: const EdgeInsets.all(WingaplusSpacing.hero),
              child: Text(
                'No sales yet today',
                style: TextStyle(color: WingaplusColors.gray500),
              ),
            ),
          )
        else
          ...items.map((sale) {
            return Card(
              margin: const EdgeInsets.only(bottom: WingaplusSpacing.sm),
              child: ListTile(
                leading: CircleAvatar(
                  backgroundColor: AppTheme.primaryBlue.withOpacity(0.1),
                  child: const Icon(
                    Icons.shopping_bag,
                    color: AppTheme.primaryBlue,
                    size: 20,
                  ),
                ),
                title: Text(
                  sale.title,
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                subtitle: Text(
                  sale.subtitle,
                  style: TextStyle(color: WingaplusColors.gray500),
                ),
                trailing: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      sale.amount,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                    Text(
                      'Profit: ${sale.profit}',
                      style: const TextStyle(
                        color: AppTheme.successGreen,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
      ],
    );
  }
}

