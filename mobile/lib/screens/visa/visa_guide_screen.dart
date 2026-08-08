import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_config.dart';
import '../../config/theme.dart';

class VisaGuideScreen extends StatefulWidget {
  const VisaGuideScreen({super.key});
  @override
  State<VisaGuideScreen> createState() => _VisaGuideScreenState();
}

class _VisaGuideScreenState extends State<VisaGuideScreen> {
  String _search = '';
  int _selRegion = 0;

  static const _regions = ['All', 'Asia', 'Europe', 'Middle East', 'Americas', 'Oceania'];

  static const _countries = [
    {
      'name': 'Bali (Indonesia)', 'flag': '🇮🇩', 'region': 'Asia',
      'visaType': 'Visa on Arrival', 'fee': 'Free (30 days)',
      'duration': '30 days', 'process': '1–2 days',
      'docs': ['Passport (6+ months valid)', 'Return ticket', 'Hotel booking', 'USD 500+ funds'],
      'tip': 'Extendable once for 30 more days at local immigration office.',
      'difficulty': 0, // 0=Easy, 1=Moderate, 2=Complex
      'color': Color(0xFF059669),
    },
    {
      'name': 'Thailand', 'flag': '🇹🇭', 'region': 'Asia',
      'visaType': 'Visa on Arrival', 'fee': '₹2,500 (THB 2,000)',
      'duration': '15 days', 'process': '1–3 days',
      'docs': ['Passport (6+ months valid)', 'Photo (4×6 cm)', 'Return ticket', 'THB 10,000+ funds'],
      'tip': 'Apply Tourist Visa in advance for 60 days. VOA only at major airports.',
      'difficulty': 0,
      'color': Color(0xFF059669),
    },
    {
      'name': 'Dubai (UAE)', 'flag': '🇦🇪', 'region': 'Middle East',
      'visaType': 'Tourist Visa', 'fee': '₹4,500–₹8,000',
      'duration': '30 / 90 days', 'process': '3–5 days',
      'docs': ['Passport (6+ months valid)', 'Photo', 'Bank statement (3 months)', 'Hotel booking', 'Travel insurance'],
      'tip': 'Apply through Emirates or Etihad Airlines or a registered UAE visa agent.',
      'difficulty': 0,
      'color': Color(0xFF059669),
    },
    {
      'name': 'Singapore', 'flag': '🇸🇬', 'region': 'Asia',
      'visaType': 'Tourist Visa', 'fee': 'SGD 30 (≈₹1,800)',
      'duration': '30 days', 'process': '3–5 days',
      'docs': ['Passport', 'Photo', 'Bank statement', 'Flight tickets', 'Accommodation proof'],
      'tip': 'Indians with valid US/UK/Schengen visa can enter visa-free for 30 days.',
      'difficulty': 0,
      'color': Color(0xFF059669),
    },
    {
      'name': 'Sri Lanka', 'flag': '🇱🇰', 'region': 'Asia',
      'visaType': 'ETA (Online)', 'fee': 'USD 20 (≈₹1,700)',
      'duration': '30 days', 'process': 'Instant',
      'docs': ['Passport', 'Credit/debit card for payment'],
      'tip': 'Apply at eta.gov.lk — approved within minutes. Very straightforward.',
      'difficulty': 0,
      'color': Color(0xFF059669),
    },
    {
      'name': 'Vietnam', 'flag': '🇻🇳', 'region': 'Asia',
      'visaType': 'E-Visa', 'fee': 'USD 25 (≈₹2,100)',
      'duration': '90 days', 'process': '3 business days',
      'docs': ['Passport (6+ months valid)', 'Photo', 'Passport scans', 'Debit/credit card'],
      'tip': 'Apply at evisa.xuatnhapcanh.gov.vn. Single or multiple entry available.',
      'difficulty': 0,
      'color': Color(0xFF059669),
    },
    {
      'name': 'Maldives', 'flag': '🇲🇻', 'region': 'Asia',
      'visaType': 'Free on Arrival', 'fee': 'Free (30 days)',
      'duration': '30 days', 'process': 'Instant',
      'docs': ['Passport (6+ months valid)', 'Hotel booking', 'Return ticket', 'USD 100/day funds'],
      'tip': 'One of the easiest countries for Indians. No visa needed — just land and enjoy!',
      'difficulty': 0,
      'color': Color(0xFF059669),
    },
    {
      'name': 'Malaysia', 'flag': '🇲🇾', 'region': 'Asia',
      'visaType': 'Visa Free', 'fee': 'Free (30 days)',
      'duration': '30 days', 'process': 'Instant',
      'docs': ['Passport (6+ months valid)', 'Return ticket', 'Sufficient funds'],
      'tip': 'Indians get 30 days visa-free. KLIA2 has fast immigration for Indians.',
      'difficulty': 0,
      'color': Color(0xFF059669),
    },
    {
      'name': 'UK', 'flag': '🇬🇧', 'region': 'Europe',
      'visaType': 'Standard Visitor Visa', 'fee': '₹12,500 (GBP 115)',
      'duration': '6 months', 'process': '15–21 days',
      'docs': ['Passport', 'Bank statements (6 months)', 'ITR', 'Employment proof', 'Hotel booking', 'Travel insurance'],
      'tip': 'Show strong ties to India — property, job, family. Biometrics required at VFS center.',
      'difficulty': 2,
      'color': Color(0xFFF59E0B),
    },
    {
      'name': 'France (Schengen)', 'flag': '🇫🇷', 'region': 'Europe',
      'visaType': 'Schengen Visa', 'fee': '₹6,800 (EUR 80)',
      'duration': '90 days in 180', 'process': '15 days',
      'docs': ['Passport (3+ months after travel)', 'Photo', 'Travel insurance (EUR 30K+)', 'Bank statement', 'Hotel booking', 'ITR'],
      'tip': 'Apply at VFS Global 3–6 weeks in advance. Valid for all 27 Schengen countries.',
      'difficulty': 1,
      'color': Color(0xFFF59E0B),
    },
    {
      'name': 'Germany (Schengen)', 'flag': '🇩🇪', 'region': 'Europe',
      'visaType': 'Schengen Visa', 'fee': '₹6,800 (EUR 80)',
      'duration': '90 days in 180', 'process': '15 days',
      'docs': ['Passport', 'Photo', 'Insurance', 'Bank statement', 'Flight itinerary', 'ITR'],
      'tip': 'German consulate is strict. Ensure 3× cost of trip in bank account.',
      'difficulty': 1,
      'color': Color(0xFFF59E0B),
    },
    {
      'name': 'USA', 'flag': '🇺🇸', 'region': 'Americas',
      'visaType': 'B1/B2 Tourist Visa', 'fee': 'USD 160 (≈₹13,500)',
      'duration': 'Up to 10 years', 'process': '30–60 days',
      'docs': ['Passport', 'DS-160 form', 'Photo', 'Bank statement', 'ITR (3 years)', 'Employment letter', 'Property proof'],
      'tip': 'Interview at US Consulate required. Show strong India ties. Valid 10 years once approved!',
      'difficulty': 2,
      'color': Color(0xFFDC2626),
    },
    {
      'name': 'Australia', 'flag': '🇦🇺', 'region': 'Oceania',
      'visaType': 'eVisitor / Tourist Visa', 'fee': 'AUD 190 (≈₹10,000)',
      'duration': '3 months', 'process': '20–40 days',
      'docs': ['Passport', 'Photo', 'Bank statement', 'Travel insurance', 'Hotel booking', 'ITR'],
      'tip': 'Apply online at ImmiAccount. Show financial stability and ties to India.',
      'difficulty': 1,
      'color': Color(0xFFF59E0B),
    },
    {
      'name': 'Japan', 'flag': '🇯🇵', 'region': 'Asia',
      'visaType': 'Tourist Visa', 'fee': '₹1,500',
      'duration': '15 days', 'process': '5–7 days',
      'docs': ['Passport', 'Photo', 'Bank statement', 'Detailed itinerary', 'Hotel bookings', 'ITR'],
      'tip': 'Very organized process. Itinerary must be day-by-day. Embassy is strict about documents.',
      'difficulty': 1,
      'color': Color(0xFFF59E0B),
    },
    {
      'name': 'New Zealand', 'flag': '🇳🇿', 'region': 'Oceania',
      'visaType': 'NZeTA + IVL', 'fee': 'NZD 23 + NZD 35 (≈₹3,500)',
      'duration': '90 days', 'process': '72 hours',
      'docs': ['Passport', 'Photo', 'Debit/credit card'],
      'tip': 'Apply online at nzeta.immigration.govt.nz. Very quick if you have valid US/UK/Schengen.',
      'difficulty': 0,
      'color': Color(0xFF059669),
    },
  ];

