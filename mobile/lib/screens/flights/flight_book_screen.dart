import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../config/app_config.dart';
import '../../config/theme.dart';
import '../../models/booking.dart';
import '../../services/api_service.dart';

class FlightBookScreen extends StatefulWidget {
  final Map<String, dynamic> flight;
  const FlightBookScreen({super.key, required this.flight});

  @override
  State<FlightBookScreen> createState() => _FlightBookScreenState();
}

class _FlightBookScreenState extends State<FlightBookScreen> {
  late List<Passenger> _passengers;
  final _contact = ContactDetails();
  String _paymentMethod = 'upi';
  bool _agreed = false;
  bool _submitting = false;
  String? _error;

  final _convFee = 249;

  static const _indiaCodes = {
    'DEL', 'BOM', 'BLR', 'MAA', 'HYD', 'CCU', 'JAI', 'GOI',
    'COK', 'PNQ', 'AMD', 'VNS', 'ATQ', 'IXL', 'SXR', 'UDR',
    'JDH', 'IXC', 'DED', 'IXZ',
  };

  @override
  void initState() {
    super.initState();
    final pax = (widget.flight['pax'] ?? 1) as int;
    _passengers =
        List.generate(pax > 0 ? pax : 1, (_) => Passenger());
  }

  bool get _isInternational {
    final from = widget.flight['from'] ?? '';
    final to = widget.flight['to'] ?? '';
    return !_indiaCodes.contains(from) || !_indiaCodes.contains(to);
  }

  int get _totalPrice =>
      (widget.flight['price'] ?? 0) + _convFee;

  bool _validate() {
    for (final p in _passengers) {
      if (!p.isValid) return false;
      if (_isInternational && !p.isValidForInternational()) return false;
    }
    if (!_contact.isValid) return false;
    if (!_agreed) return false;
    return true;
  }

