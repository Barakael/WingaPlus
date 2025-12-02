import 'package:flutter/material.dart';
import 'wingaplus_destination.dart';

/// Navigation helper for salesman role matching React Sidebar
class SalesmanNav {
  static const List<WingaProDestination> destinations = [
    WingaProDestination(
      label: 'Dashboard',
      icon: Icons.dashboard_rounded,
      route: '/dashboard',
    ),
    WingaProDestination(
      label: 'My Sales',
      icon: Icons.list_alt_rounded,
      route: '/my-sales',
    ),
    WingaProDestination(
      label: 'Ufundi',
      icon: Icons.build_rounded,
      route: '/services',
    ),
    WingaProDestination(
      label: 'Ganji',
      icon: Icons.monetization_on_rounded,
      route: '/commissions',
    ),
    WingaProDestination(
      label: 'Targets',
      icon: Icons.flag_circle_rounded,
      route: '/targets',
    ),
    WingaProDestination(
      label: 'Warranties',
      icon: Icons.shield_rounded,
      route: '/warranties',
    ),
    WingaProDestination(
      label: 'Settings',
      icon: Icons.settings_rounded,
      route: '/settings',
    ),
  ];

  /// Handle destination tap - navigate based on route
  static void handleDestinationTap({
    required BuildContext context,
    required int currentIndex,
    required int newIndex,
  }) {
    if (newIndex < 0 || newIndex >= destinations.length) return;
    if (newIndex == currentIndex) return;

    final destination = destinations[newIndex];

    // Use pushReplacementNamed to match React app behavior (single-page app style)
    Navigator.of(context).pushReplacementNamed(destination.route);
  }

  /// Get current index from route
  static int getCurrentIndex(String route) {
    for (int i = 0; i < destinations.length; i++) {
      if (destinations[i].route == route) {
        return i;
      }
    }
    // Handle legacy routes
    if (route == '/sales') return 1; // My Sales
    if (route == '/warranties') return 5; // Warranties
    if (route == '/services') return 2; // Ufundi
    if (route == '/commissions') return 3; // Ganji
    if (route == '/targets') return 4; // Targets
    return 0; // Default to dashboard
  }
}
