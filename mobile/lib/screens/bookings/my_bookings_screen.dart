import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_config.dart';
import '../../config/theme.dart';

class MyBookingsScreen extends StatefulWidget {
  const MyBookingsScreen({super.key});
  @override
  State<MyBookingsScreen> createState() => _MyBookingsScreenState();
}

class _MyBookingsScreenState extends State<MyBookingsScreen> with SingleTickerProviderStateMixin {
  late TabController _tab;

  // Track booking tab
  final _refCtrl = TextEditingController();
  bool _searching = false;
  Map<String, dynamic>? _result;
  String? _trackError;

  // History tab
  final _phoneCtrl = TextEditingController();
  bool _historyLoading = false;
  List<dynamic>? _history;
  String? _historyError;

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: 2, vsync: this);
    _tab.addListener(() { if (mounted) setState(() {}); });
  }

  @override
  void dispose() {
    _tab.dispose();
    _refCtrl.dispose();
    _phoneCtrl.dispose();
    super.dispose();
  }

  Future<void> _trackBooking() async {
    final ref = _refCtrl.text.trim();
    if (ref.isEmpty) {
      setState(() { _trackError = 'Enter your booking reference.'; _result = null; });
      return;
    }
    setState(() { _searching = true; _trackError = null; _result = null; });
    try {
      final uri = Uri.parse('${AppConfig.backendUrl}/bookings/${Uri.encodeComponent(ref)}');
      final res = await http.get(uri, headers: {'Accept': 'application/json'})
          .timeout(const Duration(seconds: 15));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body) as Map<String, dynamic>;
        setState(() { _result = data; _searching = false; });
        return;
      }
    } catch (_) {}
    setState(() { _searching = false; _trackError = 'Booking not found. Check your reference and try again.'; });
  }

  Future<void> _loadHistory() async {
    final digits = _phoneCtrl.text.replaceAll(RegExp(r'\D'), '');
    final phone = digits.length >= 10 ? digits.substring(digits.length - 10) : '';
    if (phone.length < 10) {
      setState(() { _historyError = 'Enter a valid 10-digit mobile number.'; _history = null; });
      return;
    }
    setState(() { _historyLoading = true; _historyError = null; _history = null; });
    try {
      final uri = Uri.parse('${AppConfig.apiUrl}/bookings/history?phone=$phone');
      final res = await http.get(uri, headers: {'Accept': 'application/json'})
          .timeout(const Duration(seconds: 15));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body) as Map<String, dynamic>;
        setState(() { _history = data['bookings'] as List? ?? []; _historyLoading = false; });
        return;
      }
    } catch (_) {}
    setState(() { _historyLoading = false; _historyError = 'Could not fetch bookings. Please try again.'; });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bg,
      body: CustomScrollView(slivers: [
        SliverAppBar(
          pinned: true,
          backgroundColor: AppTheme.primary,
          foregroundColor: Colors.white,
          title: Text('My Bookings',
              style: GoogleFonts.inter(fontWeight: FontWeight.w700, color: Colors.white)),
          bottom: TabBar(
            controller: _tab,
            labelColor: AppTheme.secondary,
            unselectedLabelColor: AppTheme.textGray,
            indicatorColor: AppTheme.secondary,
            labelStyle: GoogleFonts.inter(fontWeight: FontWeight.w600, fontSize: 13),
            tabs: const [Tab(text: 'Track Booking'), Tab(text: 'My History')],
          ),
        ),
        SliverFillRemaining(
          hasScrollBody: true,
          child: TabBarView(
            controller: _tab,
            children: [_buildTrack(), _buildHistory()],
          ),
        ),
      ]),
    );
  }

  Widget _buildTrack() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: const LinearGradient(colors: [Color(0xFF006CE4), Color(0xFF0055B3)]),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(children: [
            const Icon(Icons.confirmation_number_outlined, color: Colors.white, size: 36),
            const SizedBox(width: 14),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Track Your Booking', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white)),
              Text('Enter your booking reference (e.g. YLO-20260715-1234) below.',
                  style: GoogleFonts.inter(fontSize: 12, color: Colors.white70, height: 1.4)),
            ])),
          ]),
        ),
        const SizedBox(height: 24),
        Text('Booking Reference', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.charcoal)),
        const SizedBox(height: 8),
        TextFormField(
          controller: _refCtrl,
          style: GoogleFonts.inter(fontSize: 14),
          textCapitalization: TextCapitalization.characters,
          decoration: _inputDec('e.g. YLO-20260715-1234', Icons.tag),
        ),
        const SizedBox(height: 20),
        if (_trackError != null) ...[
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: const Color(0xFFFEE2E2), borderRadius: BorderRadius.circular(10)),
            child: Row(children: [
              const Icon(Icons.info_outline, color: AppTheme.red, size: 18),
              const SizedBox(width: 8),
              Expanded(child: Text(_trackError!, style: GoogleFonts.inter(fontSize: 12, color: AppTheme.red))),
            ]),
          ),
          const SizedBox(height: 16),
        ],
        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: _searching ? null : _trackBooking,
            icon: _searching
                ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                : const Icon(Icons.search),
            label: Text(_searching ? 'Searching...' : 'Track Booking',
                style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600)),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.secondary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ),
        if (_result != null) ...[
          const SizedBox(height: 24),
          _BookingResultCard(data: _result!),
        ],
        const SizedBox(height: 32),
        const Divider(color: AppTheme.borderGray),
        const SizedBox(height: 16),
        Text('Need help?', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.charcoal)),
        const SizedBox(height: 10),
        _HelpTile(Icons.chat_bubble_outline, 'WhatsApp Support', '+91-8427831127',
            onTap: () async {
              final u = Uri.parse(AppConfig.whatsappUrl('Hi! I need help with my booking.'));
              launchUri(u);
            }),
        const SizedBox(height: 8),
        _HelpTile(Icons.email_outlined, 'Email Us', AppConfig.contactEmail,
            onTap: () async {
              launchUri(Uri.parse('mailto:${AppConfig.contactEmail}?subject=Booking Enquiry'));
            }),
        const SizedBox(height: 20),
      ]),
    );
  }

  Widget _buildHistory() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: const LinearGradient(colors: [Color(0xFF1E3A5F), Color(0xFF006CE4)]),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(children: [
            const Icon(Icons.history, color: Colors.white, size: 36),
            const SizedBox(width: 14),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Your Trip History', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white)),
              Text('Enter the mobile number used while booking to see all your trips.',
                  style: GoogleFonts.inter(fontSize: 12, color: Colors.white70, height: 1.4)),
            ])),
          ]),
        ),
        const SizedBox(height: 24),
        Text('Mobile Number', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.charcoal)),
        const SizedBox(height: 8),
        Row(children: [
          Expanded(
            child: TextFormField(
              controller: _phoneCtrl,
              keyboardType: TextInputType.phone,
              style: GoogleFonts.inter(fontSize: 14),
              maxLength: 10,
              decoration: _inputDec('10-digit mobile number', Icons.phone_outlined).copyWith(counterText: ''),
            ),
          ),
          const SizedBox(width: 10),
          ElevatedButton(
            onPressed: _historyLoading ? null : _loadHistory,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.secondary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: _historyLoading
                ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                : const Icon(Icons.search, size: 20),
          ),
        ]),
        if (_historyError != null) ...[
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: const Color(0xFFFEE2E2), borderRadius: BorderRadius.circular(10)),
            child: Row(children: [
              const Icon(Icons.info_outline, color: AppTheme.red, size: 18),
              const SizedBox(width: 8),
              Expanded(child: Text(_historyError!, style: GoogleFonts.inter(fontSize: 12, color: AppTheme.red))),
            ]),
          ),
        ],
        if (_history != null) ...[
          const SizedBox(height: 20),
          if (_history!.isEmpty)
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(color: AppTheme.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.borderGray)),
              child: Column(children: [
                const Icon(Icons.luggage_outlined, size: 48, color: AppTheme.textGray),
                const SizedBox(height: 12),
                Text('No bookings found', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.primary)),
                const SizedBox(height: 6),
                Text('No trips found for this number.\nBookings made via WhatsApp may not appear here.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textGray, height: 1.5)),
              ]),
            )
          else ...[
            Text('${_history!.length} booking${_history!.length != 1 ? "s" : ""} found',
                style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textGray)),
            const SizedBox(height: 12),
            ..._history!.map((b) => _HistoryCard(booking: b as Map<String, dynamic>)),
          ],
        ],
        const SizedBox(height: 80),
      ]),
    );
  }

  InputDecoration _inputDec(String hint, IconData icon) => InputDecoration(
    hintText: hint,
    hintStyle: GoogleFonts.inter(fontSize: 13, color: AppTheme.textGray),
    prefixIcon: Icon(icon, size: 18, color: AppTheme.textGray),
    filled: true, fillColor: AppTheme.white,
    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: AppTheme.borderGray)),
    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: AppTheme.borderGray)),
    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppTheme.secondary, width: 1.5)),
  );
}