  Future<void> _pay() async {
    if (widget.flight['price'] == 0 ||
        widget.flight['price'] == null) {
      setState(() => _error =
          'Price unavailable. Please contact us on WhatsApp.');
      return;
    }
    if (!_validate()) {
      setState(() =>
          _error = 'Please fill all required fields and accept the terms.');
      return;
    }
    setState(() { _error = null; _submitting = true; });
    try {
      final bookingData = FlightBooking(
        flight: Map<String, dynamic>.from(widget.flight)
          ..['totalPayable'] = _totalPrice,
        passengers: _passengers,
        contact: _contact,
        paymentMethod: _paymentMethod,
      ).toJson();

      final json = await ApiService().initiateFlightPayment(bookingData);
      if (!mounted) return;

      if (json['error'] != null) {
        setState(() {
          _error = json['error'].toString();
          _submitting = false;
        });
        return;
      }

      final paymentUrl = json['paymentUrl'] as String?;
      if (paymentUrl != null) {
        context.push('/payment', extra: {
          'url': paymentUrl,
          'successUrl': AppConfig.flightSuccessUrl,
          'failureUrl': AppConfig.paymentFailureUrl,
          'title': 'Flight Payment',
        });
      } else {
        setState(() {
          _error = 'Could not get payment URL. Please try again.';
          _submitting = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = e.toString();
        _submitting = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final f = widget.flight;
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(
        title: Text('Complete Booking',
            style: GoogleFonts.playfairDisplay(fontWeight: FontWeight.bold)),
        leading: const BackButton(),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Flight summary
            _FlightSummaryCard(flight: f),
            const SizedBox(height: 16),

            // Passenger forms
            Text('Traveller Details',
                style: GoogleFonts.playfairDisplay(
                    fontSize: 17, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            ..._passengers.asMap().entries.map((entry) =>
                _PassengerForm(
                  index: entry.key,
                  passenger: entry.value,
                  isInternational: _isInternational,
                  onChanged: () => setState(() {}),
                )),

            const SizedBox(height: 16),

            // Contact
            _ContactForm(contact: _contact, onChanged: () => setState(() {})),

            const SizedBox(height: 16),

            // Payment method
            _PaymentMethodSelector(
              selected: _paymentMethod,
              onChanged: (v) => setState(() => _paymentMethod = v),
            ),

            const SizedBox(height: 16),

            // Fare summary
            _FareSummary(
              basePrice: f['price'] ?? 0,
              convFee: _convFee,
              totalPayable: _totalPrice,
              pax: f['pax'] ?? 1,
              paymentMethod: _paymentMethod,
            ),

            const SizedBox(height: 16),

            // Error
            if (_error != null)
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEE2E2),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFFFCA5A5)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.error_outline,
                        color: AppTheme.red, size: 16),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(_error!,
                          style: GoogleFonts.inter(
                              fontSize: 12, color: AppTheme.red)),
                    ),
                  ],
                ),
              ),

            const SizedBox(height: 12),

            // Terms
            GestureDetector(
              onTap: () => setState(() => _agreed = !_agreed),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Checkbox(
                    value: _agreed,
                    onChanged: (v) => setState(() => _agreed = v ?? false),
                    activeColor: AppTheme.amber,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(4)),
                  ),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.only(top: 12),
                      child: Text(
                        'I agree to the Terms & Conditions and Privacy Policy. All passenger details are correct.',
                        style: GoogleFonts.inter(
                            fontSize: 12, color: AppTheme.textGray),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Pay button
            SizedBox(
              width: double.infinity,
              height: 54,
              child: ElevatedButton.icon(
                onPressed: _submitting ||
                        !_agreed ||
                        (f['price'] ?? 0) <= 0
                    ? null
                    : _pay,
                icon: _submitting
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(
                            strokeWidth: 2, color: Colors.white))
                    : const Icon(Icons.lock_outline),
                label: Text(
                  _submitting
                      ? 'Processing...'
                      : (f['price'] ?? 0) <= 0
                          ? 'Price unavailable'
                          : 'Pay ₹${_formatINR(_totalPrice)} Securely',
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.amber,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                ),
              ),
            ),

            const SizedBox(height: 8),
            const Center(
              child: Text(
                '🔒 Secured by Easebuzz · 256-bit SSL · PCI DSS',
                style: TextStyle(
                    fontSize: 11, color: AppTheme.textGray),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  String _formatINR(int amount) {
    final s = amount.toString();
    if (s.length <= 3) return s;
    final last3 = s.substring(s.length - 3);
    final rest = s.substring(0, s.length - 3);
    final formatted = rest.replaceAllMapped(
        RegExp(r'(\d{1,2})(?=(\d{2})+$)'), (m) => '${m[1]},');
    return '$formatted,$last3';
  }
}

class _FlightSummaryCard extends StatelessWidget {
  final Map<String, dynamic> flight;
  const _FlightSummaryCard({required this.flight});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.borderGray),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Your Flight',
              style: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.amber,
                  letterSpacing: 1)),
          const SizedBox(height: 12),
          Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppTheme.amberLight,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Center(
                  child: Text(
                    (flight['code'] ?? '').toString().substring(
                        0,
                        (flight['code'] ?? '').toString().length >= 2
                            ? 2
                            : (flight['code'] ?? '').toString().length),
                    style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.amber),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Row(
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(flight['dep'] ?? '',
                            style: GoogleFonts.inter(
                                fontSize: 22,
                                fontWeight: FontWeight.w800)),
                        Text(flight['from'] ?? '',
                            style: GoogleFonts.inter(
                                fontSize: 12, color: AppTheme.textGray)),
                      ],
                    ),
                    const Expanded(
                        child: Icon(Icons.flight,
                            color: AppTheme.amber)),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(flight['arr'] ?? '',
                            style: GoogleFonts.inter(
                                fontSize: 22,
                                fontWeight: FontWeight.w800)),
                        Text(flight['to'] ?? '',
                            style: GoogleFonts.inter(
                                fontSize: 12, color: AppTheme.textGray)),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Text(flight['airline'] ?? '',
                  style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: AppTheme.textGray)),
              const SizedBox(width: 8),
              Text('·',
                  style: GoogleFonts.inter(color: AppTheme.textGray)),
              const SizedBox(width: 8),
              Text(flight['date'] ?? '',
                  style: GoogleFonts.inter(
                      fontSize: 12, color: AppTheme.textGray)),
              const SizedBox(width: 8),
              Text('·',
                  style: GoogleFonts.inter(color: AppTheme.textGray)),
              const SizedBox(width: 8),
              Text('${flight['pax'] ?? 1} Pax',
                  style: GoogleFonts.inter(
                      fontSize: 12, color: AppTheme.textGray)),
            ],
          ),
        ],
      ),
    );
  }
}

