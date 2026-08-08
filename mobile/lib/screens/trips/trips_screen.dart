import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:shimmer/shimmer.dart';
import '../../config/theme.dart';
import '../../models/package.dart';
import '../../providers/currency_provider.dart';
import '../../services/api_service.dart';
import '../../services/analytics_service.dart';

class TripsScreen extends StatefulWidget {
  final String? initialQuery;
  final String? initialCategory;
  const TripsScreen({super.key, this.initialQuery, this.initialCategory});
  @override
  State<TripsScreen> createState() => _TripsScreenState();
}

class _TripsScreenState extends State<TripsScreen> {
  List<TourPackage> _packages = [];
  bool _loading = true;
  late String _selected;
  late String _searchQuery;
  late final TextEditingController _searchCtrl;

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  static const _cats = [
    {'id': 'all',           'label': 'All',           'icon': '✦'},
    {'id': 'domestic',      'label': 'India',          'icon': '🇮🇳'},
    {'id': 'international', 'label': 'International',  'icon': '🌍'},
    {'id': 'honeymoon',     'label': 'Honeymoon',      'icon': '💑'},
    {'id': 'beach',         'label': 'Beach',          'icon': '🏖️'},
    {'id': 'adventure',     'label': 'Adventure',      'icon': '🏔️'},
    {'id': 'heritage',      'label': 'Heritage',       'icon': '🏛️'},
    {'id': 'offbeat',       'label': 'Offbeat',        'icon': '🌿'},
  ];

  @override
  void initState() {
    super.initState();
    // Map home screen category names to trips screen category IDs
    final catMap = {
      'beach': 'beach', 'heritage': 'heritage',
      'honeymoon': 'honeymoon', 'adventure': 'adventure',
      'international': 'international', 'domestic': 'domestic',
      'offbeat': 'offbeat', 'all': 'all',
    };
    final initCat = widget.initialCategory;
    _selected = (initCat != null && catMap.containsKey(initCat)) ? catMap[initCat]! : 'all';
    // Trip type queries: family, group, solo, honeymoon map to search or category
    final q = widget.initialQuery ?? '';
    if (q == 'family') { _selected = 'domestic'; _searchQuery = ''; }
    else if (q == 'group') { _selected = 'all'; _searchQuery = 'group'; }
    else if (q == 'solo') { _selected = 'all'; _searchQuery = 'solo'; }
    else if (q == 'honeymoon') { _selected = 'honeymoon'; _searchQuery = ''; }
    else { _searchQuery = q; }
    _searchCtrl = TextEditingController(text: _searchQuery);
    AnalyticsService.screen('packages');
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    final pkgs = await ApiService().getPackages();
    if (mounted) setState(() { _packages = pkgs.isEmpty ? demoPackages : pkgs; _loading = false; });
  }

  List<TourPackage> get _filtered {
    var list = _selected == 'all' ? _packages : _packages.where((p) => p.category == _selected).toList();
    if (_searchQuery.isNotEmpty) {
      final q = _searchQuery.toLowerCase();
      list = list.where((p) =>
        p.title.toLowerCase().contains(q) ||
        p.destination.toLowerCase().contains(q) ||
        (p.description?.toLowerCase().contains(q) ?? false)
      ).toList();
    }
    return list;
  }

