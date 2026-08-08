import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_config.dart';
import '../../config/theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/currency_provider.dart';
import '../../providers/wallet_provider.dart';

/// Opens a URL in-app WebView on mobile, new tab on Flutter web.
void _openUrl(BuildContext context, String url, String title) {
  if (kIsWeb) {
    launchUrl(Uri.parse(url), mode: LaunchMode.platformDefault);
  } else {
    context.push('/payment', extra: {
      'url': url,
      'title': title,
      'successUrl': '',
      'failureUrl': '',
    });
  }
}

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final currency = context.watch<CurrencyProvider>();
    final wallet = context.watch<WalletProvider>();

    return Scaffold(
      backgroundColor: AppTheme.bg,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            backgroundColor: AppTheme.primary,
            foregroundColor: Colors.white,
            pinned: true,
            title: Text('My Profile',
                style: GoogleFonts.inter(fontWeight: FontWeight.w700, color: Colors.white)),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  // Traveller card
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF006CE4), Color(0xFF0055B3)],
                      ),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 28,
                          backgroundColor: Colors.white30,
                          child: Text(
                            auth.displayName[0].toUpperCase(),
                            style: GoogleFonts.inter(
                                fontSize: 22,
                                fontWeight: FontWeight.w700,
                                color: Colors.white),
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(auth.displayName,
                                  style: GoogleFonts.inter(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w700,
                                      color: Colors.white)),
                              Text(
                                auth.phone.isNotEmpty
                                    ? '+91 ${auth.phone}'
                                    : 'No account needed — just travel!',
                                style: GoogleFonts.inter(
                                    fontSize: 12, color: Colors.white70),
                              ),
                              const SizedBox(height: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: Colors.white30,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  '₹${wallet.balance.toStringAsFixed(0)} WanderLoot',
                                  style: GoogleFonts.inter(
                                      fontSize: 11,
                                      color: Colors.white,
                                      fontWeight: FontWeight.w600),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Bookings
                  _SettingsSection(
                    title: 'My Bookings',
                    items: [
                      _SettingsItem(
                        icon: Icons.confirmation_number_outlined,
                        title: 'Track Booking',
                        subtitle: 'Check status by reference or email',
                        onTap: () => context.push('/my-bookings'),
                      ),
                      _SettingsItem(
                        icon: Icons.history,
                        title: 'Booking History',
                        subtitle: 'View all past & upcoming trips',
                        onTap: () => context.push('/my-bookings'),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  // Explore
                  _SettingsSection(
                    title: 'Explore',
                    items: [
                      _SettingsItem(
                        icon: Icons.favorite_border,
                        title: 'Saved Trips',
                        subtitle: 'Your wishlist & saved packages',
                        onTap: () => context.push('/wishlist'),
                      ),
                      _SettingsItem(
                        icon: Icons.local_offer_outlined,
                        title: 'Exclusive Deals',
                        subtitle: 'Flash sales & promo codes',
                        onTap: () => context.go('/offers'),
                      ),
                      _SettingsItem(
                        icon: Icons.flight_takeoff_outlined,
                        title: 'Visa Guide',
                        subtitle: 'Requirements for Indian passport',
                        onTap: () => context.push('/visa-guide'),
                      ),
                      _SettingsItem(
                        icon: Icons.star_outline,
                        title: 'Traveller Reviews',
                        subtitle: '2,500+ verified reviews',
                        onTap: () => context.push('/reviews'),
                      ),
                      _SettingsItem(
                        icon: Icons.article_outlined,
                        title: 'Travel Journal & Blog',
                        subtitle: 'Guides, tips and destination stories',
                        onTap: () => context.push('/blogs'),
                      ),
                      _SettingsItem(
                        icon: Icons.info_outline,
                        title: 'About YlooTrips',
                        subtitle: 'Our story, team & certifications',
                        onTap: () => context.push('/about'),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  // Currency
                  _SettingsSection(
                    title: 'Preferences',
                    items: [
                      _SettingsItem(
                        icon: Icons.currency_exchange,
                        title: 'Currency',
                        subtitle: currency.currency,
                        onTap: () => _showCurrencySheet(
                            context, currency),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  // Support
                  _SettingsSection(
                    title: 'Support',
                    items: [
                      _SettingsItem(
                        icon: Icons.chat_bubble_outline,
                        title: 'WhatsApp Support',
                        subtitle: AppConfig.phone,
                        onTap: () async {
                          final url = Uri.parse(
                              AppConfig.whatsappUrl('Hi! I need help.'));
                          if (await canLaunchUrl(url)) {
                            await launchUrl(url,
                                mode: LaunchMode.externalApplication);
                          }
                        },
                      ),
                      _SettingsItem(
                        icon: Icons.email_outlined,
                        title: 'Email Us',
                        subtitle: AppConfig.contactEmail,
                        onTap: () async {
                          final url = Uri.parse(
                              'mailto:${AppConfig.contactEmail}');
                          if (await canLaunchUrl(url)) {
                            await launchUrl(url);
                          }
                        },
                      ),
                      _SettingsItem(
                        icon: Icons.public,
                        title: 'Visit Website',
                        subtitle: AppConfig.siteUrl,
                        onTap: () => _openUrl(context, AppConfig.siteUrl, 'YlooTrips'),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  // Legal
                  _SettingsSection(
                    title: 'Legal',
                    items: [
                      _SettingsItem(
                        icon: Icons.privacy_tip_outlined,
                        title: 'Privacy Policy',
                        onTap: () => _openUrl(context,
                            '${AppConfig.siteUrl}/privacy-policy', 'Privacy Policy'),
                      ),
                      _SettingsItem(
                        icon: Icons.description_outlined,
                        title: 'Terms & Conditions',
                        onTap: () => _openUrl(context,
                            '${AppConfig.siteUrl}/terms', 'Terms & Conditions'),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  // Version
                  Text(
                    '${AppConfig.appName} v1.4.0 · ${AppConfig.tagline}',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(
                        fontSize: 11, color: AppTheme.textGray),
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

  void _showCurrencySheet(
      BuildContext context, CurrencyProvider currency) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(height: 16),
          Text('Select Currency',
              style: GoogleFonts.inter(
                  fontSize: 18, fontWeight: FontWeight.w700, color: AppTheme.dark)),
          const SizedBox(height: 8),
          ...currency.currencies.map((c) => ListTile(
                title: Text(c, style: GoogleFonts.inter()),
                trailing: c == currency.currency
                    ? const Icon(Icons.check, color: AppTheme.primary)
                    : null,
                onTap: () {
                  currency.setCurrency(c);
                  Navigator.pop(context);
                },
              )),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _SettingsSection extends StatelessWidget {
  final String title;
  final List<_SettingsItem> items;

  const _SettingsSection(
      {required this.title, required this.items});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 8),
          child: Text(title,
              style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.textGray,
                  letterSpacing: 0.5)),
        ),
        Container(
          decoration: BoxDecoration(
            color: AppTheme.white,
            borderRadius: BorderRadius.circular(14),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            children: items
                .asMap()
                .entries
                .map((entry) {
                  final isLast = entry.key == items.length - 1;
                  return Column(
                    children: [
                      entry.value,
                      if (!isLast)
                        const Divider(
                            height: 1,
                            indent: 52,
                            color: AppTheme.borderGray),
                    ],
                  );
                })
                .toList(),
          ),
        ),
      ],
    );
  }
}

class _SettingsItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? subtitle;
  final VoidCallback onTap;

  const _SettingsItem({
    required this.icon,
    required this.title,
    this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: onTap,
      leading: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: AppTheme.amberLight,
          borderRadius: BorderRadius.circular(9),
        ),
        child: Icon(icon, color: AppTheme.amber, size: 18),
      ),
      title: Text(title,
          style: GoogleFonts.inter(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: AppTheme.charcoal)),
      subtitle: subtitle != null
          ? Text(subtitle!,
              style: GoogleFonts.inter(
                  fontSize: 11, color: AppTheme.textGray))
          : null,
      trailing: const Icon(Icons.chevron_right,
          color: AppTheme.textGray, size: 18),
    );
  }
}
