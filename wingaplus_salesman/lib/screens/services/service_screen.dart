import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../design/tokens.dart';
import '../../providers/auth_provider.dart';
import '../../providers/sales_provider.dart'; // placeholder
import '../../widgets/dashboard/dashboard_header.dart';
import '../../widgets/layout/wingaplus_shell.dart';
import '../../widgets/layout/salesman_nav.dart';

class ServiceScreen extends StatefulWidget {
  const ServiceScreen({super.key});

  @override
  State<ServiceScreen> createState() => _ServiceScreenState();
}

class _ServiceScreenState extends State<ServiceScreen> {
  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final salesProvider = context.watch<SalesProvider>();
    final user = authProvider.user;

    return WingaplusShell(
      destinations: SalesmanNav.destinations,
      currentIndex: SalesmanNav.getCurrentIndex('/services'),
      onDestinationSelected: (index) {
        SalesmanNav.handleDestinationTap(
          context: context,
          currentIndex: SalesmanNav.getCurrentIndex('/services'),
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
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(WingaplusSpacing.xl),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const DashboardHeader(
              title: 'Services',
              subtitle: 'Manage service requests and follow-ups',
            ),
            const SizedBox(height: WingaplusSpacing.xl),
            _buildServiceList(salesProvider),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.of(context).pushNamed('/file-service'),
        icon: const Icon(Icons.add_circle),
        label: const Text('File Service'),
      ),
    );
  }

  Widget _buildServiceList(SalesProvider salesProvider) {
    if (salesProvider.sales.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(WingaplusSpacing.hero),
          child: Text(
            'No service requests yet.',
            style: TextStyle(color: WingaplusColors.gray500),
          ),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Recent Service Requests',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: WingaplusSpacing.md),
        ...salesProvider.sales.map((sale) {
          return Card(
            margin: const EdgeInsets.only(bottom: WingaplusSpacing.sm),
            child: ListTile(
              leading: const Icon(Icons.build, color: Colors.orange),
              title: Text('${sale.productName} service'),
              subtitle: Text(
                'Customer: ${sale.customerName ?? 'N/A'} • Opened ${sale.formattedCreatedAt}',
              ),
              trailing: Chip(
                label: const Text('In Progress'),
                backgroundColor: WingaplusColors.secondary100,
                labelStyle: const TextStyle(color: WingaplusColors.secondary700),
              ),
            ),
          );
        }),
      ],
    );
  }
}

