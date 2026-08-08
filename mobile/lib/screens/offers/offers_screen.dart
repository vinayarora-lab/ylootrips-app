import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_config.dart';
import '../../config/theme.dart';
import '../../providers/remote_config_provider.dart';

class OffersScreen extends StatefulWidget {
  const OffersScreen({super.key});
  @override
  State<OffersScreen> createState() => _OffersScreenState();
}

class _OffersScreenState extends State<OffersScreen> {
  int _selectedCat = 0;
  late Timer _timer;
  Duration _flashLeft = const Duration(hours: 5, minutes: 47, seconds: 22);

  static const _cats = ['All Deals', 'Honeymoon', 'International', 'Beach', 'Adventure', 'Heritage'];


  List<Map<String, dynamic>> _filtered(List<Map<String, dynamic>> deals) {
    if (_selectedCat == 0) return List<Map<String,dynamic>>.from(deals);
    final cat = _cats[_selectedCat];
    return deals.where((d) => d['category'] == cat).toList();
  }

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (_flashLeft.inSeconds > 0) {
        setState(() => _flashLeft -= const Duration(seconds: 1));
      }
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  String _fmt(int v) => v.toString().padLeft(2, '0');

  @override
  Widget build(BuildContext context) {
    final rc = context.watch<RemoteConfigProvider>();
    final deals = rc.deals;
    final promos = rc.promos;
    final filtered = _filtered(deals);
    return Scaffold(
      backgroundColor: AppTheme.cream,
      body: CustomScrollView(slivers: [
        // ── App bar ───────────────────────────────────────────────────────────
        SliverAppBar(
          pinned: true,
          expandedHeight: 120,
          backgroundColor: const Color(0xFF1a3c34),
          foregroundColor: Colors.white,
          flexibleSpace: FlexibleSpaceBar(
            titlePadding: const EdgeInsets.fromLTRB(16, 0, 16, 14),
            title: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Exclusive Deals', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white)),
              Text('Limited time · Guaranteed best price', style: GoogleFonts.inter(fontSize: 10, color: Colors.white60)),
            ]),
            background: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(colors: [Color(0xFF1a3c34), Color(0xFF2d6a4f)]),
              ),
            ),
          ),
        ),

        // ── Flash countdown ───────────────────────────────────────────────────
        SliverToBoxAdapter(
          child: Container(
            margin: const EdgeInsets.fromLTRB(16, 16, 16, 0),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFFDC2626), Color(0xFFEA580C)]),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(children: [
              const Icon(Icons.local_fire_department, color: Colors.white, size: 28),
              const SizedBox(width: 10),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Flash Sale Ends In', style: GoogleFonts.inter(fontSize: 11, color: Colors.white70)),
                Text('Grab deals before they\'re gone!', style: GoogleFonts.inter(fontSize: 12, color: Colors.white, fontWeight: FontWeight.w600)),
              ])),
              _CountdownBox(_fmt(_flashLeft.inHours)),
              const Padding(padding: EdgeInsets.symmetric(horizontal: 4), child: Text(':', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold))),
              _CountdownBox(_fmt(_flashLeft.inMinutes % 60)),
              const Padding(padding: EdgeInsets.symmetric(horizontal: 4), child: Text(':', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold))),
              _CountdownBox(_fmt(_flashLeft.inSeconds % 60)),
            ]),
          ),
        ),

        // ── Promo codes ───────────────────────────────────────────────────────
        SliverToBoxAdapter(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 20, 16, 10),
              child: Text('Promo Codes', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w700, color: AppTheme.primary)),
            ),
            SizedBox(
              height: 90,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
                itemCount: promos.length,
                itemBuilder: (_, i) {
                  final p = promos[i];
                  final code = p['code'] as String? ?? '';
                  return GestureDetector(
                    onTap: () => _copyCode(context, code),
                    child: Container(
                      width: 200,
                      margin: const EdgeInsets.only(right: 12),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppTheme.amber.withValues(alpha: 0.4)),
                        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 8, offset: const Offset(0, 2))],
                      ),
                      child: Row(children: [
                        Text(p['emoji'] as String? ?? '🎁', style: const TextStyle(fontSize: 24)),
                        const SizedBox(width: 10),
                        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.center, children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(color: AppTheme.amber.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(6)),
                            child: Text(code, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w800, color: AppTheme.amber, letterSpacing: 1)),
                          ),
                          const SizedBox(height: 4),
                          Text(p['title'] as String? ?? '', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: AppTheme.primary)),
                          Text(p['sub'] as String? ?? '', style: GoogleFonts.inter(fontSize: 9, color: AppTheme.textGray)),
                        ])),
                        const Icon(Icons.copy, size: 14, color: AppTheme.textGray),
                      ]),
                    ),
                  );
                },
              ),
            ),
          ]),
        ),

        // ── Category chips ───────────────────────────────────────────────────
        SliverToBoxAdapter(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 20, 16, 10),
              child: Text('All Deals', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w700, color: AppTheme.primary)),
            ),
            SizedBox(
              height: 36,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
                itemCount: _cats.length,
                itemBuilder: (_, i) => GestureDetector(
                  onTap: () => setState(() => _selectedCat = i),
                  child: Container(
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                    decoration: BoxDecoration(
                      color: _selectedCat == i ? AppTheme.secondary : AppTheme.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: _selectedCat == i ? AppTheme.secondary : AppTheme.borderGray),
                    ),
                    child: Text(_cats[i], style: GoogleFonts.inter(
                      fontSize: 12, fontWeight: FontWeight.w600,
                      color: _selectedCat == i ? Colors.white : AppTheme.charcoal,
                    )),
                  ),
                ),
              ),
            ),
          ]),
        ),

        // ── Deal cards ───────────────────────────────────────────────────────
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
          sliver: SliverList(
            delegate: SliverChildBuilderDelegate(
              (_, i) => _DealCard(deal: filtered[i]),
              childCount: filtered.length,
            ),
          ),
        ),

        // ── WanderLoot promo ─────────────────────────────────────────────────
        SliverToBoxAdapter(
          child: Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFF006CE4), Color(0xFF0055B3)]),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(children: [
              const Icon(Icons.account_balance_wallet_outlined, color: Colors.white, size: 36),
              const SizedBox(height: 10),
              Text('Earn WanderLoot Cashback', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white)),
              const SizedBox(height: 6),
              Text('Get 10% cashback on every booking. Redeem on future trips — no expiry!',
                  textAlign: TextAlign.center, style: GoogleFonts.inter(fontSize: 12, color: Colors.white, height: 1.5)),
              const SizedBox(height: 14),
              ElevatedButton(
                onPressed: () => context.push('/cashback'),
                style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: AppTheme.amber,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
                child: Text('View My Wallet', style: GoogleFonts.inter(fontWeight: FontWeight.w700)),
              ),
            ]),
          ),
        ),

        const SliverToBoxAdapter(child: SizedBox(height: 80)),
      ]),
    );
  }

  void _copyCode(BuildContext context, String code) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text('Code "$code" copied! Apply at checkout.', style: GoogleFonts.inter()),
      backgroundColor: AppTheme.secondary,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      duration: const Duration(seconds: 2),
    ));
  }
}

