import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../design/tokens.dart';
import '../../providers/auth_provider.dart';
import '../../providers/sales_provider.dart'; // placeholder until WarrantyProvider exists
import '../../widgets/dashboard/dashboard_header.dart';
import '../../widgets/layout/wingaplus_shell.dart';
import '../../widgets/layout/salesman_nav.dart';

class WarrantyScreen extends StatefulWidget {
  const WarrantyScreen({super.key});

  @override
  State<WarrantyScreen> createState() => _WarrantyScreenState();
}

class _WarrantyScreenState extends State<WarrantyScreen> {
  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final salesProvider = context.watch<SalesProvider>();
    final user = authProvider.user;

    return WingaProShell(
      destinations: SalesmanNav.destinations,
      currentIndex: SalesmanNav.getCurrentIndex('/warranties'),
      onDestinationSelected: (index) {
        SalesmanNav.handleDestinationTap(
          context: context,
          currentIndex: SalesmanNav.getCurrentIndex('/warranties'),
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
        onPressed: () => Navigator.of(context).pushNamed('/file-warranty'),
        icon: const Icon(Icons.note_add),
        label: const Text('File Warranty'),
      ),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(WingaProSpacing.xl),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const DashboardHeader(
              title: 'Warranties',
              subtitle: 'Track submitted warranties and their status',
            ),
            const SizedBox(height: WingaProSpacing.xl),
            _buildWarrantyList(salesProvider),
          ],
        ),
      ),
    );
  }

  Widget _buildWarrantyList(SalesProvider salesProvider) {
    // Placeholder: reuse sales data until warranties provider is available.
    if (salesProvider.sales.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(WingaProSpacing.hero),
          child: Text(
            'No warranties yet.',
            style: TextStyle(color: WingaProColors.gray500),
          ),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Active Warranties',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: WingaProSpacing.md),
        ...salesProvider.sales.map((sale) {
          return Card(
            margin: const EdgeInsets.only(bottom: WingaProSpacing.sm),
            child: ListTile(
              leading: const Icon(Icons.verified, color: Colors.blue),
              title: Text('${sale.productName} Warranty'),
              subtitle: Text(
                'Customer: ${sale.customerName ?? 'N/A'} • Filed on ${sale.formattedCreatedAt}',
              ),
              trailing: const Chip(
                label: Text('Pending'),
                backgroundColor: WingaProColors.primary50,
                labelStyle: TextStyle(color: WingaProColors.brandPrimary),
              ),
            ),
          );
        }),
      ],
    );
  }
}
