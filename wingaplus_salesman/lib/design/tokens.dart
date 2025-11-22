import 'package:flutter/material.dart';

/// Canonical design tokens shared across the Flutter salesman app.
/// Values mirror the Tailwind palette and layout system from the React frontend.
class WingaProColors {
  WingaProColors._();

  // Primary blue palette (tailwind primary scale)
  static const Color primary50 = Color(0xFFEFF6FF);
  static const Color primary100 = Color(0xFFDBEAFE);
  static const Color primary200 = Color(0xFFBFDBFE);
  static const Color primary300 = Color(0xFF93C5FD);
  static const Color primary400 = Color(0xFF60A5FA);
  static const Color primary500 = Color(0xFF3B82F6);
  static const Color primary600 = Color(0xFF2563EB);
  static const Color primary700 = Color(0xFF1D4ED8);
  static const Color primary800 = Color(0xFF1E40AF);
  static const Color primary900 = Color(0xFF1E3A8A);

  // Secondary purple palette
  static const Color secondary50 = Color(0xFFF5F3FF);
  static const Color secondary100 = Color(0xFFEDE9FE);
  static const Color secondary200 = Color(0xFFDDD6FE);
  static const Color secondary300 = Color(0xFFC4B5FD);
  static const Color secondary400 = Color(0xFFA78BFA);
  static const Color secondary500 = Color(0xFF8B5CF6);
  static const Color secondary600 = Color(0xFF7C3AED);
  static const Color secondary700 = Color(0xFF6D28D9);
  static const Color secondary800 = Color(0xFF5B21B6);
  static const Color secondary900 = Color(0xFF4C1D95);

  // Accent green palette
  static const Color accent50 = Color(0xFFECFDF5);
  static const Color accent100 = Color(0xFFD1FAE5);
  static const Color accent200 = Color(0xFFA7F3D0);
  static const Color accent300 = Color(0xFF6EE7B7);
  static const Color accent400 = Color(0xFF34D399);
  static const Color accent500 = Color(0xFF10B981);
  static const Color accent600 = Color(0xFF059669);
  static const Color accent700 = Color(0xFF047857);
  static const Color accent800 = Color(0xFF065F46);
  static const Color accent900 = Color(0xFF064E3B);

  // Brand surfaces
  static const Color brandPrimary = Color(0xFF1973AE);
  static const Color brandPrimaryDark = Color(0xFF0D5A8A);
  static const Color brandSecondary = Color(0xFF04BCF2);
  static const Color brandSecondaryDark = Color(0xFF03A8D8);

  // Neutral ramp inspired by Tailwind gray scale
  static const Color gray50 = Color(0xFFF9FAFB);
  static const Color gray100 = Color(0xFFF3F4F6);
  static const Color gray200 = Color(0xFFE5E7EB);
  static const Color gray300 = Color(0xFFD1D5DB);
  static const Color gray400 = Color(0xFF9CA3AF);
  static const Color gray500 = Color(0xFF6B7280);
  static const Color gray600 = Color(0xFF4B5563);
  static const Color gray700 = Color(0xFF374151);
  static const Color gray800 = Color(0xFF1F2937);
  static const Color gray900 = Color(0xFF111827);
}

class WingaProSpacing {
  WingaProSpacing._();

  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 24;
  static const double xxl = 32;
  static const double hero = 48;
}

class WingaProRadius {
  WingaProRadius._();

  static const BorderRadius sm = BorderRadius.all(Radius.circular(8));
  static const BorderRadius md = BorderRadius.all(Radius.circular(12));
  static const BorderRadius lg = BorderRadius.all(Radius.circular(16));
  static const BorderRadius xl = BorderRadius.all(Radius.circular(24));
}

class WingaProShadows {
  WingaProShadows._();

  static const List<BoxShadow> cardLight = [
    BoxShadow(
      color: Color(0x331973AE),
      blurRadius: 30,
      offset: Offset(0, 10),
    ),
  ];

  static const List<BoxShadow> cardDark = [
    BoxShadow(
      color: Color(0x66111827),
      blurRadius: 20,
      offset: Offset(0, 8),
    ),
  ];
}

class WingaProDurations {
  WingaProDurations._();

  static const Duration fast = Duration(milliseconds: 150);
  static const Duration base = Duration(milliseconds: 250);
  static const Duration slow = Duration(milliseconds: 400);
}