  List<Map<String, dynamic>> get _filtered {
    var list = List<Map<String, dynamic>>.from(_countries);
    if (_selRegion > 0) list = list.where((c) => c['region'] == _regions[_selRegion]).toList();
    if (_search.isNotEmpty) {
      list = list.where((c) => (c['name'] as String).toLowerCase().contains(_search.toLowerCase())).toList();
    }
    return list;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.cream,
      body: CustomScrollView(slivers: [
        // ── Header ────────────────────────────────────────────────────────────
        SliverAppBar(
          pinned: true,
          expandedHeight: 130,
          backgroundColor: const Color(0xFF1a3c34),
          foregroundColor: Colors.white,
          flexibleSpace: FlexibleSpaceBar(
            titlePadding: const EdgeInsets.fromLTRB(16, 0, 16, 14),
            title: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Visa Guide', style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
              Text('Requirements for Indian passport holders', style: GoogleFonts.inter(fontSize: 10, color: Colors.white60)),
            ]),
            background: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(colors: [Color(0xFF1a3c34), Color(0xFF2d6a4f)]),
              ),
              child: Align(alignment: Alignment.centerRight,
                child: Padding(padding: const EdgeInsets.only(right: 20),
                  child: Text('🌍', style: const TextStyle(fontSize: 60)))),
            ),
          ),
        ),

        // ── Search ───────────────────────────────────────────────────────────
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
            child: TextField(
              onChanged: (v) => setState(() => _search = v),
              style: GoogleFonts.inter(fontSize: 14),
              decoration: InputDecoration(
                hintText: 'Search country...',
                hintStyle: GoogleFonts.inter(color: AppTheme.textGray, fontSize: 14),
                prefixIcon: const Icon(Icons.search, color: AppTheme.textGray, size: 20),
                filled: true, fillColor: AppTheme.white,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: AppTheme.borderGray)),
                enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: AppTheme.borderGray)),
                focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.secondary, width: 1.5)),
              ),
            ),
          ),
        ),

        // ── Legend ────────────────────────────────────────────────────────────
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
            child: Row(children: [
              _LegendDot(const Color(0xFF059669), 'Easy / Free'),
              const SizedBox(width: 16),
              _LegendDot(const Color(0xFFF59E0B), 'Moderate'),
              const SizedBox(width: 16),
              _LegendDot(const Color(0xFFDC2626), 'Complex'),
            ]),
          ),
        ),

        // ── Region chips ─────────────────────────────────────────────────────
        SliverToBoxAdapter(
          child: SizedBox(
            height: 48,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
              itemCount: _regions.length,
              itemBuilder: (_, i) => GestureDetector(
                onTap: () => setState(() => _selRegion = i),
                child: Container(
                  margin: const EdgeInsets.only(right: 8),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                  decoration: BoxDecoration(
                    color: _selRegion == i ? AppTheme.secondary : AppTheme.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: _selRegion == i ? AppTheme.secondary : AppTheme.borderGray),
                  ),
                  child: Text(_regions[i], style: GoogleFonts.inter(
                    fontSize: 12, fontWeight: FontWeight.w600,
                    color: _selRegion == i ? Colors.white : AppTheme.charcoal,
                  )),
                ),
              ),
            ),
          ),
        ),

        // ── Country cards ────────────────────────────────────────────────────
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
          sliver: SliverList(
            delegate: SliverChildBuilderDelegate(
              (_, i) => _VisaCard(country: _filtered[i]),
              childCount: _filtered.length,
            ),
          ),
        ),

        // ── YlooTrips CTA ────────────────────────────────────────────────────
        SliverToBoxAdapter(
          child: Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: const Color(0xFF1a3c34), borderRadius: BorderRadius.circular(20)),
            child: Column(children: [
              const Icon(Icons.support_agent_outlined, color: Colors.white, size: 36),
              const SizedBox(height: 10),
              Text('Need Visa Assistance?', style: GoogleFonts.playfairDisplay(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
              const SizedBox(height: 6),
              Text('Our team handles all visa paperwork, documentation & submission on your behalf.',
                  textAlign: TextAlign.center, style: GoogleFonts.inter(fontSize: 12, color: Colors.white70, height: 1.5)),
              const SizedBox(height: 14),
              ElevatedButton.icon(
                onPressed: () async {
                  final url = Uri.parse(AppConfig.whatsappUrl('Hi! I need visa assistance for my trip.'));
                  if (await canLaunchUrl(url)) launchUrl(url, mode: LaunchMode.externalApplication);
                },
                icon: const Icon(Icons.chat_bubble_outline, size: 16),
                label: Text('WhatsApp Us', style: GoogleFonts.inter(fontWeight: FontWeight.w700)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF25D366),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ]),
          ),
        ),

        const SliverToBoxAdapter(child: SizedBox(height: 32)),
      ]),
    );
  }
}

