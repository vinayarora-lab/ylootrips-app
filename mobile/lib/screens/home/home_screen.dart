import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_config.dart';
import '../../config/theme.dart';
import '../../models/package.dart';
import '../../providers/currency_provider.dart';
import '../../providers/wallet_provider.dart';
import '../../providers/remote_config_provider.dart';
import '../../services/api_service.dart';
import '../../services/analytics_service.dart';

enum _Tab { flights, hotels, packages, planner }

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  _Tab _tab = _Tab.flights;
  List<TourPackage> _packages = [];
  bool _loading = true;
  int _bannerIdx = 0;
  final _pageCtrl = PageController();
  final _scrollCtrl = ScrollController();
  bool _headerSolid = false;
  int _tickerIdx = 0;

  // Flights
  String _from = 'DEL', _fromName = 'New Delhi';
  String _to = 'BOM', _toName = 'Mumbai';
  DateTime _flightDate = DateTime.now().add(const Duration(days: 7));
  DateTime _returnDate = DateTime.now().add(const Duration(days: 14));
  bool _flightRoundTrip = false;
  int _passengers = 1;

  // Hotels
  final _cityCtrl = TextEditingController(text: 'Jaipur');
  DateTime _checkIn  = DateTime.now().add(const Duration(days: 7));
  DateTime _checkOut = DateTime.now().add(const Duration(days: 10));
  int _hotelGuests = 2;

  // Packages
  final _pkgSearchCtrl = TextEditingController();
  String _pkgCategory = 'all';



  // Quick actions are now fully remote-configurable from admin panel.
  // Fallback icons used when icon name from remote config is not recognised.
  static IconData _iconFromName(String name) {
    const map = {
      'flight': Icons.flight_rounded,
      'hotel': Icons.hotel_rounded,
      'beach_access': Icons.beach_access_rounded,
      'directions_bus': Icons.directions_bus_rounded,
      'directions_car': Icons.directions_car_rounded,
      'flight_land': Icons.flight_land_rounded,
      'auto_awesome': Icons.auto_awesome,
      'local_offer': Icons.local_offer_rounded,
      'train': Icons.train_rounded,
      'sailing': Icons.sailing_rounded,
      'favorite': Icons.favorite_rounded,
      'map': Icons.map_rounded,
      'star': Icons.star_rounded,
      'camera': Icons.camera_alt_rounded,
      'card_giftcard': Icons.card_giftcard,
      'diamond': Icons.diamond_rounded,
    };
    return map[name] ?? Icons.explore_rounded;
  }

  static Color _colorFromHex(String hex) {
    try {
      return Color(int.parse('FF${hex.replaceAll('#', '')}', radix: 16));
    } catch (_) {
      return const Color(0xFF006CE4);
    }
  }

  static const _tickerMsgs = [
    '🔴 Priya from Mumbai booked Kashmir Package — 2 hrs ago',
    '🔥 47 bookings today · 3 seats left on Goa Beach package',
    '🔴 Rajesh & Family booked Rajasthan Heritage — 5 hrs ago',
    '⚡ Flash Sale active · Bali down ₹5,000 · Book today',
    '🔴 Sarah from London booked Golden Triangle — 1 hr ago',
    '💍 Neha & Rohan booked Maldives Honeymoon — 3 hrs ago',
  ];

  // Snippet from real reviews
  static const _miniReviews = [
    ('Sagar', '🇮🇳', 'Kashmir Tour',
     'Our Kashmir trip with YLOO Trips was absolutely wonderful. Every moment was memorable.',
     'https://www.ylootrips.com/reviews/sagar-kashmir.jpg'),
    ('Neha & Rohan', '🇮🇳', 'Bali Honeymoon',
     'Humari Bali honeymoon bilkul sapne jaisi thi! YlooTrips ne har cheez arrange ki. 🙏',
     'https://www.ylootrips.com/reviews/neha-rohan-bali.jpg'),
    ('Sarah Mitchell', '🇺🇸', 'Golden Triangle',
     'The Taj Mahal at sunrise was indescribable — I still get chills. Absolutely seamless.',
     'https://www.ylootrips.com/reviews/sarah-mitchell-india.jpg'),
    ('Lachlan B.', '🇦🇺', 'Rajasthan Heritage',
     'Rajasthan blew my mind. Stayed in boutique heritage properties every night. 100% booking again.',
     'https://www.ylootrips.com/reviews/lachlan-rajasthan.jpg'),
  ];

  @override
  void initState() {
    super.initState();
    AnalyticsService.screen('home');
    _loadPackages();
    _autoBanner();
    _autoTicker();
    _scrollCtrl.addListener(() {
      final solid = _scrollCtrl.offset > 200;
      if (solid != _headerSolid) setState(() => _headerSolid = solid);
    });
    WidgetsBinding.instance.addPostFrameCallback((_) => _checkWelcomeCredit());
  }

  void _autoTicker() {
    Future.delayed(const Duration(seconds: 4), () {
      if (!mounted) return;
      setState(() => _tickerIdx = (_tickerIdx + 1) % _tickerMsgs.length);
      _autoTicker();
    });
  }

  Future<void> _checkWelcomeCredit() async {
    if (!mounted) return;
    final wallet = context.read<WalletProvider>();
    final isNew = await wallet.grantWelcomeCredit();
    if (isNew && mounted) {
      await Future.delayed(const Duration(milliseconds: 800));
      if (mounted) _showWelcomeDialog();
    }
  }

  void _showWelcomeDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => const _WelcomeCreditDialog(),
    );
  }

  @override
  void dispose() {
    _pageCtrl.dispose();
    _scrollCtrl.dispose();
    _cityCtrl.dispose();
    _pkgSearchCtrl.dispose();
    super.dispose();
  }

  void _autoBanner() {
    Future.delayed(const Duration(seconds: 5), () {
      if (!mounted) return;
      final count = context.read<RemoteConfigProvider>().banners.length;
      final next = (_bannerIdx + 1) % (count > 0 ? count : 4);
      if (_pageCtrl.hasClients) {
        _pageCtrl.animateToPage(next, duration: const Duration(milliseconds: 700), curve: Curves.easeInOut);
      }
      setState(() => _bannerIdx = next);
      _autoBanner();
    });
  }

  Future<void> _loadPackages() async {
    final pkgs = await ApiService().getPackages();
    if (mounted) setState(() { _packages = pkgs.isEmpty ? demoPackages : pkgs; _loading = false; });
  }

  RemoteConfigProvider get _rc => context.read<RemoteConfigProvider>();

  void _goPackage(TourPackage pkg) => context.push('/package', extra: {
    'id': pkg.id, 'title': pkg.title, 'destination': pkg.destination,
    'imageUrl': pkg.imageUrl, 'price': pkg.price, 'rating': pkg.rating,
    'reviews': pkg.reviews, 'nights': pkg.nights, 'days': pkg.days,
    'description': pkg.description, 'highlights': pkg.highlights,
    'category': pkg.category, 'discount': pkg.discount, 'slug': pkg.slug,
  });

  String _fmt(DateTime d) {
    const m = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return '${d.day} ${m[d.month]}';
  }

  @override
  Widget build(BuildContext context) {
    final rc = context.watch<RemoteConfigProvider>();
    return Scaffold(
      backgroundColor: AppTheme.bg,
      body: CustomScrollView(
        controller: _scrollCtrl,
        slivers: [
          // ── Announcement bar (remote-controlled) ────────────────────────
          if (rc.showAnnouncement)
            SliverToBoxAdapter(child: _announcementBar(rc)),
          // ── MMT-style blue sticky header ──────────────────────────────────
          SliverAppBar(
            pinned: true,
            floating: false,
            elevation: 0,
            scrolledUnderElevation: 0,
            backgroundColor: AppTheme.primary,
            surfaceTintColor: Colors.transparent,
            toolbarHeight: 60,
            title: Row(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Image.asset(
                  'assets/images/logo.png',
                  height: 32,
                  fit: BoxFit.contain,
                  color: Colors.white,
                  errorBuilder: (_, __, ___) => Text(
                    'YlooTrips',
                    style: GoogleFonts.playfairDisplay(fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white),
                  ),
                ),
                const SizedBox(width: 8),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text('YlooTrips', style: GoogleFonts.playfairDisplay(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white, letterSpacing: -0.3)),
                    Text('Luxury India Travel', style: GoogleFonts.inter(fontSize: 9, color: Colors.white60)),
                  ],
                ),
              ],
            ),
            actions: [
              // Wallet balance — green pill
              GestureDetector(
                onTap: () => context.go('/cashback'),
                child: Container(
                  margin: const EdgeInsets.only(right: 6),
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFF059669),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [BoxShadow(color: const Color(0xFF059669).withValues(alpha: 0.4), blurRadius: 8, offset: const Offset(0, 2))],
                  ),
                  child: Row(mainAxisSize: MainAxisSize.min, children: [
                    const Icon(Icons.account_balance_wallet_rounded, size: 13, color: Colors.white),
                    const SizedBox(width: 4),
                    Consumer<WalletProvider>(
                      builder: (_, w, __) => Text(
                        '₹${w.balance.toStringAsFixed(0)}',
                        style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w800, color: Colors.white),
                      ),
                    ),
                  ]),
                ),
              ),
              GestureDetector(
                onTap: () => context.push('/my-bookings'),
                child: Container(
                  margin: const EdgeInsets.only(right: 4),
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.white24),
                  ),
                  child: Row(mainAxisSize: MainAxisSize.min, children: [
                    const Icon(Icons.confirmation_number_outlined, size: 13, color: Colors.white),
                    const SizedBox(width: 4),
                    Text('Trips', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.white)),
                  ]),
                ),
              ),
              const SizedBox(width: 4),
            ],
          ),

          // ── Hero banner ───────────────────────────────────────────────────
          SliverToBoxAdapter(child: _heroBanner()),

          // ── Search card (overlaps hero from below — fully tappable) ───────
          SliverToBoxAdapter(child: Container(
            margin: EdgeInsets.fromLTRB(12, kIsWeb ? 8 : -72, 12, 0),
            child: _searchCard(rc),
          )),

          // ── Live booking ticker ───────────────────────────────────────────
          SliverToBoxAdapter(child: _liveTicker()),

          // ── Quick actions ─────────────────────────────────────────────────
          SliverToBoxAdapter(child: _quickActionsGrid()),
          SliverToBoxAdapter(child: Container(height: 8, color: const Color(0xFFF3F4F6))),

          // ── Stats bar ─────────────────────────────────────────────────────
          SliverToBoxAdapter(child: _statsBar()),
          SliverToBoxAdapter(child: Container(height: 8, color: const Color(0xFFF3F4F6))),

          // ── EMI banner ────────────────────────────────────────────────────
          SliverToBoxAdapter(child: _emiBanner()),
          SliverToBoxAdapter(child: Container(height: 8, color: const Color(0xFFF3F4F6))),

          // ── Deals strip ───────────────────────────────────────────────────
          SliverToBoxAdapter(child: _dealsStrip()),
          SliverToBoxAdapter(child: Container(height: 8, color: const Color(0xFFF3F4F6))),

          // ── Only on YlooTrips (unique features) ──────────────────────────
          SliverToBoxAdapter(child: _uniqueFeaturesSection()),
          SliverToBoxAdapter(child: Container(height: 8, color: const Color(0xFFF3F4F6))),

          // ── Trending ──────────────────────────────────────────────────────
          SliverToBoxAdapter(child: _sectionHeader('Top Destinations', 'Most booked this season', onMore: () => context.go('/trips'))),
          SliverToBoxAdapter(child: _trendingRow()),
          SliverToBoxAdapter(child: Container(height: 8, color: const Color(0xFFF3F4F6))),

          // ── Category tiles ────────────────────────────────────────────────
          SliverToBoxAdapter(child: _sectionHeader('Browse by Style', 'Find your perfect travel type')),
          SliverToBoxAdapter(child: _categoryGrid()),
          SliverToBoxAdapter(child: Container(height: 8, color: const Color(0xFFF3F4F6))),

          // ── Hidden Gems & Secret Places ───────────────────────────────────
          SliverToBoxAdapter(child: _sectionHeader('Hidden Gems', '🗺️ Secret places only locals know', onMore: () => context.go('/trips'))),
          SliverToBoxAdapter(child: _hiddenGemsSection()),
          SliverToBoxAdapter(child: Container(height: 8, color: const Color(0xFFF3F4F6))),

          // ── Trip segments ─────────────────────────────────────────────────
          SliverToBoxAdapter(child: _sectionHeader('Plan by Trip Type', 'Honeymoon · Family · Group · Solo')),
          SliverToBoxAdapter(child: _segmentsSection()),
          SliverToBoxAdapter(child: Container(height: 8, color: const Color(0xFFF3F4F6))),

          // ── Featured packages ─────────────────────────────────────────────
          SliverToBoxAdapter(child: _sectionHeader('Featured Packages', 'Curated luxury experiences', onMore: () => context.go('/trips'))),
          SliverToBoxAdapter(child: _featuredPackages()),
          SliverToBoxAdapter(child: Container(height: 8, color: const Color(0xFFF3F4F6))),

          // ── Best Time to Visit Guide ─────────────────────────────────────
          SliverToBoxAdapter(child: _sectionHeader('Best Time to Visit', '📅 Month-by-month travel calendar', onMore: null)),
          SliverToBoxAdapter(child: _bestTimeSection()),
          SliverToBoxAdapter(child: Container(height: 8, color: const Color(0xFFF3F4F6))),

          // ── Events & Group bookings ───────────────────────────────────────
          SliverToBoxAdapter(child: _eventsSection()),
          SliverToBoxAdapter(child: Container(height: 8, color: const Color(0xFFF3F4F6))),

          // ── International trips ───────────────────────────────────────────────
          SliverToBoxAdapter(child: _sectionHeader('International Trips', 'Flight + Hotel + Visa · All-in price', onMore: () => context.go('/trips'))),
          SliverToBoxAdapter(child: _internationalTrips()),
          SliverToBoxAdapter(child: Container(height: 8, color: const Color(0xFFF3F4F6))),

          // ── Flight Booking Timing Guide ───────────────────────────────────
          SliverToBoxAdapter(child: _sectionHeader('Flight Booking Guide', '✈️ When to book for the cheapest fares', onMore: null)),
          SliverToBoxAdapter(child: _flightTimingGuide()),
          SliverToBoxAdapter(child: Container(height: 8, color: const Color(0xFFF3F4F6))),

          // ── International SIM card ────────────────────────────────────────
          SliverToBoxAdapter(child: _simCardSection()),
          SliverToBoxAdapter(child: Container(height: 8, color: const Color(0xFFF3F4F6))),

          // ── Free Forex Card ───────────────────────────────────────────────
          SliverToBoxAdapter(child: _forexCardSection()),
          SliverToBoxAdapter(child: Container(height: 8, color: const Color(0xFFF3F4F6))),

          // ── Why YlooTrips vs competitors ─────────────────────────────────────
          SliverToBoxAdapter(child: _sectionHeader('Why Choose YlooTrips?', 'Compare with top travel brands')),
          SliverToBoxAdapter(child: _whyUsSection()),
          SliverToBoxAdapter(child: Container(height: 8, color: const Color(0xFFF3F4F6))),

          // ── Reviews strip ─────────────────────────────────────────────────
          SliverToBoxAdapter(child: _sectionHeader('What Travellers Say', '4.9★ · 2,400+ verified reviews', onMore: () => context.push('/reviews'))),
          SliverToBoxAdapter(child: _reviewsStrip()),
          SliverToBoxAdapter(child: Container(height: 8, color: const Color(0xFFF3F4F6))),

          // ── Credentials bar ───────────────────────────────────────────────
          SliverToBoxAdapter(child: _credentialsBar()),

          // ── Trust + CTA ───────────────────────────────────────────────────
          SliverToBoxAdapter(child: _trustCTA()),

          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }

  // ── Announcement bar (shown when rc.showAnnouncement is true) ─────────────
  Widget _announcementBar(RemoteConfigProvider rc) {
    Color barColor;
    try {
      final hex = rc.announcementColor.replaceFirst('#', 'FF');
      barColor = Color(int.parse(hex, radix: 16));
    } catch (_) {
      barColor = const Color(0xFFDC2626);
    }
    return Container(
      width: double.infinity,
      color: barColor,
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Row(children: [
        const Icon(Icons.campaign_rounded, color: Colors.white, size: 16),
        const SizedBox(width: 8),
        Expanded(child: Text(rc.announcement,
            style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.white))),
      ]),
    );
  }

  // ── Hero banner (pure image + text, no search card inside) ───────────────
  Widget _heroBanner() {
    final banners = _rc.banners;
    final bannerLabels = _rc.bannerLabels;
    return SizedBox(
      height: 340,
      child: Stack(children: [
        PageView.builder(
          controller: _pageCtrl,
          onPageChanged: (i) => setState(() => _bannerIdx = i),
          itemCount: banners.length,
          itemBuilder: (_, i) => CachedNetworkImage(imageUrl: banners[i], fit: BoxFit.cover,
              placeholder: (_, __) => Container(color: const Color(0xFF1a3c34))),
        ),
        // Dark gradient: top for appbar, bottom for text
        DecoratedBox(decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter, end: Alignment.bottomCenter,
            colors: [
              Colors.black.withValues(alpha: 0.60),
              Colors.black.withValues(alpha: 0.00),
              Colors.black.withValues(alpha: 0.82),
            ],
            stops: const [0.0, 0.38, 1.0],
          ),
        )),
        // Location + Hero text
        Positioned(left: 20, right: 20, bottom: 60, child: Column(
          crossAxisAlignment: CrossAxisAlignment.start, children: [
            if (bannerLabels.length > _bannerIdx)
              Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.18),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.white24),
                ),
                child: Row(mainAxisSize: MainAxisSize.min, children: [
                  const Icon(Icons.location_on_rounded, size: 12, color: Colors.white70),
                  const SizedBox(width: 4),
                  Text(bannerLabels[_bannerIdx], style: GoogleFonts.inter(fontSize: 11, color: Colors.white, fontWeight: FontWeight.w500)),
                ]),
              ),
            Text(_rc.heroTitle, style: GoogleFonts.inter(
              fontSize: 30, fontWeight: FontWeight.w800, color: Colors.white, height: 1.15, letterSpacing: -0.5)),
            const SizedBox(height: 14),
            Row(children: [
              _HeroPill(Icons.people_outline, _rc.heroPill1),
              const SizedBox(width: 8),
              _HeroPill(Icons.star_rounded, _rc.heroPill2),
              const SizedBox(width: 8),
              _HeroPill(Icons.public, _rc.heroPill3),
            ]),
          ],
        )),
        // Dot indicator
        Positioned(bottom: 12, right: 20, child: Row(
          children: List.generate(banners.length, (i) => AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            width: _bannerIdx == i ? 22 : 5, height: 5,
            margin: const EdgeInsets.only(left: 4),
            decoration: BoxDecoration(
              color: _bannerIdx == i ? Colors.white : Colors.white38,
              borderRadius: BorderRadius.circular(3),
            ),
          )),
        )),
      ]),
    );
  }

  Widget _searchCard(RemoteConfigProvider rc) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.14), blurRadius: 28, offset: const Offset(0, 8)),
          BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 6, offset: const Offset(0, 2)),
        ],
      ),
      child: Column(children: [
        // Tab row — website style pill tabs inside cream bg container
        Padding(
          padding: const EdgeInsets.fromLTRB(10, 10, 10, 0),
          child: Container(
            padding: const EdgeInsets.all(3),
            decoration: BoxDecoration(
              color: AppTheme.primaryLight,
              borderRadius: BorderRadius.circular(13),
            ),
            child: Row(children: [
              if (rc.tabFlights)  _STab(Icons.flight_rounded,  'Flights',  _tab == _Tab.flights,  () => setState(() => _tab = _Tab.flights)),
              if (rc.tabHotels)   _STab(Icons.hotel_rounded,   'Hotels',   _tab == _Tab.hotels,   () => setState(() => _tab = _Tab.hotels)),
              if (rc.tabHolidays) _STab(Icons.luggage_rounded, 'Holidays', _tab == _Tab.packages, () => setState(() => _tab = _Tab.packages)),
              if (rc.tabAIPlanner)_STab(Icons.auto_awesome,    'AI Plan',  _tab == _Tab.planner,  () => setState(() => _tab = _Tab.planner)),
            ]),
          ),
        ),
        const SizedBox(height: 12),
        AnimatedSize(
          duration: const Duration(milliseconds: 220),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
            child: _searchForm(),
          ),
        ),
      ]),
    );
  }

  Widget _searchForm() {
    switch (_tab) {

      // ── FLIGHTS ────────────────────────────────────────────────────────────
      case _Tab.flights:
        return Column(key: const ValueKey('f'), mainAxisSize: MainAxisSize.min, children: [
          // One-way / Round-trip toggle
          Container(
            padding: const EdgeInsets.all(3),
            decoration: BoxDecoration(
              color: AppTheme.cream,
              borderRadius: BorderRadius.circular(11),
              border: Border.all(color: const Color(0xFFE5E7EB)),
            ),
            child: Row(children: [
              _TripChip('One-way', !_flightRoundTrip, () => setState(() => _flightRoundTrip = false)),
              _TripChip('Round Trip', _flightRoundTrip, () => setState(() => _flightRoundTrip = true)),
            ]),
          ),
          const SizedBox(height: 10),
          // From / Swap / To
          Row(children: [
            Expanded(child: _Field(
              icon: Icons.flight_takeoff_rounded,
              top: 'From',
              bottom: '$_fromName · $_from',
              onTap: () => _pickCode(true),
            )),
            GestureDetector(
              onTap: () => setState(() {
                final tc = _from; _from = _to; _to = tc;
                final tn = _fromName; _fromName = _toName; _toName = tn;
              }),
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 8),
                width: 34, height: 34,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFFE5E7EB)),
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 4)],
                ),
                child: const Icon(Icons.swap_horiz_rounded, size: 18, color: Color(0xFFD97706)),
              ),
            ),
            Expanded(child: _Field(
              icon: Icons.flight_land_rounded,
              top: 'To',
              bottom: '$_toName · $_to',
              onTap: () => _pickCode(false),
            )),
          ]),
          const SizedBox(height: 10),
          // Date(s) row
          Row(children: [
            Expanded(child: _Field(
              icon: Icons.calendar_month_rounded,
              top: _flightRoundTrip ? 'Depart' : 'Date',
              bottom: _fmt(_flightDate),
              onTap: () async {
                final d = await showDatePicker(context: context, initialDate: _flightDate,
                    firstDate: DateTime.now(), lastDate: DateTime.now().add(const Duration(days: 365)));
                if (d != null) setState(() {
                  _flightDate = d;
                  if (_returnDate.isBefore(d.add(const Duration(days: 1)))) {
                    _returnDate = d.add(const Duration(days: 7));
                  }
                });
              },
            )),
            if (_flightRoundTrip) ...[
              const SizedBox(width: 8),
              Expanded(child: _Field(
                icon: Icons.calendar_month_rounded,
                top: 'Return',
                bottom: _fmt(_returnDate),
                onTap: () async {
                  final d = await showDatePicker(context: context,
                      initialDate: _returnDate,
                      firstDate: _flightDate.add(const Duration(days: 1)),
                      lastDate: DateTime.now().add(const Duration(days: 365)));
                  if (d != null) setState(() => _returnDate = d);
                },
              )),
            ],
          ]),
          const SizedBox(height: 10),
          // Passengers row
          _CounterRow(
            icon: Icons.person_outline_rounded,
            label: 'Passengers',
            value: _passengers,
            min: 1, max: 6,
            onDecrement: () => setState(() => _passengers--),
            onIncrement: () => setState(() => _passengers++),
          ),
          const SizedBox(height: 12),
          _SearchBtn('Search Flights', Icons.flight_rounded, () {
            final dateStr = '${_flightDate.year}-${_flightDate.month.toString().padLeft(2,'0')}-${_flightDate.day.toString().padLeft(2,'0')}';
            final retStr = _flightRoundTrip
                ? '${_returnDate.year}-${_returnDate.month.toString().padLeft(2,'0')}-${_returnDate.day.toString().padLeft(2,'0')}'
                : null;
            context.push('/flights/results', extra: {
              'origin': _from, 'originName': _fromName,
              'destination': _to, 'destinationName': _toName,
              'tripType': _flightRoundTrip ? 'roundtrip' : 'oneway',
              'date': dateStr,
              'dateDisplay': _fmt(_flightDate),
              'returnDate': retStr,
              'returnDateDisplay': _flightRoundTrip ? _fmt(_returnDate) : null,
              'adults': _passengers,
            });
          }),
        ]);

      // ── HOTELS ────────────────────────────────────────────────────────────
      case _Tab.hotels:
        return Column(key: const ValueKey('h'), mainAxisSize: MainAxisSize.min, children: [
          // City search
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFE5E7EB)),
            ),
            child: Row(children: [
              const Icon(Icons.location_on_rounded, size: 16, color: AppTheme.secondary),
              const SizedBox(width: 8),
              Expanded(child: TextField(
                controller: _cityCtrl,
                style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.charcoal),
                decoration: InputDecoration(
                  labelText: 'City / Destination',
                  labelStyle: GoogleFonts.inter(fontSize: 10, color: AppTheme.textGray),
                  border: InputBorder.none, isDense: true, contentPadding: EdgeInsets.zero,
                ),
              )),
            ]),
          ),
          const SizedBox(height: 10),
          // Check-in / Check-out
          Row(children: [
            Expanded(child: _Field(icon: Icons.calendar_today_rounded, top: 'Check-in',  bottom: _fmt(_checkIn),  onTap: () => _pickDate(true))),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF3C7),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFFFDE68A)),
              ),
              child: Column(children: [
                Text('${_checkOut.difference(_checkIn).inDays}', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w900, color: const Color(0xFFD97706))),
                Text('Nights', style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w600, color: const Color(0xFFD97706))),
              ]),
            ),
            const SizedBox(width: 8),
            Expanded(child: _Field(icon: Icons.calendar_today_rounded, top: 'Check-out', bottom: _fmt(_checkOut), onTap: () => _pickDate(false))),
          ]),
          const SizedBox(height: 10),
          // Guests row
          _CounterRow(
            icon: Icons.people_outline_rounded,
            label: 'Guests',
            value: _hotelGuests,
            min: 1, max: 8,
            onDecrement: () => setState(() => _hotelGuests--),
            onIncrement: () => setState(() => _hotelGuests++),
          ),
          const SizedBox(height: 12),
          _SearchBtn('Search Hotels', Icons.hotel_rounded, () {
            final fmtDate = (DateTime d) => '${d.year}-${d.month.toString().padLeft(2,'0')}-${d.day.toString().padLeft(2,'0')}';
            context.go('/hotels', extra: {
              'city': _cityCtrl.text.trim().isEmpty ? 'Jaipur' : _cityCtrl.text.trim(),
              'checkIn': fmtDate(_checkIn),
              'checkOut': fmtDate(_checkOut),
              'guests': _hotelGuests,
              'autoSearch': true,
            });
          }),
        ]);

      // ── PACKAGES ──────────────────────────────────────────────────────────
      case _Tab.packages:
        return Column(key: const ValueKey('p'), mainAxisSize: MainAxisSize.min, children: [
          // Destination search input
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFE5E7EB)),
            ),
            child: Row(children: [
              const Icon(Icons.search_rounded, size: 18, color: AppTheme.secondary),
              const SizedBox(width: 8),
              Expanded(child: TextField(
                controller: _pkgSearchCtrl,
                onChanged: (_) => setState(() {}),
                style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.charcoal),
                decoration: InputDecoration(
                  hintText: 'Where do you want to go?',
                  hintStyle: GoogleFonts.inter(fontSize: 13, color: AppTheme.textGray),
                  border: InputBorder.none, isDense: true, contentPadding: EdgeInsets.zero,
                ),
              )),
              if (_pkgSearchCtrl.text.isNotEmpty)
                GestureDetector(
                  onTap: () { _pkgSearchCtrl.clear(); setState(() {}); },
                  child: const Icon(Icons.close_rounded, size: 16, color: AppTheme.textGray),
                ),
            ]),
          ),
          const SizedBox(height: 10),
          // Category quick-pick chips
          SizedBox(
            height: 30,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                ['All', 'all'], ['Beach', 'beach'], ['Heritage', 'heritage'],
                ['Honeymoon', 'honeymoon'], ['Adventure', 'adventure'], ['International', 'international'],
              ].map((c) => GestureDetector(
                onTap: () => setState(() => _pkgCategory = c[1]),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 180),
                  margin: const EdgeInsets.only(right: 8),
                  padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 5),
                  decoration: BoxDecoration(
                    color: _pkgCategory == c[1] ? AppTheme.secondary : Colors.transparent,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: _pkgCategory == c[1] ? AppTheme.secondary : AppTheme.borderGray),
                  ),
                  child: Text(c[0], style: GoogleFonts.inter(
                    fontSize: 11, fontWeight: FontWeight.w600,
                    color: _pkgCategory == c[1] ? Colors.white : AppTheme.charcoal,
                  )),
                ),
              )).toList(),
            ),
          ),
          const SizedBox(height: 12),
          _SearchBtn('Search Packages', Icons.explore_rounded, () {
            context.go('/trips', extra: {
              'query': _pkgSearchCtrl.text.trim(),
              'category': _pkgCategory,
            });
          }),
        ]);

      // ── AI PLANNER ────────────────────────────────────────────────────────
      case _Tab.planner:
        return Column(key: const ValueKey('ai'), mainAxisSize: MainAxisSize.min, children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFF5B21B6), Color(0xFF7C3AED)]),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(children: [
              const Icon(Icons.auto_awesome, color: Colors.white, size: 20),
              const SizedBox(width: 10),
              Expanded(child: Text(
                'Tell our AI your dream trip — budget, days, style — get a full itinerary in seconds!',
                style: GoogleFonts.inter(fontSize: 12, color: Colors.white70, height: 1.4),
              )),
            ]),
          ),
          const SizedBox(height: 12),
          _SearchBtn('Open AI Trip Planner', Icons.auto_awesome, () => context.go('/planner'), color: const Color(0xFF7C3AED)),
        ]);
    }
  }

  // ── Stats bar ─────────────────────────────────────────────────────────────
  Widget _statsBar() {
    final stats = _rc.stats;
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 4),
      color: Colors.white,
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceAround, children: [
        _StatBox(stats['travellers'] as String? ?? '25,000+', 'Travellers', Icons.people_rounded, const Color(0xFF1D4ED8)),
        _Divider(),
        _StatBox(stats['rating'] as String? ?? '4.9★', 'Google Rating', Icons.star_rounded, const Color(0xFFF59E0B)),
        _Divider(),
        _StatBox(stats['destinations'] as String? ?? '150+', 'Destinations', Icons.public_rounded, AppTheme.secondary),
        _Divider(),
        _StatBox(stats['since'] as String? ?? '2022', 'Est. Year', Icons.verified_rounded, const Color(0xFF059669)),
      ]),
    );
  }

  // ── Quick actions — MMT-style horizontal circular icons ──────────────────
  Widget _quickActionsGrid() {
    final rc = context.watch<RemoteConfigProvider>();
    final actions = rc.quickActions;
    return Container(
      color: Colors.white,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 18, 16, 12),
          child: Row(children: [
            Text('Our Services',
                style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w800, color: AppTheme.dark, letterSpacing: -0.3)),
            const Spacer(),
            GestureDetector(
              onTap: () => context.go('/trips'),
              child: Text('View All', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.secondary)),
            ),
          ]),
        ),
        SizedBox(
          height: 96,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            itemCount: actions.length,
            itemBuilder: (_, i) {
              final a = actions[i];
              final icon  = _iconFromName(a['icon'] as String? ?? 'explore');
              final label = a['label'] as String? ?? '';
              final color = _colorFromHex(a['color'] as String? ?? '#006CE4');
              final route = a['route'] as String? ?? '/';
              return GestureDetector(
                onTap: () => context.go(route),
                child: Container(
                  width: 72,
                  margin: const EdgeInsets.only(right: 4),
                  child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                    Container(
                      width: 56, height: 56,
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: 0.10),
                        shape: BoxShape.circle,
                        border: Border.all(color: color.withValues(alpha: 0.20), width: 1.5),
                      ),
                      child: Icon(icon, color: color, size: 24),
                    ),
                    const SizedBox(height: 6),
                    Text(label,
                      textAlign: TextAlign.center,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: AppTheme.charcoal)),
                  ]),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 8),
        const Divider(height: 1, color: Color(0xFFF3F4F6)),
      ]),
    );
  }

  // ── Deals strip ───────────────────────────────────────────────────────────
  Widget _dealsStrip() {
    final quickLinks = [
      (Icons.flight_rounded,      'Flights',     '/flights',    const Color(0xFF1D4ED8)),
      (Icons.hotel_rounded,       'Hotels',      '/hotels',     const Color(0xFF0F766E)),
      (Icons.local_offer_rounded, 'Hot Deals',   '/offers',     const Color(0xFFDC2626)),
      (Icons.map_outlined,        'Visa Guide',  '/visa-guide', const Color(0xFF7C3AED)),
      (Icons.sim_card_rounded,       'Intl SIM',    '__sim__',     const Color(0xFF059669)),
      (Icons.credit_card_rounded,    'Forex Card',  '__forex__',   const Color(0xFFF59E0B)),
      (Icons.favorite_border,        'Saved Trips', '/wishlist',   const Color(0xFFBE123C)),
    ];
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      // Hot Deals banner
      GestureDetector(
        onTap: () => context.go('/offers'),
        child: Container(
          margin: const EdgeInsets.fromLTRB(16, 12, 16, 0),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: const LinearGradient(colors: [Color(0xFFDC2626), Color(0xFFEA580C)]),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(children: [
            const Icon(Icons.local_fire_department, color: Colors.white, size: 32),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(_rc.flashSaleText, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w800, color: Colors.white)),
              Text('Limited seats · Ends today · Book now', style: GoogleFonts.inter(fontSize: 11, color: Colors.white70)),
            ])),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(8)),
              child: Text('View Deals', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: const Color(0xFFDC2626))),
            ),
          ]),
        ),
      ),
      // Quick links row
      SizedBox(
        height: 72,
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.fromLTRB(16, 10, 16, 0),
          itemCount: quickLinks.length,
          itemBuilder: (_, i) {
            final q = quickLinks[i];
            return GestureDetector(
              onTap: () async {
                if (q.$3 == '__sim__') {
                  context.push('/esim');
                } else if (q.$3 == '__forex__') {
                  context.push('/forex-card');
                } else {
                  context.go(q.$3);
                }
              },
              child: Container(
                margin: const EdgeInsets.only(right: 10),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: q.$4.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: q.$4.withValues(alpha: 0.2)),
                ),
                child: Row(mainAxisSize: MainAxisSize.min, children: [
                  Icon(q.$1, size: 16, color: q.$4),
                  const SizedBox(width: 6),
                  Text(q.$2, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: q.$4)),
                ]),
              ),
            );
          },
        ),
      ),
    ]);
  }

  // ── Trending destinations ─────────────────────────────────────────────────
  Widget _trendingRow() {
    final trending = _rc.trending;
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.only(bottom: 16),
      child: SizedBox(
      height: 230,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
        itemCount: trending.length,
        itemBuilder: (_, i) {
          final t = trending[i];
          return GestureDetector(
            onTap: () => context.go('/trips'),
            child: Container(
              width: 160,
              margin: const EdgeInsets.only(right: 14),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.14), blurRadius: 16, offset: const Offset(0, 6))],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Stack(fit: StackFit.expand, children: [
                  CachedNetworkImage(imageUrl: t['image'] as String? ?? '', fit: BoxFit.cover,
                      placeholder: (_, __) => Container(color: const Color(0xFF1a3c34))),
                  DecoratedBox(decoration: BoxDecoration(
                    gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter,
                      colors: [Colors.transparent, Colors.black.withValues(alpha: 0.85)], stops: const [0.4, 1.0]),
                  )),
                  // Duration badge top-right
                  Positioned(top: 12, right: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.55),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(t['duration'] as String? ?? '', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.white)),
                    )),
                  Positioned(left: 12, right: 12, bottom: 14, child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(t['name'] as String? ?? '', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white, letterSpacing: -0.2)),
                    Text(t['country'] as String? ?? '', style: GoogleFonts.inter(fontSize: 11, color: Colors.white60)),
                    const SizedBox(height: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.secondary,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(t['price'] as String? ?? '', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w800, color: Colors.white)),
                    ),
                  ])),
                ]),
              ),
            ),
          );
        },
      ),
      ),
    );
  }

  // ── Category grid ─────────────────────────────────────────────────────────
  Widget _categoryGrid() {
    final cats = [
      {'emoji': '🏖️', 'label': 'Beach', 'sub': 'Goa · Andamans', 'id': 'beach',
       'img': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80'},
      {'emoji': '💑', 'label': 'Honeymoon', 'sub': 'Bali · Maldives', 'id': 'honeymoon',
       'img': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80'},
      {'emoji': '🏔️', 'label': 'Adventure', 'sub': 'Ladakh · Spiti', 'id': 'adventure',
       'img': 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80'},
      {'emoji': '🏛️', 'label': 'Heritage', 'sub': 'Rajasthan · Agra', 'id': 'heritage',
       'img': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80'},
      {'emoji': '🌿', 'label': 'Offbeat', 'sub': 'Hidden Gems', 'id': 'offbeat',
       'img': 'https://images.unsplash.com/photo-1591135742467-db8bfd09fd4e?w=400&q=80'},
      {'emoji': '🌍', 'label': 'Global', 'sub': 'Dubai · Bangkok', 'id': 'international',
       'img': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80'},
    ];
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: GridView.count(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        crossAxisCount: 3,
        childAspectRatio: 0.78,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
        children: cats.map((c) {
          final id = c['id'] as String;
          return GestureDetector(
            onTap: () => context.go('/trips', extra: {'category': id}),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Stack(children: [
                // Background image
                Image.network(
                  c['img'] as String,
                  width: double.infinity,
                  height: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(color: const Color(0xFF1E3A5F)),
                ),
                // Dark gradient overlay
                Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Color(0x33000000), Color(0xCC000000)],
                      stops: [0.3, 1.0],
                    ),
                  ),
                ),
                // Labels
                Positioned(
                  bottom: 10, left: 8, right: 8,
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(c['label'] as String,
                      style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w800, color: Colors.white, letterSpacing: -0.2)),
                    Text(c['sub'] as String,
                      style: GoogleFonts.inter(fontSize: 9, color: Colors.white70),
                      maxLines: 1, overflow: TextOverflow.ellipsis),
                  ]),
                ),
                // Emoji badge top-left
                Positioned(
                  top: 8, left: 8,
                  child: Text(c['emoji'] as String, style: const TextStyle(fontSize: 20)),
                ),
              ]),
            ),
          );
        }).toList(),
      ),
    );
  }

  // ── Featured packages ─────────────────────────────────────────────────────
  Widget _featuredPackages() {
    if (_loading) {
      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(children: List.generate(2, (_) => Container(
          height: 250, margin: const EdgeInsets.only(bottom: 14),
          decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(20)),
        ))),
      );
    }
    final currency = context.watch<CurrencyProvider>();
    return Column(
      children: _packages.take(4).map((pkg) => GestureDetector(
        onTap: () => _goPackage(pkg),
        child: Container(
          margin: const EdgeInsets.fromLTRB(16, 0, 16, 14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 20, offset: const Offset(0, 6))],
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            // Image with badges
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
              child: Stack(children: [
                CachedNetworkImage(imageUrl: pkg.imageUrl, height: 190, width: double.infinity, fit: BoxFit.cover,
                    placeholder: (_, __) => Container(height: 190, color: const Color(0xFF1a3c34))),
                // Gradient at bottom of image
                Positioned.fill(child: DecoratedBox(decoration: BoxDecoration(
                  gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter,
                    colors: [Colors.transparent, Colors.black.withValues(alpha: 0.45)], stops: const [0.55, 1.0]),
                ))),
                // Top badges
                if (pkg.discount > 0)
                  Positioned(top: 12, left: 12, child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(color: const Color(0xFFDC2626), borderRadius: BorderRadius.circular(8)),
                    child: Text('${pkg.discount}% OFF', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w800, color: Colors.white)),
                  )),
                Positioned(top: 12, right: 12, child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(color: Colors.black.withValues(alpha: 0.55), borderRadius: BorderRadius.circular(8)),
                  child: Text('${pkg.nights}N/${pkg.days}D', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.white)),
                )),
                // Destination at bottom of image
                Positioned(left: 12, bottom: 10, child: Row(children: [
                  const Icon(Icons.location_on_rounded, size: 13, color: Colors.white70),
                  Text(pkg.destination, style: GoogleFonts.inter(fontSize: 11, color: Colors.white, fontWeight: FontWeight.w600)),
                ])),
              ]),
            ),
            // Details
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 12, 14, 14),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(pkg.title,
                    style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w800, color: const Color(0xFF1A1A2E), height: 1.2),
                    maxLines: 2, overflow: TextOverflow.ellipsis),
                const SizedBox(height: 8),
                Row(children: [
                  Icon(Icons.star_rounded, size: 14, color: const Color(0xFFF59E0B)),
                  const SizedBox(width: 3),
                  Text('${pkg.rating}', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: const Color(0xFF1A1A2E))),
                  Text('  ·  ${pkg.reviews} reviews', style: GoogleFonts.inter(fontSize: 11, color: Colors.grey.shade500)),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppTheme.secondary.withValues(alpha: 0.10),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(pkg.category, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: AppTheme.secondary)),
                  ),
                ]),
                const SizedBox(height: 12),
                Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
                  Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('Starting from', style: GoogleFonts.inter(fontSize: 10, color: Colors.grey.shade500)),
                    if (pkg.discount > 0)
                      Text(
                        currency.format((pkg.price / (1 - pkg.discount / 100)).roundToDouble()),
                        style: GoogleFonts.inter(fontSize: 12, color: Colors.grey.shade400,
                          decoration: TextDecoration.lineThrough),
                      ),
                    Text(currency.format(pkg.price.toDouble()),
                        style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w900,
                          color: pkg.discount > 0 ? const Color(0xFF059669) : AppTheme.secondary,
                          letterSpacing: -0.5)),
                    Text('per person', style: GoogleFonts.inter(fontSize: 9, color: Colors.grey.shade400)),
                  ]),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFFE64057), Color(0xFFFF6B35)],
                        begin: Alignment.topLeft, end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(10),
                      boxShadow: [BoxShadow(color: const Color(0xFFE64057).withValues(alpha: 0.3), blurRadius: 8, offset: const Offset(0, 3))],
                    ),
                    child: Text('Book Now', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white)),
                  ),
                ]),
              ]),
            ),
          ]),
        ),
      )).toList(),
    );
  }

  // ── Live booking ticker ───────────────────────────────────────────────────
  Widget _liveTicker() {
    return Container(
      color: const Color(0xFF0F172A),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 9),
      child: AnimatedSwitcher(
        duration: const Duration(milliseconds: 600),
        transitionBuilder: (child, anim) => FadeTransition(opacity: anim, child: child),
        child: Row(
          key: ValueKey(_tickerIdx),
          children: [
            Container(
              width: 7, height: 7,
              decoration: const BoxDecoration(color: Color(0xFF22C55E), shape: BoxShape.circle),
            ),
            const SizedBox(width: 8),
            Text('LIVE', style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w800, color: const Color(0xFF22C55E), letterSpacing: 1.2)),
            const SizedBox(width: 10),
            Expanded(child: Text(
              _tickerMsgs[_tickerIdx],
              style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w500, color: Colors.white70),
              overflow: TextOverflow.ellipsis,
            )),
            const Icon(Icons.chevron_right, size: 14, color: Colors.white30),
          ],
        ),
      ),
    );
  }

  // ── EMI banner ────────────────────────────────────────────────────────────
  Widget _emiBanner() {
    return GestureDetector(
      onTap: () => context.go('/trips'),
      child: Container(
        margin: const EdgeInsets.fromLTRB(16, 0, 16, 0),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          gradient: const LinearGradient(colors: [Color(0xFF1D4ED8), Color(0xFF3B82F6)]),
          borderRadius: BorderRadius.circular(14),
        ),
        child: Row(children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(10)),
            child: const Icon(Icons.credit_card_rounded, color: Colors.white, size: 22),
          ),
          const SizedBox(width: 12),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('0% EMI Available', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w800, color: Colors.white)),
            Text('From ₹4,999/month · SBI · HDFC · ICICI · No extra charge', style: GoogleFonts.inter(fontSize: 10, color: Colors.white70)),
          ])),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(8)),
            child: Text('View Plans', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, color: const Color(0xFF1D4ED8))),
          ),
        ]),
      ),
    );
  }

  // ── Trip segments (Honeymoon / Family / Group / Solo) ─────────────────────
  Widget _segmentsSection() {
    final segs = [
      ('💍', 'Honeymoon', 'Romantic couple getaways', const Color(0xFFEC4899), const Color(0xFFFDF2F8)),
      ('👨‍👩‍👧‍👦', 'Family Tours', 'Kid-friendly adventures', const Color(0xFF0EA5E9), const Color(0xFFEFF6FF)),
      ('🎒', 'Group Travel', '10+ people · 15% off', const Color(0xFF10B981), const Color(0xFFF0FDF4)),
      ('🧘', 'Solo Travel', 'Safe curated solo trips', const Color(0xFF8B5CF6), const Color(0xFFF5F3FF)),
    ];
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 4),
      child: GridView.count(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        crossAxisCount: 2,
        childAspectRatio: 2.4,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
        children: segs.map((s) => GestureDetector(
          onTap: () => context.go('/trips'),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            decoration: BoxDecoration(
              color: s.$5,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: s.$4.withValues(alpha: 0.25)),
            ),
            child: Row(children: [
              Text(s.$1, style: const TextStyle(fontSize: 24)),
              const SizedBox(width: 10),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.center, children: [
                Text(s.$2, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w800, color: const Color(0xFF1A1A2E))),
                Text(s.$3, style: GoogleFonts.inter(fontSize: 9, color: s.$4, fontWeight: FontWeight.w600)),
              ])),
            ]),
          ),
        )).toList(),
      ),
    );
  }

  // ── Events & Group Bookings ───────────────────────────────────────────────
  Widget _eventsSection() {
    final events = [
      ('🎊', 'Destination\nWedding', 'From ₹2,00,000', const Color(0xFFEC4899)),
      ('🏢', 'Corporate\nEvents', 'Groups 10–500 pax', const Color(0xFF1D4ED8)),
      ('🎓', 'College &\nSchool Tours', 'Student discounts', const Color(0xFF10B981)),
      ('🎉', 'Club & Party\nTrips', 'Exclusive packages', const Color(0xFFEA580C)),
      ('👑', 'VIP Group\nTravel', '20+ pax · 20% off', const Color(0xFF8B5CF6)),
      ('🏆', 'Sports &\nTeam Tours', 'All team sizes', const Color(0xFF0891B2)),
    ];
    final guarantees = [
      (Icons.verified_rounded, 'Price Beat\nGuaranteed'),
      (Icons.support_agent_rounded, 'Dedicated\nEvent Manager'),
      (Icons.groups_rounded, 'Any Group\nSize'),
      (Icons.receipt_long_rounded, 'Custom\nItinerary'),
    ];
    return Container(
      color: Colors.white,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // Header banner
        Container(
          margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF0F2027), Color(0xFF203A43), Color(0xFF2C5364)],
              begin: Alignment.topLeft, end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: const Color(0xFFEC4899), borderRadius: BorderRadius.circular(20)),
                child: Text('EVENTS & GROUP BOOKINGS', style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w800, color: Colors.white, letterSpacing: 0.8)),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
                child: Text('🏆 Best Price', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.white)),
              ),
            ]),
            const SizedBox(height: 12),
            Text('We Beat Every\nTravel Agent\'s Price', style: GoogleFonts.inter(
              fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white, height: 1.2, letterSpacing: -0.5)),
            const SizedBox(height: 6),
            Text('Weddings · Corporate · Groups · Clubs · College Tours', style: GoogleFonts.inter(fontSize: 11, color: Colors.white54)),
            const SizedBox(height: 16),
            // Guarantee pills row
            Row(children: guarantees.asMap().entries.map((entry) => Expanded(child: Container(
              margin: EdgeInsets.only(right: entry.key == guarantees.length - 1 ? 0 : 8),
              padding: const EdgeInsets.symmetric(vertical: 10),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.white.withValues(alpha: 0.12)),
              ),
              child: Column(children: [
                Icon(entry.value.$1, size: 16, color: const Color(0xFFFCD34D)),
                const SizedBox(height: 4),
                Text(entry.value.$2, style: GoogleFonts.inter(fontSize: 8, fontWeight: FontWeight.w600, color: Colors.white70, height: 1.3), textAlign: TextAlign.center),
              ]),
            ))).toList()),
            const SizedBox(height: 16),
            // WhatsApp CTA
            GestureDetector(
              onTap: () async {
                final url = Uri.parse(AppConfig.whatsappUrl('Hi! I need a custom quote for a group/event booking.'));
                if (await canLaunchUrl(url)) await launchUrl(url, mode: LaunchMode.externalApplication);
              },
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 13),
                decoration: BoxDecoration(
                  color: const Color(0xFF25D366),
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [BoxShadow(color: const Color(0xFF25D366).withValues(alpha: 0.35), blurRadius: 12, offset: const Offset(0, 4))],
                ),
                child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                  const Icon(Icons.chat_rounded, color: Colors.white, size: 18),
                  const SizedBox(width: 8),
                  Text('Get Custom Quote in 5 mins · WhatsApp', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w800, color: Colors.white)),
                ]),
              ),
            ),
          ]),
        ),
        // Event type horizontal scroll
        Padding(
          padding: const EdgeInsets.only(left: 16, bottom: 4),
          child: Text('Choose Event Type', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.dark)),
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 110,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
            itemCount: events.length,
            itemBuilder: (_, i) {
              final e = events[i];
              return GestureDetector(
                onTap: () async {
                  final url = Uri.parse(AppConfig.whatsappUrl('Hi! I am interested in ${e.$1} ${e.$2.replaceAll('\n', ' ')} booking.'));
                  if (await canLaunchUrl(url)) await launchUrl(url, mode: LaunchMode.externalApplication);
                },
                child: Container(
                  width: 110,
                  margin: const EdgeInsets.only(right: 12),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: e.$4.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: e.$4.withValues(alpha: 0.25)),
                  ),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(e.$1, style: const TextStyle(fontSize: 26)),
                    const SizedBox(height: 6),
                    Text(e.$2, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w800, color: const Color(0xFF1A1A2E), height: 1.2)),
                    const SizedBox(height: 3),
                    Text(e.$3, style: GoogleFonts.inter(fontSize: 9, color: e.$4, fontWeight: FontWeight.w600)),
                  ]),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 14),
        // Counter-agent promise strip
        Container(
          margin: const EdgeInsets.fromLTRB(16, 0, 16, 4),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFFFFFBEB),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFFDE68A)),
          ),
          child: Row(children: [
            const Icon(Icons.emoji_events_rounded, color: Color(0xFFD97706), size: 28),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Show us any agent\'s quote — we\'ll beat it!', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w800, color: const Color(0xFF92400E))),
              Text('Every counter agent · Every online portal · Guaranteed lowest price for groups', style: GoogleFonts.inter(fontSize: 10, color: const Color(0xFFB45309), height: 1.4)),
            ])),
          ]),
        ),
        const SizedBox(height: 4),
      ]),
    );
  }

  // ── International trips horizontal scroll ────────────────────────────────
  Widget _internationalTrips() {
    final trips = [
      {'name': 'Dubai', 'flag': '🇦🇪', 'price': '₹29,999', 'nights': '4N/5D', 'tag': 'Visa Free', 'color': const Color(0xFF0EA5E9), 'img': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80'},
      {'name': 'Bali', 'flag': '🇮🇩', 'price': '₹34,999', 'nights': '5N/6D', 'tag': 'Best Seller', 'color': const Color(0xFF10B981), 'img': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80'},
      {'name': 'Thailand', 'flag': '🇹🇭', 'price': '₹22,999', 'nights': '4N/5D', 'tag': 'Budget Pick', 'color': const Color(0xFFEA580C), 'img': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&q=80'},
      {'name': 'Singapore', 'flag': '🇸🇬', 'price': '₹39,999', 'nights': '4N/5D', 'tag': 'Popular', 'color': const Color(0xFF7C3AED), 'img': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80'},
      {'name': 'Maldives', 'flag': '🇲🇻', 'price': '₹59,999', 'nights': '4N/5D', 'tag': 'Luxury', 'color': const Color(0xFF0891B2), 'img': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80'},
      {'name': 'Europe', 'flag': '🇪🇺', 'price': '₹1,19,999', 'nights': '8N/9D', 'tag': 'Premium', 'color': const Color(0xFFDC2626), 'img': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80'},
    ];
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.only(bottom: 16),
      child: SizedBox(
        height: 218,
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
          itemCount: trips.length,
          itemBuilder: (_, i) {
            final t = trips[i];
            final color = t['color'] as Color;
            return GestureDetector(
              onTap: () => context.go('/trips', extra: {'category': 'international'}),
              child: Container(
                width: 155,
                margin: const EdgeInsets.only(right: 14),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.12), blurRadius: 14, offset: const Offset(0, 5))],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: Stack(fit: StackFit.expand, children: [
                    Image.network(t['img'] as String, fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Container(color: color.withValues(alpha: 0.3))),
                    DecoratedBox(decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter, end: Alignment.bottomCenter,
                        colors: [Colors.transparent, Colors.black.withValues(alpha: 0.88)],
                        stops: const [0.35, 1.0],
                      ),
                    )),
                    Positioned(top: 10, left: 10, child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(8)),
                      child: Text(t['tag'] as String, style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w800, color: Colors.white)),
                    )),
                    Positioned(top: 10, right: 10, child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                      decoration: BoxDecoration(color: Colors.black.withValues(alpha: 0.55), borderRadius: BorderRadius.circular(8)),
                      child: Text(t['nights'] as String, style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w700, color: Colors.white)),
                    )),
                    Positioned(left: 10, right: 10, bottom: 12, child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Row(children: [
                        Flexible(child: Text(t['name'] as String, style: GoogleFonts.inter(fontSize: 17, fontWeight: FontWeight.w800, color: Colors.white, letterSpacing: -0.3), overflow: TextOverflow.ellipsis)),
                        const SizedBox(width: 4),
                        Text(t['flag'] as String, style: const TextStyle(fontSize: 14)),
                      ]),
                      const SizedBox(height: 6),
                      Row(children: [
                        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text('From', style: GoogleFonts.inter(fontSize: 8, color: Colors.white54)),
                          Text(t['price'] as String, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w900, color: Colors.white)),
                        ])),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(7)),
                          child: Text('View', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.white)),
                        ),
                      ]),
                    ])),
                  ]),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  // ── Why YlooTrips comparison table ────────────────────────────────────────
  // ── Free Forex Card (BookMyForex) ────────────────────────────────────────
  Widget _forexCardSection() {
    return GestureDetector(
      onTap: () => context.push('/forex-card'),
      child: Container(
        margin: const EdgeInsets.fromLTRB(16, 4, 16, 4),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF92400E), Color(0xFFD97706)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(color: const Color(0xFFD97706).withValues(alpha: 0.3), blurRadius: 16, offset: const Offset(0, 6)),
          ],
        ),
        child: Stack(children: [
          Positioned(right: -15, top: -15,
            child: Container(width: 110, height: 110,
              decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withValues(alpha: 0.06)))),
          Positioned(left: -10, bottom: -20,
            child: Container(width: 70, height: 70,
              decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withValues(alpha: 0.04)))),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Row(children: [
              Container(
                width: 64, height: 64,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white.withValues(alpha: 0.25), width: 1.5),
                ),
                child: Stack(alignment: Alignment.center, children: [
                  const Icon(Icons.credit_card_rounded, color: Colors.white, size: 32),
                  Positioned(top: 8, right: 8,
                    child: Container(width: 10, height: 10,
                      decoration: const BoxDecoration(color: Color(0xFFFBBF24), shape: BoxShape.circle))),
                ]),
              ),
              const SizedBox(width: 16),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(color: const Color(0xFFFBBF24), borderRadius: BorderRadius.circular(20)),
                    child: Text('FREE', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w800, color: const Color(0xFF78350F))),
                  ),
                  const SizedBox(width: 6),
                  Text('No annual fee', style: GoogleFonts.inter(fontSize: 11, color: Colors.white70, fontWeight: FontWeight.w500)),
                ]),
                const SizedBox(height: 4),
                Text('Travel Forex Card', style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.w700, color: Colors.white, letterSpacing: -0.3)),
                const SizedBox(height: 4),
                Text('Lock rates before you fly · Use in 150+ currencies · Zero hidden charges', style: GoogleFonts.inter(fontSize: 11, color: Colors.white.withValues(alpha: 0.85), height: 1.4)),
                const SizedBox(height: 12),
                Row(children: [
                  _forexBadge('USD · EUR · GBP'),
                  const SizedBox(width: 8),
                  _forexBadge('150+ Currencies'),
                ]),
              ])),
              const SizedBox(width: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 8, offset: const Offset(0, 2))],
                ),
                child: Column(children: [
                  Text('Apply', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w800, color: const Color(0xFF92400E))),
                  const SizedBox(height: 2),
                  const Icon(Icons.arrow_forward_rounded, size: 14, color: Color(0xFFD97706)),
                ]),
              ),
            ]),
          ),
        ]),
      ),
    );
  }

  Widget _forexBadge(String label) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
    decoration: BoxDecoration(
      color: Colors.white.withValues(alpha: 0.15),
      borderRadius: BorderRadius.circular(20),
      border: Border.all(color: Colors.white.withValues(alpha: 0.25)),
    ),
    child: Text(label, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: Colors.white)),
  );

  // ── International SIM card (Matrix Cellular) ─────────────────────────────
  Widget _simCardSection() {
    return GestureDetector(
      onTap: () => context.push('/esim'),
      child: Container(
        margin: const EdgeInsets.fromLTRB(16, 4, 16, 4),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF0F4C81), Color(0xFF1A73E8)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(color: const Color(0xFF1A73E8).withValues(alpha: 0.25), blurRadius: 16, offset: const Offset(0, 6)),
          ],
        ),
        child: Stack(children: [
          // Background circles decoration
          Positioned(right: -20, top: -20,
            child: Container(width: 120, height: 120,
              decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withValues(alpha: 0.06)))),
          Positioned(right: 30, bottom: -30,
            child: Container(width: 80, height: 80,
              decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withValues(alpha: 0.04)))),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Row(children: [
              // SIM icon container
              Container(
                width: 64, height: 64,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white.withValues(alpha: 0.25), width: 1.5),
                ),
                child: const Icon(Icons.sim_card_rounded, color: Colors.white, size: 32),
              ),
              const SizedBox(width: 16),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  const Icon(Icons.public_rounded, color: Colors.white70, size: 14),
                  const SizedBox(width: 4),
                  Text('Available in 200+ countries', style: GoogleFonts.inter(fontSize: 11, color: Colors.white70, fontWeight: FontWeight.w500)),
                ]),
                const SizedBox(height: 4),
                Text('International SIM Card', style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.w700, color: Colors.white, letterSpacing: -0.3)),
                const SizedBox(height: 4),
                Text('Stay connected abroad · No roaming charges · Instant activation', style: GoogleFonts.inter(fontSize: 11, color: Colors.white.withValues(alpha: 0.85), height: 1.4)),
                const SizedBox(height: 12),
                Row(children: [
                  _simBadge('4G/5G Data'),
                  const SizedBox(width: 8),
                  _simBadge('Voice + SMS'),
                  const SizedBox(width: 8),
                  _simBadge('eSIM Ready'),
                ]),
              ])),
              const SizedBox(width: 12),
              Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 8, offset: const Offset(0, 2))],
                  ),
                  child: Column(children: [
                    Text('Get SIM', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w800, color: const Color(0xFF0F4C81))),
                    const SizedBox(height: 2),
                    const Icon(Icons.arrow_forward_rounded, size: 14, color: Color(0xFF1A73E8)),
                  ]),
                ),
              ]),
            ]),
          ),
        ]),
      ),
    );
  }

  Widget _simBadge(String label) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
    decoration: BoxDecoration(
      color: Colors.white.withValues(alpha: 0.15),
      borderRadius: BorderRadius.circular(20),
      border: Border.all(color: Colors.white.withValues(alpha: 0.25)),
    ),
    child: Text(label, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: Colors.white)),
  );

  Widget _whyUsSection() {
    final rows = [
      ('Best Price on India Trips', true, false, false),
      ('India Travel Specialists', true, false, false),
      ('WhatsApp 24/7 Support', true, false, false),
      ('Custom Itinerary', true, false, false),
      ('Visa Assistance', true, false, false),
      ('Zero Hidden Fees', true, false, false),
    ];
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 20),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // Comparison table
        Container(
          decoration: BoxDecoration(
            border: Border.all(color: const Color(0xFFE5E7EB)),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(children: [
            // Header
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              decoration: const BoxDecoration(
                color: Color(0xFFF8FAFC),
                borderRadius: BorderRadius.vertical(top: Radius.circular(15)),
              ),
              child: Row(children: [
                Expanded(flex: 4, child: Text('Feature', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: const Color(0xFF6B7280)))),
                Expanded(flex: 3, child: Center(child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                  decoration: BoxDecoration(color: AppTheme.secondary, borderRadius: BorderRadius.circular(6)),
                  child: Text('YlooTrips', style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w800, color: Colors.white), textAlign: TextAlign.center),
                ))),
                Expanded(flex: 3, child: Center(child: Image.network(
                  'https://logo.clearbit.com/makemytrip.com',
                  height: 18,
                  errorBuilder: (_, __, ___) => Text('MakeMyTrip', style: GoogleFonts.inter(fontSize: 8, color: const Color(0xFF6B7280))),
                ))),
                Expanded(flex: 3, child: Center(child: Image.network(
                  'https://logo.clearbit.com/booking.com',
                  height: 18,
                  errorBuilder: (_, __, ___) => Text('Booking.com', style: GoogleFonts.inter(fontSize: 8, color: const Color(0xFF6B7280))),
                ))),
              ]),
            ),
            const Divider(height: 1, color: Color(0xFFE5E7EB)),
            // Data rows
            ...List.generate(rows.length, (i) {
              final r = rows[i];
              final isLast = i == rows.length - 1;
              return Column(children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 11),
                  decoration: BoxDecoration(
                    color: i.isEven ? Colors.white : const Color(0xFFFAFAFB),
                    borderRadius: isLast ? const BorderRadius.vertical(bottom: Radius.circular(15)) : null,
                  ),
                  child: Row(children: [
                    Expanded(flex: 4, child: Text(r.$1, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w500, color: const Color(0xFF374151)))),
                    Expanded(flex: 3, child: Center(child: _CompCell(r.$2, true))),
                    Expanded(flex: 3, child: Center(child: _CompCell(r.$3, false))),
                    Expanded(flex: 3, child: Center(child: _CompCell(r.$4, false))),
                  ]),
                ),
                if (!isLast) const Divider(height: 1, color: Color(0xFFE5E7EB)),
              ]);
            }),
          ]),
        ),
        const SizedBox(height: 14),
        // CTA button
        GestureDetector(
          onTap: () => context.go('/trips'),
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 14),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFF006CE4), Color(0xFF0055B3)]),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
              const Icon(Icons.verified_rounded, color: Colors.white, size: 16),
              const SizedBox(width: 8),
              Text('Browse Packages · Best Price Guaranteed', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white)),
            ]),
          ),
        ),
      ]),
    );
  }

  // ── Mini reviews horizontal strip ─────────────────────────────────────────
  Widget _reviewsStrip() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.only(bottom: 16),
      child: SizedBox(
      height: 200,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
        itemCount: _miniReviews.length,
        itemBuilder: (_, i) {
          final r = _miniReviews[i];
          return GestureDetector(
            onTap: () => context.push('/reviews'),
            child: Container(
              width: 260,
              margin: const EdgeInsets.only(right: 14),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.07), blurRadius: 14, offset: const Offset(0, 4))],
              ),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                // Stars + verified
                Row(children: [
                  ...List.generate(5, (_) => const Icon(Icons.star_rounded, color: Color(0xFFF59E0B), size: 14)),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                    decoration: BoxDecoration(color: const Color(0xFFDCFCE7), borderRadius: BorderRadius.circular(6)),
                    child: Text('✓ Verified', style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w700, color: const Color(0xFF15803D))),
                  ),
                ]),
                const SizedBox(height: 10),
                // Review quote
                Expanded(child: Text('"${r.$4}"',
                    style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF374151), height: 1.55, fontStyle: FontStyle.italic),
                    maxLines: 4, overflow: TextOverflow.ellipsis)),
                const SizedBox(height: 12),
                // Reviewer info
                Row(children: [
                  ClipOval(child: Image.network(r.$5, width: 34, height: 34, fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(width: 34, height: 34, color: AppTheme.secondary,
                          child: Center(child: Text(r.$1[0], style: GoogleFonts.inter(color: Colors.white, fontWeight: FontWeight.w800)))))),
                  const SizedBox(width: 10),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Row(children: [
                      Text(r.$2, style: const TextStyle(fontSize: 13)),
                      const SizedBox(width: 4),
                      Expanded(child: Text(r.$1, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: const Color(0xFF1A1A2E)), overflow: TextOverflow.ellipsis)),
                    ]),
                    Text(r.$3, style: GoogleFonts.inter(fontSize: 10, color: AppTheme.secondary, fontWeight: FontWeight.w600)),
                  ])),
                ]),
              ]),
            ),
          );
        },
      ),
      ),
    );
  }

  // ── Credentials bar ───────────────────────────────────────────────────────
  Widget _credentialsBar() {
    final items = [
      (Icons.verified_rounded, 'Govt.\nLicensed', const Color(0xFF1D4ED8)),
      (Icons.receipt_long_rounded, 'MSME\nReg.', const Color(0xFF059669)),
      (Icons.shield_rounded, 'GST\nReg.', const Color(0xFF7C3AED)),
      (Icons.lock_rounded, 'PCI-DSS\nSecure', const Color(0xFFDC2626)),
      (Icons.star_rounded, '4.9★\nGoogle', const Color(0xFFF59E0B)),
    ];
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 24, 16, 0),
      padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 16, offset: const Offset(0, 4))],
      ),
      child: Column(children: [
        Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          Container(width: 24, height: 2, color: AppTheme.secondary),
          const SizedBox(width: 8),
          Text('TRUSTED & VERIFIED', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w800, color: const Color(0xFF6B7280), letterSpacing: 1.5)),
          const SizedBox(width: 8),
          Container(width: 24, height: 2, color: AppTheme.secondary),
        ]),
        const SizedBox(height: 16),
        Row(mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: items.map((b) => Column(children: [
            Container(
              width: 44, height: 44,
              decoration: BoxDecoration(color: b.$3.withValues(alpha: 0.10), shape: BoxShape.circle),
              child: Icon(b.$1, size: 22, color: b.$3),
            ),
            const SizedBox(height: 6),
            Text(b.$2, style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w700, color: const Color(0xFF374151)), textAlign: TextAlign.center),
          ])).toList(),
        ),
      ]),
    );
  }

  // ── Trust + WhatsApp CTA ─────────────────────────────────────────────────
  Widget _trustCTA() {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF0F2027), Color(0xFF1a3c34), Color(0xFF2d6a4f)],
          begin: Alignment.topLeft, end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Stack(children: [
        // Decorative circle
        Positioned(top: -30, right: -30, child: Container(
          width: 140, height: 140,
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.04),
            shape: BoxShape.circle,
          ),
        )),
        Padding(
          padding: const EdgeInsets.all(24),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text('FREE CONSULTATION', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w800, color: Colors.white70, letterSpacing: 1)),
            ),
            const SizedBox(height: 12),
            Text('Start Planning Your\nDream Trip', style: GoogleFonts.inter(
              fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white, height: 1.2, letterSpacing: -0.3)),
            const SizedBox(height: 6),
            Text('No booking fees · Best price promise', style: GoogleFonts.inter(fontSize: 12, color: Colors.white54)),
            const SizedBox(height: 20),
            // Trust pills
            Wrap(spacing: 8, runSpacing: 8, children: [
              _TrustPill(Icons.verified_user_rounded, '100% Secure'),
              _TrustPill(Icons.headset_mic_rounded, '24/7 Support'),
              _TrustPill(Icons.star_rounded, '4.9★ Rated'),
              _TrustPill(Icons.price_check_rounded, 'Best Price'),
            ]),
            const SizedBox(height: 20),
            // WhatsApp CTA
            GestureDetector(
              onTap: () async {
                final url = Uri.parse(AppConfig.whatsappUrl('Hi! I want to plan a trip with YlooTrips.'));
                if (await canLaunchUrl(url)) await launchUrl(url, mode: LaunchMode.externalApplication);
              },
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 15),
                decoration: BoxDecoration(
                  color: const Color(0xFF25D366),
                  borderRadius: BorderRadius.circular(14),
                  boxShadow: [BoxShadow(color: const Color(0xFF25D366).withValues(alpha: 0.4), blurRadius: 16, offset: const Offset(0, 6))],
                ),
                child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                  const Icon(Icons.chat_rounded, color: Colors.white, size: 20),
                  const SizedBox(width: 10),
                  Text('Chat on WhatsApp', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w800, color: Colors.white)),
                ]),
              ),
            ),
            const SizedBox(height: 12),
            Row(mainAxisAlignment: MainAxisAlignment.center, children: [
              const Icon(Icons.email_outlined, size: 12, color: Colors.white38),
              const SizedBox(width: 4),
              Text('hello@ylootrips.com', style: GoogleFonts.inter(fontSize: 11, color: Colors.white38)),
              const SizedBox(width: 16),
              const Icon(Icons.access_time_rounded, size: 12, color: Colors.white38),
              const SizedBox(width: 4),
              Text('9AM–9PM, 7 days', style: GoogleFonts.inter(fontSize: 11, color: Colors.white38)),
            ]),
          ]),
        ),
      ]),
    );
  }


  // ══════════════════════════════════════════════════════════════════════════
  // UNIQUE FEATURES — Only on YlooTrips
  // ══════════════════════════════════════════════════════════════════════════
  Widget _uniqueFeaturesSection() {
    final features = [
      (
        '🗺️', 'Hidden Gems', 'Secret spots locals love — no crowds, pure magic',
        const Color(0xFF065F46), const Color(0xFF059669),
        Icons.explore_rounded,
        () => _scrollToSection('gems'),
      ),
      (
        '📅', 'Best Time Guide', 'Know exactly when to visit every destination',
        const Color(0xFF1E3A5F), const Color(0xFF1A73E8),
        Icons.calendar_month_rounded,
        () => _scrollToSection('time'),
      ),
      (
        '✈️', 'Flight Price Tips', 'Book at the right time, save up to 40%',
        const Color(0xFF7C2D12), const Color(0xFFEA580C),
        Icons.savings_rounded,
        () => _scrollToSection('flight'),
      ),
    ];

    return Container(
      color: Colors.white,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 18, 16, 4),
          child: Row(children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFF7C3AED), Color(0xFF4F46E5)]),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text('ONLY ON YLOOTRIPS', style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w800, color: Colors.white, letterSpacing: 0.8)),
            ),
            const SizedBox(width: 8),
            Expanded(child: Text('What makes us different', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.dark))),
          ]),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 130,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            itemCount: features.length,
            itemBuilder: (_, i) {
              final f = features[i];
              return GestureDetector(
                onTap: f.$7,
                child: Container(
                  width: 180,
                  margin: const EdgeInsets.only(right: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(colors: [f.$4, f.$5], begin: Alignment.topLeft, end: Alignment.bottomRight),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [BoxShadow(color: f.$5.withValues(alpha: 0.25), blurRadius: 12, offset: const Offset(0, 4))],
                  ),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                    Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                      Text(f.$1, style: const TextStyle(fontSize: 24)),
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.15), shape: BoxShape.circle),
                        child: Icon(f.$6, color: Colors.white, size: 14),
                      ),
                    ]),
                    Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(f.$2, style: GoogleFonts.playfairDisplay(fontSize: 14, fontWeight: FontWeight.w700, color: Colors.white)),
                      const SizedBox(height: 4),
                      Text(f.$3, style: GoogleFonts.inter(fontSize: 10, color: Colors.white.withValues(alpha: 0.85), height: 1.4)),
                    ]),
                  ]),
                ),
              );
            },
          ),
        ),
      ]),
    );
  }

  void _scrollToSection(String key) {
    _scrollCtrl.animateTo(
      _scrollCtrl.position.maxScrollExtent * 0.5,
      duration: const Duration(milliseconds: 800),
      curve: Curves.easeInOut,
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // HIDDEN GEMS
  // ══════════════════════════════════════════════════════════════════════════
  Widget _hiddenGemsSection() {
    final gems = [
      _GemData('Chopta, Uttarakhand', 'The Mini Switzerland of India', 'Oct–Jun', '₹8,000', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', 'Snow-covered meadows, Tungnath temple trek, zero crowds vs Shimla'),
      _GemData('Ziro Valley, Arunachal', 'UNESCO Heritage Rice Fields', 'Sep–Nov', '₹12,000', 'https://images.unsplash.com/photo-1591135742467-db8bfd09fd4e?w=600', 'Apatani tribe culture, lush green valleys, music festival in September'),
      _GemData('Dawki, Meghalaya', 'Crystal Clear River Boat Rides', 'Nov–Apr', '₹10,000', 'https://images.unsplash.com/photo-1618993895395-1c4438e38f25?w=600', 'Cleanest river in Asia, Bangladesh border village, Living root bridges nearby'),
      _GemData('Majuli Island, Assam', "World's Largest River Island", 'Nov–Mar', '₹9,000', 'https://images.unsplash.com/photo-1602390459736-c3e8e9b82b86?w=600', 'Vaishnavite monasteries (satras), mask-making tradition, ferry from Jorhat'),
      _GemData('Dhanushkodi, Tamil Nadu', "India's Ghost Town & Tip", 'Nov–Feb', '₹6,000', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600', 'Where Bay of Bengal meets Arabian Sea, abandoned town ruins, Ram Setu view'),
      _GemData('Spiti Valley, HP', 'Cold Desert Monastery Land', 'Jun–Oct', '₹15,000', 'https://images.unsplash.com/photo-1613923736985-ccbc43a65c2b?w=600', 'Key Monastery, Chandratal Lake, one of highest inhabited villages on Earth'),
    ];

    return SizedBox(
      height: 240,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
        itemCount: gems.length,
        itemBuilder: (_, i) => _GemCard(gem: gems[i], onTap: () => context.go('/trips')),
      ),
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // BEST TIME TO VISIT GUIDE
  // ══════════════════════════════════════════════════════════════════════════
  Widget _bestTimeSection() {
    final destinations = [
      _BestTimeData('Goa', '🏖️', 'Nov – Feb', 'Beach & Party Season', 'Avoid Jun–Sep (monsoon). Best: Christmas–New Year. Water sports from Oct.', const Color(0xFF0EA5E9)),
      _BestTimeData('Kerala', '🌴', 'Sep – Mar', 'Backwaters & Wildlife', 'Post-monsoon greenery (Aug–Sep). Avoid peak summer. Houseboat best Dec–Feb.', const Color(0xFF059669)),
      _BestTimeData('Rajasthan', '🏰', 'Oct – Mar', 'Desert & Forts', 'Summer is extreme (45°C). Pushkar Fair in Nov. Desert camping ideal Dec–Jan.', const Color(0xFFD97706)),
      _BestTimeData('Ladakh', '⛰️', 'Jun – Sep', 'High Altitude Treks', 'Roads open June. Avoid winter (passes closed). Pangong Lake best July–Aug.', const Color(0xFF7C3AED)),
      _BestTimeData('Andamans', '🐠', 'Oct – May', 'Coral & Beaches', 'Avoid June–Sep monsoon. Scuba diving best Nov–Apr. Havelock most beautiful Dec.', const Color(0xFF0891B2)),
      _BestTimeData('Manali', '🎿', 'Oct–Mar & Jun–Sep', 'Snow or Adventure', 'Snow: Dec–Feb. Rohtang open Jun–Oct. Avoid Apr–May (slushy roads).', const Color(0xFF1D4ED8)),
      _BestTimeData('Varanasi', '🛕', 'Oct – Mar', 'Spiritual & Cultural', 'Dev Deepawali in Nov (most beautiful). Avoid June–Aug heat. Ganga Aarti daily.', const Color(0xFFDC2626)),
      _BestTimeData('Bali', '🌺', 'Apr – Oct', 'Dry Season', 'Avoid Nov–Mar monsoon. Ubud best Apr–June. Seminyak beach ideal Jul–Aug.', const Color(0xFFEC4899)),
    ];

    return Container(
      color: Colors.white,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // Month bar
        Container(
          margin: const EdgeInsets.fromLTRB(16, 0, 16, 12),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFFF0FDF4),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFF86EFAC)),
          ),
          child: Row(children: [
            const Icon(Icons.lightbulb_outline_rounded, color: Color(0xFF059669), size: 18),
            const SizedBox(width: 8),
            Expanded(child: Text('Pro tip: Book 60–90 days ahead for best prices. Last-minute travel costs 40% more.', style: GoogleFonts.inter(fontSize: 11, color: const Color(0xFF065F46), height: 1.4))),
          ]),
        ),
        SizedBox(
          height: 160,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            itemCount: destinations.length,
            itemBuilder: (_, i) => _BestTimeCard(data: destinations[i], onTap: () => context.go('/trips')),
          ),
        ),
      ]),
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // FLIGHT BOOKING TIMING GUIDE
  // ══════════════════════════════════════════════════════════════════════════
  Widget _flightTimingGuide() {
    final tips = [
      _FlightTip(Icons.flight_rounded, 'Domestic Flights', 'Book 4–6 weeks ahead', 'Best days: Tuesday & Wednesday. Avoid booking on Friday–Sunday — prices spike 30%.', const Color(0xFF1D4ED8)),
      _FlightTip(Icons.public_rounded, 'International Flights', 'Book 3–5 months ahead', 'Cheapest on Tuesdays & Wednesdays. Fly midweek (Tue–Thu) to save 20% vs weekends.', const Color(0xFF0891B2)),
      _FlightTip(Icons.nightlight_round, 'Best Time of Day', '5 AM & Late Night', 'Early morning flights are 20% cheaper. Red-eye (midnight) flights save the most.', const Color(0xFF7C3AED)),
      _FlightTip(Icons.trending_down_rounded, 'Cheapest Months to Fly', 'Jan–Feb & Sep–Oct', 'Post-holiday and shoulder season. Avoid May–June and December for domestic routes.', const Color(0xFF059669)),
      _FlightTip(Icons.alarm_rounded, 'Last Minute Deals', '24–72 hours before', 'Airlines drop unsold seats. Use incognito mode. Clear cookies before searching.', const Color(0xFFDC2626)),
      _FlightTip(Icons.compare_arrows_rounded, 'Round Trip vs One Way', 'Always compare both', 'Sometimes 2 one-way tickets are cheaper. Check both before booking.', const Color(0xFFD97706)),
    ];

    return Container(
      color: Colors.white,
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // Price calendar hint
        Container(
          margin: const EdgeInsets.fromLTRB(16, 0, 16, 12),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            gradient: const LinearGradient(colors: [Color(0xFF1D4ED8), Color(0xFF0891B2)]),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Row(children: [
            const Icon(Icons.savings_rounded, color: Colors.white, size: 28),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Save up to 40% on flights', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: Colors.white)),
              Text('Follow these 6 insider tips — used by frequent flyers & travel agents', style: GoogleFonts.inter(fontSize: 10, color: Colors.white70, height: 1.4)),
            ])),
            GestureDetector(
              onTap: () => context.go('/flights'),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(8)),
                child: Text('Search', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: const Color(0xFF1D4ED8))),
              ),
            ),
          ]),
        ),
        // Tip cards
        SizedBox(
          height: 148,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
            itemCount: tips.length,
            itemBuilder: (_, i) => _FlightTipCard(tip: tips[i]),
          ),
        ),
      ]),
    );
  }

  Widget _sectionHeader(String title, String sub, {VoidCallback? onMore}) => Container(
    color: Colors.white,
    padding: const EdgeInsets.fromLTRB(16, 20, 16, 10),
    child: Row(crossAxisAlignment: CrossAxisAlignment.center, children: [
      Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(title, style: GoogleFonts.inter(fontSize: 17, fontWeight: FontWeight.w800, color: AppTheme.dark, letterSpacing: -0.3)),
        const SizedBox(height: 2),
        Text(sub, style: GoogleFonts.inter(fontSize: 11, color: Colors.grey.shade500)),
      ])),
      if (onMore != null)
        GestureDetector(
          onTap: onMore,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
            decoration: BoxDecoration(
              color: AppTheme.secondary.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text('See all', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.secondary)),
          ),
        ),
    ]),
  );

  void _pickCode(bool isFrom) async {
    final airports = [
      ('DEL', 'New Delhi'), ('BOM', 'Mumbai'), ('BLR', 'Bangalore'),
      ('CCU', 'Kolkata'), ('MAA', 'Chennai'), ('HYD', 'Hyderabad'),
      ('GOI', 'Goa'), ('AMD', 'Ahmedabad'), ('PNQ', 'Pune'),
      ('COK', 'Kochi'), ('SXR', 'Srinagar'), ('IXC', 'Chandigarh'),
      ('JAI', 'Jaipur'), ('LKO', 'Lucknow'), ('IXL', 'Leh'),
      ('DXB', 'Dubai'), ('SIN', 'Singapore'), ('BKK', 'Bangkok'),
    ];
    final p = await showDialog<(String, String)>(
      context: context,
      builder: (_) => SimpleDialog(
        title: Text(isFrom ? 'From City' : 'To City',
            style: GoogleFonts.playfairDisplay(fontWeight: FontWeight.bold)),
        children: airports.map((a) => SimpleDialogOption(
          onPressed: () => Navigator.pop(context, a),
          child: Row(children: [
            Container(
              width: 42, height: 30,
              decoration: BoxDecoration(color: AppTheme.amberLight, borderRadius: BorderRadius.circular(6)),
              child: Center(child: Text(a.$1, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w800, color: AppTheme.amber))),
            ),
            const SizedBox(width: 12),
            Text(a.$2, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500)),
          ]),
        )).toList(),
      ),
    );
    if (p != null) setState(() {
      if (isFrom) { _from = p.$1; _fromName = p.$2; }
      else { _to = p.$1; _toName = p.$2; }
    });
  }

  void _pickDate(bool isCheckIn) async {
    final d = await showDatePicker(context: context,
      initialDate: isCheckIn ? _checkIn : _checkOut,
      firstDate: isCheckIn ? DateTime.now() : _checkIn,
      lastDate: DateTime.now().add(const Duration(days: 365)));
    if (d != null) setState(() {
      if (isCheckIn) { _checkIn = d; if (_checkOut.isBefore(d.add(const Duration(days: 1)))) _checkOut = d.add(const Duration(days: 1)); }
      else _checkOut = d;
    });
  }
}

