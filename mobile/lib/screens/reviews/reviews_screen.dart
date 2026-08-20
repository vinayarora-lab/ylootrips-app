import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import '../../config/app_config.dart';
import '../../config/theme.dart';

class ReviewsScreen extends StatefulWidget {
  const ReviewsScreen({super.key});
  @override
  State<ReviewsScreen> createState() => _ReviewsScreenState();
}

class _ReviewsScreenState extends State<ReviewsScreen> {
  List<Map<String, dynamic>> _reviews = [];
  bool _loading = true;

  // Fallback hardcoded reviews
  static const _fallback = [
    {
      'name': 'Himanshu',
      'location': 'Ambala, Haryana',
      'flag': '🇮🇳',
      'trip': 'Manali & Rohtang Pass',
      'rating': 5,
      'date': 'Jul 2026',
      'photo': '/reviews/himanshu-manali.jpg',
      'tripImage': '',
      'text': 'Our Manali and Rohtang Pass trip with YLOO Trips was simply unforgettable. The snow-covered mountains, breathtaking views, and exciting activities at Rohtang Pass made the journey truly special. The hotels were comfortable, the transportation was smooth, and everything was perfectly organized. Thank you, YLOO Trips, for an amazing holiday. Highly recommended!',
    },
    {
      'name': 'Jatin',
      'location': 'Alwar, Rajasthan',
      'flag': '🇮🇳',
      'trip': 'Vietnam Group Trip',
      'rating': 5,
      'date': 'Jul 2026',
      'photo': '/reviews/jatin-vietnam.jpg',
      'tripImage': '',
      'text': 'I compared my holiday package with Booking.com and MakeMyTrips and was pleasantly surprised that YLOO Trips provided a more budget-friendly package with excellent hotels and services. The entire trip was perfectly planned, and everything exceeded my expectations. Highly recommended!',
    },
    {
      'name': 'Sagar',
      'location': 'Gurugram, Haryana',
      'flag': '🇮🇳',
      'trip': 'Kashmir Tour Package',
      'rating': 5,
      'date': 'May 2026',
      'photo': '/reviews/sagar-kashmir.jpg',
      'tripImage': '',
      'text': 'Our Kashmir trip with YLOO Trips was absolutely wonderful. From the beautiful valleys of Gulmarg and Pahalgam to the peaceful Dal Lake in Srinagar, every moment was memorable. The hotels, transportation, and sightseeing were perfectly arranged. The entire journey was smooth and stress-free. Thank you, YLOO Trips, for giving us an unforgettable holiday. Highly recommended!',
    },
    {
      'name': 'Prerna and Aditya',
      'location': 'Rohtak, Haryana',
      'flag': '🇮🇳',
      'trip': 'Darjeeling Package',
      'rating': 5,
      'date': 'Jul 2026',
      'photo': '/reviews/aditya-prerna-darjeeling.jpg',
      'tripImage': '',
      'text': 'I recently visited Darjeeling, and it was an amazing experience. The weather was pleasant, the scenery was beautiful, and the mountains were absolutely breathtaking. Every part of the trip was well planned and hassle-free. It was truly one of the best trips I have ever had. Thank you, YLOO Trips, for making this journey so memorable. Highly recommended!',
    },
    {
      'name': 'Avnish and Shivani',
      'location': 'Gurugram, Haryana',
      'flag': '🇮🇳',
      'trip': 'Lakshadweep Island Package',
      'rating': 5,
      'date': 'Apr 2026',
      'photo': '/reviews/lakshadweep-couple.jpg',
      'tripImage': '',
      'text': 'Recently visited Lakshadweep through Ylootrips.com and it was an incredible experience! The itinerary was well-planned, accommodations were comfortable, and the entire trip was smooth from start to finish. The team was supportive and always available for assistance. Lakshadweep itself is breathtaking, and Ylootrips made the journey even more memorable. Highly recommend booking with them!',
    },
    {
      'name': 'Neha & Rohan Sharma',
      'location': 'Mumbai, Maharashtra',
      'flag': '🇮🇳',
      'trip': 'Bali Honeymoon Package',
      'rating': 5,
      'date': 'Mar 2026',
      'photo': '/reviews/neha-rohan-bali.jpg',
      'tripImage': '',
      'text': 'Humari Bali honeymoon bilkul sapne jaisi thi! Overwater villa, private dinner, volcano sunrise — YlooTrips ne har cheez arrange ki. Paise kamaal ka vasool hua. Dil se shukriya team ko! 🙏',
    },
    {
      'name': 'Aditya Nair',
      'location': 'Bangalore, Karnataka',
      'flag': '🇮🇳',
      'trip': 'Thailand Budget Trip',
      'rating': 5,
      'date': 'Feb 2026',
      'photo': '/reviews/aditya-nair-thailand.jpg',
      'tripImage': '',
      'text': 'Pehli international trip thi — Thailand ne expectations se kaafi zyada diya. Phi Phi Islands toh zindagi bhar yaad rahegi. Coordinator WhatsApp pe hamesha available tha. Har rupee worth it!',
    },
    {
      'name': 'Vikram & Ananya Singh',
      'location': 'New Delhi, India',
      'flag': '🇮🇳',
      'trip': 'Dubai Tour Package',
      'rating': 5,
      'date': 'Jan 2026',
      'photo': '/reviews/vikram-ananya-dubai.jpg',
      'tripImage': '',
      'text': 'Desert safari, Burj Khalifa, Dubai Mall — sab kuch perfect tha. Visa ka koi tension nahi, YlooTrips ne sab handle kiya. Ek baar aur zaroor jayenge. Highly recommend karta hoon sabko! 👍',
    },
    {
      'name': 'Meera & Suresh Iyer',
      'location': 'Chennai, Tamil Nadu',
      'flag': '🇮🇳',
      'trip': 'Kerala Backwaters Tour',
      'rating': 5,
      'date': 'Dec 2025',
      'photo': '/reviews/meera-suresh-kerala.jpg',
      'tripImage': '',
      'text': 'Anniversary trip ke liye Kerala choose kiya — YlooTrips ki team ne jo itinerary banaya woh outstanding tha. Houseboat pe sunset dekhna aur fresh Kerala food… aisi memories jo kabhi nahi bhoolenge.',
    },
    {
      'name': 'Rajan & Preethi Pillai',
      'location': 'Kochi, Kerala',
      'flag': '🇮🇳',
      'trip': 'Maldives Luxury Package',
      'rating': 5,
      'date': 'Feb 2026',
      'photo': '/reviews/rajan-preethi-maldives.jpg',
      'tripImage': '',
      'text': 'Maldives mein overwater villa — yeh sirf sapne mein hota tha, lekin YlooTrips ne sach kar dikhaya. Dolphin cruise aur sandbank picnic best experiences rahe. Poori team ka bahut shukriya! ❤️',
    },
    {
      'name': 'Karan Malhotra',
      'location': 'Chandigarh, Punjab',
      'flag': '🇮🇳',
      'trip': '7-Day Rajasthan Heritage',
      'rating': 5,
      'date': 'Nov 2025',
      'photo': '/reviews/karan-rajasthan.jpg',
      'tripImage': '',
      'text': 'Rajasthan trip ekdum mast rahi yaar! Jaipur, Jodhpur, Udaipur — teen cities, teen alag worlds. Private car aur guide tha, koi rush nahi. Jitni photos li sab Instagram pe viral ho gayi 😄',
    },
    {
      'name': 'Sarah Mitchell',
      'location': 'San Francisco, USA',
      'flag': '🇺🇸',
      'trip': '10-Day Golden Triangle',
      'rating': 5,
      'date': 'Mar 2026',
      'photo': '/reviews/sarah-mitchell-india.jpg',
      'tripImage': '',
      'text': 'The Taj Mahal at sunrise was indescribable — I still get chills. YlooTrips made our first India trip absolutely seamless. Our guide knew stories about every monument. India is intense in the best way.',
    },
    {
      'name': 'James & Emma Hargreaves',
      'location': 'London, UK',
      'flag': '🇬🇧',
      'trip': '14-Day Kerala & South India',
      'rating': 5,
      'date': 'Feb 2026',
      'photo': '/reviews/james-emma-kerala.jpg',
      'tripImage': '',
      'text': 'The Kerala houseboat was the most romantic two days of our lives. YlooTrips answered every WhatsApp within minutes — even for last-minute hotel changes. Five stars without hesitation.',
    },
    {
      'name': 'Lachlan Burgess',
      'location': 'Melbourne, Australia',
      'flag': '🇦🇺',
      'trip': '7-Day Rajasthan Heritage',
      'rating': 5,
      'date': 'Jan 2026',
      'photo': '/reviews/lachlan-rajasthan.jpg',
      'tripImage': '',
      'text': 'Rajasthan blew my mind — forts, camels, the blue city of Jodhpur. I came solo and felt completely safe the whole time. Stayed in boutique heritage properties every night. 100% booking again.',
    },
    {
      'name': 'Priya Sharma',
      'location': 'Toronto, Canada',
      'flag': '🇨🇦',
      'trip': '12-Day North India & Himalayas',
      'rating': 5,
      'date': 'Oct 2025',
      'photo': '/reviews/priya-himalayas.jpg',
      'tripImage': '',
      'text': 'YlooTrips built me a completely custom itinerary — off-the-beaten-path temples, cooking classes in Varanasi, and the Kalka-Shimla mountain railway. Nothing was copy-pasted. Pure magic.',
    },
    {
      'name': 'Chloé Dubois',
      'location': 'Paris, France',
      'flag': '🇫🇷',
      'trip': '14-Day Kerala & South India',
      'rating': 5,
      'date': 'Sep 2025',
      'photo': '/reviews/chloe-kerala.jpg',
      'tripImage': '',
      'text': 'Kerala — tea estates, spice gardens, traditional Kathakali arranged just for our group. The food recommendations were outstanding. YlooTrips is professional, warm, genuinely passionate. Je reviendrai!',
    },
    {
      'name': 'Katrin & Markus',
      'location': 'Munich, Germany',
      'flag': '🇩🇪',
      'trip': '10-Day Golden Triangle',
      'rating': 5,
      'date': 'Nov 2025',
      'photo': '/reviews/katrin-markus-india.jpg',
      'tripImage': '',
      'text': 'Every hotel was better than expected. The private car and driver made all the difference — comfortable, safe, stopping wherever we wanted for photos. We wish we had one more day in Varanasi.',
    },
  ];

