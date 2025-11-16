import 'package:flutter/material.dart';

import '../../design/tokens.dart';

class QuickAction {
  final String label;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const QuickAction({
    required this.label,
    required this.icon,
    required this.color,
    required this.onTap,
  });
}

class QuickActionsGrid extends StatelessWidget {
  final List<QuickAction> actions;

  const QuickActionsGrid({
    super.key,
    required this.actions,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Actions',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: WingaplusSpacing.md),
        Wrap(
          spacing: WingaplusSpacing.md,
          runSpacing: WingaplusSpacing.md,
          children: actions
              .map(
                (action) => _QuickActionCard(action: action),
              )
              .toList(),
        ),
      ],
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final QuickAction action;

  const _QuickActionCard({
    required this.action,
  });

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    final cardWidth = width >= 768 ? (width / 3) - 48 : width;

    return ConstrainedBox(
      constraints: BoxConstraints(
        maxWidth: cardWidth,
        minWidth: 160,
      ),
      child: Card(
        child: InkWell(
          onTap: action.onTap,
          borderRadius: WingaplusRadius.md,
          child: Padding(
            padding: const EdgeInsets.all(WingaplusSpacing.lg),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      action.label,
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: WingaplusSpacing.sm),
                    Text(
                      'Tap to open',
                      style: TextStyle(
                        color: WingaplusColors.gray500,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
                Container(
                  decoration: BoxDecoration(
                    color: action.color.withOpacity(0.15),
                    borderRadius: WingaplusRadius.md,
                  ),
                  padding: const EdgeInsets.all(WingaplusSpacing.sm),
                  child: Icon(
                    action.icon,
                    color: action.color,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

