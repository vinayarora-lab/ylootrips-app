import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_config.dart';
import '../../config/theme.dart';

class BlogsScreen extends StatelessWidget {
  const BlogsScreen({super.key});

  static const _blogs = [
    {
      'title': '7 Reasons Why Kashmir is Called Paradise on Earth',
      'category': 'Destination',
      'readTime': '5 min read',
      'date': 'Jun 2026',
      'excerpt': 'From the floating gardens of Dal Lake to the snow-draped peaks of Gulmarg, Kashmir offers experiences that defy description. Here\'s why every traveller must visit at least once.',
      'image': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
      'slug': '/blogs/kashmir-paradise',
    },
    {
      'title': 'The Ultimate Kerala Backwaters Guide: What Nobody Tells You',
      'category': 'Travel Guide',
      'readTime': '7 min read',
      'date': 'Jun 2026',
      'excerpt': 'Beyond the tourist houseboats lies a network of hidden canals where village life unfolds untouched. Our insider guide to experiencing Kerala\'s backwaters like a local.',
      'image': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
      'slug': '/blogs/kerala-backwaters',
    },
    {
      'title': 'Bali Honeymoon: The Complete 2026 Planning Guide',
      'category': 'Honeymoon',
      'readTime': '8 min read',
      'date': 'May 2026',
      'excerpt': 'Private villas, rice terrace sunrise walks, volcanic lake reflections and world-class spas — Bali has everything for the perfect honeymoon. Here\'s how to plan it right.',
      'image': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
      'slug': '/blogs/bali-honeymoon',
    },
    {
      'title': 'Ladakh on a Royal Enfield: The Route Every Biker Must Ride',
      'category': 'Adventure',
      'readTime': '10 min read',
      'date': 'May 2026',
      'excerpt': 'Manali to Leh via Rohtang, Baralacha La and Lachung La — the world\'s highest motorable road journey. Route maps, best stops, permits needed and what to pack.',
      'image': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
      'slug': '/blogs/ladakh-bike-trip',
    },
    {
      'title': 'Golden Triangle India: How to Do Delhi-Agra-Jaipur in 5 Days',
      'category': 'Itinerary',
      'readTime': '6 min read',
      'date': 'Apr 2026',
      'excerpt': 'Most guides say 7-10 days — but with the right timing you can cover India\'s most iconic circuit in just 5 days without missing anything important. Here\'s the optimised route.',
      'image': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80',
      'slug': '/blogs/golden-triangle',
    },
    {
      'title': 'Maldives vs Andaman: Which Island Paradise is Right for You?',
      'category': 'Comparison',
      'readTime': '6 min read',
      'date': 'Apr 2026',
      'excerpt': 'Both offer turquoise water and white sand — but they\'re completely different experiences at very different price points. Our honest comparison helps you choose.',
      'image': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80',
      'slug': '/blogs/maldives-vs-andaman',
    },
    {
      'title': 'WanderLoot: How Our Cashback Program Saves You Up to ₹15,000',
      'category': 'Tips & Tricks',
      'readTime': '4 min read',
      'date': 'Mar 2026',
      'excerpt': 'Every booking earns cashback into your WanderLoot wallet. Here\'s how to maximise rewards, stack with seasonal offers, and save big on your next luxury trip.',
      'image': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
      'slug': '/blogs/wanderloot-guide',
    },
    {
      'title': '10 Offbeat India Destinations International Tourists Miss Completely',
      'category': 'Offbeat',
      'readTime': '9 min read',
      'date': 'Mar 2026',
      'excerpt': 'Coorg coffee estates, Ziro valley festivals, Majuli river island, Spiti monasteries — the India beyond the guidebooks is waiting. Here are 10 secrets worth the detour.',
      'image': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80',
      'slug': '/blogs/offbeat-india',
    },
  ];

  static const _catColors = {
    'Destination': Color(0xFF3B82F6),
    'Travel Guide': Color(0xFF10B981),
    'Honeymoon': Color(0xFFEC4899),
    'Adventure': Color(0xFFF59E0B),
    'Itinerary': Color(0xFF8B5CF6),
    'Comparison': Color(0xFF06B6D4),
    'Tips & Tricks': Color(0xFFEF4444),
    'Offbeat': Color(0xFF6B7280),
  };

