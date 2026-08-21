import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
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
  // Exact same reviews as https://www.ylootrips.com homepage
  static const _fallback = [
    {'name':'Avnish & Shivani','flag':'🇮🇳','location':'Gurugram, Haryana','trip':'Lakshadweep Island Package','rating':5,'date':'April 2026','photo':'https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=800&q=80','text':'Lakshadweep through YlooTrips was simply breathtaking! The itinerary was perfectly planned, transfers were seamless, and the team was just a WhatsApp away every step of the journey. The lagoons, the coral reefs, the silence — it felt like another world. Highly recommend to anyone wanting a truly unique Indian escape!'},
    {'name':'Neha & Rohan Sharma','flag':'🇮🇳','location':'Mumbai, Maharashtra','trip':'Bali Honeymoon Package','rating':5,'date':'May 2026','photo':'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80','text':'Humari Bali honeymoon bilkul sapne se bhi sundar thi! Overwater villa, private beach dinner, volcano sunrise hike — YlooTrips ne har ek detail ka khayal rakha. Price bhi best tha compared to other agencies. Dil se shukriya! Definitely booking our anniversary trip with them too.'},
    {'name':'Aditya & Pooja Nair','flag':'🇮🇳','location':'Bangalore, Karnataka','trip':'Thailand Budget Trip','rating':5,'date':'March 2026','photo':'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&q=80','text':'Pehli international trip thi aur YlooTrips ne ise unforgettable bana diya. Phi Phi Islands, Bangkok street food, Chiang Mai temples — sab kuch scheduled tha par feel bilkul spontaneous thi. Coordinator 24/7 WhatsApp pe available tha. Har rupee worth it raha!'},
    {'name':'Deepak & Sunita Verma','flag':'🇮🇳','location':'New Delhi, India','trip':'Kashmir Tour Package','rating':5,'date':'June 2026','photo':'https://images.unsplash.com/photo-1617140237921-de8aea459edd?w=800&q=80','text':'Kashmir mein phoolon ki ghati aur Dal Lake ke shikare pe sunset — aisa nazar kabhi nahi bhoolenge. YlooTrips ne puri family ke liye (6 log) itna smooth trip plan kiya. Hotels top-notch the, guide bilkul knowledgeable tha. Abhi bhi aankhein bhar aati hain yeh sochke!'},
    {'name':'Meera & Suresh Iyer','flag':'🇮🇳','location':'Chennai, Tamil Nadu','trip':'Kerala Backwaters Tour','rating':5,'date':'January 2026','photo':'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80','text':'Anniversary trip ke liye Kerala — YlooTrips ki team ne itna soulful itinerary banaya. Alleppey houseboat pe do din, Munnar tea estates mein subah, Kovalam beach pe shaam. Fresh Kerala sadya khana toh next level tha. Aisi memories jo kabhi fade nahi hongi. Thank you YlooTrips!'},
    {'name':'Rajan & Preethi Pillai','flag':'🇮🇳','location':'Kochi, Kerala','trip':'Maldives Luxury Package','rating':5,'date':'February 2026','photo':'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80','text':'Overwater bungalow in Maldives was literally a dream come true. YlooTrips got us an incredible deal on a 5-star resort that we would never have found on our own. Dolphin cruise, sandbank breakfast, snorkeling with turtles — every day was better than the last. Pure luxury at an unbelievable price!'},
    {'name':'Karan & Rhea Malhotra','flag':'🇮🇳','location':'Chandigarh, Punjab','trip':'7-Day Rajasthan Heritage','rating':5,'date':'December 2025','photo':'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&q=80','text':'Rajasthan trip was beyond expectations! Jaipur forts, Jodhpur blue lanes, Udaipur lake palaces — three cities and three completely different moods. Private car and knowledgeable guide made it super comfortable. Heritage hotel stays were the cherry on top. Thanks YlooTrips for making this trip so special!'},
    {'name':'Amit & Divya Kulkarni','flag':'🇮🇳','location':'Pune, Maharashtra','trip':'Dubai Tour Package','rating':5,'date':'April 2026','photo':'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80','text':'Dubai trip with YlooTrips was absolutely flawless. Visa handled in 2 days, hotel was perfectly located, desert safari was the highlight of our lives! Burj Khalifa at night with the fountain show — goosebumps guaranteed. Value for money is unmatched. Already planning Singapore with them next!'},
    {'name':'Sarah Mitchell','flag':'🇺🇸','location':'San Francisco, USA','trip':'10-Day Golden Triangle','rating':5,'date':'March 2026','photo':'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80','text':'The Taj Mahal at sunrise left me completely speechless — I still get chills thinking about it. YlooTrips made our first India trip absolutely seamless. Our guide Rajesh knew every story behind every monument. The heritage hotels in Jaipur were magnificent. India is overwhelming in the most beautiful way possible.'},
    {'name':'James & Emma Hargreaves','flag':'🇬🇧','location':'London, UK','trip':'14-Day Kerala & South India','rating':5,'date':'February 2026','photo':'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80','text':'The Kerala houseboat nights were the most romantic experience of our lives — nothing but stars, water, and silence. YlooTrips responded to every WhatsApp message within minutes, even sorted a last-minute hotel switch without fuss. South India is deeply underrated and YlooTrips showed us exactly why.'},
    {'name':'Lachlan Burgess','flag':'🇦🇺','location':'Melbourne, Australia','trip':'7-Day Rajasthan Heritage','rating':5,'date':'January 2026','photo':'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&q=80','text':'Rajasthan completely blew my expectations — the forts, the camels, the blue city of Jodhpur at golden hour. I travelled solo and felt safe and looked-after throughout. Boutique heritage havelis every night. The local food recommendations from my guide were priceless. Booking my next India trip with YlooTrips without question.'},
    {'name':'Jennifer Walsh','flag':'🇨🇦','location':'Vancouver, Canada','trip':'12-Day Himalayas & Varanasi','rating':5,'date':'October 2025','photo':'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80','text':'YlooTrips built me a completely bespoke itinerary — hidden Himalayan temples, a dawn cooking class in Varanasi, the Kalka-Shimla toy train. Nothing was generic or copy-pasted. They genuinely listened to what I wanted. The sunrise Ganga aarti in Varanasi was the single most moving experience of my life.'},
    {'name':'Chloé Dubois','flag':'🇫🇷','location':'Paris, France','trip':'14-Day Kerala & South India','rating':5,'date':'November 2025','photo':'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800&q=80','text':'Kerala was a revelation — emerald tea estates, spice gardens that overwhelm your senses, and a traditional Kathakali performance arranged privately for our group. The Ayurvedic spa retreat was extraordinary. YlooTrips was professional, warm, and clearly passionate about showing us the real Kerala. Je reviendrai pour sure!'},
    {'name':'Katrin & Markus Weber','flag':'🇩🇪','location':'Munich, Germany','trip':'10-Day Golden Triangle','rating':5,'date':'December 2025','photo':'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80','text':'Every hotel exceeded our expectations — beautifully curated, great locations. The private car and driver gave us total freedom to stop for photos wherever we wanted. Agra Fort at dusk, the pink markets of Jaipur, the ghats of Varanasi — all beyond anything we imagined. We wish we had booked two more weeks.'},
    {'name':'Aroha & Tama Ngata','flag':'🇳🇿','location':'Auckland, New Zealand','trip':'Goa Beach & Culture Package','rating':5,'date':'May 2026','photo':'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80','text':'We wanted beaches but also culture, and YlooTrips delivered both perfectly. North Goa nightlife, South Goa hidden coves, old Portuguese churches and spice farms — the balance was spot-on. Our beach villa was stunning and the seafood recommendations were world-class. India is now firmly on our must-return list.'},
  ];

  @override
  void initState() {
    super.initState();
    // Use the same 15 hardcoded reviews as the website homepage (InternationalTestimonials.tsx)
    // API is skipped — backend has different reviews that don't match the website
    _reviews = List<Map<String, dynamic>>.from(_fallback);
    _loading = false;
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
