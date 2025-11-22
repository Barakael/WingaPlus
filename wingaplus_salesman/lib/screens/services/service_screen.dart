import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../design/tokens.dart';
import '../../providers/auth_provider.dart';
import '../../providers/sales_provider.dart'; // placeholder
import '../../widgets/dashboard/dashboard_header.dart';
import '../../widgets/layout/WingaPro_shell.dart';
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

    return WingaProShell(
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
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.of(context).pushNamed('/file-service'),
        icon: const Icon(Icons.add_circle),
        label: const Text('File Service'),
      ),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(WingaProSpacing.xl),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const DashboardHeader(
              title: 'Services',
              subtitle: 'Manage service requests and follow-ups',
            ),
            const SizedBox(height: WingaProSpacing.xl),
            _buildServiceList(salesProvider),
          ],
        ),
      ),
    );
  }

  Widget _buildServiceList(SalesProvider salesProvider) {
    if (salesProvider.sales.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(WingaProSpacing.hero),
          child: Text(
            'No service requests yet.',
            style: TextStyle(color: WingaProColors.gray500),
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
        const SizedBox(height: WingaProSpacing.md),
        ...salesProvider.sales.map((sale) {
          return Card(
            margin: const EdgeInsets.only(bottom: WingaProSpacing.sm),
            child: ListTile(
              leading: const Icon(Icons.build, color: Colors.orange),
              title: Text('${sale.productName} service'),
              subtitle: Text(
                'Customer: ${sale.customerName ?? 'N/A'} • Opened ${sale.formattedCreatedAt}',
              ),
              trailing: const Chip(
                label: Text('In Progress'),
                backgroundColor: WingaProColors.secondary100,
                labelStyle: TextStyle(color: WingaProColors.secondary700),
              ),
            ),
          );
        }),
      ],
    );
  }
}
