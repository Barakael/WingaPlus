import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/auth_provider.dart';
import '../../providers/sales_provider.dart';
import '../../design/tokens.dart';
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

    return WingaplusShell(
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
          padding: const EdgeInsets.all(WingaplusSpacing.xl),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const DashboardHeader(
                title: 'Target Management',
                subtitle: 'Create and manage your sales targets',
              ),
              const SizedBox(height: WingaplusSpacing.xl),
              
              // Targets List
              if (salesProvider.targets.isEmpty)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.all(WingaplusSpacing.xl * 2),
                    child: Column(
                      children: [
                        Icon(
                          Icons.flag_circle_outlined,
                          size: 64,
                          color: WingaplusColors.gray400,
                        ),
                        const SizedBox(height: WingaplusSpacing.md),
                        Text(
                          'No targets set yet',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const SizedBox(height: WingaplusSpacing.sm),
                        Text(
                          'Create your first target to start tracking your performance',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: WingaplusColors.gray600,
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

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: WingaplusSpacing.md),
      child: Padding(
        padding: const EdgeInsets.all(WingaplusSpacing.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    target.name,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                ),
                Chip(
                  label: Text(
                    target.status,
                    style: const TextStyle(fontSize: 12),
                  ),
                  backgroundColor: target.status == 'active'
                      ? WingaplusColors.successGreen.withOpacity(0.2)
                      : WingaplusColors.gray300,
                ),
              ],
            ),
            const SizedBox(height: WingaplusSpacing.sm),
            Text(
              '${target.period} • ${target.metric.replaceAll('_', ' ')}',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: WingaplusColors.gray600,
                  ),
            ),
            const SizedBox(height: WingaplusSpacing.sm),
            Text(
              target.metric == 'profit'
                  ? 'Target: ${formatCurrency(target.targetValue)}'
                  : 'Target: ${target.targetValue.toString()} items',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: WingaplusColors.primary600,
                  ),
            ),
            if (target.bonusAmount != null) ...[
              const SizedBox(height: WingaplusSpacing.xs),
              Text(
                'Bonus: ${formatCurrency(target.bonusAmount!)}',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: WingaplusColors.successGreen,
                    ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

