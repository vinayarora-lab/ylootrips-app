import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/app_config.dart';
import '../config/theme.dart';
import '../providers/remote_config_provider.dart';

class MainShell extends StatelessWidget {
  final Widget child;
  const MainShell({super.key, required this.child});

  int _locationToIndex(String location) {
    if (location.startsWith('/trips')) return 1;
    if (location.startsWith('/offers')) return 2;
    if (location.startsWith('/planner')) return 3;
    if (location.startsWith('/profile')) return 4;
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).uri.toString();
    final currentIndex = _locationToIndex(location);
    final rc = context.watch<RemoteConfigProvider>();

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: AppTheme.primary,
        statusBarIconBrightness: Brightness.light,
      ),
      child: Scaffold(
        body: child,
        floatingActionButton: _WhatsAppFab(),
        floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
        bottomNavigationBar: Container(
          decoration: const BoxDecoration(
            color: AppTheme.white,
            border: Border(top: BorderSide(color: AppTheme.borderGray, width: 0.8)),
            boxShadow: [
              BoxShadow(color: Color(0x14000000), blurRadius: 16, offset: Offset(0, -4)),
            ],
          ),
          child: SafeArea(
            top: false,
            child: SizedBox(
              height: 62,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _NavItem(icon: Icons.home_outlined, activeIcon: Icons.home_rounded, label: rc.navHomeLabel,
                      isActive: currentIndex == 0, onTap: () => context.go('/')),
                  _NavItem(icon: Icons.luggage_outlined, activeIcon: Icons.luggage_rounded, label: rc.navTripsLabel,
                      isActive: currentIndex == 1, onTap: () => context.go('/trips')),
                  // Centre Offers button
                  GestureDetector(
                    onTap: () => context.go('/offers'),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 48, height: 48,
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFFE64057), Color(0xFFFF6B35)],
                              begin: Alignment.topLeft, end: Alignment.bottomRight,
                            ),
                            shape: BoxShape.circle,
                            boxShadow: [BoxShadow(color: const Color(0xFFE64057).withValues(alpha: 0.4), blurRadius: 12, offset: const Offset(0, 4))],
                          ),
                          child: Icon(
                            currentIndex == 2 ? Icons.local_offer_rounded : Icons.local_offer_outlined,
                            color: Colors.white, size: 22,
                          ),
                        ),
                        const SizedBox(height: 1),
                        Text(rc.navOffersLabel, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700,
                            color: currentIndex == 2 ? const Color(0xFFE64057) : AppTheme.textGray)),
                      ],
                    ),
                  ),
                  _NavItem(icon: Icons.auto_awesome_outlined, activeIcon: Icons.auto_awesome, label: rc.navPlannerLabel,
                      isActive: currentIndex == 3, onTap: () => context.go('/planner')),
                  _NavItem(icon: Icons.person_outline_rounded, activeIcon: Icons.person_rounded, label: rc.navProfileLabel,
                      isActive: currentIndex == 4, onTap: () => context.go('/profile')),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _WhatsAppFab extends StatelessWidget {
  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: () async {
      final url = Uri.parse(AppConfig.whatsappUrl('Hi! I want to plan a trip with YlooTrips.'));
      if (await canLaunchUrl(url)) await launchUrl(url, mode: LaunchMode.externalApplication);
    },
    child: Container(
      width: 56, height: 56,
      decoration: BoxDecoration(
        color: const Color(0xFF25D366),
        shape: BoxShape.circle,
        boxShadow: [BoxShadow(color: const Color(0xFF25D366).withValues(alpha: 0.45), blurRadius: 16, offset: const Offset(0, 6))],
      ),
      child: const Icon(Icons.chat_rounded, color: Colors.white, size: 26),
    ),
  );
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final bool isActive;
  final VoidCallback onTap;
  const _NavItem({required this.icon, required this.activeIcon, required this.label, required this.isActive, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: SizedBox(
        width: 64,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(isActive ? activeIcon : icon, size: 23,
                color: isActive ? AppTheme.secondary : AppTheme.textGray),
            const SizedBox(height: 3),
            Text(label,
              style: GoogleFonts.inter(
                fontSize: 10,
                fontWeight: isActive ? FontWeight.w700 : FontWeight.w400,
                color: isActive ? AppTheme.secondary : AppTheme.textGray,
              )),
          ],
        ),
      ),
    );
  }
}