// ── Reusable widgets ──────────────────────────────────────────────────────────

// ── Trip type chip (One-way / Round-trip) ─────────────────────────────────────
class _TripChip extends StatelessWidget {
  final String label;
  final bool active;
  final VoidCallback onTap;
  const _TripChip(this.label, this.active, this.onTap);

  @override
  Widget build(BuildContext context) => Expanded(
    child: GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(vertical: 7),
        decoration: BoxDecoration(
          color: active ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
          boxShadow: active
              ? [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 6, offset: const Offset(0, 2))]
              : [],
        ),
        child: Text(label, textAlign: TextAlign.center,
          style: GoogleFonts.inter(
            fontSize: 12,
            fontWeight: active ? FontWeight.w700 : FontWeight.w500,
            color: active ? AppTheme.secondary : AppTheme.textGray,
          )),
      ),
    ),
  );
}

// ── Counter row (Passengers / Guests) ─────────────────────────────────────────
class _CounterRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final int value, min, max;
  final VoidCallback onDecrement, onIncrement;
  const _CounterRow({
    required this.icon, required this.label,
    required this.value, required this.min, required this.max,
    required this.onDecrement, required this.onIncrement,
  });

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
    decoration: BoxDecoration(color: AppTheme.cream, borderRadius: BorderRadius.circular(10)),
    child: Row(children: [
      Icon(icon, size: 16, color: AppTheme.secondary),
      const SizedBox(width: 8),
      Text(label, style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textGray, fontWeight: FontWeight.w500)),
      const Spacer(),
      GestureDetector(
        onTap: value > min ? onDecrement : null,
        child: Container(
          width: 28, height: 28,
          decoration: BoxDecoration(
            border: Border.all(color: value > min ? AppTheme.borderGray : AppTheme.cream),
            borderRadius: BorderRadius.circular(7),
          ),
          child: Icon(Icons.remove, size: 14, color: value > min ? AppTheme.charcoal : AppTheme.borderGray),
        ),
      ),
      Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14),
        child: Text('$value', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w800, color: AppTheme.charcoal)),
      ),
      GestureDetector(
        onTap: value < max ? onIncrement : null,
        child: Container(
          width: 28, height: 28,
          decoration: BoxDecoration(
            color: AppTheme.amberLight,
            border: Border.all(color: AppTheme.amber.withValues(alpha: 0.4)),
            borderRadius: BorderRadius.circular(7),
          ),
          child: const Icon(Icons.add, size: 14, color: AppTheme.amber),
        ),
      ),
    ]),
  );
}