  @override
  void initState() {
    super.initState();
    _fetchReviews();
  }

  Future<void> _fetchReviews() async {
    try {
      final res = await http.get(
        Uri.parse('https://trip-backend-65232427280.asia-south1.run.app/api/testimonials'),
      ).timeout(const Duration(seconds: 8));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final List raw = data is List ? data : (data['testimonials'] ?? data['reviews'] ?? []);
        if (raw.isNotEmpty && mounted) {
          setState(() {
            _reviews = raw.map((e) => Map<String, dynamic>.from(e as Map)).toList();
            _loading = false;
          });
          return;
        }
      }
    } catch (_) {}
    // fallback to hardcoded
    if (mounted) setState(() { _reviews = List<Map<String, dynamic>>.from(_fallback); _loading = false; });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.cream,
      body: CustomScrollView(slivers: [
        SliverAppBar(
        leading: Navigator.canPop(context)
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_rounded, size: 20),
                onPressed: () => Navigator.of(context).pop(),
              )
            : null,
        automaticallyImplyLeading: false,
          pinned: true,
          backgroundColor: AppTheme.white,
          foregroundColor: AppTheme.primary,
          title: Text('Traveller Reviews',
              style: GoogleFonts.playfairDisplay(fontWeight: FontWeight.bold, color: AppTheme.primary)),
        ),