  void _openPackage(TourPackage pkg) {
    AnalyticsService.viewPackage(id: pkg.id, name: pkg.title, price: pkg.price);
    context.push('/package', extra: {
    'id': pkg.id, 'title': pkg.title, 'destination': pkg.destination,
    'imageUrl': pkg.imageUrl, 'price': pkg.price, 'rating': pkg.rating,
    'reviews': pkg.reviews, 'nights': pkg.nights, 'days': pkg.days,
    'description': pkg.description, 'highlights': pkg.highlights,
    'category': pkg.category, 'discount': pkg.discount,
    'slug': pkg.slug ?? '',
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.cream,
      body: CustomScrollView(
        slivers: [
          _appBar(),
          SliverToBoxAdapter(child: _header()),
          SliverToBoxAdapter(child: _searchBar()),
          SliverToBoxAdapter(child: _categoryBar()),
          if (_loading)
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (_, i) => _ShimmerCard(),
                childCount: 3,
              ),
            )
          else if (_filtered.isEmpty)
            SliverFillRemaining(
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(32),
                  child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                    const Icon(Icons.luggage_outlined, size: 64, color: AppTheme.textGray),
                    const SizedBox(height: 16),
                    Text('No packages found', style: GoogleFonts.playfairDisplay(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.primary)),
                    const SizedBox(height: 8),
                    Text(
                      _searchQuery.isNotEmpty
                        ? 'No results for "$_searchQuery". Try a different search or category.'
                        : 'Try a different category or contact us on WhatsApp for custom packages.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.inter(fontSize: 13, color: AppTheme.textGray, height: 1.5),
                    ),
                  ]),
                ),
              ),
            )
          else
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (_, i) {
                  final pkg = _filtered[i];
                  // First card is hero-sized, rest are standard
                  return i == 0
                      ? _HeroCard(package: pkg, onTap: () => _openPackage(pkg))
                      : _LuxuryCard(package: pkg, onTap: () => _openPackage(pkg));
                },
                childCount: _filtered.length,
              ),
            ),
          const SliverToBoxAdapter(child: SizedBox(height: 80)),
        ],
      ),
    );
  }

  Widget _appBar() => SliverAppBar(
    pinned: true,
    backgroundColor: AppTheme.white,
    elevation: 0,
    scrolledUnderElevation: 0.5,
    shadowColor: AppTheme.borderGray,
    title: Image.asset('assets/images/logo.png', height: 26, fit: BoxFit.contain),
    actions: [
      IconButton(
        icon: const Icon(Icons.tune_rounded, color: AppTheme.primary),
        onPressed: () {},
      ),
    ],
  );

  Widget _header() => Padding(
    padding: const EdgeInsets.fromLTRB(20, 20, 20, 4),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text('Curated Journeys', style: GoogleFonts.playfairDisplay(fontSize: 28, fontWeight: FontWeight.bold, color: AppTheme.primary, height: 1.1)),
      const SizedBox(height: 6),
      Text(
        _searchQuery.isNotEmpty
          ? '${_filtered.length} result${_filtered.length != 1 ? 's' : ''} for "$_searchQuery"'
          : '${_packages.length} handpicked experiences await',
        style: GoogleFonts.inter(fontSize: 13, color: AppTheme.textGray),
      ),
    ]),
  );

  Widget _searchBar() => Padding(
    padding: const EdgeInsets.fromLTRB(20, 10, 20, 0),
    child: Container(
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 10, offset: const Offset(0, 2))],
      ),
      child: TextField(
        controller: _searchCtrl,
        onChanged: (v) => setState(() => _searchQuery = v),
        style: GoogleFonts.inter(fontSize: 14, color: AppTheme.charcoal),
        decoration: InputDecoration(
          hintText: 'Search destinations, packages...',
          hintStyle: GoogleFonts.inter(fontSize: 13, color: AppTheme.textGray),
          prefixIcon: const Icon(Icons.search_rounded, color: AppTheme.secondary, size: 20),
          suffixIcon: _searchQuery.isNotEmpty
            ? GestureDetector(
                onTap: () { _searchCtrl.clear(); setState(() => _searchQuery = ''); },
                child: const Icon(Icons.close_rounded, color: AppTheme.textGray, size: 18),
              )
            : null,
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        ),
      ),
    ),
  );

  Widget _categoryBar() => Container(
    height: 46,
    margin: const EdgeInsets.only(top: 12, bottom: 4),
    child: ListView.builder(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      itemCount: _cats.length,
      itemBuilder: (_, i) {
        final c = _cats[i];
        final active = _selected == c['id'];
        return GestureDetector(
          onTap: () => setState(() => _selected = c['id']!),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            margin: const EdgeInsets.only(right: 8),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: active ? AppTheme.primary : AppTheme.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: active ? AppTheme.primary : AppTheme.borderGray),
              boxShadow: active ? [BoxShadow(color: AppTheme.primary.withValues(alpha: 0.15), blurRadius: 8, offset: const Offset(0, 2))] : [],
            ),
            child: Row(mainAxisSize: MainAxisSize.min, children: [
              Text(c['icon']!, style: const TextStyle(fontSize: 13)),
              const SizedBox(width: 6),
              Text(c['label']!, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: active ? Colors.white : AppTheme.primary)),
            ]),
          ),
        );
      },
    ),
  );
}