class _NavBtn extends StatelessWidget {
  final IconData icon; final String label; final VoidCallback onTap; final bool dark;
  const _NavBtn(this.icon, this.label, this.onTap, {this.dark = false});
  @override
  Widget build(BuildContext context) => IconButton(
    icon: Icon(icon, size: 22, color: dark ? AppTheme.primary : Colors.white),
    onPressed: onTap,
  );
}

class _HeroPill extends StatelessWidget {
  final IconData icon; final String label;
  const _HeroPill(this.icon, this.label);
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
    decoration: BoxDecoration(
      color: Colors.white.withValues(alpha: 0.15),
      borderRadius: BorderRadius.circular(20),
      border: Border.all(color: Colors.white24),
    ),
    child: Row(mainAxisSize: MainAxisSize.min, children: [
      Icon(icon, size: 12, color: Colors.white),
      const SizedBox(width: 5),
      Text(label, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.white)),
    ]),
  );
}

class _StatBox extends StatelessWidget {
  final String value, label; final IconData icon; final Color color;
  const _StatBox(this.value, this.label, this.icon, this.color);
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(horizontal: 4),
    child: Column(mainAxisSize: MainAxisSize.min, children: [
      Container(
        width: 36, height: 36,
        decoration: BoxDecoration(color: color.withValues(alpha: 0.10), shape: BoxShape.circle),
        child: Icon(icon, size: 18, color: color),
      ),
      const SizedBox(height: 6),
      Text(value, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w900, color: const Color(0xFF1A1A2E))),
      Text(label, style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w500, color: Colors.grey.shade500), textAlign: TextAlign.center),
    ]),
  );
}

