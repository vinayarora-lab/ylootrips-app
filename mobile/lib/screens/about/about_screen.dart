import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_config.dart';
import '../../config/theme.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  static const _stats = [
    {'value': '25,000+', 'label': 'Happy Travellers'},
    {'value': '4.9★', 'label': '2,400+ Reviews'},
    {'value': '150+', 'label': 'Destinations'},
    {'value': '50+', 'label': 'Team Members'},
  ];

  static const _trustBadges = [
    (Icons.verified_outlined, 'Government Licensed', 'Registered travel company, Govt. of India'),
    (Icons.business_center_outlined, 'MSME Registered', 'UDYAM-HR-05-0141455'),
    (Icons.receipt_long_outlined, 'GST Registered', 'GST No. 07BATPV1942C1ZF'),
    (Icons.security_outlined, 'PCI-DSS Compliant', 'Secure payment processing — all card data encrypted'),
    (Icons.lock_outlined, '256-bit SSL', 'All transactions encrypted via Easebuzz payment gateway'),
    (Icons.support_agent_outlined, '24/7 Concierge', 'Dedicated travel expert on WhatsApp — always reachable'),
    (Icons.star_outline, '4.9★ Google Rating', '2,400+ verified reviews from real travellers'),
    (Icons.account_balance_wallet_outlined, 'WanderLoot Cashback', 'Earn 10% cashback on every booking — redeemable on future trips'),
  ];

  static const _payments = [
    '💳 Visa / Mastercard / Amex',
    '📱 UPI (GPay, PhonePe, Paytm)',
    '🏦 Bank Transfer (NEFT/RTGS)',
    '📅 0% Cost EMI Available',
    '💵 USD · GBP · EUR · AUD · INR',
  ];

  static const _countries = [
    '🇮🇳 India', '🇺🇸 USA', '🇬🇧 UK', '🇦🇺 Australia',
    '🇨🇦 Canada', '🇩🇪 Germany', '🇫🇷 France', '🇦🇪 UAE',
    '🇸🇬 Singapore', '🇯🇵 Japan', '🇳🇿 New Zealand', '🇮🇹 Italy',
    '🇳🇱 Netherlands',
  ];

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
          title: Text('About YlooTrips',
              style: GoogleFonts.playfairDisplay(fontWeight: FontWeight.bold, color: AppTheme.primary)),
        ),

        // ── Hero ───────────────────────────────────────────────────────────────
        SliverToBoxAdapter(
          child: Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF1a3c34), Color(0xFF2d6a4f)],
                begin: Alignment.topLeft, end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              image: const DecorationImage(
                image: NetworkImage('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800'),
                fit: BoxFit.cover, opacity: 0.12,
              ),
            ),
            child: Column(children: [
              Image.asset('assets/images/logo.png', height: 36, color: Colors.white,
                  errorBuilder: (_, __, ___) => Text('YLOO TRIPS',
                      style: GoogleFonts.playfairDisplay(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white))),
              const SizedBox(height: 6),
              Text('Luxury India Travel Specialists',
                  style: GoogleFonts.inter(fontSize: 12, color: Colors.white60, letterSpacing: 1.5)),
              const SizedBox(height: 14),
              Text(
                'Founded in 2022 by Vinay Arora, YlooTrips was built to fix one problem: the lack of transparency and quality in India\'s online travel industry. Today we serve 25,000+ travellers from 13 countries with handcrafted luxury journeys across 150+ destinations.',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(fontSize: 13, color: Colors.white, height: 1.6),
              ),
              const SizedBox(height: 20),
              Row(mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: _stats.map((s) => Column(children: [
                  Text(s['value']!, style: GoogleFonts.inter(fontSize: 17, fontWeight: FontWeight.w800, color: AppTheme.amber)),
                  const SizedBox(height: 2),
                  Text(s['label']!, style: GoogleFonts.inter(fontSize: 10, color: Colors.white70), textAlign: TextAlign.center),
                ])).toList(),
              ),
            ]),
          ),
        ),

        // ── Founder ────────────────────────────────────────────────────────────
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 0),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Leadership', style: GoogleFonts.playfairDisplay(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.primary)),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 3))],
                ),
                child: Row(children: [
                  CircleAvatar(
                    radius: 30,
                    backgroundColor: AppTheme.secondary.withValues(alpha: 0.15),
                    child: Text('VA', style: GoogleFonts.playfairDisplay(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.secondary)),
                  ),
                  const SizedBox(width: 16),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('Vinay Arora', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.primary)),
                    Text('Founder & CEO', style: GoogleFonts.inter(fontSize: 12, color: AppTheme.secondary, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 6),
                    Text('Ex-traveller turned entrepreneur. Built YlooTrips in 2022 to bring transparency and luxury-level service to India\'s travel industry.',
                        style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textGray, height: 1.4)),
                    const SizedBox(height: 8),
                    Row(children: [
                      const Icon(Icons.location_on_outlined, size: 13, color: AppTheme.textGray),
                      const SizedBox(width: 4),
                      Text('New Delhi, India', style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textGray)),
                    ]),
                  ])),
                ]),
              ),
            ]),
          ),
        ),

        // ── Trust & Credentials ────────────────────────────────────────────────
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 24, 16, 0),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Trust & Credentials', style: GoogleFonts.playfairDisplay(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.primary)),
              const SizedBox(height: 12),
              ..._trustBadges.map((b) => Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppTheme.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppTheme.borderGray),
                ),
                child: Row(children: [
                  Container(
                    width: 40, height: 40,
                    decoration: BoxDecoration(color: const Color(0xFFD1FAE5), borderRadius: BorderRadius.circular(10)),
                    child: Icon(b.$1, color: const Color(0xFF059669), size: 20),
                  ),
                  const SizedBox(width: 14),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(b.$2, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.primary)),
                    Text(b.$3, style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textGray, height: 1.3)),
                  ])),
                  const Icon(Icons.check_circle, color: Color(0xFF059669), size: 18),
                ]),
              )),
            ]),
          ),
        ),

        // ── Company Info ───────────────────────────────────────────────────────
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 24, 16, 0),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Company Information', style: GoogleFonts.playfairDisplay(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.primary)),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: AppTheme.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.borderGray)),
                child: Column(children: [
                  _InfoRow('Legal Name', 'Ambe Enterprise'),
                  _InfoRow('MSME No.', 'UDYAM-HR-05-0141455'),
                  _InfoRow('GST No.', '07BATPV1942C1ZF'),
                  _InfoRow('Headquarters', 'New Delhi – 110001, India'),
                  _InfoRow('Founded', '2022'),
                  _InfoRow('Team Size', '50+ travel experts'),
                  _InfoRow('Support Hours', '9:00 AM – 9:00 PM, 7 days'),
                  _InfoRow('Phone', '+91-8427831127'),
                  _InfoRow('Email', 'hello@ylootrips.com', isLast: true),
                ]),
              ),
            ]),
          ),
        ),

        // ── Countries served ───────────────────────────────────────────────────
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 24, 16, 0),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('We Serve Travellers From', style: GoogleFonts.playfairDisplay(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.primary)),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8, runSpacing: 8,
                children: _countries.map((c) => Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                  decoration: BoxDecoration(color: AppTheme.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: AppTheme.borderGray)),
                  child: Text(c, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500, color: AppTheme.primary)),
                )).toList(),
              ),
            ]),
          ),
        ),

        // ── Payment methods ────────────────────────────────────────────────────
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 24, 16, 0),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Payment Methods Accepted', style: GoogleFonts.playfairDisplay(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.primary)),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: AppTheme.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.borderGray)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: _payments.map((p) => Padding(
                    padding: const EdgeInsets.symmetric(vertical: 5),
                    child: Text(p, style: GoogleFonts.inter(fontSize: 13, color: AppTheme.charcoal)),
                  )).toList(),
                ),
              ),
            ]),
          ),
        ),

        // ── CTA ────────────────────────────────────────────────────────────────
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(color: AppTheme.primary, borderRadius: BorderRadius.circular(20)),
              child: Column(children: [
                Text('Ready to Travel?', style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                const SizedBox(height: 6),
                Text('Free consultation · No booking fees · Best price promise',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(fontSize: 12, color: Colors.white70)),
                const SizedBox(height: 16),
                Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                  ElevatedButton.icon(
                    onPressed: () => launchUrl(
                        Uri.parse(AppConfig.whatsappUrl('Hi! I\'d like to plan a trip.')),
                        mode: LaunchMode.externalApplication),
                    icon: const Icon(Icons.chat_bubble_outline, size: 16),
                    label: const Text('WhatsApp Us'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF25D366),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                  const SizedBox(width: 10),
                  OutlinedButton.icon(
                    onPressed: () {
                      final url = AppConfig.siteUrl;
                      if (kIsWeb) {
                        launchUrl(Uri.parse(url), mode: LaunchMode.platformDefault);
                      } else {
                        context.push('/payment', extra: {'url': url, 'title': 'YlooTrips', 'successUrl': '', 'failureUrl': ''});
                      }
                    },
                    icon: const Icon(Icons.public, size: 16),
                    label: const Text('Website'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.white,
                      side: const BorderSide(color: Colors.white54),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                ]),
              ]),
            ),
          ),
        ),

        const SliverToBoxAdapter(child: SizedBox(height: 32)),
      ]),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label, value;
  final bool isLast;
  const _InfoRow(this.label, this.value, {this.isLast = false});

  @override
  Widget build(BuildContext context) => Column(children: [
    Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(children: [
        SizedBox(width: 120, child: Text(label, style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textGray))),
        Expanded(child: Text(value, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.primary))),
      ]),
    ),
    if (!isLast) const Divider(height: 1, color: AppTheme.borderGray),
  ]);
}
