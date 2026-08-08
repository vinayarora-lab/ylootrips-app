import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/theme.dart';

/// A generic WebView screen used by the remote web route override system.
/// Any Flutter route can be replaced with a website URL via the admin panel,
/// without shipping a new build to the Play Store.
class RemoteWebScreen extends StatefulWidget {
  final String url;
  final String title;
  const RemoteWebScreen({super.key, required this.url, required this.title});

  @override
  State<RemoteWebScreen> createState() => _RemoteWebScreenState();
}

class _RemoteWebScreenState extends State<RemoteWebScreen> {
  late final WebViewController _ctrl;
  bool _loading = true;
  bool _canGoBack = false;

  @override
  void initState() {
    super.initState();
    _ctrl = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(AppTheme.cream)
      ..setNavigationDelegate(NavigationDelegate(
        onPageStarted: (_) => setState(() => _loading = true),
        onPageFinished: (_) async {
          final canGoBack = await _ctrl.canGoBack();
          if (mounted) setState(() { _loading = false; _canGoBack = canGoBack; });
        },
        onNavigationRequest: (req) {
          final url = req.url;
          if (url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('whatsapp:')) {
            launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
            return NavigationDecision.prevent;
          }
          return NavigationDecision.navigate;
        },
      ))
      ..loadRequest(Uri.parse(widget.url));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.white,
      appBar: AppBar(
        backgroundColor: AppTheme.white,
        elevation: 0,
        scrolledUnderElevation: 0.5,
        shadowColor: AppTheme.borderGray,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
          color: AppTheme.primary,
          onPressed: () async {
            if (_canGoBack) {
              await _ctrl.goBack();
            } else {
              if (context.mounted) Navigator.of(context).maybePop();
            }
          },
        ),
        title: Text(widget.title, style: GoogleFonts.playfairDisplay(
          fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primary)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, size: 20, color: AppTheme.secondary),
            onPressed: () => _ctrl.reload(),
          ),
          IconButton(
            icon: const Icon(Icons.open_in_browser_rounded, size: 20, color: AppTheme.secondary),
            onPressed: () => launchUrl(Uri.parse(widget.url), mode: LaunchMode.externalApplication),
          ),
        ],
      ),
      body: Stack(children: [
        WebViewWidget(controller: _ctrl),
        if (_loading) const LinearProgressIndicator(
          backgroundColor: AppTheme.creamDark,
          valueColor: AlwaysStoppedAnimation<Color>(AppTheme.secondary),
          minHeight: 2,
        ),
      ]),
    );
  }
}