class _Divider extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Container(width: 1, height: 36, color: AppTheme.borderGray);
}

class _STab extends StatelessWidget {
  final IconData icon; final String label; final bool active; final VoidCallback onTap;
  const _STab(this.icon, this.label, this.active, this.onTap);
  @override
  Widget build(BuildContext context) => Expanded(
    child: GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: active ? const Color(0xFFD97706) : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Icon(icon, size: 16, color: active ? Colors.white : const Color(0xFF9CA3AF)),
          const SizedBox(height: 3),
          Text(label, style: GoogleFonts.inter(
            fontSize: 10, fontWeight: FontWeight.w600,
            color: active ? Colors.white : const Color(0xFF6B7280),
          )),
        ]),
      ),
    ),
  );
}

class _Field extends StatelessWidget {
  final IconData icon; final String top, bottom; final VoidCallback? onTap;
  const _Field({required this.icon, required this.top, required this.bottom, this.onTap});
  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 11),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Row(children: [
        Icon(icon, size: 15, color: const Color(0xFF9CA3AF)),
        const SizedBox(width: 8),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(top, style: GoogleFonts.inter(fontSize: 10, color: const Color(0xFF9CA3AF), fontWeight: FontWeight.w500)),
          const SizedBox(height: 1),
          Text(bottom, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: const Color(0xFF111827)), maxLines: 1, overflow: TextOverflow.ellipsis),
        ])),
      ]),
    ),
  );
}