// ── Hero Card (first item — extra large) ──────────────────────────────────────
class _HeroCard extends StatelessWidget {
  final TourPackage package;
  final VoidCallback onTap;
  const _HeroCard({required this.package, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final currency = context.watch<CurrencyProvider>();
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.fromLTRB(16, 12, 16, 8),
        height: 360,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.18), blurRadius: 20, offset: const Offset(0, 6))],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: Stack(
            fit: StackFit.expand,
            children: [
              CachedNetworkImage(imageUrl: package.imageUrl, fit: BoxFit.cover,
                placeholder: (_, __) => Container(color: AppTheme.creamDark)),
              // Dark gradient from bottom
              const DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [Colors.transparent, Color(0xCC000000)],
                    stops: [0.35, 1.0],
                  ),
                ),
              ),
              // Top badges
              Positioned(
                top: 16, left: 16, right: 16,
                child: Row(
                  children: [
                    _Badge(label: '★ ${package.rating}', bg: Colors.white, text: AppTheme.primary),
                    const SizedBox(width: 8),
                    _Badge(label: '${package.nights}N/${package.days}D', bg: AppTheme.secondary, text: Colors.white),
                    const Spacer(),
                    if (package.discount > 0) ...[
                      _Badge(label: '${package.discount}% OFF', bg: Colors.red, text: Colors.white),
                      const SizedBox(width: 8),
                    ],
                    _WishlistHeart(slug: package.slug ?? package.id),
                  ],
                ),
              ),
              // Bottom content
              Positioned(
                left: 20, right: 20, bottom: 20,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(children: [
                      const Icon(Icons.location_on, size: 12, color: Colors.white70),
                      const SizedBox(width: 4),
                      Text(package.destination, style: GoogleFonts.inter(fontSize: 12, color: Colors.white70)),
                    ]),
                    const SizedBox(height: 4),
                    Text(package.title, style: GoogleFonts.playfairDisplay(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white, height: 1.2)),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text('Starting from', style: GoogleFonts.inter(fontSize: 10, color: Colors.white60)),
                          Text(currency.format(package.price.toDouble()), style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white)),
                        ]),
                        const Spacer(),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(30)),
                          child: Text('Explore', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.primary)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Luxury Card (standard items) ──────────────────────────────────────────────
class _LuxuryCard extends StatelessWidget {
  final TourPackage package;
  final VoidCallback onTap;
  const _LuxuryCard({required this.package, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final currency = context.watch<CurrencyProvider>();
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
        decoration: BoxDecoration(
          color: AppTheme.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.07), blurRadius: 16, offset: const Offset(0, 4))],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
              child: Stack(
                children: [
                  CachedNetworkImage(
                    imageUrl: package.imageUrl,
                    height: 200,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    placeholder: (_, __) => Container(height: 200, color: AppTheme.creamDark),
                  ),
                  // subtle bottom gradient
                  Positioned.fill(
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [Colors.transparent, Colors.black.withValues(alpha: 0.3)],
                          stops: const [0.6, 1.0],
                        ),
                      ),
                    ),
                  ),
                  // Duration badge top-right
                  Positioned(
                    top: 12, right: 12,
                    child: _Badge(label: '${package.nights}N/${package.days}D', bg: Colors.black54, text: Colors.white),
                  ),
                  // Wishlist heart - top left
                  Positioned(
                    top: 12, left: 12,
                    child: _WishlistHeart(slug: package.slug ?? package.id),
                  ),
                  // Discount badge - below heart if both present
                  if (package.discount > 0)
                    Positioned(
                      top: 12, left: 56,
                      child: _Badge(label: '${package.discount}% OFF', bg: Colors.red, text: Colors.white),
                    ),
                ],
              ),
            ),
            // Details
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [
                    const Icon(Icons.location_on, size: 12, color: AppTheme.secondary),
                    const SizedBox(width: 3),
                    Text(package.destination, style: GoogleFonts.inter(fontSize: 11, color: AppTheme.secondary, fontWeight: FontWeight.w600)),
                    const Spacer(),
                    const Icon(Icons.star, size: 13, color: Color(0xFFF59E0B)),
                    Text(' ${package.rating}', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700)),
                    Text(' (${package.reviews})', style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textGray)),
                  ]),
                  const SizedBox(height: 6),
                  Text(package.title, style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primary, height: 1.2), maxLines: 2, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 10),
                  // Highlight chips
                  if (package.highlights.isNotEmpty)
                    Wrap(
                      spacing: 6,
                      runSpacing: 4,
                      children: package.highlights.take(3).map((h) => Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(color: AppTheme.cream, borderRadius: BorderRadius.circular(20)),
                        child: Text(h, style: GoogleFonts.inter(fontSize: 10, color: AppTheme.primary, fontWeight: FontWeight.w500)),
                      )).toList(),
                    ),
                  const SizedBox(height: 14),
                  const Divider(height: 1, color: AppTheme.borderGray),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text('Starting from', style: GoogleFonts.inter(fontSize: 10, color: AppTheme.textGray)),
                        if (package.discount > 0) ...[
                          Text(
                            currency.format((package.price / (1 - package.discount / 100)).roundToDouble()),
                            style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textGray,
                              decoration: TextDecoration.lineThrough),
                          ),
                        ],
                        Text(currency.format(package.price.toDouble()),
                          style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w800,
                            color: package.discount > 0 ? const Color(0xFF059669) : AppTheme.primary)),
                        Text('per person · all inclusive', style: GoogleFonts.inter(fontSize: 10, color: AppTheme.textGray)),
                      ]),
                      const Spacer(),
                      GestureDetector(
                        onTap: onTap,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF006CE4), Color(0xFF0055B3)],
                              begin: Alignment.topLeft, end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(12),
                            boxShadow: [BoxShadow(color: const Color(0xFF006CE4).withValues(alpha: 0.3), blurRadius: 8, offset: const Offset(0, 3))],
                          ),
                          child: Text('View Details', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white)),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  final String label;
  final Color bg, text;
  const _Badge({required this.label, required this.bg, required this.text});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(20)),
      child: Text(label, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, color: text)),
    );
  }
}

