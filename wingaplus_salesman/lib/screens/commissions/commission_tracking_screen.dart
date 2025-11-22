import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/auth_provider.dart';
import '../../providers/sales_provider.dart';
import '../../design/tokens.dart';
import '../../widgets/layout/WingaPro_shell.dart';
import '../../widgets/layout/salesman_nav.dart';
import '../../widgets/dashboard/dashboard_header.dart';

/// Commission/Ganji Tracking Screen - matches React CommissionTracking
class CommissionTrackingScreen extends StatefulWidget {
  const CommissionTrackingScreen({super.key});

  @override
  State<CommissionTrackingScreen> createState() =>
      _CommissionTrackingScreenState();
}

class _CommissionTrackingScreenState extends State<CommissionTrackingScreen> {
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
    await salesProvider.loadSales(filterType: 'monthly');
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

    // Calculate stats
    final totalGanji = salesProvider.totalProfit;
    final totalItems = salesProvider.totalItemsSold;
    final totalSales = salesProvider.totalRevenue;

    return WingaProShell(
      destinations: SalesmanNav.destinations,
      currentIndex: SalesmanNav.getCurrentIndex('/commissions'),
      onDestinationSelected: (index) {
        SalesmanNav.handleDestinationTap(
          context: context,
          currentIndex: SalesmanNav.getCurrentIndex('/commissions'),
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
      child: RefreshIndicator(
        onRefresh: _loadData,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(WingaProSpacing.xl),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const DashboardHeader(
                title: 'Ganji Dashboard',
                subtitle: 'Track your profit "ganji" performance over time',
              ),
              const SizedBox(height: WingaProSpacing.xl),

              // Summary Cards
              Row(
                children: [
                  Expanded(
                    child: _StatCard(
                      title: 'Total Profit',
                      value: _formatCurrency(totalGanji),
                      icon: Icons.trending_up,
                      color: WingaProColors.primary500,
                    ),
                  ),
                  const SizedBox(width: WingaProSpacing.md),
                  Expanded(
                    child: _StatCard(
                      title: 'Items Sold',
                      value: totalItems.toString(),
                      icon: Icons.shopping_cart,
                      color: WingaProColors.secondary500,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: WingaProSpacing.md),

              // Info message
              Container(
                padding: const EdgeInsets.all(WingaProSpacing.md),
                decoration: BoxDecoration(
                  color: WingaProColors.primary50,
                  borderRadius: WingaProRadius.md,
                  border: Border.all(color: WingaProColors.primary200),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.info_outline, color: WingaProColors.primary600),
                    SizedBox(width: WingaProSpacing.sm),
                    Expanded(
                      child: Text(
                        'View detailed monthly performance and commission tracking',
                        style: TextStyle(
                          color: WingaProColors.primary700,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  const _StatCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(WingaProSpacing.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: WingaProColors.gray600,
                      ),
                ),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: WingaProRadius.sm,
                  ),
                  child: Icon(icon, color: color, size: 20),
                ),
              ],
            ),
            const SizedBox(height: WingaProSpacing.sm),
            Text(
              value,
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
            ),
          ],
        ),
      ),
    );
  }
}