class _SearchBtn extends StatelessWidget {
  final String label; final IconData icon; final VoidCallback onTap; final Color? color;
  const _SearchBtn(this.label, this.icon, this.onTap, {this.color});
  @override
  Widget build(BuildContext context) => SizedBox(
    width: double.infinity, height: 50,
    child: ElevatedButton.icon(
      onPressed: onTap,
      icon: Icon(icon, size: 18),
      label: Text(label, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700, letterSpacing: 0.2)),
      style: ElevatedButton.styleFrom(
        backgroundColor: color ?? const Color(0xFFD97706),
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        elevation: 0,
      ),
    ),
  );
}

class _TrustPill extends StatelessWidget {
  final IconData icon; final String label;
  const _TrustPill(this.icon, this.label);
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
    decoration: BoxDecoration(
      color: Colors.white.withValues(alpha: 0.10),
      borderRadius: BorderRadius.circular(20),
      border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
    ),
    child: Row(mainAxisSize: MainAxisSize.min, children: [
      Icon(icon, size: 13, color: const Color(0xFFFCD34D)),
      const SizedBox(width: 5),
      Text(label, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.white)),
    ]),
  );
}

class _CompCell extends StatelessWidget {
  final bool value;
  final bool highlight;
  const _CompCell(this.value, this.highlight);
  @override
  Widget build(BuildContext context) => Container(
    width: 24, height: 24,
    decoration: BoxDecoration(
      color: value ? (highlight ? const Color(0xFF006CE4) : const Color(0xFFDCFCE7)) : const Color(0xFFFEE2E2),
      shape: BoxShape.circle,
    ),
    child: Icon(
      value ? Icons.check_rounded : Icons.close_rounded,
      size: 14,
      color: value ? Colors.white : const Color(0xFFDC2626),
    ),
  );
}

