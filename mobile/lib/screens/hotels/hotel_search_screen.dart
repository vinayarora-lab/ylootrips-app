import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_config.dart';
import '../../config/theme.dart';
import '../../services/api_service.dart';
import '../../widgets/booking_payment_sheet.dart';

class HotelSearchScreen extends StatefulWidget {
  final String? initialCity;
  final String? initialCheckIn;
  final String? initialCheckOut;
  final int? initialGuests;
  final bool autoSearch;
  const HotelSearchScreen({
    super.key,
    this.initialCity,
    this.initialCheckIn,
    this.initialCheckOut,
    this.initialGuests,
    this.autoSearch = false,
  });
  @override
  State<HotelSearchScreen> createState() => _HotelSearchScreenState();
}

class _HotelSearchScreenState extends State<HotelSearchScreen> {
  late String _city;
  late DateTime _checkIn;
  late DateTime _checkOut;
  late int _guests;
  bool _loading = false;
  List<dynamic> _results = [];
  bool _searched = false;

  @override
  void initState() {
    super.initState();
    _city = widget.initialCity ?? 'Jaipur';
    _checkIn = widget.initialCheckIn != null
        ? DateTime.tryParse(widget.initialCheckIn!) ?? DateTime.now().add(const Duration(days: 7))
        : DateTime.now().add(const Duration(days: 7));
    _checkOut = widget.initialCheckOut != null
        ? DateTime.tryParse(widget.initialCheckOut!) ?? DateTime.now().add(const Duration(days: 10))
        : DateTime.now().add(const Duration(days: 10));
    _guests = widget.initialGuests ?? 2;
    if (widget.autoSearch) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _search());
    }
  }

  static const _popularCities = [
    {'name': 'Jaipur',    'sub': 'Pink City',      'img': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80'},
    {'name': 'Udaipur',   'sub': 'City of Lakes',  'img': 'https://images.unsplash.com/photo-1587135991058-8816b028691f?w=600&q=80'},
    {'name': 'Goa',       'sub': 'Beach Paradise', 'img': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80'},
    {'name': 'Munnar',    'sub': 'Tea Valleys',    'img': 'https://images.unsplash.com/photo-1602301868083-a7e68ff87e04?w=600&q=80'},
    {'name': 'Manali',    'sub': 'Snow Peaks',     'img': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'},
    {'name': 'Srinagar',  'sub': 'Kashmir Valley', 'img': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'},
    {'name': 'Rishikesh', 'sub': 'Yoga Capital',   'img': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80'},
    {'name': 'Varanasi',  'sub': 'Spiritual City', 'img': 'https://images.unsplash.com/photo-1561361058-c24e01d62cfc?w=600&q=80'},
  ];

  int get _nights => _checkOut.difference(_checkIn).inDays;

  String _fmt(DateTime d) {
    const m = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return '${d.day} ${m[d.month]}';
  }

  Future<void> _search() async {
    if (_city.trim().isEmpty) return;
    setState(() { _loading = true; _searched = true; });
    final fmtDate = (DateTime d) => '${d.year}-${d.month.toString().padLeft(2,'0')}-${d.day.toString().padLeft(2,'0')}';
    final res = await ApiService().searchHotels(
      city: _city.trim(),
      checkIn: fmtDate(_checkIn),
      checkOut: fmtDate(_checkOut),
      guests: _guests,
    );
    if (mounted) {
      setState(() {
        _results = (res['hotels'] as List<dynamic>?) ?? [];
        _loading = false;
      });
    }
  }

  Future<void> _pickDate(bool isCheckIn) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: isCheckIn ? _checkIn : _checkOut,
      firstDate: isCheckIn ? DateTime.now() : _checkIn.add(const Duration(days: 1)),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(
          colorScheme: const ColorScheme.light(primary: AppTheme.secondary, onPrimary: Colors.white),
        ),
        child: child!,
      ),
    );
    if (picked == null) return;
    setState(() {
      if (isCheckIn) {
        _checkIn = picked;
        if (_checkOut.isBefore(_checkIn.add(const Duration(days: 1)))) {
          _checkOut = _checkIn.add(const Duration(days: 1));
        }
      } else {
        _checkOut = picked;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.cream,
      body: CustomScrollView(
        slivers: [
          _buildAppBar(),
          SliverToBoxAdapter(child: _buildSearchCard()),
          if (_loading)
            const SliverFillRemaining(
              child: Center(child: CircularProgressIndicator(color: AppTheme.secondary)))
          else if (_searched && _results.isEmpty)
            SliverToBoxAdapter(child: _buildEmpty())
          else if (_searched)
            ...[
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                  child: Row(children: [
                    Text('${_results.length} hotels in $_city',
                      style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.bold)),
                    const Spacer(),
                    Text('$_nights night${_nights != 1 ? 's' : ''}',
                      style: GoogleFonts.inter(fontSize: 13, color: AppTheme.secondary, fontWeight: FontWeight.w600)),
                  ]),
                ),
              ),
              SliverList(delegate: SliverChildBuilderDelegate(
                (_, i) => _HotelCard(
                  hotel: _results[i] as Map<String, dynamic>,
                  checkIn: _checkIn, checkOut: _checkOut,
                  city: _city, guests: _guests,
                ),
                childCount: _results.length,
              )),
            ]
          else
            SliverToBoxAdapter(child: _buildPopular()),
          const SliverToBoxAdapter(child: SizedBox(height: 80)),
        ],
      ),
    );
  }

  Widget _buildAppBar() {
    return SliverAppBar(
      pinned: true,
      elevation: 0,
      scrolledUnderElevation: 0.5,
      shadowColor: AppTheme.borderGray,
      backgroundColor: AppTheme.white,
      foregroundColor: AppTheme.primary,
      title: Row(children: [
        Container(
          width: 32, height: 32,
          decoration: BoxDecoration(color: AppTheme.primary, borderRadius: BorderRadius.circular(8)),
          child: const Icon(Icons.hotel_outlined, color: Colors.white, size: 18),
        ),
        const SizedBox(width: 10),
        Text('Hotel Search', style: GoogleFonts.playfairDisplay(
          fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primary)),
      ]),
    );
  }

  Widget _buildSearchCard() {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 16, offset: const Offset(0,4))],
      ),
      child: Column(children: [
        // City
        GestureDetector(
          onTap: _showCitySearch,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(color: AppTheme.cream, borderRadius: BorderRadius.circular(12)),
            child: Row(children: [
              Container(
                width: 36, height: 36,
                decoration: BoxDecoration(color: AppTheme.primary.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(9)),
                child: const Icon(Icons.location_on, color: AppTheme.secondary, size: 18),
              ),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('City or Destination', style: GoogleFonts.inter(fontSize: 10, color: AppTheme.textGray, fontWeight: FontWeight.w500)),
                Text(_city, style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w800, color: AppTheme.primary)),
              ])),
              const Icon(Icons.edit_location_alt_outlined, color: AppTheme.secondary, size: 18),
            ]),
          ),
        ),
        const SizedBox(height: 10),
        // Dates
        Row(children: [
          Expanded(child: GestureDetector(
            onTap: () => _pickDate(true),
            child: _DateBox(label: 'Check-in', day: _fmt(_checkIn), sub: _checkIn.year.toString()),
          )),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 8),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(color: AppTheme.secondary.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
            child: Column(children: [
              Text('$_nights', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w900, color: AppTheme.secondary)),
              Text('Nights', style: GoogleFonts.inter(fontSize: 9, color: AppTheme.secondary, fontWeight: FontWeight.w600)),
            ]),
          ),
          Expanded(child: GestureDetector(
            onTap: () => _pickDate(false),
            child: _DateBox(label: 'Check-out', day: _fmt(_checkOut), sub: _checkOut.year.toString()),
          )),
        ]),
        const SizedBox(height: 10),
        // Guests
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          decoration: BoxDecoration(color: AppTheme.cream, borderRadius: BorderRadius.circular(12)),
          child: Row(children: [
            Container(
              width: 36, height: 36,
              decoration: BoxDecoration(color: AppTheme.primary.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(9)),
              child: const Icon(Icons.people_alt_outlined, color: AppTheme.secondary, size: 18),
            ),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Guests', style: GoogleFonts.inter(fontSize: 10, color: AppTheme.textGray, fontWeight: FontWeight.w500)),
              Text('$_guests Adult${_guests > 1 ? 's' : ''}',
                style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.primary)),
            ])),
            GestureDetector(
              onTap: () { if (_guests > 1) setState(() => _guests--); },
              child: _CountBtn(icon: Icons.remove, enabled: _guests > 1),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              child: Text('$_guests', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w900, color: AppTheme.primary)),
            ),
            GestureDetector(
              onTap: () { if (_guests < 8) setState(() => _guests++); },
              child: _CountBtn(icon: Icons.add, enabled: true, filled: true),
            ),
          ]),
        ),
        const SizedBox(height: 14),
        SizedBox(
          width: double.infinity, height: 52,
          child: ElevatedButton.icon(
            onPressed: _loading ? null : _search,
            icon: _loading
              ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
              : const Icon(Icons.search_rounded, size: 20),
            label: Text(_loading ? 'Searching...' : 'Search Hotels',
              style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700)),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primary,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              elevation: 0,
            ),
          ),
        ),
      ]),
    );
  }

  void _showCitySearch() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _CitySheet(
        cities: _popularCities.map((c) => c['name']!).toList(),
        onSelect: (c) { setState(() => _city = c); },
      ),
    );
  }

  Widget _buildPopular() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('Popular Destinations', style: GoogleFonts.playfairDisplay(fontSize: 22, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Text('Top picks for your next stay', style: GoogleFonts.inter(fontSize: 13, color: AppTheme.textGray)),
        const SizedBox(height: 16),
        GridView.builder(
          physics: const NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2, childAspectRatio: 1.2,
            crossAxisSpacing: 10, mainAxisSpacing: 10,
          ),
          itemCount: _popularCities.length,
          itemBuilder: (_, i) {
            final c = _popularCities[i];
            return GestureDetector(
              onTap: () { setState(() => _city = c['name']!); _search(); },
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Stack(fit: StackFit.expand, children: [
                  Image.network(
                    c['img']!,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(color: AppTheme.creamDark),
                  ),
                  const DecoratedBox(decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter, end: Alignment.bottomCenter,
                      colors: [Colors.transparent, Color(0xDD000000)],
                      stops: [0.3, 1.0],
                    ),
                  )),
                  Positioned(bottom: 12, left: 12, right: 12, child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(c['name']!, style: GoogleFonts.playfairDisplay(
                        fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                      Text(c['sub']!, style: GoogleFonts.inter(
                        fontSize: 11, color: Colors.white70)),
                    ],
                  )),
                ]),
              ),
            );
          },
        ),
      ]),
    );
  }

  Widget _buildEmpty() {
    return Padding(
      padding: const EdgeInsets.all(40),
      child: Column(children: [
        const SizedBox(height: 20),
        Container(
          width: 72, height: 72,
          decoration: BoxDecoration(color: AppTheme.creamDark, shape: BoxShape.circle),
          child: const Icon(Icons.hotel_outlined, size: 36, color: AppTheme.textGray),
        ),
        const SizedBox(height: 16),
        Text('No hotels found in $_city',
          style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        Text('Try a different city or contact our travel experts',
          textAlign: TextAlign.center,
          style: GoogleFonts.inter(fontSize: 13, color: AppTheme.textGray, height: 1.5)),
        const SizedBox(height: 24),
        ElevatedButton.icon(
          onPressed: () async {
            final url = Uri.parse(AppConfig.whatsappUrl('Hi! I need help finding hotels in $_city.'));
            if (await canLaunchUrl(url)) launchUrl(url, mode: LaunchMode.externalApplication);
          },
          icon: const Icon(Icons.chat_rounded, size: 18),
          label: const Text('Ask on WhatsApp'),
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF25D366),
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          ),
        ),
      ]),
    );
  }
}

