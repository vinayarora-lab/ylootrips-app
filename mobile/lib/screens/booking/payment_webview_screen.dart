import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../../config/theme.dart';
import '../../providers/wallet_provider.dart';
import '../../services/analytics_service.dart';

class PaymentWebviewScreen extends StatefulWidget {
  final String url;
  final String successUrl;
  final String failureUrl;
  final String title;
  final int walletDeducted;
  final int totalAmount;
  final String tripTitle;

  const PaymentWebviewScreen({
    super.key,
    required this.url,
    required this.successUrl,
    required this.failureUrl,
    required this.title,
    this.walletDeducted = 0,
    this.totalAmount = 0,
    this.tripTitle = '',
  });

  @override
  State<PaymentWebviewScreen> createState() =>
      _PaymentWebviewScreenState();
}

class _PaymentWebviewScreenState
    extends State<PaymentWebviewScreen> {
  late WebViewController _ctrl;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _ctrl = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(NavigationDelegate(
        onPageStarted: (_) => setState(() => _loading = true),
        onPageFinished: (_) => setState(() => _loading = false),
        onNavigationRequest: (req) {
          final url = req.url;

          // Success
          if (widget.successUrl.isNotEmpty && url.startsWith(widget.successUrl)) {
            _onSuccess(url);
            return NavigationDecision.prevent;
          }

          // Failure
          if (widget.failureUrl.isNotEmpty && url.startsWith(widget.failureUrl)) {
            _onFailure(url);
            return NavigationDecision.prevent;
          }

          return NavigationDecision.navigate;
        },
      ))
      ..loadRequest(Uri.parse(widget.url));
  }

  void _onSuccess(String url) {
    if (!mounted) return;
    // Extract reference from URL if present
    final uri = Uri.tryParse(url);
    final ref = uri?.queryParameters['ref'] ??
        uri?.queryParameters['txnid'] ?? '';

    // Firebase Analytics purchase event
    AnalyticsService.purchase(
      transactionId: ref.isNotEmpty ? ref : 'MOB-${DateTime.now().millisecondsSinceEpoch}',
      name: widget.title,
      amount: widget.totalAmount,
    );

    // Apply WanderLoot: deduct used credits + add 5% cashback
    final wallet = context.read<WalletProvider>();
    if (widget.walletDeducted > 0) {
      wallet.deduct(
        widget.walletDeducted.toDouble(),
        'Used for ${widget.tripTitle.isNotEmpty ? widget.tripTitle : widget.title}',
      );
    }
    if (widget.totalAmount > 0) {
      final cashback = (widget.totalAmount * 0.05).roundToDouble();
      wallet.addCashback(
        cashback,
        '5% Cashback on ${widget.tripTitle.isNotEmpty ? widget.tripTitle : widget.title}',
      );
    }

    final cashback = widget.totalAmount > 0
        ? (widget.totalAmount * 0.05).round()
        : 0;

    if (mounted) {
      context.go('/booking-confirmed', extra: {
        'ref': ref.isNotEmpty ? ref : 'MOB-${DateTime.now().millisecondsSinceEpoch}',
        'tripTitle': widget.tripTitle.isNotEmpty ? widget.tripTitle : widget.title,
        'totalAmount': widget.totalAmount,
        'cashbackEarned': cashback,
        'walletUsed': widget.walletDeducted,
      });
    }
  }

  void _onFailure(String url) {
    if (!mounted) return;
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.cancel, color: AppTheme.red, size: 60),
            const SizedBox(height: 12),
            Text('Payment Failed',
                style: GoogleFonts.playfairDisplay(
                    fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(
              'Your payment could not be processed. Please try again or contact us on WhatsApp.',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                  fontSize: 13, color: AppTheme.textGray),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              context.pop();
            },
            child: const Text('Try Again'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              context.go('/');
            },
            child: const Text('Go Home'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title,
            style: GoogleFonts.inter(fontWeight: FontWeight.w600)),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => showDialog(
            context: context,
            builder: (_) => AlertDialog(
              title: const Text('Cancel Payment?'),
              content: const Text(
                  'Are you sure you want to cancel this payment?'),
              actions: [
                TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('No')),
                TextButton(
                    onPressed: () {
                      Navigator.pop(context);
                      context.pop();
                    },
                    child: const Text('Yes, Cancel',
                        style: TextStyle(color: Colors.red))),
              ],
            ),
          ),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 12),
            padding:
                const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFFD1FAE5),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.lock, size: 11, color: Color(0xFF065F46)),
                const SizedBox(width: 3),
                Text('Secure',
                    style: GoogleFonts.inter(
                        fontSize: 11,
                        color: const Color(0xFF065F46),
                        fontWeight: FontWeight.w600)),
              ],
            ),
          ),
        ],
      ),
      body: Stack(
        children: [
          WebViewWidget(controller: _ctrl),
          if (_loading)
            const Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CircularProgressIndicator(color: AppTheme.primary),
                  SizedBox(height: 12),
                  Text('Loading payment gateway...'),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
