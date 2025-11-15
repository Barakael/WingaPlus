import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/auth_provider.dart';
import '../../providers/sales_provider.dart';
import '../../config/theme.dart';
import '../../widgets/common/stats_card.dart';

class SalesmanDashboard extends StatefulWidget {
  const SalesmanDashboard({Key? key}) : super(key: key);

  @override
  State<SalesmanDashboard> createState() => _SalesmanDashboardState();
}

class _SalesmanDashboardState extends State<SalesmanDashboard> {
  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
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

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final salesProvider = context.watch<SalesProvider>();
    final user = authProvider.user;

    return Scaffold(
      appBar: AppBarCustom(
        title: 'Dashboard',
        user: user,
        onLogout: () async {
          await authProvider.logout();
          if (mounted) {
            Navigator.of(context).pushReplacementNamed('/login');
          }
        },
      ),
      body: RefreshIndicator(
        onRefresh: _loadData,
        child: salesProvider.isLoading && salesProvider.sales.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Welcome message
                    Text(
                      'Welcome back, ${user?.name ?? 'User'}!',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Here\'s your sales overview for today',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppTheme.mediumGray,
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Stats cards
                    Row(
                      children: [
                        Expanded(
                          child: StatsCard(
                            title: 'Sales Today',
                            value: salesProvider.totalSalesCount.toString(),
                            icon: Icons.shopping_cart,
                            color: AppTheme.primaryBlue,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: StatsCard(
                            title: 'Revenue',
                            value: _formatCurrency(salesProvider.totalRevenue),
                            icon: Icons.attach_money,
                            color: AppTheme.successGreen,
                            isCompact: true,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: StatsCard(
                            title: 'Profit',
                            value: _formatCurrency(salesProvider.totalProfit),
                            icon: Icons.trending_up,
                            color: AppTheme.secondaryBlue,
                            isCompact: true,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: StatsCard(
                            title: 'Items Sold',
                            value: salesProvider.totalItemsSold.toString(),
                            icon: Icons.inventory_2,
                            color: AppTheme.warningYellow,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // Quick actions
                    Text(
                      'Quick Actions',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: _ActionCard(
                            title: 'My Sales',
                            icon: Icons.list_alt,
                            color: AppTheme.primaryBlue,
                            onTap: () => Navigator.of(context).pushNamed('/sales'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _ActionCard(
                            title: 'Commissions',
                            icon: Icons.monetization_on,
                            color: AppTheme.successGreen,
                            onTap: () => Navigator.of(context).pushNamed('/commissions'),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: _ActionCard(
                            title: 'Targets',
                            icon: Icons.flag,
                            color: AppTheme.warningYellow,
                            onTap: () => Navigator.of(context).pushNamed('/targets'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(child: SizedBox()),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // Recent sales
                    Text(
                      'Recent Sales',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    if (salesProvider.sales.isEmpty)
                      Center(
                        child: Padding(
                          padding: const EdgeInsets.all(32.0),
                          child: Text(
                            'No sales yet today',
                            style: TextStyle(color: AppTheme.mediumGray),
                          ),
                        ),
                      )
                    else
                      ...salesProvider.sales.take(5).map((sale) {
                        return Card(
                          margin: const EdgeInsets.only(bottom: 8),
                          child: ListTile(
                            leading: CircleAvatar(
                              backgroundColor: AppTheme.primaryBlue.withOpacity(0.1),
                              child: Icon(
                                Icons.shopping_bag,
                                color: AppTheme.primaryBlue,
                                size: 20,
                              ),
                            ),
                            title: Text(
                              sale.productName,
                              style: const TextStyle(fontWeight: FontWeight.w600),
                            ),
                            subtitle: Text(
                              '${sale.quantity} x ${sale.formattedUnitPrice}',
                              style: TextStyle(color: AppTheme.mediumGray),
                            ),
                            trailing: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text(
                                  sale.formattedTotalPrice,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                  ),
                                ),
                                Text(
                                  'Profit: ${sale.formattedProfit}',
                                  style: TextStyle(
                                    color: AppTheme.successGreen,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                  ],
                ),
              ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.of(context).pushNamed('/sale-form'),
        icon: const Icon(Icons.add),
        label: const Text('New Sale'),
      ),
    );
  }
}

class _ActionCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _ActionCard({
    Key? key,
    required this.title,
    required this.icon,
    required this.color,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Icon(icon, size: 32, color: color),
              const SizedBox(height: 8),
              Text(
                title,
                textAlign: TextAlign.center,
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class AppBarCustom extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final user;
  final VoidCallback onLogout;

  const AppBarCustom({
    Key? key,
    required this.title,
    this.user,
    required this.onLogout,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: Text(title),
      actions: [
        PopupMenuButton<int>(
          icon: const Icon(Icons.account_circle),
          itemBuilder: (context) => <PopupMenuEntry<int>>[
            PopupMenuItem<int>(
              enabled: false,
              child: Text(
                '${user?.name ?? 'User'}\n${user?.email ?? ''}',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
            ),
            const PopupMenuDivider(),
            PopupMenuItem<int>(
              child: const Row(
                children: [
                  Icon(Icons.logout, size: 20),
                  SizedBox(width: 8),
                  Text('Logout'),
                ],
              ),
              onTap: onLogout,
            ),
          ],
        ),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