// ── Date Box ─────────────────────────────────────────────────────────────────
class _DateBox extends StatelessWidget {
  final String label, day, sub;
  const _DateBox({required this.label, required this.day, required this.sub});

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(color: AppTheme.cream, borderRadius: BorderRadius.circular(12)),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: GoogleFonts.inter(fontSize: 10, color: AppTheme.textGray, fontWeight: FontWeight.w500)),
      const SizedBox(height: 2),
      Text(day, style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w800, color: AppTheme.primary)),
      Text(sub, style: GoogleFonts.inter(fontSize: 10, color: AppTheme.textGray)),
    ]),
  );
}

// ── Count Button ─────────────────────────────────────────────────────────────
class _CountBtn extends StatelessWidget {
  final IconData icon;
  final bool enabled;
  final bool filled;
  const _CountBtn({required this.icon, required this.enabled, this.filled = false});

  @override
  Widget build(BuildContext context) => Container(
    width: 30, height: 30,
    decoration: BoxDecoration(
      color: filled ? AppTheme.secondary : Colors.transparent,
      border: Border.all(color: enabled ? AppTheme.secondary : AppTheme.borderGray),
      borderRadius: BorderRadius.circular(8),
    ),
    child: Icon(icon, size: 14, color: filled ? Colors.white : (enabled ? AppTheme.secondary : AppTheme.borderGray)),
  );
}

