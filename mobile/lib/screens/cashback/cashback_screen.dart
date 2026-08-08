import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/wallet_provider.dart';

class CashbackScreen extends StatelessWidget {
  const CashbackScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final wallet = context.watch<WalletProvider>();

    return Scaffold(
      backgroundColor: AppTheme.cream,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            backgroundColor: AppTheme.amber,
            expandedHeight: 220,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF006CE4), Color(0xFF0055B3)],
                  ),
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(20, 56, 20, 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.diamond,
                                color: Colors.white, size: 28),
                            const SizedBox(width: 10),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('WanderLoot',
                                    style: GoogleFonts.inter(
                                        fontSize: 22,
                                        fontWeight: FontWeight.w800,
                                        color: Colors.white)),
                                Text('Your Rewards Wallet',
                                    style: GoogleFonts.inter(
                                        fontSize: 12,
                                        color: Colors.white70)),
                              ],
                            ),
                          ],
                        ),
                        const Spacer(),
                        Text('Available Balance',
                            style: GoogleFonts.inter(
                                fontSize: 12, color: Colors.white70)),
                        Text(
                          '₹${wallet.balance.toStringAsFixed(2)}',
                          style: GoogleFonts.inter(
                            fontSize: 36,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
                        Text(
                          wallet.balance > 0
                              ? '🎉 You have ₹${wallet.balance.toStringAsFixed(0)} ready to use!'
                              : '🌟 Earn cashback on every trip!',
                          style: GoogleFonts.inter(
                              fontSize: 12, color: Colors.white70),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            title: Text('WanderLoot Rewards',
                style: GoogleFonts.inter(
                    fontWeight: FontWeight.w700,
                    color: Colors.white)),
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  // How it works
                  _SectionCard(
                    title: 'How to Earn',
                    child: Column(
                      children: [
                        _EarnItem(
                          icon: Icons.luggage_outlined,
                          title: 'Book a Tour Package',
                          subtitle: 'Earn up to 5% cashback',
                          color: AppTheme.amber,
                        ),
                        _EarnItem(
                          icon: Icons.flight_outlined,
                          title: 'Book a Flight',
                          subtitle: 'Earn ₹100 per booking',
                          color: const Color(0xFF3B82F6),
                        ),
                        _EarnItem(
                          icon: Icons.hotel_outlined,
                          title: 'Book a Hotel',
                          subtitle: 'Earn ₹50 per night',
                          color: const Color(0xFF8B5CF6),
                        ),
                        _EarnItem(
                          icon: Icons.people_outline,
                          title: 'Refer a Friend',
                          subtitle: 'Earn ₹1,000 per referral',
                          color: const Color(0xFF10B981),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // How to use
                  _SectionCard(
                    title: 'How to Use',
                    child: Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppTheme.amberLight,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.info_outline,
                                  color: AppTheme.amber, size: 18),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  'Use up to 10% of your booking value from WanderLoot wallet at checkout.',
                                  style: GoogleFonts.inter(
                                      fontSize: 13,
                                      color: AppTheme.charcoal,
                                      height: 1.5),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: _StepCard('1', 'Shop',
                                  'Choose a tour, flight or hotel'),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: _StepCard('2', 'Apply',
                                  'Use WanderLoot at checkout'),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: _StepCard('3', 'Save',
                                  'Instant discount applied'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Transaction history
                  _SectionCard(
                    title: 'Transaction History',
                    child: wallet.transactions.isEmpty
                        ? Padding(
                            padding: const EdgeInsets.all(20),
                            child: Column(
                              children: [
                                const Icon(Icons.receipt_long_outlined,
                                    size: 40, color: AppTheme.textGray),
                                const SizedBox(height: 8),
                                Text(
                                  'No transactions yet.\nBook a trip to earn cashback!',
                                  textAlign: TextAlign.center,
                                  style: GoogleFonts.inter(
                                      fontSize: 13,
                                      color: AppTheme.textGray),
                                ),
                              ],
                            ),
                          )
                        : Column(
                            children:
                                wallet.transactions.take(10).map((t) {
                              final isCredit = t['type'] == 'credit';
                              return ListTile(
                                contentPadding: EdgeInsets.zero,
                                leading: Container(
                                  width: 38,
                                  height: 38,
                                  decoration: BoxDecoration(
                                    color: isCredit
                                        ? const Color(0xFFD1FAE5)
                                        : const Color(0xFFFEE2E2),
                                    shape: BoxShape.circle,
                                  ),
                                  child: Icon(
                                    isCredit
                                        ? Icons.add
                                        : Icons.remove,
                                    size: 18,
                                    color: isCredit
                                        ? const Color(0xFF059669)
                                        : AppTheme.red,
                                  ),
                                ),
                                title: Text(
                                  t['reason'] ?? '',
                                  style: GoogleFonts.inter(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w500),
                                ),
                                subtitle: Text(
                                  _formatDate(
                                      t['date']?.toString() ?? ''),
                                  style: GoogleFonts.inter(
                                      fontSize: 11,
                                      color: AppTheme.textGray),
                                ),
                                trailing: Text(
                                  '${isCredit ? '+' : '-'}₹${(t['amount'] as double).toStringAsFixed(0)}',
                                  style: GoogleFonts.inter(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700,
                                    color: isCredit
                                        ? const Color(0xFF059669)
                                        : AppTheme.red,
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                  ),

                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(String iso) {
    try {
      final dt = DateTime.parse(iso);
      return '${dt.day}/${dt.month}/${dt.year}';
    } catch (_) {
      return '';
    }
  }
}

class _SectionCard extends StatelessWidget {
  final String title;
  final Widget child;
  const _SectionCard({required this.title, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              style: GoogleFonts.playfairDisplay(
                  fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }
}

class _EarnItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;

  const _EarnItem({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: color.withOpacity(0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.charcoal)),
                Text(subtitle,
                    style: GoogleFonts.inter(
                        fontSize: 11, color: AppTheme.textGray)),
              ],
            ),
          ),
          const Icon(Icons.chevron_right,
              color: AppTheme.textGray, size: 18),
        ],
      ),
    );
  }
}

class _StepCard extends StatelessWidget {
  final String step;
  final String title;
  final String sub;
  const _StepCard(this.step, this.title, this.sub);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
      decoration: BoxDecoration(
        color: AppTheme.cream,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 24,
            height: 24,
            decoration: const BoxDecoration(
              color: AppTheme.amber,
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(step,
                  style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: Colors.white)),
            ),
          ),
          const SizedBox(height: 6),
          Text(title,
              style: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.charcoal)),
          const SizedBox(height: 2),
          Text(sub,
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                  fontSize: 9, color: AppTheme.textGray)),
        ],
      ),
    );
  }
}
