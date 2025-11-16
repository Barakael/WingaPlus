import 'package:flutter/material.dart';

import '../widgets/layout/wingaplus_destination.dart';

class SalesmanNav {
  SalesmanNav._();

  static const List<WingaplusDestination> destinations = [
    WingaplusDestination(
      label: 'Dashboard',
      icon: Icons.dashboard_customize_rounded,
      route: '/dashboard',
    ),
    WingaplusDestination(
      label: 'My Sales',
      icon: Icons.shopping_cart_rounded,
      route: '/sales',
    ),
    WingaplusDestination(
      label: 'Ufundi',
      icon: Icons.build_circle_rounded,
      route: '/services',
    ),
    WingaplusDestination(
      label: 'Ganji',
      icon: Icons.monetization_on_rounded,
      route: '/commissions',
    ),
    WingaplusDestination(
      label: 'Targets',
      icon: Icons.flag_circle_rounded,
      route: '/targets',
    ),
    WingaplusDestination(
      label: 'Warranties',
      icon: Icons.verified_user_rounded,
      route: '/warranties',
    ),
    WingaplusDestination(
      label: 'Settings',
      icon: Icons.settings_rounded,
      route: '/settings',
    ),
  ];

  static void handleDestinationTap({
    required BuildContext context,
    required int currentIndex,
    required int newIndex,
  }) {
    if (newIndex == currentIndex) return;
    final destination = destinations[newIndex];
    Navigator.of(context).pushReplacementNamed(destination.route);
  }
}