Future<void> launchUri(Uri uri) async {
  if (await canLaunchUrl(uri)) await launchUrl(uri, mode: LaunchMode.externalApplication);
}

class _HistoryCard extends StatelessWidget {
  final Map<String, dynamic> booking;
  const _HistoryCard({required this.booking});

  @override
  Widget build(BuildContext context) {
    final status = (booking['status'] as String? ?? 'pending').toLowerCase();
    final payStatus = (booking['paymentStatus'] as String? ?? 'unpaid').toLowerCase();
    final isConfirmed = status == 'confirmed' || status == 'completed';
    final isCancelled = status == 'cancelled';
    final statusColor = isConfirmed
        ? const Color(0xFF10B981)
        : isCancelled ? AppTheme.red : AppTheme.amber;

    String dateStr = '';
    try {
      final d = DateTime.parse(booking['travelDate'] as String);
      dateStr = '${d.day} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.month-1]} ${d.year}';
    } catch (_) {}

    final total = (booking['totalAmount'] as num?)?.toInt() ?? 0;
    final paid = (booking['paidAmount'] as num?)?.toInt() ?? 0;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: statusColor.withValues(alpha: 0.25)),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 8, offset: const Offset(0, 2))],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Expanded(
            child: Text(booking['tripTitle'] as String? ?? 'Trip',
                style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.primary),
                maxLines: 2, overflow: TextOverflow.ellipsis),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(color: statusColor.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(20)),
            child: Text(status.toUpperCase(),
                style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: statusColor)),
          ),
        ]),
        const SizedBox(height: 8),
        if ((booking['destination'] as String? ?? '').isNotEmpty)
          _InfoRow(Icons.location_on_outlined, booking['destination'] as String),
        if (dateStr.isNotEmpty) _InfoRow(Icons.calendar_today_outlined, dateStr),
        _InfoRow(Icons.people_outline, '${booking['guests'] ?? 1} guest(s)'),
        const SizedBox(height: 8),
        Row(children: [
          Text('₹${_fmt(paid)} paid',
              style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.secondary)),
          if (payStatus != 'paid') ...[
            Text(' of ₹${_fmt(total)}',
                style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textGray)),
          ],
          const Spacer(),
          Text(booking['bookingReference'] as String? ?? '',
              style: GoogleFonts.robotoMono(fontSize: 11, color: AppTheme.textGray)),
        ]),
      ]),
    );
  }

  String _fmt(int n) => n.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]},');

  Widget _InfoRow(IconData icon, String text) => Padding(
    padding: const EdgeInsets.only(bottom: 4),
    child: Row(children: [
      Icon(icon, size: 13, color: AppTheme.textGray),
      const SizedBox(width: 6),
      Text(text, style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textGray)),
    ]),
  );
}

