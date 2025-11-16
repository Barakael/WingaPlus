import 'package:flutter/material.dart';

/// Navigation destination used across Wingaplus layout widgets.
class WingaplusDestination {
  final String label;
  final IconData icon;
  final String route;

  const WingaplusDestination({
    required this.label,
    required this.icon,
    required this.route,
  });
}