        // ── Rating hero ──────────────────────────────────────────────────────
        SliverToBoxAdapter(
          child: Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFF1a3c34), Color(0xFF2d6a4f)]),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(children: [
              Text('4.9', style: GoogleFonts.playfairDisplay(fontSize: 52, fontWeight: FontWeight.bold, color: Colors.white)),
              Row(mainAxisAlignment: MainAxisAlignment.center, children: List.generate(5, (i) =>
                  const Icon(Icons.star, color: Color(0xFFF59E0B), size: 22))),
              const SizedBox(height: 6),
              Text('2,400+ verified reviews', style: GoogleFonts.inter(fontSize: 13, color: Colors.white70)),
              const SizedBox(height: 16),
              // Rating breakdown
              ...[
                ('5★', 0.87, '87%'),
                ('4★', 0.09, '9%'),
                ('3★', 0.03, '3%'),
                ('2★', 0.01, '1%'),
              ].map((r) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 2),
                child: Row(children: [
                  SizedBox(width: 28, child: Text(r.$1, style: GoogleFonts.inter(fontSize: 11, color: Colors.white70))),
                  const SizedBox(width: 8),
                  Expanded(child: ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: r.$2,
                      backgroundColor: Colors.white24,
                      valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFF59E0B)),
                      minHeight: 6,
                    ),
                  )),
                  const SizedBox(width: 8),
                  SizedBox(width: 28, child: Text(r.$3, style: GoogleFonts.inter(fontSize: 11, color: Colors.white70), textAlign: TextAlign.right)),
                ]),
              )),
              const SizedBox(height: 16),
              Row(mainAxisAlignment: MainAxisAlignment.spaceAround, children: [
                _StatBox('98%', 'Recommend'),
                _StatBox('25K+', 'Travellers'),
                _StatBox('150+', 'Destinations'),
              ]),
            ]),
          ),
        ),

        // ── Reviews list ─────────────────────────────────────────────────────
        if (_loading)
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.symmetric(vertical: 48),
              child: Center(child: CircularProgressIndicator()),
            ),
          )
        else
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (_, i) => _ReviewCard(review: _reviews[i]),
              childCount: _reviews.length,
            ),
          ),

        const SliverToBoxAdapter(child: SizedBox(height: 32)),
      ]),
    );
  }
}

class _StatBox extends StatelessWidget {
  final String value, label;
  const _StatBox(this.value, this.label);
  @override
  Widget build(BuildContext context) => Column(children: [
    Text(value, style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w800, color: AppTheme.amber)),
    Text(label, style: GoogleFonts.inter(fontSize: 10, color: Colors.white70)),
  ]);
}