class _LegendDot extends StatelessWidget {
  final Color color;
  final String label;
  const _LegendDot(this.color, this.label);
  @override
  Widget build(BuildContext context) => Row(children: [
    Container(width: 10, height: 10, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
    const SizedBox(width: 5),
    Text(label, style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textGray)),
  ]);
}

class _VisaCard extends StatefulWidget {
  final Map<String, dynamic> country;
  const _VisaCard({required this.country});
  @override
  State<_VisaCard> createState() => _VisaCardState();
}

class _VisaCardState extends State<_VisaCard> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    final c = widget.country;
    final color = c['color'] as Color;
    final docs = c['docs'] as List<String>;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderGray),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 8, offset: const Offset(0, 2))],
      ),
      child: Column(children: [
        // Header row
        GestureDetector(
          onTap: () => setState(() => _expanded = !_expanded),
          behavior: HitTestBehavior.opaque,
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Row(children: [
              Text(c['flag'] as String, style: const TextStyle(fontSize: 28)),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(c['name'] as String, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.primary)),
                const SizedBox(height: 3),
                Row(children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(6)),
                    child: Text(c['visaType'] as String, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: color)),
                  ),
                  const SizedBox(width: 6),
                  Text(c['fee'] as String, style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textGray)),
                ]),
              ])),
              Row(children: [
                Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                  Text(c['duration'] as String, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: AppTheme.primary)),
                  Text(c['process'] as String, style: GoogleFonts.inter(fontSize: 10, color: AppTheme.textGray)),
                ]),
                const SizedBox(width: 8),
                Icon(_expanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down, color: AppTheme.textGray),
              ]),
            ]),
          ),
        ),

        // Expanded details
        if (_expanded) ...[
          const Divider(height: 1, color: AppTheme.borderGray),
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Required Documents', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.primary)),
              const SizedBox(height: 8),
              ...docs.map((d) => Padding(
                padding: const EdgeInsets.only(bottom: 5),
                child: Row(children: [
                  const Icon(Icons.check_circle, size: 14, color: Color(0xFF059669)),
                  const SizedBox(width: 8),
                  Expanded(child: Text(d, style: GoogleFonts.inter(fontSize: 12, color: AppTheme.charcoal))),
                ]),
              )),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(color: const Color(0xFFFEF3C7), borderRadius: BorderRadius.circular(10)),
                child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  const Text('💡', style: TextStyle(fontSize: 14)),
                  const SizedBox(width: 8),
                  Expanded(child: Text(c['tip'] as String, style: GoogleFonts.inter(fontSize: 11, color: const Color(0xFF92400E), height: 1.4))),
                ]),
              ),
            ]),
          ),
        ],
      ]),
    );
  }
}
