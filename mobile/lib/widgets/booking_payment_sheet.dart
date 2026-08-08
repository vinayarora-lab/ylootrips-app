import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../config/app_config.dart';
import '../config/theme.dart';
import '../providers/wallet_provider.dart';
import '../services/api_service.dart';
import '../services/analytics_service.dart';

/// Shows a booking form bottom sheet, calls payment API, then opens
/// in-app Easebuzz payment WebView.
///
/// [type]: 'package' | 'hotel'
/// [title]: display name shown in form
/// [price]: numeric price in INR
/// [extraData]: additional fields merged into payment request
Future<void> showBookingPaymentSheet(
  BuildContext context, {
  required String type,
  required String title,
  required int price,
  Map<String, dynamic> extraData = const {},
}) async {
  await showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (ctx) => _BookingSheet(
      type: type,
      title: title,
      price: price,
      extraData: extraData,
    ),
  );
}

class _BookingSheet extends StatefulWidget {
  final String type;
  final String title;
  final int price;
  final Map<String, dynamic> extraData;

  const _BookingSheet({
    required this.type,
    required this.title,
    required this.price,
    required this.extraData,
  });

  @override
  State<_BookingSheet> createState() => _BookingSheetState();
}

class _BookingSheetState extends State<_BookingSheet> {
  final _form = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  int _pax = 2;
  bool _submitting = false;
  String? _error;
  bool _useWallet = false;

