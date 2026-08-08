import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_config.dart';
import '../../config/theme.dart';

class BookingConfirmedScreen extends StatefulWidget {
  final String bookingRef;
  final String tripTitle;
  final int totalAmount;
  final int cashbackEarned;
  final int walletUsed;

  const BookingConfirmedScreen({
    super.key,
    required this.bookingRef,
    required this.tripTitle,
    this.totalAmount = 0,
    this.cashbackEarned = 0,
    this.walletUsed = 0,
  });

  @override
  State<BookingConfirmedScreen> createState() => _BookingConfirmedScreenState();
}

class _BookingConfirmedScreenState extends State<BookingConfirmedScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scaleAnim;
  late Animation<double> _fadeAnim;
  bool _copied = false;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(duration: const Duration(milliseconds: 700), vsync: this);
    _scaleAnim = CurvedAnimation(parent: _ctrl, curve: Curves.elasticOut);
    _fadeAnim = CurvedAnimation(parent: _ctrl, curve: Curves.easeIn);
    _ctrl.forward();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  void _copyRef() {
    Clipboard.setData(ClipboardData(text: widget.bookingRef));
    setState(() => _copied = true);
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) setState(() => _copied = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      child: Scaffold(
        backgroundColor: AppTheme.bg,
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: FadeTransition(
              opacity: _fadeAnim,
              child: Column(children: [
                const SizedBox(height: 24),

                // ── Animated checkmark ──────────────────────────────────────
                ScaleTransition(
                  scale: _scaleAnim,
                  child: Container(
                    width: 100, height: 100,
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981).withValues(alpha: 0.12),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.check_circle_rounded,
                        color: Color(0xFF10B981), size: 64),
                  ),
                ),
                const SizedBox(height: 20),

                Text('Booking Confirmed!',
                    style: GoogleFonts.inter(
                        fontSize: 26, fontWeight: FontWeight.w800, color: AppTheme.dark)),
                const SizedBox(height: 6),
                Text(widget.tripTitle.isNotEmpty ? widget.tripTitle : 'Your trip is booked',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(fontSize: 14, color: AppTheme.textGray)),

                const SizedBox(height: 28),

                // ── Booking Reference Card ──────────────────────────────────
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppTheme.primary.withValues(alpha: 0.2)),
                    boxShadow: [
                      BoxShadow(color: AppTheme.primary.withValues(alpha: 0.08),
                          blurRadius: 16, offset: const Offset(0, 4)),
                    ],
                  ),
                  child: Column(children: [
                    Text('Booking Reference',
                        style: GoogleFonts.inter(
                            fontSize: 11, fontWeight: FontWeight.w600,
                            color: AppTheme.textGray, letterSpacing: 0.8)),
                    const SizedBox(height: 10),
                    Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                      Text(widget.bookingRef,
                          style: GoogleFonts.inter(
                              fontSize: 22, fontWeight: FontWeight.w900,
                              color: AppTheme.primary, letterSpacing: 1.2)),
                      const SizedBox(width: 10),
                      GestureDetector(
                        onTap: _copyRef,
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: _copied
                                ? const Color(0xFF10B981).withValues(alpha: 0.12)
                                : AppTheme.primaryLight,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(mainAxisSize: MainAxisSize.min, children: [
                            Icon(_copied ? Icons.check : Icons.copy_rounded,
                                size: 14,
                                color: _copied ? const Color(0xFF10B981) : AppTheme.primary),
                            const SizedBox(width: 4),
                            Text(_copied ? 'Copied!' : 'Copy',
                                style: GoogleFonts.inter(
                                    fontSize: 11, fontWeight: FontWeight.w600,
                                    color: _copied ? const Color(0xFF10B981) : AppTheme.primary)),
                          ]),
                        ),
                      ),
                    ]),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFFD1FAE5),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text('Save this reference to track your booking',
                          style: GoogleFonts.inter(
                              fontSize: 11, color: const Color(0xFF065F46),
                              fontWeight: FontWeight.w500)),
                    ),
                  ]),
                ),

                const SizedBox(height: 16),

                // ── Summary Card ────────────────────────────────────────────
                if (widget.totalAmount > 0 || widget.cashbackEarned > 0)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05),
                          blurRadius: 10, offset: const Offset(0, 3))],
                    ),
                    child: Column(children: [
                      if (widget.totalAmount > 0)
                        _SummaryRow('Amount Paid',
                            '₹${widget.totalAmount.toString()}', Icons.payment_rounded,
                            const Color(0xFF374151)),
                      if (widget.walletUsed > 0) ...[
                        const SizedBox(height: 8),
                        _SummaryRow('WanderLoot Used',
                            '- ₹${widget.walletUsed}', Icons.account_balance_wallet_rounded,
                            AppTheme.primary),
                      ],
                      if (widget.cashbackEarned > 0) ...[
                        const Padding(
                          padding: EdgeInsets.symmetric(vertical: 8),
                          child: Divider(color: AppTheme.borderGray, height: 1),
                        ),
                        _SummaryRow('Cashback Earned',
                            '+ ₹${widget.cashbackEarned}', Icons.diamond_rounded,
                            const Color(0xFF10B981)),
                        const SizedBox(height: 4),
                        Text('Added to your WanderLoot wallet',
                            style: GoogleFonts.inter(
                                fontSize: 10, color: const Color(0xFF6B7280))),
                      ],
                    ]),
                  ),

                const SizedBox(height: 16),

                // ── Email confirmation notice ────────────────────────────────
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryLight,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(children: [
                    const Icon(Icons.email_rounded, color: AppTheme.primary, size: 20),
                    const SizedBox(width: 10),
                    Expanded(child: Text(
                      'Your e-ticket & itinerary will be sent to your registered email shortly.',
                      style: GoogleFonts.inter(fontSize: 12, color: AppTheme.primary, height: 1.5),
                    )),
                  ]),
                ),

                const SizedBox(height: 28),

                // ── CTAs ────────────────────────────────────────────────────
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () => context.go('/my-bookings'),
                    icon: const Icon(Icons.track_changes_rounded),
                    label: Text('Track My Booking',
                        style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      elevation: 0,
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: () async {
                      final msg = 'Hi! I just booked. My reference is ${widget.bookingRef}. Please confirm my booking.';
                      final url = Uri.parse(AppConfig.whatsappUrl(msg));
                      if (await canLaunchUrl(url)) {
                        await launchUrl(url, mode: LaunchMode.externalApplication);
                      }
                    },
                    icon: const Icon(Icons.chat_rounded, color: Color(0xFF25D366)),
                    label: Text('WhatsApp Confirmation',
                        style: GoogleFonts.inter(
                            fontSize: 14, fontWeight: FontWeight.w600,
                            color: AppTheme.dark)),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: AppTheme.borderGray),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                TextButton(
                  onPressed: () => context.go('/'),
                  child: Text('Back to Home',
                      style: GoogleFonts.inter(
                          fontSize: 13, color: AppTheme.textGray, fontWeight: FontWeight.w500)),
                ),
                const SizedBox(height: 16),
              ]),
            ),
          ),
        ),
      ),
    );
  }
}

class _SummaryRow extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  const _SummaryRow(this.label, this.value, this.icon, this.color);

  @override
  Widget build(BuildContext context) {
    return Row(children: [
      Icon(icon, size: 16, color: color),
      const SizedBox(width: 8),
      Text(label, style: GoogleFonts.inter(fontSize: 13, color: AppTheme.textGray)),
      const Spacer(),
      Text(value,
          style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: color)),
    ]);
  }
}