// ── City Search Sheet ─────────────────────────────────────────────────────────
class _CitySheet extends StatefulWidget {
  final List<String> cities;
  final ValueChanged<String> onSelect;
  const _CitySheet({required this.cities, required this.onSelect});

  @override
  State<_CitySheet> createState() => _CitySheetState();
}

class _CitySheetState extends State<_CitySheet> {
  String _q = '';
  final _ctrl = TextEditingController();

  static const _allCities = [
    'Jaipur','Udaipur','Goa','Munnar','Manali','Srinagar','Rishikesh','Varanasi',
    'Darjeeling','Ooty','Coorg','Shimla','Mussoorie','Nainital','McLeod Ganj',
    'Agra','Jodhpur','Pushkar','Ranthambore','Kolkata','Mumbai','Delhi','Bangalore',
    'Chennai','Hyderabad','Kochi','Amritsar','Mysore',
  ];

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final filtered = _allCities.where((c) => c.toLowerCase().contains(_q.toLowerCase())).toList();
    return Container(
      height: MediaQuery.of(context).size.height * 0.75,
      decoration: const BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(children: [
        const SizedBox(height: 8),
        Container(width: 40, height: 4, decoration: BoxDecoration(color: AppTheme.borderGray, borderRadius: BorderRadius.circular(2))),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Select Destination', style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            TextField(
              controller: _ctrl,
              autofocus: true,
              onChanged: (v) => setState(() => _q = v),
              style: GoogleFonts.inter(fontSize: 14),
              decoration: InputDecoration(
                hintText: 'Search city...',
                prefixIcon: const Icon(Icons.search, color: AppTheme.secondary),
                filled: true,
                fillColor: AppTheme.cream,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              ),
            ),
          ]),
        ),
        Expanded(child: ListView.builder(
          itemCount: filtered.length,
          itemBuilder: (_, i) => ListTile(
            leading: Container(
              width: 40, height: 40,
              decoration: BoxDecoration(color: AppTheme.creamDark, borderRadius: BorderRadius.circular(10)),
              child: const Icon(Icons.location_city_outlined, color: AppTheme.secondary, size: 20),
            ),
            title: Text(filtered[i], style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600)),
            subtitle: Text('India', style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textGray)),
            trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: AppTheme.textGray),
            onTap: () {
              widget.onSelect(filtered[i]);
              Navigator.pop(context);
            },
          ),
        )),
      ]),
    );
  }
}