  int get _total => widget.price * _pax;
  int get _advance => (_total * 0.25).round();
  int get _walletDiscount {
    if (!_useWallet) return 0;
    final wallet = context.read<WalletProvider>();
    final max = wallet.maxDeductible(_total.toDouble()).floor();
    return max.clamp(0, wallet.balance.floor()).clamp(0, _advance);
  }
  int get _chargeable => _advance - _walletDiscount;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    super.dispose();
  }

  Future<void> _pay() async {
    if (!_form.currentState!.validate()) return;
    setState(() { _submitting = true; _error = null; });

    try {
      AnalyticsService.beginCheckout(name: widget.title, price: widget.price, pax: _pax);
      final ref = 'MOB-${DateTime.now().millisecondsSinceEpoch}';
      final walletUsed = _walletDiscount;
      final bookingData = {
        'bookingReference': ref,
        'customerName': _nameCtrl.text.trim(),
        'customerEmail': _emailCtrl.text.trim(),
        'customerPhone': _phoneCtrl.text.trim(),
        'pax': _pax,
        'totalAmount': _total,
        'chargeNow': _chargeable,
        'walletDiscount': walletUsed,
        'tripTitle': widget.title,
        'type': widget.type,
        ...widget.extraData,
      };

      final json = await ApiService().initiatePackagePayment(bookingData);
      final paymentUrl = json['paymentUrl'] as String? ??
          json['payment_url'] as String? ??
          json['url'] as String?;

      if (!mounted) return;

      if (paymentUrl != null && paymentUrl.isNotEmpty) {
        Navigator.of(context).pop(); // close sheet
        context.push('/payment', extra: {
          'url': paymentUrl,
          'successUrl': AppConfig.paymentSuccessUrl,
          'failureUrl': AppConfig.paymentFailureUrl,
          'title': '${widget.title} Payment',
          'walletDeducted': walletUsed,
          'totalAmount': _total,
          'tripTitle': widget.title,
        });
      } else {
        setState(() {
          _error = json['message'] as String? ?? 'Could not initiate payment. Please try again.';
          _submitting = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Payment initiation failed. Please try again.';
          _submitting = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final bottom = MediaQuery.of(context).viewInsets.bottom;
    return Container(
      decoration: const BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.fromLTRB(20, 20, 20, bottom + 20),
      child: SingleChildScrollView(
        child: Form(
          key: _form,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              // Handle
              Center(
                child: Container(
                  width: 40, height: 4,
                  decoration: BoxDecoration(
                    color: AppTheme.borderGray,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Title
              Text(widget.title,
                style: GoogleFonts.playfairDisplay(
                  fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primary),
                maxLines: 2, overflow: TextOverflow.ellipsis),
              const SizedBox(height: 4),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF3C7),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text('25% advance · Pay rest later',
                      style: GoogleFonts.inter(fontSize: 11, color: const Color(0xFF92400E),
                          fontWeight: FontWeight.w600)),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFFD1FAE5),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.lock, size: 10, color: Color(0xFF065F46)),
                        const SizedBox(width: 3),
                        Text('Secure Payment',
                          style: GoogleFonts.inter(fontSize: 11, color: const Color(0xFF065F46),
                              fontWeight: FontWeight.w600)),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Traveller details
              Text('Traveller Details',
                style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700,
                    color: AppTheme.charcoal)),
              const SizedBox(height: 12),

              _Field(
                controller: _nameCtrl,
                label: 'Full Name',
                icon: Icons.person_outline,
                validator: (v) => v!.trim().isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 10),
              _Field(
                controller: _emailCtrl,
                label: 'Email',
                icon: Icons.email_outlined,
                keyboardType: TextInputType.emailAddress,
                validator: (v) =>
                    v!.contains('@') ? null : 'Enter valid email',
              ),
              const SizedBox(height: 10),
              _Field(
                controller: _phoneCtrl,
                label: 'Phone (with country code)',
                icon: Icons.phone_outlined,
                keyboardType: TextInputType.phone,
                inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'[0-9+]'))],
                validator: (v) =>
                    v!.length >= 10 ? null : 'Enter valid phone number',
              ),
              const SizedBox(height: 10),

              // Pax selector
              Row(
                children: [
                  const Icon(Icons.people_outline, size: 18, color: AppTheme.textGray),
                  const SizedBox(width: 8),
                  Text('Travellers',
                    style: GoogleFonts.inter(fontSize: 14, color: AppTheme.charcoal)),
                  const Spacer(),
                  _Counter(
                    value: _pax,
                    onDec: _pax > 1 ? () => setState(() => _pax--) : null,
                    onInc: _pax < 20 ? () => setState(() => _pax++) : null,
                  ),
                ],
              ),

              const SizedBox(height: 20),
              const Divider(color: AppTheme.borderGray),
              const SizedBox(height: 12),

              // WanderLoot wallet
              Consumer<WalletProvider>(
                builder: (_, wallet, __) {
                  final maxDiscount = wallet.maxDeductible(_total.toDouble()).floor();
                  final applicable = maxDiscount.clamp(0, wallet.balance.floor());
                  if (wallet.balance <= 0) return const SizedBox.shrink();
                  return Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFEF3C7),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: const Color(0xFFFCD34D)),
                        ),
                        child: Row(
                          children: [
                            const Text('🪙', style: TextStyle(fontSize: 20)),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('WanderLoot Credits',
                                    style: GoogleFonts.inter(
                                      fontSize: 13, fontWeight: FontWeight.w700,
                                      color: const Color(0xFF92400E))),
                                  Text('Balance: ₹${_formatNum(wallet.balance.floor())}  •  Apply up to ₹${_formatNum(applicable)}',
                                    style: GoogleFonts.inter(
                                      fontSize: 11, color: const Color(0xFF78350F))),
                                ],
                              ),
                            ),
                            Switch(
                              value: _useWallet,
                              onChanged: applicable > 0
                                  ? (v) => setState(() => _useWallet = v)
                                  : null,
                              activeColor: const Color(0xFFD97706),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),
                    ],
                  );
                },
              ),

              // Price summary
              _PriceRow('Package price', '₹${_formatNum(widget.price)} × $_pax'),
              const SizedBox(height: 6),
              _PriceRow('Total', '₹${_formatNum(_total)}', bold: true),
              const SizedBox(height: 6),
              if (_walletDiscount > 0) ...[
                _PriceRow('WanderLoot discount', '− ₹${_formatNum(_walletDiscount)}',
                    highlight: true),
                const SizedBox(height: 6),
              ],
              _PriceRow(
                'Pay now (25% advance)',
                '₹${_formatNum(_chargeable)}',
                bold: true,
                highlight: true,
              ),

              const SizedBox(height: 16),

              if (_error != null) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEE2E2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(_error!,
                    style: GoogleFonts.inter(fontSize: 12, color: AppTheme.red)),
                ),
                const SizedBox(height: 12),
              ],

              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _submitting ? null : _pay,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.secondary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    disabledBackgroundColor: AppTheme.creamDark,
                  ),
                  child: _submitting
                      ? const SizedBox(
                          width: 20, height: 20,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white))
                      : Text(
                          'Pay ₹${_formatNum(_chargeable)} to Confirm',
                          style: GoogleFonts.inter(
                              fontSize: 15, fontWeight: FontWeight.w700)),
                ),
              ),
              const SizedBox(height: 8),
              Center(
                child: Text('Secured by Easebuzz · 256-bit SSL',
                  style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textGray)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatNum(int n) {
    final s = n.toString();
    if (s.length <= 3) return s;
    final buf = StringBuffer();
    final rem = (s.length - 3) % 2;
    int i = 0;
    if (rem != 0) { buf.write(s.substring(0, rem)); buf.write(','); i = rem; }
    while (i < s.length - 3) {
      buf.write(s.substring(i, i + 2));
      buf.write(',');
      i += 2;
    }
    buf.write(s.substring(s.length - 3));
    return buf.toString();
  }
}