class _PassengerForm extends StatelessWidget {
  final int index;
  final Passenger passenger;
  final bool isInternational;
  final VoidCallback onChanged;

  const _PassengerForm({
    required this.index,
    required this.passenger,
    required this.isInternational,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.borderGray),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Traveller ${index + 1}',
              style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.charcoal)),
          const SizedBox(height: 12),

          // Title
          Row(
            children: ['Mr', 'Ms', 'Mrs'].map((t) {
              final selected = passenger.title == t;
              return GestureDetector(
                onTap: () {
                  passenger.title = t;
                  onChanged();
                },
                child: Container(
                  margin: const EdgeInsets.only(right: 8),
                  padding: const EdgeInsets.symmetric(
                      horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color:
                        selected ? AppTheme.amber : AppTheme.white,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                        color: selected
                            ? AppTheme.amber
                            : AppTheme.borderGray),
                  ),
                  child: Text(t,
                      style: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: selected
                              ? Colors.white
                              : AppTheme.textGray)),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 10),

          // Name fields
          Row(
            children: [
              Expanded(
                child: _Field(
                    label: 'First Name *',
                    initial: passenger.firstName,
                    onChanged: (v) {
                      passenger.firstName = v;
                      onChanged();
                    }),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _Field(
                    label: 'Last Name *',
                    initial: passenger.lastName,
                    onChanged: (v) {
                      passenger.lastName = v;
                      onChanged();
                    }),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // DOB
          _Field(
            label: 'Date of Birth * (YYYY-MM-DD)',
            initial: passenger.dob,
            keyboardType: TextInputType.datetime,
            onChanged: (v) {
              passenger.dob = v;
              onChanged();
            },
          ),

          // Passport for international
          if (isInternational) ...[
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFEFF6FF),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFFBFDBFE)),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      const Icon(Icons.public,
                          size: 14, color: Color(0xFF3B82F6)),
                      const SizedBox(width: 6),
                      Text('International Flight — Passport Required',
                          style: GoogleFonts.inter(
                              fontSize: 11,
                              color: const Color(0xFF1D4ED8),
                              fontWeight: FontWeight.w600)),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: _Field(
                          label: 'Passport No *',
                          initial: passenger.passportNo,
                          onChanged: (v) {
                            passenger.passportNo = v.toUpperCase();
                            onChanged();
                          },
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _Field(
                          label: 'Expiry (YYYY-MM-DD) *',
                          initial: passenger.passportExpiry,
                          onChanged: (v) {
                            passenger.passportExpiry = v;
                            onChanged();
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _ContactForm extends StatelessWidget {
  final ContactDetails contact;
  final VoidCallback onChanged;

  const _ContactForm(
      {required this.contact, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.borderGray),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Contact Details',
              style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.charcoal)),
          Text('E-ticket & booking confirmation sent here',
              style: GoogleFonts.inter(
                  fontSize: 11, color: AppTheme.textGray)),
          const SizedBox(height: 12),
          _Field(
            label: 'Email Address *',
            initial: contact.email,
            keyboardType: TextInputType.emailAddress,
            onChanged: (v) {
              contact.email = v;
              onChanged();
            },
          ),
          const SizedBox(height: 10),
          _Field(
            label: 'Mobile Number *',
            initial: contact.phone,
            keyboardType: TextInputType.phone,
            onChanged: (v) {
              contact.phone = v;
              onChanged();
            },
          ),
        ],
      ),
    );
  }
}

class _PaymentMethodSelector extends StatelessWidget {
  final String selected;
  final ValueChanged<String> onChanged;

  const _PaymentMethodSelector(
      {required this.selected, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    final methods = [
      {'id': 'upi', 'label': 'UPI', 'sub': 'PhonePe, GPay, Paytm', 'badge': '5% OFF'},
      {'id': 'credit_card', 'label': 'Credit Card', 'sub': 'Visa, Mastercard, Amex', 'badge': '3% OFF'},
      {'id': 'debit_card', 'label': 'Debit Card', 'sub': 'Visa, Mastercard, RuPay', 'badge': '3% OFF'},
      {'id': 'netbanking', 'label': 'Net Banking', 'sub': 'All major banks', 'badge': ''},
    ];

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.borderGray),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Payment Method',
              style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.charcoal)),
          const SizedBox(height: 12),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            childAspectRatio: 3.2,
            crossAxisSpacing: 8,
            mainAxisSpacing: 8,
            children: methods.map((m) {
              final isSelected = selected == m['id'];
              return GestureDetector(
                onTap: () => onChanged(m['id']!),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppTheme.amberLight
                        : AppTheme.cream,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                        color: isSelected
                            ? AppTheme.amber
                            : AppTheme.borderGray,
                        width: isSelected ? 1.5 : 1),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(m['label']!,
                                style: GoogleFonts.inter(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                    color: isSelected
                                        ? AppTheme.amber
                                        : AppTheme.charcoal)),
                            if (m['badge']!.isNotEmpty)
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 4, vertical: 1),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFD1FAE5),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(m['badge']!,
                                    style: GoogleFonts.inter(
                                        fontSize: 9,
                                        fontWeight: FontWeight.w700,
                                        color: const Color(0xFF065F46))),
                              ),
                          ],
                        ),
                      ),
                      if (isSelected)
                        const Icon(Icons.check_circle,
                            size: 14, color: AppTheme.amber),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}