// ── Hotel Card ────────────────────────────────────────────────────────────────
class _HotelCard extends StatelessWidget {
  final Map<String, dynamic> hotel;
  final DateTime checkIn, checkOut;
  final String city;
  final int guests;

  const _HotelCard({
    required this.hotel, required this.checkIn,
    required this.checkOut, required this.city, required this.guests,
  });

  @override
  Widget build(BuildContext context) {
    final nights = checkOut.difference(checkIn).inDays;
    final pricePerNight = (hotel['pricePerNight'] as num?)?.toInt() ?? 2999;
    final totalPrice = pricePerNight * nights;
    final rating = double.tryParse(hotel['rating']?.toString() ?? '4.0') ?? 4.0;
    final thumbnail = hotel['thumbnail'] as String? ?? '';
    final amenities = (hotel['amenities'] as List<dynamic>? ?? []).take(3).toList();

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.07), blurRadius: 16, offset: const Offset(0,4))],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // Image
        ClipRRect(
          borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
          child: Stack(children: [
            thumbnail.isNotEmpty
              ? Image.network(
                  thumbnail,
                  height: 180,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(height: 180, color: AppTheme.creamDark,
                    child: const Center(child: Icon(Icons.hotel_outlined, size: 48, color: AppTheme.textGray))),
                )
              : Container(height: 180, color: AppTheme.creamDark,
                  child: const Center(child: Icon(Icons.hotel_outlined, size: 48, color: AppTheme.textGray))),
            // Gradient overlay
            Positioned.fill(child: DecoratedBox(decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter, end: Alignment.bottomCenter,
                colors: [Colors.transparent, Colors.black.withValues(alpha: 0.3)],
                stops: const [0.5, 1.0],
              ),
            ))),
            // Rating badge
            Positioned(top: 12, right: 12, child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
              child: Row(mainAxisSize: MainAxisSize.min, children: [
                const Icon(Icons.star_rounded, size: 14, color: Color(0xFFF59E0B)),
                const SizedBox(width: 3),
                Text(rating.toStringAsFixed(1),
                  style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w800, color: AppTheme.primary)),
              ]),
            )),
          ]),
        ),
        // Details
        Padding(
          padding: const EdgeInsets.all(14),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              const Icon(Icons.location_on, size: 12, color: AppTheme.secondary),
              const SizedBox(width: 3),
              Text(hotel['location'] ?? city,
                style: GoogleFonts.inter(fontSize: 11, color: AppTheme.secondary, fontWeight: FontWeight.w600)),
            ]),
            const SizedBox(height: 4),
            Text(hotel['name'] ?? 'Hotel',
              style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w800, color: AppTheme.primary),
              maxLines: 2, overflow: TextOverflow.ellipsis),
            if (amenities.isNotEmpty) ...[
              const SizedBox(height: 8),
              Wrap(spacing: 6, runSpacing: 4, children: amenities.map((a) => Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppTheme.cream, borderRadius: BorderRadius.circular(20)),
                child: Text(a.toString(), style: GoogleFonts.inter(
                  fontSize: 10, color: AppTheme.secondary, fontWeight: FontWeight.w500)),
              )).toList()),
            ],
            const SizedBox(height: 12),
            const Divider(height: 1, color: AppTheme.borderGray),
            const SizedBox(height: 12),
            Row(children: [
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Per night', style: GoogleFonts.inter(fontSize: 10, color: AppTheme.textGray)),
                Text('₹${_fmt(pricePerNight)}',
                  style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w900, color: AppTheme.primary)),
                Text('Total: ₹${_fmt(totalPrice)} · $nights nights',
                  style: GoogleFonts.inter(fontSize: 10, color: AppTheme.textGray)),
              ]),
              const Spacer(),
              ElevatedButton(
                onPressed: () => showBookingPaymentSheet(
                  context,
                  type: 'hotel',
                  title: hotel['name'] ?? 'Hotel Booking',
                  price: pricePerNight,
                  extraData: {
                    'hotelName': hotel['name'],
                    'city': city,
                    'checkIn': checkIn.toIso8601String().split('T').first,
                    'checkOut': checkOut.toIso8601String().split('T').first,
                    'nights': nights, 'guests': guests,
                  },
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.secondary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 0,
                ),
                child: Text('Book Now', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700)),
              ),
            ]),
          ]),
        ),
      ]),
    );
  }

  String _fmt(int n) {
    if (n < 1000) return n.toString();
    final s = n.toString();
    if (s.length <= 3) return s;
    final buf = StringBuffer();
    final rem = (s.length - 3) % 2;
    int i = 0;
    if (rem != 0) { buf.write(s.substring(0, rem)); buf.write(','); i = rem; }
    while (i < s.length - 3) { buf.write(s.substring(i, i+2)); buf.write(','); i += 2; }
    buf.write(s.substring(s.length - 3));
    return buf.toString();
  }
}