class _ReviewCard extends StatelessWidget {
  final Map<String, dynamic> review;
  const _ReviewCard({required this.review});

  @override
  Widget build(BuildContext context) {
    // Support both API fields (userName/comment/userImage) and fallback fields (name/text/photo)
    final name = (review['userName'] ?? review['name'] ?? 'Traveller') as String;
    final text = (review['comment'] ?? review['text'] ?? '') as String;
    final trip = (review['destination'] ?? review['trip'] ?? '') as String;
    final rating = (review['rating'] as num?)?.toInt() ?? 5;
    final location = (review['country'] ?? review['location'] ?? '') as String;
    final date = (review['tripDate'] ?? review['date'] ?? '') as String;
    final rawPhoto = (review['userImage'] ?? review['tripPhotoUrl'] ?? review['photo'] ?? '') as String;
    final photoUrl = rawPhoto.isNotEmpty
        ? (rawPhoto.startsWith('http') ? rawPhoto : '${AppConfig.siteUrl}$rawPhoto')
        : '';
    final initials = name.split(' ').map((w) => w.isNotEmpty ? w[0] : '').take(2).join().toUpperCase();

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 16, offset: const Offset(0, 4))],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

        // ── Review photo banner (same image as on website) ──────────────────
        if (photoUrl.isNotEmpty)
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
            child: Stack(children: [
              Image.network(
                photoUrl,
                height: 200,
                width: double.infinity,
                fit: BoxFit.cover,
                loadingBuilder: (_, child, progress) => progress == null
                    ? child
                    : Container(height: 200, color: const Color(0xFF1a3c34),
                        child: const Center(child: CircularProgressIndicator(color: Colors.white54, strokeWidth: 2))),
                errorBuilder: (_, __, ___) => Container(
                  height: 200,
                  color: const Color(0xFF1a3c34),
                  child: const Center(child: Icon(Icons.landscape_outlined, color: Colors.white54, size: 40)),
                ),
              ),
              // Dark gradient for readability
              Positioned.fill(child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [Colors.transparent, Colors.black.withValues(alpha: 0.6)],
                    stops: const [0.4, 1.0],
                  ),
                ),
              )),
              // Trip name overlay bottom-left
              if (trip.isNotEmpty)
                Positioned(left: 12, bottom: 10, child: Row(children: [
                  const Icon(Icons.location_on, size: 13, color: Colors.white70),
                  const SizedBox(width: 3),
                  Text(trip, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.white)),
                ])),
              Positioned(top: 10, right: 10, child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(20)),
                child: Row(mainAxisSize: MainAxisSize.min, children: [
                  const Icon(Icons.star, color: Color(0xFFF59E0B), size: 13),
                  const SizedBox(width: 3),
                  Text('$rating.0', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.white)),
                ]),
              )),
            ]),
          ),

        // ── Review body ─────────────────────────────────────────────────────
        Padding(
          padding: const EdgeInsets.all(14),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

            // Reviewer info row
            Row(children: [
              CircleAvatar(
                radius: 20,
                backgroundColor: AppTheme.secondary.withValues(alpha: 0.15),
                child: Text(initials, style: GoogleFonts.inter(fontWeight: FontWeight.w700, color: AppTheme.secondary, fontSize: 12)),
              ),
              const SizedBox(width: 10),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(name,
                    style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.primary)),
                if (location.isNotEmpty || date.isNotEmpty)
                  Text('${location.isNotEmpty ? location : ''}${location.isNotEmpty && date.isNotEmpty ? '  ·  ' : ''}${date.isNotEmpty ? date : ''}',
                      style: GoogleFonts.inter(fontSize: 10, color: AppTheme.textGray)),
              ])),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(color: const Color(0xFFD1FAE5), borderRadius: BorderRadius.circular(20)),
                child: Row(mainAxisSize: MainAxisSize.min, children: [
                  const Icon(Icons.verified, size: 10, color: Color(0xFF059669)),
                  const SizedBox(width: 3),
                  Text('Verified', style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w700, color: Color(0xFF059669))),
                ]),
              ),
            ]),

            const SizedBox(height: 10),

            // Review text
            Text(
              '"$text"',
              style: GoogleFonts.inter(fontSize: 13, color: AppTheme.charcoal, height: 1.65, fontStyle: FontStyle.italic),
            ),

            const SizedBox(height: 10),

            // Star row
            Row(children: [
              ...List.generate(rating, (i) => const Icon(Icons.star, color: Color(0xFFF59E0B), size: 14)),
              const SizedBox(width: 8),
              Text('$rating.0 / 5.0',
                  style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textGray, fontWeight: FontWeight.w500)),
            ]),
          ]),
        ),
      ]),
    );
  }
}
