import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/auth_provider.dart';
import '../../providers/sales_provider.dart';
import '../../design/tokens.dart';
import '../../config/theme.dart';
import '../../widgets/layout/wingaplus_shell.dart';
import '../../widgets/layout/salesman_nav.dart';
import '../../widgets/dashboard/dashboard_header.dart';
import '../../models/target.dart';

/// Target Management Screen - matches React TargetManagement
class TargetManagementScreen extends StatefulWidget {
  const TargetManagementScreen({super.key});

  @override
  State<TargetManagementScreen> createState() => _TargetManagementScreenState();
}

class _TargetManagementScreenState extends State<TargetManagementScreen> {
  @override
  void initState() {
    super.initState();
    // Delay data loading to avoid setState during build
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadData();
    });
  }

  Future<void> _loadData() async {
    if (!mounted) return;
    final salesProvider = context.read<SalesProvider>();
    await salesProvider.loadTargets();
  }

  String _formatCurrency(double amount) {
    final formatter = NumberFormat('#,###', 'en_US');
    return 'TSh ${formatter.format(amount)}';
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final salesProvider = context.watch<SalesProvider>();
    final user = authProvider.user;

    return WingaProShell(
      destinations: SalesmanNav.destinations,
      currentIndex: SalesmanNav.getCurrentIndex('/targets'),
      onDestinationSelected: (index) {
        SalesmanNav.handleDestinationTap(
          context: context,
          currentIndex: SalesmanNav.getCurrentIndex('/targets'),
          newIndex: index,
        );
      },
      userName: user?.name,
      userRole: user?.role,
      onLogout: () async {
        await authProvider.logout();
        if (mounted) {
          Navigator.of(context).pushReplacementNamed('/login');
        }
      },
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // TODO: Show create target modal
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Create target feature coming soon')),
          );
        },
        icon: const Icon(Icons.add),
        label: const Text('New Target'),
      ),
      child: RefreshIndicator(
        onRefresh: _loadData,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(WingaProSpacing.xl),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const DashboardHeader(
                title: 'Target Management',
                subtitle: 'Create and manage your sales targets',
              ),
              const SizedBox(height: WingaProSpacing.xl),

              // Targets List
              if (salesProvider.targets.isEmpty)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.all(WingaProSpacing.xl * 2),
                    child: Column(
                      children: [
                        const Icon(
                          Icons.flag_circle_outlined,
                          size: 64,
                          color: WingaProColors.gray400,
                        ),
                        const SizedBox(height: WingaProSpacing.md),
                        Text(
                          'No targets set yet',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const SizedBox(height: WingaProSpacing.sm),
                        Text(
                          'Create your first target to start tracking your performance',
                          style:
                              Theme.of(context).textTheme.bodyMedium?.copyWith(
                                    color: WingaProColors.gray600,
                                  ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                )
              else
                ...salesProvider.targets.map((target) => _TargetCard(
                      target: target,
                      formatCurrency: _formatCurrency,
                    )),
            ],
          ),
        ),
      ),
    );
  }
}

class _TargetCard extends StatelessWidget {
  final Target target;
  final String Function(double) formatCurrency;

  const _TargetCard({
    required this.target,
    required this.formatCurrency,
  });

  // Get display name from target type
  String get _displayName {
    final typeMap = {
      'sales_count': 'Sales Count',
      'revenue': 'Revenue',
      'profit': 'Profit',
      'items_sold': 'Items Sold',
    };
    return typeMap[target.type] ?? target.type.replaceAll('_', ' ').split(' ').map((word) => 
      word.isEmpty ? '' : word[0].toUpperCase() + word.substring(1)
    ).join(' ');
  }

  // Get status based on dates
  String get _status {
    final now = DateTime.now();
    if (now.isBefore(target.startDate)) {
      return 'upcoming';
    } else if (now.isAfter(target.endDate)) {
      return 'completed';
    } else {
      return 'active';
    }
  }

  // Check if target is for currency (revenue/profit) or count
  bool get _isCurrencyType {
    return target.type == 'revenue' || target.type == 'profit';
  }

  @override
  Widget build(BuildContext context) {
    final isActive = _status == 'active';
    
    return Card(
      margin: const EdgeInsets.only(bottom: WingaProSpacing.md),
      child: Padding(
        padding: const EdgeInsets.all(WingaProSpacing.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    _displayName,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                ),
                Chip(
                  label: Text(
                    _status.toUpperCase(),
                    style: const TextStyle(fontSize: 12),
                  ),
                  backgroundColor: isActive
                      ? AppTheme.successGreen.withOpacity(0.2)
                      : WingaProColors.gray300,
                ),
              ],
            ),
            const SizedBox(height: WingaProSpacing.sm),
            Text(
              '${target.period.toUpperCase()} • ${target.type.replaceAll('_', ' ').toUpperCase()}',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: WingaProColors.gray600,
                  ),
            ),
            const SizedBox(height: WingaProSpacing.sm),
            Text(
              _isCurrencyType
                  ? 'Target: ${formatCurrency(target.targetAmount)}'
                  : 'Target: ${target.targetAmount.toStringAsFixed(0)} items',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: WingaProColors.primary600,
                  ),
            ),
            const SizedBox(height: WingaProSpacing.xs),
            Text(
              'Current: ${_isCurrencyType ? formatCurrency(target.currentAmount) : target.currentAmount.toStringAsFixed(0)}',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppTheme.successGreen,
                  ),
            ),
            const SizedBox(height: WingaProSpacing.xs),
            // Progress indicator
            LinearProgressIndicator(
              value: target.achievementPercentage / 100,
              backgroundColor: WingaProColors.gray200,
              valueColor: AlwaysStoppedAnimation<Color>(
                isActive ? AppTheme.successGreen : WingaProColors.gray400,
              ),
            ),
            const SizedBox(height: WingaProSpacing.xs),
            Text(
              '${target.achievementPercentage.toStringAsFixed(1)}% achieved',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: WingaProColors.gray600,
                  ),
            ),
          ],
        ),
      ),
    );
  }
}
