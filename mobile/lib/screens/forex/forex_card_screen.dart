import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../../config/theme.dart';

class ForexCardScreen extends StatefulWidget {
  const ForexCardScreen({super.key});

  @override
  State<ForexCardScreen> createState() => _ForexCardScreenState();
}

class _ForexCardScreenState extends State<ForexCardScreen> {
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
      ..loadRequest(Uri.parse('https://goniyo.com/'));
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
              gradient: const LinearGradient(colors: [Color(0xFF92400E), Color(0xFFD97706)]),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.credit_card_rounded, color: Colors.white, size: 16),
          ),
          const SizedBox(width: 10),
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Free Forex Card', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700, color: const Color(0xFF1C1C1C))),
            Text('Powered by Niyo Global', style: GoogleFonts.inter(fontSize: 10, color: const Color(0xFF6B7280))),
          ]),
        ]),
        bottom: _loading
            ? PreferredSize(
                preferredSize: const Size.fromHeight(3),
                child: LinearProgressIndicator(
                  value: _progress,
                  backgroundColor: const Color(0xFFE5E7EB),
                  valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFD97706)),
                  minHeight: 3,
                ),
              )
            : null,
      ),
      body: Column(children: [
        // YlooTrips branded banner
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF92400E), Color(0xFFD97706)],
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
            ),
          ),
          child: Row(children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(mainAxisSize: MainAxisSize.min, children: [
                const Icon(Icons.verified_rounded, color: Color(0xFFD97706), size: 14),
                const SizedBox(width: 4),
                Text('FREE', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w800, color: const Color(0xFF92400E))),
              ]),
            ),
            const SizedBox(width: 10),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Get Free Forex Card from YlooTrips', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white)),
              Text('Zero annual fee · 150+ currencies · Lock rates before you fly', style: GoogleFonts.inter(fontSize: 10, color: Colors.white.withValues(alpha: 0.85))),
            ])),
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.2), shape: BoxShape.circle),
              child: const Icon(Icons.info_outline_rounded, color: Colors.white, size: 16),
            ),
          ]),
        ),
        // Feature chips
        Container(
          color: const Color(0xFFFFFBF0),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(children: [
            _chip(Icons.currency_exchange_rounded, 'Zero Forex Markup'),
            const SizedBox(width: 8),
            _chip(Icons.public_rounded, '150+ Countries'),
            const SizedBox(width: 8),
            _chip(Icons.flash_on_rounded, 'Instant Apply'),
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
    Icon(icon, size: 13, color: const Color(0xFFD97706)),
    const SizedBox(width: 3),
    Text(label, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: const Color(0xFF92400E))),
  ]);
}