// ── Welcome ₹1,000 Credit Dialog ─────────────────────────────────────────────
class _WelcomeCreditDialog extends StatefulWidget {
  const _WelcomeCreditDialog();
  @override
  State<_WelcomeCreditDialog> createState() => _WelcomeCreditDialogState();
}

class _WelcomeCreditDialogState extends State<_WelcomeCreditDialog>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scale;
  late Animation<double> _fade;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(duration: const Duration(milliseconds: 600), vsync: this);
    _scale = CurvedAnimation(parent: _ctrl, curve: Curves.elasticOut);
    _fade  = CurvedAnimation(parent: _ctrl, curve: Curves.easeIn);
    _ctrl.forward();
  }

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _fade,
      child: ScaleTransition(
        scale: _scale,
        child: Dialog(
          backgroundColor: Colors.transparent,
          insetPadding: const EdgeInsets.all(24),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(28),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.2), blurRadius: 40, offset: const Offset(0, 10))],
            ),
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              // Gold header
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 28),
                decoration: const BoxDecoration(
                  gradient: LinearGradient(colors: [Color(0xFF006CE4), Color(0xFF0055B3)]),
                  borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
                ),
                child: Column(children: [
                  // Wallet icon with glow
                  Container(
                    width: 72, height: 72,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.account_balance_wallet_rounded, size: 38, color: Colors.white),
                  ),
                  const SizedBox(height: 12),
                  Text('Welcome Gift!', style: GoogleFonts.inter(
                    fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white)),
                  const SizedBox(height: 4),
                  Text('Your WanderLoot wallet is ready', style: GoogleFonts.inter(fontSize: 12, color: Colors.white70)),
                ]),
              ),

              // Credit amount — styled like a banknote
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFF8E7),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0xFFF59E0B), width: 1.5),
                  ),
                  child: Column(children: [
                    Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                      Text('WANDERLOOT CREDIT', style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w700, color: const Color(0xFF92400E), letterSpacing: 1.5)),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(color: const Color(0xFF059669), borderRadius: BorderRadius.circular(6)),
                        child: Text('CREDITED', style: GoogleFonts.inter(fontSize: 8, fontWeight: FontWeight.w700, color: Colors.white, letterSpacing: 1)),
                      ),
                    ]),
                    const SizedBox(height: 10),
                    Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text('₹', style: GoogleFonts.inter(fontSize: 28, fontWeight: FontWeight.w700, color: const Color(0xFF92400E))),
                      Text('1,000', style: GoogleFonts.playfairDisplay(fontSize: 52, fontWeight: FontWeight.bold, color: const Color(0xFF92400E), height: 1.0)),
                    ]),
                    const SizedBox(height: 4),
                    Text('One Thousand Rupees Only', style: GoogleFonts.inter(fontSize: 11, color: const Color(0xFF92400E))),
                    const SizedBox(height: 10),
                    const Divider(color: Color(0xFFF59E0B)),
                    const SizedBox(height: 8),
                    Row(children: [
                      const Icon(Icons.stars_rounded, size: 14, color: Color(0xFFF59E0B)),
                      const SizedBox(width: 6),
                      Text('Redeemable on your first booking', style: GoogleFonts.inter(fontSize: 11, color: const Color(0xFF92400E))),
                    ]),
                  ]),
                ),
              ),

              // How it works
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 16, 24, 0),
                child: Column(children: [
                  _CreditRow(Icons.check_circle_outline, 'No expiry — credits never expire'),
                  _CreditRow(Icons.check_circle_outline, 'Use on any booking — packages, hotels'),
                  _CreditRow(Icons.check_circle_outline, 'Earn more — 10% cashback on every trip'),
                ]),
              ),

              // CTA
              Padding(
                padding: const EdgeInsets.all(24),
                child: Column(children: [
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => Navigator.of(context).pop(),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        elevation: 0,
                      ),
                      child: Text('Start Exploring 🎉', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700)),
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                      GoRouter.of(context).go('/cashback');
                    },
                    child: Text('View my wallet →', style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textGray)),
                  ),
                ]),
              ),
            ]),
          ),
        ),
      ),
    );
  }
}