class _BookingResultCard extends StatelessWidget {
  final Map<String, dynamic> data;
  const _BookingResultCard({required this.data});

  @override
  Widget build(BuildContext context) {
    final status = (data['status'] as String? ?? 'confirmed').toLowerCase();
    final statusColor = status == 'confirmed' || status == 'paid'
        ? const Color(0xFF10B981) : status == 'pending' ? AppTheme.amber : AppTheme.red;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: statusColor.withValues(alpha: 0.3)),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 10, offset: const Offset(0, 3))],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Icon(Icons.check_circle, color: statusColor, size: 20),
          const SizedBox(width: 8),
          Text('Booking Found', style: GoogleFonts.inter(fontWeight: FontWeight.w700, color: statusColor)),
          const Spacer(),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(color: statusColor.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(20)),
            child: Text(status.toUpperCase(),
                style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, color: statusColor)),
          ),
        ]),
        const Divider(height: 20, color: AppTheme.borderGray),
        if (data['tripTitle'] != null || data['productInfo'] != null)
          _Row('Trip', data['tripTitle'] ?? data['productInfo'] ?? ''),
        if (data['bookingReference'] != null) _Row('Reference', data['bookingReference']),
        if (data['customerName'] != null || data['name'] != null)
          _Row('Name', data['customerName'] ?? data['name'] ?? ''),
        if (data['travelDate'] != null) _Row('Travel Date', data['travelDate']),
        if (data['pax'] != null) _Row('Travellers', '${data['pax']}'),
        if (data['totalAmount'] != null)
          _Row('Total Amount', '₹${data['totalAmount']}'),
        if (data['chargeNow'] != null || data['partialPaid'] != null)
          _Row('Advance Paid', '₹${data['chargeNow'] ?? data['partialPaid']}'),
      ]),
    );
  }

  Widget _Row(String label, String value) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 4),
    child: Row(children: [
      SizedBox(width: 110, child: Text(label, style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textGray))),
      Expanded(child: Text(value, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.primary))),
    ]),
  );
}

class _HelpTile extends StatelessWidget {
  final IconData icon;
  final String title, subtitle;
  final VoidCallback onTap;
  const _HelpTile(this.icon, this.title, this.subtitle, {required this.onTap});

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.borderGray),
      ),
      child: Row(children: [
        Icon(icon, color: AppTheme.secondary, size: 20),
        const SizedBox(width: 12),
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(title, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600)),
          Text(subtitle, style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textGray)),
        ]),
        const Spacer(),
        const Icon(Icons.arrow_forward_ios, size: 14, color: AppTheme.textGray),
      ]),
    ),
  );
}
