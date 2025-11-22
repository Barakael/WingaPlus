import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../design/tokens.dart';

class AppTheme {
  static const Color warningYellow = Color(0xFFF59E0B);
  static const Color errorRed = Color(0xFFEF4444);
  static const Color infoBlue = Color(0xFF3B82F6);

  // Legacy aliases for backwards compatibility with existing widgets.
  static const Color primaryBlue = WingaProColors.brandPrimary;
  static const Color secondaryBlue = WingaProColors.secondary500;
  static const Color successGreen = WingaProColors.accent500;
  static const Color lightGray = WingaProColors.gray100;
  static const Color mediumGray = WingaProColors.gray500;
  static const Color darkGray = WingaProColors.gray800;
  static const Color white = Colors.white;
  static const Color darkCard = WingaProColors.gray800;
  static const Color darkBorder = WingaProColors.gray700;
  static const Color darkBg = WingaProColors.gray900;

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    primaryColor: WingaProColors.brandPrimary,
    scaffoldBackgroundColor: WingaProColors.gray100,
    colorScheme: const ColorScheme.light(
      primary: WingaProColors.brandPrimary,
      secondary: WingaProColors.secondary500,
      surface: Colors.white,
      error: errorRed,
      onPrimary: Colors.white,
      onSecondary: Colors.white,
      onSurface: WingaProColors.gray800,
      onError: Colors.white,
    ),
    textTheme: GoogleFonts.interTextTheme().apply(
      bodyColor: WingaProColors.gray800,
      displayColor: WingaProColors.gray800,
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: Colors.white,
      foregroundColor: WingaProColors.gray800,
      elevation: 0,
      centerTitle: true,
      titleTextStyle: GoogleFonts.inter(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: WingaProColors.gray800,
      ),
    ),
    cardTheme: const CardThemeData(
      color: Colors.white,
      elevation: 0,
      shadowColor: Colors.transparent,
      shape: RoundedRectangleBorder(
        borderRadius: WingaProRadius.md,
      ),
      margin: EdgeInsets.zero,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: WingaProColors.brandPrimary,
        foregroundColor: Colors.white,
        elevation: 0,
        padding: const EdgeInsets.symmetric(
          horizontal: WingaProSpacing.xl,
          vertical: WingaProSpacing.md,
        ),
        shape: const RoundedRectangleBorder(
          borderRadius: WingaProRadius.sm,
        ),
        textStyle: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Colors.white,
      border: const OutlineInputBorder(
        borderRadius: WingaProRadius.sm,
        borderSide: BorderSide(color: WingaProColors.gray300),
      ),
      enabledBorder: const OutlineInputBorder(
        borderRadius: WingaProRadius.sm,
        borderSide: BorderSide(color: WingaProColors.gray200),
      ),
      focusedBorder: const OutlineInputBorder(
        borderRadius: WingaProRadius.sm,
        borderSide: BorderSide(
          color: WingaProColors.brandPrimary,
          width: 2,
        ),
      ),
      errorBorder: const OutlineInputBorder(
        borderRadius: WingaProRadius.sm,
        borderSide: BorderSide(color: errorRed),
      ),
      contentPadding: const EdgeInsets.symmetric(
        horizontal: WingaProSpacing.lg,
        vertical: WingaProSpacing.md,
      ),
      hintStyle: GoogleFonts.inter(
        color: WingaProColors.gray500,
        fontSize: 14,
      ),
    ),
    floatingActionButtonTheme: const FloatingActionButtonThemeData(
      backgroundColor: WingaProColors.brandSecondary,
      foregroundColor: Colors.white,
      elevation: 4,
    ),
  );

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    primaryColor: WingaProColors.brandPrimary,
    scaffoldBackgroundColor: WingaProColors.gray900,
    colorScheme: const ColorScheme.dark(
      primary: WingaProColors.brandPrimary,
      secondary: WingaProColors.secondary400,
      surface: WingaProColors.gray800,
      error: errorRed,
      onPrimary: Colors.white,
      onSecondary: Colors.white,
      onSurface: Colors.white,
      onError: Colors.white,
    ),
    textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme).apply(
      bodyColor: Colors.white,
      displayColor: Colors.white,
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: WingaProColors.gray800,
      foregroundColor: Colors.white,
      elevation: 0,
      centerTitle: true,
      titleTextStyle: GoogleFonts.inter(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: Colors.white,
      ),
    ),
    cardTheme: const CardThemeData(
      color: WingaProColors.gray800,
      elevation: 0,
      shadowColor: Colors.transparent,
      shape: RoundedRectangleBorder(
        borderRadius: WingaProRadius.md,
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: WingaProColors.brandPrimary,
        foregroundColor: Colors.white,
        elevation: 0,
        padding: const EdgeInsets.symmetric(
          horizontal: WingaProSpacing.xl,
          vertical: WingaProSpacing.md,
        ),
        shape: const RoundedRectangleBorder(
          borderRadius: WingaProRadius.sm,
        ),
        textStyle: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: WingaProColors.gray800,
      border: const OutlineInputBorder(
        borderRadius: WingaProRadius.sm,
        borderSide: BorderSide(color: WingaProColors.gray700),
      ),
      enabledBorder: const OutlineInputBorder(
        borderRadius: WingaProRadius.sm,
        borderSide: BorderSide(color: WingaProColors.gray700),
      ),
      focusedBorder: const OutlineInputBorder(
        borderRadius: WingaProRadius.sm,
        borderSide: BorderSide(
          color: WingaProColors.brandPrimary,
          width: 2,
        ),
      ),
      errorBorder: const OutlineInputBorder(
        borderRadius: WingaProRadius.sm,
        borderSide: BorderSide(color: errorRed),
      ),
      contentPadding: const EdgeInsets.symmetric(
        horizontal: WingaProSpacing.lg,
        vertical: WingaProSpacing.md,
      ),
      hintStyle: GoogleFonts.inter(
        color: WingaProColors.gray500,
        fontSize: 14,
      ),
    ),
    floatingActionButtonTheme: const FloatingActionButtonThemeData(
      backgroundColor: WingaProColors.secondary400,
      foregroundColor: Colors.white,
      elevation: 4,
    ),
  );
}