class _CreditRow extends StatelessWidget {
  final IconData icon;
  final String text;
  const _CreditRow(this.icon, this.text);
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 6),
    child: Row(children: [
      Icon(icon, size: 15, color: const Color(0xFF059669)),
      const SizedBox(width: 8),
      Text(text, style: GoogleFonts.inter(fontSize: 12, color: AppTheme.charcoal)),
    ]),
  );
}

// ── Data models ──────────────────────────────────────────────────────────────

class _GemData {
  final String name, tagline, bestTime, budgetFrom, image, localTip;
  const _GemData(this.name, this.tagline, this.bestTime, this.budgetFrom, this.image, this.localTip);
}

class _BestTimeData {
  final String name, emoji, months, season, tip;
  final Color color;
  const _BestTimeData(this.name, this.emoji, this.months, this.season, this.tip, this.color);
}

class _FlightTip {
  final IconData icon;
  final String title, subtitle, detail;
  final Color color;
  const _FlightTip(this.icon, this.title, this.subtitle, this.detail, this.color);
}

// ── Card widgets ─────────────────────────────────────────────────────────────

class _GemCard extends StatelessWidget {
  final _GemData gem;
  final VoidCallback onTap;
  const _GemCard({required this.gem, required this.onTap, super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 180,
        margin: const EdgeInsets.only(right: 12),
        decoration: BoxDecoration(borderRadius: BorderRadius.circular(16), boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 10, offset: const Offset(0, 3)),
        ]),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Stack(children: [
            // Image
            Image.network(gem.image, width: 180, height: 240, fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(width: 180, height: 240, color: const Color(0xFFE5E7EB))),
            // Gradient overlay
            Container(
              width: 180, height: 240,
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter, end: Alignment.bottomCenter,
                  colors: [Colors.transparent, Color(0xCC000000)],
                  stops: [0.4, 1.0],
                ),
              ),
            ),
            // Secret badge
            Positioned(top: 10, left: 10,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: const Color(0xFF059669), borderRadius: BorderRadius.circular(20)),
                child: Row(mainAxisSize: MainAxisSize.min, children: [
                  const Icon(Icons.lock_open_rounded, color: Colors.white, size: 10),
                  const SizedBox(width: 3),
                  Text('Hidden Gem', style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w700, color: Colors.white)),
                ]),
              ),
            ),
            // Best time badge
            Positioned(top: 10, right: 10,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(8)),
                child: Text(gem.bestTime, style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w600, color: Colors.white)),
              ),
            ),
            // Bottom info
            Positioned(bottom: 0, left: 0, right: 0,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(gem.name, style: GoogleFonts.playfairDisplay(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white), maxLines: 1, overflow: TextOverflow.ellipsis),
                  Text(gem.tagline, style: GoogleFonts.inter(fontSize: 10, color: Colors.white70), maxLines: 1, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 6),
                  // Local tip
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                    decoration: BoxDecoration(color: const Color(0xFF059669).withValues(alpha: 0.85), borderRadius: BorderRadius.circular(6)),
                    child: Text('From ${gem.budgetFrom}/person', style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w600, color: Colors.white)),
                  ),
                ]),
              ),
            ),
          ]),
        ),
      ),
    );
  }
}

