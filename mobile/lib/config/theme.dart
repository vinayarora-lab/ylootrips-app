import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // MakeMyTrip-style color system
  static const Color primary      = Color(0xFF006CE4);  // MMT blue
  static const Color primaryDark  = Color(0xFF0055B3);
  static const Color primaryLight = Color(0xFFE8F1FF);
  static const Color secondary    = Color(0xFFE64057);  // MMT red (offers)
  static const Color accent       = Color(0xFFFF6B35);  // orange CTA
  static const Color dark         = Color(0xFF1A1A2C);
  static const Color white        = Color(0xFFFFFFFF);
  static const Color bg           = Color(0xFFF4F6FA);
  static const Color cardBg       = Color(0xFFFFFFFF);
  static const Color textGray     = Color(0xFF717491);
  static const Color borderGray   = Color(0xFFE8ECF0);
  static const Color green        = Color(0xFF28A745);
  static const Color red          = Color(0xFFE64057);
  static const Color orange       = Color(0xFFFF6B35);
  static const Color navy         = Color(0xFF1A1A2C);

  // Aliases used across existing screens
  static const Color amber        = primary;
  static const Color amberLight   = primaryLight;
  static const Color cream        = bg;
  static const Color creamDark    = Color(0xFFE8ECF0);
  static const Color creamLight   = Color(0xFFF9FAFF);
  static const Color charcoal     = dark;
  static const Color gold         = primary;

  static ThemeData get light {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: bg,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primary,
        primary: primary,
        secondary: secondary,
        surface: white,
        brightness: Brightness.light,
      ),
      textTheme: GoogleFonts.interTextTheme().copyWith(
        displayLarge:  GoogleFonts.inter(fontSize: 32, fontWeight: FontWeight.w800, color: dark),
        displayMedium: GoogleFonts.inter(fontSize: 26, fontWeight: FontWeight.w700, color: dark),
        headlineLarge: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.w700, color: dark),
        headlineMedium:GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600, color: dark),
        titleLarge:    GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: dark),
        titleMedium:   GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: dark),
        bodyLarge:     GoogleFonts.inter(fontSize: 15, color: dark),
        bodyMedium:    GoogleFonts.inter(fontSize: 13, color: textGray),
        labelLarge:    GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: white),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: primary,
        foregroundColor: white,
        elevation: 0,
        scrolledUnderElevation: 0,
        titleTextStyle: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w700, color: white),
        iconTheme: const IconThemeData(color: white),
        centerTitle: false,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: white,
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          textStyle: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: white,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: borderGray)),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: borderGray)),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: primary, width: 1.5)),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        hintStyle: GoogleFonts.inter(fontSize: 14, color: textGray),
      ),
      cardTheme: CardThemeData(
        color: white,
        elevation: 2,
        shadowColor: Colors.black.withValues(alpha: 0.08),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: EdgeInsets.zero,
      ),
      chipTheme: ChipThemeData(
        backgroundColor: primaryLight,
        labelStyle: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500, color: primary),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: white,
        selectedItemColor: primary,
        unselectedItemColor: textGray,
        selectedLabelStyle: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600),
        unselectedLabelStyle: GoogleFonts.inter(fontSize: 11),
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
    );
  }
}

LinearGradient get accentGradient => const LinearGradient(
    colors: [Color(0xFF006CE4), Color(0xFF0055B3)]);

LinearGradient get heroGradient => const LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Colors.transparent, Color(0xCC000000)]);

LinearGradient get amberGradient => accentGradient;
