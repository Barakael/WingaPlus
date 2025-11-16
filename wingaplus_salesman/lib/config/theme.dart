import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../design/tokens.dart';

class AppTheme {
  static const Color warningYellow = Color(0xFFF59E0B);
  static const Color errorRed = Color(0xFFEF4444);
  static const Color infoBlue = Color(0xFF3B82F6);

  // Legacy aliases for backwards compatibility with existing widgets.
  static const Color primaryBlue = WingaplusColors.brandPrimary;
  static const Color secondaryBlue = WingaplusColors.secondary500;
  static const Color successGreen = WingaplusColors.accent500;
  static const Color lightGray = WingaplusColors.gray100;
  static const Color mediumGray = WingaplusColors.gray500;
  static const Color darkGray = WingaplusColors.gray800;
  static const Color white = Colors.white;
  static const Color darkCard = WingaplusColors.gray800;
  static const Color darkBorder = WingaplusColors.gray700;
  static const Color darkBg = WingaplusColors.gray900;

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    primaryColor: WingaplusColors.brandPrimary,
    scaffoldBackgroundColor: WingaplusColors.gray100,
    colorScheme: const ColorScheme.light(
      primary: WingaplusColors.brandPrimary,
      secondary: WingaplusColors.secondary500,
      surface: Colors.white,
      error: errorRed,
      onPrimary: Colors.white,
      onSecondary: Colors.white,
      onSurface: WingaplusColors.gray800,
      onError: Colors.white,
    ),
    textTheme: GoogleFonts.interTextTheme().apply(
      bodyColor: WingaplusColors.gray800,
      displayColor: WingaplusColors.gray800,
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: Colors.white,
      foregroundColor: WingaplusColors.gray800,
      elevation: 0,
      centerTitle: true,
      titleTextStyle: GoogleFonts.inter(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: WingaplusColors.gray800,
      ),
    ),
    cardTheme: CardThemeData(
      color: Colors.white,
      elevation: 0,
      shadowColor: Colors.transparent,
      shape: RoundedRectangleBorder(
        borderRadius: WingaplusRadius.md,
      ),
      margin: EdgeInsets.zero,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: WingaplusColors.brandPrimary,
        foregroundColor: Colors.white,
        elevation: 0,
        padding: const EdgeInsets.symmetric(
          horizontal: WingaplusSpacing.xl,
          vertical: WingaplusSpacing.md,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: WingaplusRadius.sm,
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
      border: OutlineInputBorder(
        borderRadius: WingaplusRadius.sm,
        borderSide: const BorderSide(color: WingaplusColors.gray300),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: WingaplusRadius.sm,
        borderSide: const BorderSide(color: WingaplusColors.gray200),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: WingaplusRadius.sm,
        borderSide: const BorderSide(
          color: WingaplusColors.brandPrimary,
          width: 2,
        ),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: WingaplusRadius.sm,
        borderSide: const BorderSide(color: errorRed),
      ),
      contentPadding: const EdgeInsets.symmetric(
        horizontal: WingaplusSpacing.lg,
        vertical: WingaplusSpacing.md,
      ),
      hintStyle: GoogleFonts.inter(
        color: WingaplusColors.gray500,
        fontSize: 14,
      ),
    ),
    floatingActionButtonTheme: const FloatingActionButtonThemeData(
      backgroundColor: WingaplusColors.brandSecondary,
      foregroundColor: Colors.white,
      elevation: 4,
    ),
  );

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    primaryColor: WingaplusColors.brandPrimary,
    scaffoldBackgroundColor: WingaplusColors.gray900,
    colorScheme: const ColorScheme.dark(
      primary: WingaplusColors.brandPrimary,
      secondary: WingaplusColors.secondary400,
      surface: WingaplusColors.gray800,
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
      backgroundColor: WingaplusColors.gray800,
      foregroundColor: Colors.white,
      elevation: 0,
      centerTitle: true,
      titleTextStyle: GoogleFonts.inter(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: Colors.white,
      ),
    ),
    cardTheme: CardThemeData(
      color: WingaplusColors.gray800,
      elevation: 0,
      shadowColor: Colors.transparent,
      shape: RoundedRectangleBorder(
        borderRadius: WingaplusRadius.md,
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: WingaplusColors.brandPrimary,
        foregroundColor: Colors.white,
        elevation: 0,
        padding: const EdgeInsets.symmetric(
          horizontal: WingaplusSpacing.xl,
          vertical: WingaplusSpacing.md,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: WingaplusRadius.sm,
        ),
        textStyle: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: WingaplusColors.gray800,
      border: OutlineInputBorder(
        borderRadius: WingaplusRadius.sm,
        borderSide: const BorderSide(color: WingaplusColors.gray700),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: WingaplusRadius.sm,
        borderSide: const BorderSide(color: WingaplusColors.gray700),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: WingaplusRadius.sm,
        borderSide: const BorderSide(
          color: WingaplusColors.brandPrimary,
          width: 2,
        ),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: WingaplusRadius.sm,
        borderSide: const BorderSide(color: errorRed),
      ),
      contentPadding: const EdgeInsets.symmetric(
        horizontal: WingaplusSpacing.lg,
        vertical: WingaplusSpacing.md,
      ),
      hintStyle: GoogleFonts.inter(
        color: WingaplusColors.gray500,
        fontSize: 14,
      ),
    ),
    floatingActionButtonTheme: const FloatingActionButtonThemeData(
      backgroundColor: WingaplusColors.secondary400,
      foregroundColor: Colors.white,
      elevation: 4,
    ),
  );
}