class _FareSummary extends StatelessWidget {
  final int basePrice;
  final int convFee;
  final int totalPayable;
  final int pax;
  final String paymentMethod;

  const _FareSummary({
    required this.basePrice,
    required this.convFee,
    required this.totalPayable,
    required this.pax,
    required this.paymentMethod,
  });

  @override
  Widget build(BuildContext context) {
    final tax = basePrice - (basePrice * 0.82).round();
    final baseFare = basePrice - tax;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.borderGray),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Fare Summary',
              style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.charcoal)),
          const SizedBox(height: 12),
          _Row('Base Fare ($pax adult${pax > 1 ? 's' : ''})',
              '₹${_fmt(baseFare)}'),
          const SizedBox(height: 6),
          _Row('Taxes & Fees', '₹${_fmt(tax)}'),
          const SizedBox(height: 6),
          _Row('Convenience Fee', '₹${_fmt(convFee)}'),
          const Divider(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Total Payable',
                  style: GoogleFonts.inter(
                      fontSize: 15, fontWeight: FontWeight.w700)),
              Text('₹${_fmt(totalPayable)}',
                  style: GoogleFonts.inter(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: AppTheme.amber)),
            ],
          ),
          if (paymentMethod == 'upi' || paymentMethod == 'credit_card')
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFFD1FAE5),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  paymentMethod == 'upi'
                      ? '🎉 5% OFF applied with UPI!'
                      : '🎉 3% OFF applied with Card!',
                  style: GoogleFonts.inter(
                      fontSize: 11,
                      color: const Color(0xFF065F46),
                      fontWeight: FontWeight.w600),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _Row(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label,
            style: GoogleFonts.inter(
                fontSize: 13, color: AppTheme.textGray)),
        Text(value,
            style: GoogleFonts.inter(
                fontSize: 13, fontWeight: FontWeight.w500)),
      ],
    );
  }

  String _fmt(int amount) {
    final s = amount.toString();
    if (s.length <= 3) return s;
    final last3 = s.substring(s.length - 3);
    final rest = s.substring(0, s.length - 3);
    final formatted = rest.replaceAllMapped(
        RegExp(r'(\d{1,2})(?=(\d{2})+$)'), (m) => '${m[1]},');
    return '$formatted,$last3';
  }
}

class _Field extends StatelessWidget {
  final String label;
  final String initial;
  final ValueChanged<String> onChanged;
  final TextInputType? keyboardType;

  const _Field({
    required this.label,
    required this.initial,
    required this.onChanged,
    this.keyboardType,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: GoogleFonts.inter(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: AppTheme.textGray)),
        const SizedBox(height: 4),
        TextFormField(
          initialValue: initial,
          keyboardType: keyboardType,
          onChanged: onChanged,
          style: GoogleFonts.inter(fontSize: 13),
          decoration: InputDecoration(
            isDense: true,
            contentPadding: const EdgeInsets.symmetric(
                horizontal: 12, vertical: 10),
            border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide:
                    const BorderSide(color: AppTheme.borderGray)),
            enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide:
                    const BorderSide(color: AppTheme.borderGray)),
            focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: const BorderSide(
                    color: AppTheme.amber, width: 1.5)),
          ),
        ),
      ],
    );
  }
}