  void _open(BuildContext context, Map<String, dynamic> blog) {
    final url = '${AppConfig.siteUrl}${blog['slug']}';
    if (kIsWeb) {
      launchUrl(Uri.parse(url), mode: LaunchMode.platformDefault);
    } else {
      context.push('/payment', extra: {
        'url': url, 'title': blog['title'], 'successUrl': '', 'failureUrl': '',
      });
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
          title: Text('Travel Journal',
              style: GoogleFonts.playfairDisplay(fontWeight: FontWeight.bold, color: AppTheme.primary)),
        ),

        // Header
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Stories & Guides', style: GoogleFonts.playfairDisplay(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.primary)),
              const SizedBox(height: 4),
              Text('Expert travel advice, destination guides and inspiration',
                  style: GoogleFonts.inter(fontSize: 13, color: AppTheme.textGray)),
            ]),
          ),
        ),

        // Featured first blog
        SliverToBoxAdapter(
          child: GestureDetector(
            onTap: () => _open(context, _blogs[0]),
            child: Container(
              margin: const EdgeInsets.fromLTRB(16, 8, 16, 0),
              height: 220,
              decoration: BoxDecoration(borderRadius: BorderRadius.circular(20)),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Stack(fit: StackFit.expand, children: [
                  Image.network(_blogs[0]['image']!, fit: BoxFit.cover),
                  const DecoratedBox(decoration: BoxDecoration(
                    gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter,
                      colors: [Colors.transparent, Color(0xDD000000)], stops: [0.3, 1.0]),
                  )),
                  Positioned(left: 16, right: 16, bottom: 16, child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start, children: [
                      _CatChip(_blogs[0]['category']!, _catColors[_blogs[0]['category']] ?? AppTheme.secondary),
                      const SizedBox(height: 8),
                      Text(_blogs[0]['title']!, style: GoogleFonts.playfairDisplay(fontSize: 17, fontWeight: FontWeight.bold, color: Colors.white, height: 1.2)),
                      const SizedBox(height: 4),
                      Text('${_blogs[0]['readTime']} · ${_blogs[0]['date']}',
                          style: GoogleFonts.inter(fontSize: 11, color: Colors.white70)),
                    ],
                  )),
                  Positioned(top: 12, right: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(20)),
                      child: Text('FEATURED', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.white, letterSpacing: 1)),
                    ),
                  ),
                ]),
              ),
            ),
          ),
        ),

        SliverList(
          delegate: SliverChildBuilderDelegate(
            (_, i) {
              final blog = _blogs[i + 1];
              return GestureDetector(
                onTap: () => _open(context, blog),
                child: Container(
                  margin: const EdgeInsets.fromLTRB(16, 14, 16, 0),
                  decoration: BoxDecoration(
                    color: AppTheme.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 10, offset: const Offset(0, 3))],
                  ),
                  child: Row(children: [
                    ClipRRect(
                      borderRadius: const BorderRadius.horizontal(left: Radius.circular(16)),
                      child: Image.network(blog['image']!, width: 110, height: 110, fit: BoxFit.cover),
                    ),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          _CatChip(blog['category']!, _catColors[blog['category']] ?? AppTheme.secondary),
                          const SizedBox(height: 6),
                          Text(blog['title']!, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.primary, height: 1.3), maxLines: 2, overflow: TextOverflow.ellipsis),
                          const SizedBox(height: 4),
                          Text('${blog['readTime']} · ${blog['date']}',
                              style: GoogleFonts.inter(fontSize: 10, color: AppTheme.textGray)),
                        ]),
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.only(right: 12),
                      child: Icon(Icons.arrow_forward_ios, size: 14, color: AppTheme.textGray),
                    ),
                  ]),
                ),
              );
            },
            childCount: _blogs.length - 1,
          ),
        ),

        const SliverToBoxAdapter(child: SizedBox(height: 40)),
      ]),
    );
  }
}

class _CatChip extends StatelessWidget {
  final String label;
  final Color color;
  const _CatChip(this.label, this.color);
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
    decoration: BoxDecoration(color: color.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(6)),
    child: Text(label, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: color)),
  );
}
