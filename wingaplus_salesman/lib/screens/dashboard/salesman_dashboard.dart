import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../config/theme.dart';
import '../../design/tokens.dart';
import '../../providers/auth_provider.dart';
import '../../providers/sales_provider.dart';
import '../../widgets/dashboard/dashboard_header.dart';
import '../../widgets/dashboard/quick_actions.dart';
import '../../widgets/dashboard/recent_sales_list.dart';
import '../../widgets/dashboard/stats_overview.dart';
import '../../widgets/layout/wingaplus_shell.dart';
import '../../widgets/layout/salesman_nav.dart';

class SalesmanDashboard extends StatefulWidget {
  const SalesmanDashboard({super.key});

  @override
  State<SalesmanDashboard> createState() => _SalesmanDashboardState();
}

class _SalesmanDashboardState extends State<SalesmanDashboard> {

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
    await Future.wait([
      salesProvider.loadSales(filterType: 'daily'),
      salesProvider.loadTargets(),
    ]);
  }

  String _formatCurrency(double amount) {
    final formatter = NumberFormat('#,###', 'en_US');
    return 'TZS ${formatter.format(amount)}';
  }

  void _handleDestinationSelected(int index) {
    SalesmanNav.handleDestinationTap(
      context: context,
      currentIndex: SalesmanNav.getCurrentIndex('/dashboard'),
      newIndex: index,
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final salesProvider = context.watch<SalesProvider>();
    final user = authProvider.user;

    return WingaplusShell(
      destinations: SalesmanNav.destinations,
      currentIndex: SalesmanNav.getCurrentIndex('/dashboard'),
      onDestinationSelected: _handleDestinationSelected,
      userName: user?.name,
      userRole: user?.role,
      onLogout: () async {
        await authProvider.logout();
        if (mounted) {
          Navigator.of(context).pushReplacementNamed('/login');
        }
      },
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.of(context).pushNamed('/sale-form'),
        icon: const Icon(Icons.add),
        label: const Text('New Sale'),
      ),
      child: RefreshIndicator(
        onRefresh: _loadData,
        child: salesProvider.isLoading && salesProvider.sales.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(WingaplusSpacing.xl),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    DashboardHeader(
                      title: 'Welcome back, ${user?.name ?? 'User'}!',
                      subtitle: 'Here\'s your sales overview for today',
                    ),
                    const SizedBox(height: WingaplusSpacing.xl),
                    StatsOverviewGrid(
                      stats: [
                        DashboardStat(
                          label: 'Sales Today',
                          value: salesProvider.totalSalesCount.toString(),
                          icon: Icons.shopping_cart,
                          color: AppTheme.primaryBlue,
                        ),
                        DashboardStat(
                          label: 'Revenue',
                          value: _formatCurrency(salesProvider.totalRevenue),
                          icon: Icons.attach_money,
                          color: AppTheme.successGreen,
                          compact: true,
                        ),
                        DashboardStat(
                          label: 'Profit',
                          value: _formatCurrency(salesProvider.totalProfit),
                          icon: Icons.trending_up,
                          color: AppTheme.secondaryBlue,
                          compact: true,
                        ),
                        DashboardStat(
                          label: 'Items Sold',
                          value: salesProvider.totalItemsSold.toString(),
                          icon: Icons.inventory_2,
                          color: AppTheme.warningYellow,
                        ),
                      ],
                    ),
                    const SizedBox(height: WingaplusSpacing.xl),
                    QuickActionsGrid(
                      actions: [
                        QuickAction(
                          label: 'My Sales',
                          icon: Icons.list_alt,
                          color: AppTheme.primaryBlue,
                          onTap: () =>
                              Navigator.of(context).pushNamed('/sales'),
                        ),
                        QuickAction(
                          label: 'Commissions',
                          icon: Icons.monetization_on,
                          color: AppTheme.successGreen,
                          onTap: () =>
                              Navigator.of(context).pushNamed('/commissions'),
                        ),
                        QuickAction(
                          label: 'Targets',
                          icon: Icons.flag,
                          color: AppTheme.warningYellow,
                          onTap: () =>
                              Navigator.of(context).pushNamed('/targets'),
                        ),
                      ],
                    ),
                    const SizedBox(height: WingaplusSpacing.xl),
                    RecentSalesList(
                      items: salesProvider.sales.take(5).map((sale) {
                        return RecentSaleItem(
                          title: sale.productName,
                          subtitle:
                              '${sale.quantity} x ${sale.formattedUnitPrice}',
                          amount: sale.formattedTotalPrice,
                          profit: sale.formattedProfit,
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
      ),
    );
  }

}