class _BestTimeCard extends StatelessWidget {
  final _BestTimeData data;
  final VoidCallback onTap;
  const _BestTimeCard({required this.data, required this.onTap, super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 170,
        margin: const EdgeInsets.only(right: 12),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: data.color.withValues(alpha: 0.06),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: data.color.withValues(alpha: 0.2)),
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Text(data.emoji, style: const TextStyle(fontSize: 22)),
            const SizedBox(width: 8),
            Expanded(child: Text(data.name, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w800, color: const Color(0xFF1C1C1C)))),
          ]),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(color: data.color, borderRadius: BorderRadius.circular(20)),
            child: Text(data.months, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.white)),
          ),
          const SizedBox(height: 6),
          Text(data.season, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: data.color)),
          const SizedBox(height: 4),
          Expanded(child: Text(data.tip, style: GoogleFonts.inter(fontSize: 10, color: const Color(0xFF6B7280), height: 1.4), maxLines: 3, overflow: TextOverflow.ellipsis)),
        ]),
      ),
    );
  }
}

class _FlightTipCard extends StatelessWidget {
  final _FlightTip tip;
  const _FlightTipCard({required this.tip, super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 190,
      margin: const EdgeInsets.only(right: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: tip.color.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: tip.color.withValues(alpha: 0.2)),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Container(
            padding: const EdgeInsets.all(7),
            decoration: BoxDecoration(color: tip.color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(10)),
            child: Icon(tip.icon, color: tip.color, size: 18),
          ),
          const SizedBox(width: 8),
          Expanded(child: Text(tip.title, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w800, color: const Color(0xFF1C1C1C)))),
        ]),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
          decoration: BoxDecoration(color: tip.color, borderRadius: BorderRadius.circular(20)),
          child: Text(tip.subtitle, style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w700, color: Colors.white)),
        ),
        const SizedBox(height: 6),
        Expanded(child: Text(tip.detail, style: GoogleFonts.inter(fontSize: 10, color: const Color(0xFF374151), height: 1.45), maxLines: 4, overflow: TextOverflow.ellipsis)),
      ]),
    );
  }
}

class _SegData {
  final String emoji, title, sub, query, badge, details;
  final Color color, bg;
  final IconData icon;
  const _SegData(this.emoji, this.title, this.sub, this.query, this.color, this.bg, this.badge, this.icon, [this.details = '']);
}

