import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/remote_config_provider.dart';
import '../screens/splash_screen.dart';
import '../screens/main_shell.dart';
import '../screens/home/home_screen.dart';
import '../screens/flights/flight_search_screen.dart';
import '../screens/flights/flight_results_screen.dart';
import '../screens/flights/flight_book_screen.dart';
import '../screens/hotels/hotel_search_screen.dart';
import '../screens/trips/trips_screen.dart';
import '../screens/trips/package_detail_screen.dart';
import '../screens/planner/trip_planner_screen.dart';
import '../screens/cashback/cashback_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/booking/payment_webview_screen.dart';
import '../screens/bookings/my_bookings_screen.dart';
import '../screens/bookings/booking_confirmed_screen.dart';
import '../screens/reviews/reviews_screen.dart';
import '../screens/blogs/blogs_screen.dart';
import '../screens/about/about_screen.dart';
import '../screens/offers/offers_screen.dart';
import '../screens/wishlist/wishlist_screen.dart';
import '../screens/visa/visa_guide_screen.dart';
import '../screens/remote_web_screen.dart';
import '../screens/force_update_screen.dart';

final router = GoRouter(
  initialLocation: '/splash',
  routes: [
    GoRoute(
      path: '/splash',
      builder: (c, s) => const SplashScreen(),
    ),
    ShellRoute(
      builder: (context, state, child) => MainShell(child: child),
      routes: [
        GoRoute(path: '/', builder: (c, s) => const HomeScreen()),
        GoRoute(path: '/flights', builder: (c, s) => const FlightSearchScreen()),
        GoRoute(path: '/hotels', builder: (c, s) {
          final extra = s.extra as Map<String, dynamic>?;
          return HotelSearchScreen(
            initialCity: extra?['city'] as String?,
            initialCheckIn: extra?['checkIn'] as String?,
            initialCheckOut: extra?['checkOut'] as String?,
            initialGuests: extra?['guests'] as int?,
            autoSearch: (extra?['autoSearch'] as bool?) ?? false,
          );
        }),
        GoRoute(path: '/trips', builder: (c, s) {
          final extra = s.extra as Map<String, dynamic>?;
          return TripsScreen(
            initialQuery: extra?['query'] as String?,
            initialCategory: extra?['category'] as String?,
          );
        }),
        GoRoute(path: '/profile', builder: (c, s) => const ProfileScreen()),
        GoRoute(path: '/planner', builder: (c, s) => const TripPlannerScreen()),
        GoRoute(path: '/cashback', builder: (c, s) => const CashbackScreen()),
        GoRoute(path: '/offers', builder: (c, s) => const OffersScreen()),
      ],
    ),
    GoRoute(
      path: '/flights/results',
      builder: (c, s) {
        final extra = s.extra as Map<String, dynamic>?;
        return FlightResultsScreen(searchParams: extra ?? {});
      },
    ),
    GoRoute(
      path: '/flights/book',
      builder: (c, s) {
        final extra = s.extra as Map<String, dynamic>?;
        return FlightBookScreen(flight: extra ?? {});
      },
    ),
    GoRoute(
      path: '/package',
      builder: (c, s) {
        final extra = s.extra as Map<String, dynamic>?;
        return PackageDetailScreen(packageData: extra ?? {});
      },
    ),
    GoRoute(path: '/my-bookings', builder: (c, s) => const MyBookingsScreen()),
    GoRoute(
      path: '/booking-confirmed',
      builder: (c, s) {
        final extra = s.extra as Map<String, dynamic>?;
        return BookingConfirmedScreen(
          bookingRef: extra?['ref'] as String? ?? 'YLO-XXXX',
          tripTitle: extra?['tripTitle'] as String? ?? '',
          totalAmount: (extra?['totalAmount'] as num?)?.toInt() ?? 0,
          cashbackEarned: (extra?['cashbackEarned'] as num?)?.toInt() ?? 0,
          walletUsed: (extra?['walletUsed'] as num?)?.toInt() ?? 0,
        );
      },
    ),
    GoRoute(path: '/reviews', builder: (c, s) {
      final url = c.read<RemoteConfigProvider>().webRouteUrl('/reviews');
      return url != null ? RemoteWebScreen(url: url, title: 'Reviews') : const ReviewsScreen();
    }),
    GoRoute(path: '/blogs', builder: (c, s) {
      final url = c.read<RemoteConfigProvider>().webRouteUrl('/blogs');
      return url != null ? RemoteWebScreen(url: url, title: 'Blog') : const BlogsScreen();
    }),
    GoRoute(path: '/about', builder: (c, s) {
      final url = c.read<RemoteConfigProvider>().webRouteUrl('/about');
      return url != null ? RemoteWebScreen(url: url, title: 'About Us') : const AboutScreen();
    }),
    GoRoute(path: '/wishlist', builder: (c, s) => const WishlistScreen()),
    GoRoute(path: '/visa-guide', builder: (c, s) {
      final url = c.read<RemoteConfigProvider>().webRouteUrl('/visa-guide');
      return url != null ? RemoteWebScreen(url: url, title: 'Visa Guide') : const VisaGuideScreen();
    }),
    GoRoute(
      path: '/force-update',
      builder: (c, s) {
        final rc = c.read<RemoteConfigProvider>();
        return ForceUpdateScreen(message: rc.updateMessage, updateUrl: rc.updateUrl);
      },
    ),
    GoRoute(
      path: '/maintenance',
      builder: (c, s) {
        final rc = c.read<RemoteConfigProvider>();
        return Scaffold(
          backgroundColor: const Color(0xFFF5F1EB),
          body: Center(child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
              const Icon(Icons.construction_rounded, size: 64, color: Color(0xFFD97706)),
              const SizedBox(height: 20),
              Text('Under Maintenance', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: const Color(0xFF1C1C1C))),
              const SizedBox(height: 12),
              Text(rc.maintenanceMessage, textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 14, color: Color(0xFF6B7280), height: 1.6)),
            ]),
          )),
        );
      },
    ),
    GoRoute(
      path: '/web',
      builder: (c, s) {
        final extra = s.extra as Map<String, dynamic>?;
        return RemoteWebScreen(
          url: extra?['url'] as String? ?? 'https://www.ylootrips.com',
          title: extra?['title'] as String? ?? 'YlooTrips',
        );
      },
    ),
    GoRoute(
      path: '/payment',
      builder: (c, s) {
        final extra = s.extra as Map<String, dynamic>?;
        final url = extra?['url'] as String? ?? '';
        if (kIsWeb && url.isNotEmpty) {
          launchUrl(Uri.parse(url), mode: LaunchMode.platformDefault);
          return const Scaffold(body: Center(child: CircularProgressIndicator()));
        }
        return PaymentWebviewScreen(
          url: url,
          successUrl: extra?['successUrl'] ?? '',
          failureUrl: extra?['failureUrl'] ?? '',
          title: extra?['title'] ?? 'Payment',
          walletDeducted: (extra?['walletDeducted'] as num?)?.toInt() ?? 0,
          totalAmount: (extra?['totalAmount'] as num?)?.toInt() ?? 0,
          tripTitle: extra?['tripTitle'] as String? ?? '',
        );
      },
    ),
  ],
);