class _CountdownBox extends StatelessWidget {
  final String value;
  const _CountdownBox(this.value);
  @override
  Widget build(BuildContext context) => Container(
    width: 42, height: 42,
    decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(8)),
    child: Center(child: Text(value, style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white))),
  );
}

class _DealCard extends StatelessWidget {
  final Map<String, dynamic> deal;
  const _DealCard({required this.deal});

  @override
  Widget build(BuildContext context) {
    final seats = deal['seats'] as int;
    final seatsColor = seats <= 3 ? const Color(0xFFDC2626) : AppTheme.secondary;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 16, offset: const Offset(0, 4))],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // Image
        ClipRRect(
          borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
          child: Stack(children: [
            Image.network(deal['image'] as String, height: 180, width: double.infinity, fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(height: 180, color: const Color(0xFF1a3c34))),
            // Discount badge
            Positioned(top: 12, left: 12, child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(color: const Color(0xFFDC2626), borderRadius: BorderRadius.circular(20)),
              child: Text('${deal['discount']} OFF', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w800, color: Colors.white)),
            )),
            // Badge
            Positioned(top: 12, right: 12, child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(20)),
              child: Text(deal['badge'] as String, style: GoogleFonts.inter(fontSize: 11, color: Colors.white, fontWeight: FontWeight.w600)),
            )),
            // Seats left
            Positioned(bottom: 12, left: 12, child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(color: seatsColor, borderRadius: BorderRadius.circular(20)),
              child: Text('$seats seats left', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.white)),
            )),
          ]),
        ),
        // Content
        Padding(
          padding: const EdgeInsets.all(14),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(deal['title'] as String, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700, color: AppTheme.primary)),
            const SizedBox(height: 3),
            Text(deal['subtitle'] as String, style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textGray)),
            const SizedBox(height: 12),
            Row(children: [
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(deal['originalPrice'] as String,
                    style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textGray, decoration: TextDecoration.lineThrough)),
                Text(deal['salePrice'] as String,
                    style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w800, color: AppTheme.primary)),
              ]),
              const Spacer(),
              ElevatedButton(
                onPressed: () async {
                  final url = Uri.parse(AppConfig.whatsappUrl('Hi! I want to book: ${deal['title']} at ${deal['salePrice']}'));
                  if (await canLaunchUrl(url)) launchUrl(url, mode: LaunchMode.externalApplication);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.secondary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                ),
                child: Text('Book Now', style: GoogleFonts.inter(fontWeight: FontWeight.w700)),
              ),
            ]),
          ]),
        ),
      ]),
    );
  }
}
