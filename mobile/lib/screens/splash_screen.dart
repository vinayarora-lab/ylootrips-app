import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../providers/remote_config_provider.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _fadeAnim;
  late Animation<double> _slideAnim;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(duration: const Duration(milliseconds: 900), vsync: this);
    _fadeAnim = CurvedAnimation(parent: _ctrl, curve: Curves.easeOut);
    _slideAnim = Tween<double>(begin: 24, end: 0).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeOutCubic),
    );
    _ctrl.forward();
    Future.delayed(const Duration(milliseconds: 2200), _navigate);
  }

  Future<void> _navigate() async {
    if (!mounted) return;
    final rc = context.read<RemoteConfigProvider>();

    // Check maintenance mode
    if (rc.maintenanceMode) {
      if (mounted) context.go('/maintenance');
      return;
    }

    // Check force update
    try {
      final info = await PackageInfo.fromPlatform();
      final current = info.version;
      final min = rc.minAppVersion;
      if (_isOlderVersion(current, min)) {
        if (mounted) context.go('/force-update');
        return;
      }
    } catch (_) {}

    if (mounted) context.go('/');
  }

  bool _isOlderVersion(String current, String min) {
    if (min == '0.0.0') return false;
    final c = current.split('.').map((e) => int.tryParse(e) ?? 0).toList();
    final m = min.split('.').map((e) => int.tryParse(e) ?? 0).toList();
    for (var i = 0; i < 3; i++) {
      final cv = i < c.length ? c[i] : 0;
      final mv = i < m.length ? m[i] : 0;
      if (cv < mv) return true;
      if (cv > mv) return false;
    }
    return false;
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.cream,
      body: Center(
        child: FadeTransition(
          opacity: _fadeAnim,
          child: AnimatedBuilder(
            animation: _slideAnim,
            builder: (_, child) => Transform.translate(
              offset: Offset(0, _slideAnim.value),
              child: child,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Image.asset(
                  'assets/images/logo.png',
                  width: 200,
                  fit: BoxFit.contain,
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: 32,
                  height: 2,
                  child: LinearProgressIndicator(
                    backgroundColor: AppTheme.creamDark,
                    valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.secondary),
                    borderRadius: BorderRadius.circular(1),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
