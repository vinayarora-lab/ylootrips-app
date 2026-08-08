import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/app_config.dart';
import '../config/theme.dart';

class WebAppScreen extends StatefulWidget {
  const WebAppScreen({super.key});

  @override
  State<WebAppScreen> createState() => _WebAppScreenState();
}

class _WebAppScreenState extends State<WebAppScreen> {
  late WebViewController _ctrl;
  bool _loading = true;
  int _currentIndex = 0;

  static const _tabs = [
    (Icons.home_outlined, Icons.home, 'Home', '${AppConfig.siteUrl}/'),
    (Icons.luggage_outlined, Icons.luggage, 'Trips', '${AppConfig.siteUrl}/tours'),
    (Icons.auto_awesome_outlined, Icons.auto_awesome, 'AI Plan', '${AppConfig.siteUrl}/trip-planner'),
    (Icons.diamond_outlined, Icons.diamond, 'Rewards', '${AppConfig.siteUrl}/cashback'),
    (Icons.person_outline, Icons.person, 'Profile', '${AppConfig.siteUrl}/my-booking'),
  ];

  @override
  void initState() {
    super.initState();
    _ctrl = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(AppTheme.cream)
      ..setNavigationDelegate(NavigationDelegate(
        onPageStarted: (_) => setState(() => _loading = true),
        onPageFinished: (url) => setState(() {
          _loading = false;
          _currentIndex = _urlToIndex(url);
        }),
        onNavigationRequest: (req) {
          final url = req.url;
          // Open truly external links in browser
          if (!url.contains('ylootrips.com') &&
              !url.contains('easebuzz') &&
              !url.startsWith('about:') &&
              !url.startsWith('data:') &&
              !url.startsWith('blob:')) {
            launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
            return NavigationDecision.prevent;
          }
          if (url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('whatsapp:')) {
            launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
            return NavigationDecision.prevent;
          }
          return NavigationDecision.navigate;
        },
      ))
      ..loadRequest(Uri.parse('${AppConfig.siteUrl}/'));
  }

  int _urlToIndex(String url) {
    if (url.contains('/trip-planner')) return 2;
    if (url.contains('/cashback')) return 3;
    if (url.contains('/my-booking') || url.contains('/profile')) return 4;
    if (url.contains('/tours') || url.contains('/trips') ||
        url.contains('/destinations') || url.contains('-package') ||
        url.contains('-tour-') || url.contains('tour-package')) return 1;
    return 0;
  }

  void _goToTab(int index) {
    setState(() => _currentIndex = index);
    _ctrl.loadRequest(Uri.parse(_tabs[index].$4));
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) async {
        if (didPop) return;
        if (await _ctrl.canGoBack()) {
          await _ctrl.goBack();
        } else {
          SystemNavigator.pop();
        }
      },
      child: Scaffold(
        backgroundColor: AppTheme.cream,
        body: Stack(
          children: [
            WebViewWidget(controller: _ctrl),
            if (_loading)
              const Positioned(
                top: 0, left: 0, right: 0,
                child: LinearProgressIndicator(
                  backgroundColor: AppTheme.creamDark,
                  valueColor: AlwaysStoppedAnimation<Color>(AppTheme.secondary),
                  minHeight: 2,
                ),
              ),
          ],
        ),
        bottomNavigationBar: Container(
          decoration: BoxDecoration(
            color: AppTheme.cream,
            border: const Border(top: BorderSide(color: AppTheme.creamDark, width: 1)),
            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 10, offset: const Offset(0, -2))],
          ),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 6),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: List.generate(_tabs.length, (i) {
                  final tab = _tabs[i];
                  final isActive = _currentIndex == i;
                  final isHighlighted = i == 2;

                  if (isHighlighted) {
                    return GestureDetector(
                      onTap: () => _goToTab(i),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 44, height: 32,
                            decoration: BoxDecoration(
                              color: isActive ? AppTheme.primary : AppTheme.creamDark,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Icon(isActive ? tab.$2 : tab.$1, size: 18,
                              color: isActive ? AppTheme.white : AppTheme.secondary),
                          ),
                          const SizedBox(height: 2),
                          Text(tab.$3, style: GoogleFonts.inter(fontSize: 10,
                            fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
                            color: isActive ? AppTheme.primary : AppTheme.textGray)),
                        ],
                      ),
                    );
                  }

                  return GestureDetector(
                    onTap: () => _goToTab(i),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(isActive ? tab.$2 : tab.$1, size: 22,
                          color: isActive ? AppTheme.primary : AppTheme.textGray),
                        const SizedBox(height: 2),
                        Text(tab.$3, style: GoogleFonts.inter(fontSize: 10,
                          fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
                          color: isActive ? AppTheme.primary : AppTheme.textGray)),
                      ],
                    ),
                  );
                }),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
