import 'package:flutter/material.dart';

/// Navigation destination used across WingaPro layout widgets.
class WingaProDestination {
  final String label;
  final IconData icon;
  final String route;

  const WingaProDestination({
    required this.label,
    required this.icon,
    required this.route,
  });
}
