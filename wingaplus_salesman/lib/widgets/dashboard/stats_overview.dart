import 'package:flutter/material.dart';

import '../../config/theme.dart';
import '../../design/tokens.dart';
import '../common/stats_card.dart';

class DashboardStat {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  final bool compact;

  const DashboardStat({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
    this.compact = false,
  });
}

class StatsOverviewGrid extends StatelessWidget {
  final List<DashboardStat> stats;

  const StatsOverviewGrid({
    super.key,
    required this.stats,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Wrap(
          spacing: WingaplusSpacing.md,
          runSpacing: WingaplusSpacing.md,
          children: stats
              .map(
                (stat) => SizedBox(
                  width: 280,
                  child: StatsCard(
                    title: stat.label,
                    value: stat.value,
                    icon: stat.icon,
                    color: stat.color,
                    isCompact: stat.compact,
                  ),
                ),
              )
              .toList(),
        ),
      ],
    );
  }
}

