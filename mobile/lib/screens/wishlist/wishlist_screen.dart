import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../config/app_config.dart';
import '../../config/theme.dart';
import '../../models/package.dart';
import 'package:url_launcher/url_launcher.dart';

class WishlistScreen extends StatefulWidget {
  const WishlistScreen({super.key});
  @override
  State<WishlistScreen> createState() => _WishlistScreenState();
}

class _WishlistScreenState extends State<WishlistScreen> {
  List<TourPackage> _saved = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    final slugs = prefs.getStringList('wishlist') ?? [];
    setState(() {
      _saved = demoPackages.where((p) => slugs.contains(p.slug)).toList();
      _loading = false;
    });
  }

  Future<void> _remove(TourPackage pkg) async {
    final prefs = await SharedPreferences.getInstance();
    final slugs = (prefs.getStringList('wishlist') ?? [])..remove(pkg.slug);
    await prefs.setStringList('wishlist', slugs);
    setState(() => _saved.remove(pkg));
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Removed from wishlist', style: GoogleFonts.inter()),
        backgroundColor: AppTheme.secondary,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        duration: const Duration(seconds: 2),
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.cream,
      body: CustomScrollView(slivers: [
        SliverAppBar(
          pinned: true,
          backgroundColor: AppTheme.white,
          foregroundColor: AppTheme.primary,
          title: Text('Saved Trips', style: GoogleFonts.playfairDisplay(fontWeight: FontWeight.bold, color: AppTheme.primary)),
          actions: [
            if (_saved.isNotEmpty)
              TextButton(
                onPressed: () async {
                  final prefs = await SharedPreferences.getInstance();
                  await prefs.setStringList('wishlist', []);
                  setState(() => _saved.clear());
                },
                child: Text('Clear all', style: GoogleFonts.inter(color: AppTheme.red, fontSize: 13)),
              ),
          ],
        ),

        if (_loading)
          const SliverFillRemaining(child: Center(child: CircularProgressIndicator()))
        else if (_saved.isEmpty)
          SliverFillRemaining(
            child: Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                  Container(
                    width: 100, height: 100,
                    decoration: BoxDecoration(
                      color: AppTheme.secondary.withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.favorite_border, size: 48, color: AppTheme.secondary),
                  ),
                  const SizedBox(height: 20),
                  Text('No saved trips yet', style: GoogleFonts.playfairDisplay(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.primary)),
                  const SizedBox(height: 10),
                  Text('Tap the ♥ heart on any package to save it here for later.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.inter(fontSize: 14, color: AppTheme.textGray, height: 1.5)),
                  const SizedBox(height: 24),
                  ElevatedButton.icon(
                    onPressed: () => context.go('/trips'),
                    icon: const Icon(Icons.explore_outlined),
                    label: const Text('Explore Packages'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.secondary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ]),
              ),
            ),
          )
        else ...[
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
            sliver: SliverToBoxAdapter(
              child: Row(children: [
                const Icon(Icons.favorite, color: AppTheme.secondary, size: 18),
                const SizedBox(width: 6),
                Text('${_saved.length} saved trip${_saved.length > 1 ? 's' : ''}',
                    style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.primary)),
              ]),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (_, i) => _WishlistCard(pkg: _saved[i], onRemove: () => _remove(_saved[i])),
                childCount: _saved.length,
              ),
            ),
          ),
        ],

        const SliverToBoxAdapter(child: SizedBox(height: 80)),
      ]),
    );
  }
}

class _WishlistCard extends StatelessWidget {
  final TourPackage pkg;
  final VoidCallback onRemove;
  const _WishlistCard({required this.pkg, required this.onRemove});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.07), blurRadius: 12, offset: const Offset(0, 4))],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // Image
        ClipRRect(
          borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
          child: Stack(children: [
            Image.network(pkg.imageUrl, height: 180, width: double.infinity, fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(height: 180, color: const Color(0xFF1a3c34))),
            // Remove button
            Positioned(top: 12, right: 12, child: GestureDetector(
              onTap: onRemove,
              child: Container(
                width: 36, height: 36,
                decoration: BoxDecoration(color: Colors.white, shape: BoxShape.circle,
                    boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 8)]),
                child: const Icon(Icons.favorite, color: Color(0xFFDC2626), size: 20),
              ),
            )),
            // Duration badge
            Positioned(bottom: 12, left: 12, child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(20)),
              child: Text('${pkg.nights}N/${pkg.days}D', style: GoogleFonts.inter(fontSize: 11, color: Colors.white, fontWeight: FontWeight.w600)),
            )),
          ]),
        ),
        Padding(
          padding: const EdgeInsets.all(14),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              const Icon(Icons.location_on_outlined, size: 13, color: AppTheme.textGray),
              const SizedBox(width: 3),
              Text(pkg.destination, style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textGray)),
            ]),
            const SizedBox(height: 4),
            Text(pkg.title, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700, color: AppTheme.primary)),
            const SizedBox(height: 8),
            Row(children: [
              ...List.generate(5, (i) => Icon(i < pkg.rating.floor() ? Icons.star : Icons.star_border,
                  color: const Color(0xFFF59E0B), size: 13)),
              const SizedBox(width: 5),
              Text('${pkg.rating}', style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textGray)),
            ]),
            const SizedBox(height: 12),
            Row(children: [
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('from', style: GoogleFonts.inter(fontSize: 10, color: AppTheme.textGray)),
                Text('₹${_fmt(pkg.price)}', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w800, color: AppTheme.primary)),
              ]),
              const Spacer(),
              OutlinedButton(
                onPressed: () async {
                  final url = Uri.parse(AppConfig.whatsappUrl('Hi! I want to enquire about: ${pkg.title}'));
                  if (await canLaunchUrl(url)) launchUrl(url, mode: LaunchMode.externalApplication);
                },
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: AppTheme.secondary),
                  foregroundColor: AppTheme.secondary,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                ),
                child: Text('Enquire', style: GoogleFonts.inter(fontWeight: FontWeight.w600, fontSize: 13)),
              ),
              const SizedBox(width: 8),
              ElevatedButton(
                onPressed: () => context.push('/package', extra: {
                  'name': pkg.title, 'price': pkg.price, 'image': pkg.imageUrl,
                  'location': pkg.destination, 'duration': '${pkg.nights}N/${pkg.days}D', 'rating': pkg.rating,
                  'slug': pkg.slug,
                }),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.secondary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                ),
                child: Text('View', style: GoogleFonts.inter(fontWeight: FontWeight.w700, fontSize: 13)),
              ),
            ]),
          ]),
        ),
      ]),
    );
  }

  String _fmt(int v) {
    if (v >= 100000) return '${(v / 100000).toStringAsFixed(0)}L';
    if (v >= 1000) return '${(v / 1000).toStringAsFixed(0)},${(v % 1000).toString().padLeft(3, '0')}';
    return v.toString();
  }
}
