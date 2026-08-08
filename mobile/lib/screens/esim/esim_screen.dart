import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../../config/theme.dart';

class ESimScreen extends StatefulWidget {
  const ESimScreen({super.key});

  @override
  State<ESimScreen> createState() => _ESimScreenState();
}

class _ESimScreenState extends State<ESimScreen> {
  late final WebViewController _ctrl;
  bool _loading = true;
  double _progress = 0;

  @override
  void initState() {
    super.initState();
    _ctrl = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(NavigationDelegate(
        onPageStarted: (_) => setState(() { _loading = true; _progress = 0; }),
        onProgress: (p) => setState(() => _progress = p / 100),
        onPageFinished: (_) => setState(() => _loading = false),
      ))
      ..loadRequest(Uri.parse('https://matrix.in/collections/esims'));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, color: Color(0xFF1C1C1C), size: 20),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Row(children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFF0F4C81), Color(0xFF1A73E8)]),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.sim_card_rounded, color: Colors.white, size: 16),
          ),
          const SizedBox(width: 10),
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('International eSIM', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700, color: const Color(0xFF1C1C1C))),
            Text('Powered by Matrix', style: GoogleFonts.inter(fontSize: 10, color: const Color(0xFF6B7280))),
          ]),
        ]),
        bottom: _loading
            ? PreferredSize(
                preferredSize: const Size.fromHeight(3),
                child: LinearProgressIndicator(
                  value: _progress,
                  backgroundColor: const Color(0xFFE5E7EB),
                  valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF1A73E8)),
                  minHeight: 3,
                ),
              )
            : null,
      ),
      body: Column(children: [
        // YlooTrips branded convenience banner
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF0F4C81), Color(0xFF1A73E8)],
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
            ),
          ),
          child: Row(children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.15),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.apps_rounded, color: Colors.white, size: 18),
            ),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('All in One App — No More Multiple Apps', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white)),
              const SizedBox(height: 2),
              Text('eSIM is here for your convenience · Stay connected in 200+ countries', style: GoogleFonts.inter(fontSize: 10, color: Colors.white.withValues(alpha: 0.85), height: 1.4)),
            ])),
          ]),
        ),
        // Feature chips
        Container(
          color: const Color(0xFFF0F5FF),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(children: [
            _chip(Icons.bolt_rounded, 'Instant Activate'),
            const SizedBox(width: 8),
            _chip(Icons.public_rounded, '200+ Countries'),
            const SizedBox(width: 8),
            _chip(Icons.signal_cellular_alt_rounded, '4G/5G Speed'),
          ]),
        ),
        const Divider(height: 1, color: Color(0xFFE5E7EB)),
        // WebView
        Expanded(
          child: WebViewWidget(controller: _ctrl),
        ),
      ]),
    );
  }

  Widget _chip(IconData icon, String label) => Row(mainAxisSize: MainAxisSize.min, children: [
    Icon(icon, size: 13, color: const Color(0xFF1A73E8)),
    const SizedBox(width: 3),
    Text(label, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: const Color(0xFF0F4C81))),
  ]);
}