// ── Wishlist Heart Button ─────────────────────────────────────────────────────
class _WishlistHeart extends StatefulWidget {
  final String slug;
  const _WishlistHeart({required this.slug});
  @override
  State<_WishlistHeart> createState() => _WishlistHeartState();
}

class _WishlistHeartState extends State<_WishlistHeart> {
  bool _saved = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    final slugs = prefs.getStringList('wishlist') ?? [];
    if (mounted) setState(() => _saved = slugs.contains(widget.slug));
  }

  Future<void> _toggle() async {
    final prefs = await SharedPreferences.getInstance();
    final slugs = (prefs.getStringList('wishlist') ?? []).toList();
    if (_saved) {
      slugs.remove(widget.slug);
    } else {
      if (!slugs.contains(widget.slug)) slugs.add(widget.slug);
    }
    await prefs.setStringList('wishlist', slugs);
    setState(() => _saved = !_saved);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(_saved ? 'Saved to wishlist' : 'Removed from wishlist',
            style: const TextStyle(fontFamily: 'Inter')),
        backgroundColor: AppTheme.secondary,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        duration: const Duration(seconds: 1),
      ));
    }
  }

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: _toggle,
    child: Container(
      width: 34, height: 34,
      decoration: BoxDecoration(
        color: Colors.white,
        shape: BoxShape.circle,
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.12), blurRadius: 8, offset: const Offset(0, 2))],
      ),
      child: Icon(
        _saved ? Icons.favorite_rounded : Icons.favorite_border_rounded,
        color: _saved ? const Color(0xFFDC2626) : AppTheme.textGray,
        size: 18,
      ),
    ),
  );
}

// ── Shimmer loading card ──────────────────────────────────────────────────────
class _ShimmerCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: const Color(0xFFE5E7EB),
      highlightColor: const Color(0xFFF9FAFB),
      child: Container(
        margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
        child: Column(children: [
          Container(height: 200, decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          )),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Container(height: 12, width: 100, color: Colors.white),
              const SizedBox(height: 10),
              Container(height: 20, width: double.infinity, color: Colors.white),
              const SizedBox(height: 6),
              Container(height: 16, width: 200, color: Colors.white),
              const SizedBox(height: 16),
              Container(height: 40, width: double.infinity, color: Colors.white),
            ]),
          ),
        ]),
      ),
    );
  }
}