class _Field extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final IconData icon;
  final TextInputType? keyboardType;
  final List<TextInputFormatter>? inputFormatters;
  final String? Function(String?)? validator;

  const _Field({
    required this.controller,
    required this.label,
    required this.icon,
    this.keyboardType,
    this.inputFormatters,
    this.validator,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      inputFormatters: inputFormatters,
      validator: validator,
      style: GoogleFonts.inter(fontSize: 14),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: GoogleFonts.inter(fontSize: 13, color: AppTheme.textGray),
        prefixIcon: Icon(icon, size: 18, color: AppTheme.textGray),
        filled: true,
        fillColor: AppTheme.creamDark,
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: AppTheme.secondary, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: AppTheme.red),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: AppTheme.red),
        ),
      ),
    );
  }
}

class _Counter extends StatelessWidget {
  final int value;
  final VoidCallback? onDec;
  final VoidCallback? onInc;
  const _Counter({required this.value, this.onDec, this.onInc});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _Btn(icon: Icons.remove, onTap: onDec),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14),
          child: Text('$value',
            style: GoogleFonts.inter(
                fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.primary)),
        ),
        _Btn(icon: Icons.add, onTap: onInc),
      ],
    );
  }
}

class _Btn extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onTap;
  const _Btn({required this.icon, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 32, height: 32,
        decoration: BoxDecoration(
          color: onTap != null ? AppTheme.creamDark : AppTheme.borderGray,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, size: 16,
          color: onTap != null ? AppTheme.secondary : AppTheme.textGray),
      ),
    );
  }
}

class _PriceRow extends StatelessWidget {
  final String label;
  final String value;
  final bool bold;
  final bool highlight;
  const _PriceRow(this.label, this.value,
      {this.bold = false, this.highlight = false});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label,
          style: GoogleFonts.inter(
            fontSize: 13,
            color: highlight ? AppTheme.secondary : AppTheme.textGray,
            fontWeight: bold ? FontWeight.w700 : FontWeight.w400,
          )),
        Text(value,
          style: GoogleFonts.inter(
            fontSize: 13,
            color: highlight ? AppTheme.secondary : AppTheme.charcoal,
            fontWeight: bold ? FontWeight.w700 : FontWeight.w500,
          )),
      ],
    );
  }
}
