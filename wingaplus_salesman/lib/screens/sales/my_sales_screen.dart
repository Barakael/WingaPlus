import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../design/tokens.dart';
import '../../providers/sales_provider.dart';
import '../../widgets/dashboard/dashboard_header.dart';
import '../../widgets/dashboard/stats_overview.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/layout/WingaPro_shell.dart';
import '../../widgets/layout/salesman_nav.dart';
import '../../widgets/sales/sales_filters.dart';

class MySalesScreen extends StatefulWidget {
  const MySalesScreen({super.key});

  @override
  State<MySalesScreen> createState() => _MySalesScreenState();
}

class _MySalesScreenState extends State<MySalesScreen> {
  String _activeFilter = 'Daily';

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
    await salesProvider.loadSales(filterType: _activeFilter.toLowerCase());
  }

  String _formatCurrency(double amount) {
    final formatter = NumberFormat('#,###', 'en_US');
    return 'TZS ${formatter.format(amount)}';
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final salesProvider = context.watch<SalesProvider>();
    final user = authProvider.user;

    return WingaProShell(
      destinations: SalesmanNav.destinations,
      currentIndex: SalesmanNav.getCurrentIndex('/my-sales'),
      onDestinationSelected: (index) {
        SalesmanNav.handleDestinationTap(
          context: context,
          currentIndex: SalesmanNav.getCurrentIndex('/my-sales'),
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
          // TODO: Navigate to sale form
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Sale form coming soon')),
          );
        },
        icon: const Icon(Icons.add),
        label: const Text('New Sale'),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.of(context).pushNamed('/sale-form'),
        icon: const Icon(Icons.add),
        label: const Text('Log Sale'),
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
                title: 'My Sales',
                subtitle: 'Track individual sales performance and revenue',
              ),
              const SizedBox(height: WingaProSpacing.xl),
              SalesFilterBar(
                activeFilter: _activeFilter,
                onChanged: (filter) {
                  setState(() => _activeFilter = filter);
                  _loadData();
                },
              ),
              const SizedBox(height: WingaProSpacing.xl),
              StatsOverviewGrid(
                stats: [
                  DashboardStat(
                    label: 'Total Sales',
                    value: salesProvider.sales.length.toString(),
                    icon: Icons.shopping_cart,
                    color: Colors.blue,
                  ),
                  DashboardStat(
                    label: 'Revenue',
                    value: _formatCurrency(salesProvider.totalRevenue),
                    icon: Icons.attach_money,
                    color: Colors.green,
                    compact: true,
                  ),
                  DashboardStat(
                    label: 'Average Value',
                    value: salesProvider.sales.isEmpty
                        ? 'TZS 0'
                        : _formatCurrency(
                            salesProvider.totalRevenue /
                                salesProvider.sales.length,
                          ),
                    icon: Icons.analytics,
                    color: Colors.purple,
                    compact: true,
                  ),
                  DashboardStat(
                    label: 'Items Sold',
                    value: salesProvider.totalItemsSold.toString(),
                    icon: Icons.inventory_2,
                    color: Colors.orange,
                  ),
                ],
              ),
              const SizedBox(height: WingaProSpacing.xl),
              _buildSalesList(salesProvider),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSalesList(SalesProvider salesProvider) {
    if (salesProvider.sales.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(WingaProSpacing.hero),
          child: Text(
            'No sales for the selected period.',
            style: TextStyle(color: WingaProColors.gray500),
          ),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Sales History',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: WingaProSpacing.md),
        ...salesProvider.sales.map((sale) {
          return Card(
            margin: const EdgeInsets.only(bottom: WingaProSpacing.sm),
            child: ListTile(
              title: Text(sale.productName),
              subtitle: Text(
                '${sale.quantity} pcs • ${sale.formattedUnitPrice} • ${sale.formattedCreatedAt}',
              ),
              trailing: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    sale.formattedTotalPrice,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    'Profit: ${sale.formattedProfit}',
                    style: const TextStyle(
                      color: Colors.green,
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
