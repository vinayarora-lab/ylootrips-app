import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/app_config.dart';

/// Fetches all dynamic app content from the API.
/// On first load: uses cached data instantly, then refreshes from network.
/// This means ZERO hardcoded content — everything editable from the backend.
class RemoteConfigProvider extends ChangeNotifier {
  Map<String, dynamic> _config = {};
  bool _loaded = false;
  bool get loaded => _loaded;

  // ── Getters with safe defaults ──────────────────────────────────────────────

  List<String> get banners => _strList('banners', _defaultBanners);
  List<String> get bannerLabels => _strList('bannerLabels', _defaultBannerLabels);

  List<Map<String, dynamic>> get trending => _mapList('trending', _defaultTrending);
  List<Map<String, dynamic>> get categories => _mapList('categories', _defaultCategories);
  List<Map<String, dynamic>> get deals => _mapList('deals', _defaultDeals);
  List<Map<String, dynamic>> get promos => _mapList('promos', _defaultPromos);

  String get announcement => _config['announcement'] as String? ?? '';
  bool get showAnnouncement => announcement.isNotEmpty;
  String get announcementColor => _config['announcementColor'] as String? ?? '#DC2626';

  String get whatsappNumber => _config['whatsappNumber'] as String? ?? AppConfig.whatsappNumber;
  String get contactEmail => _config['contactEmail'] as String? ?? AppConfig.contactEmail;
  String get phone => _config['phone'] as String? ?? AppConfig.phone;

  Map<String, dynamic> get stats => (_config['stats'] as Map<String, dynamic>?) ?? _defaultStats;

  String get flashSaleText => _config['flashSaleText'] as String? ?? 'Flash Sale — Up to 33% OFF';
  bool get showFlashSale => _config['showFlashSale'] as bool? ?? true;

  // ── Hero / Search card text ──────────────────────────────────────────────────
  String get heroTitle => _config['heroTitle'] as String? ?? 'Find Your Perfect\nHoliday';
  String get heroPill1 => _config['heroPill1'] as String? ?? '25,000+ Trips';
  String get heroPill2 => _config['heroPill2'] as String? ?? '4.9★ Rated';
  String get heroPill3 => _config['heroPill3'] as String? ?? '150+ Destinations';

  // ── Quick actions grid (home screen 8-icon grid) ─────────────────────────────
  // Each item: { "icon": "flight", "label": "Flights", "color": "#006CE4", "route": "/flights" }
  List<Map<String, dynamic>> get quickActions =>
      _mapList('quickActions', _defaultQuickActions);

  // ── Search tabs visibility ───────────────────────────────────────────────────
  bool get tabFlights  => featureEnabled('tabFlights',  defaultValue: true);
  bool get tabHotels   => featureEnabled('tabHotels',   defaultValue: true);
  bool get tabHolidays => featureEnabled('tabHolidays', defaultValue: true);
  bool get tabAIPlanner=> featureEnabled('tabAIPlanner',defaultValue: true);

  // ── Bottom nav labels (override default labels) ──────────────────────────────
  String get navHomeLabel    => _config['navHomeLabel']    as String? ?? 'Home';
  String get navTripsLabel   => _config['navTripsLabel']   as String? ?? 'My Trips';
  String get navOffersLabel  => _config['navOffersLabel']  as String? ?? 'Offers';
  String get navPlannerLabel => _config['navPlannerLabel'] as String? ?? 'AI Plan';
  String get navProfileLabel => _config['navProfileLabel'] as String? ?? 'Profile';

  // ── Theme color overrides (hex string, e.g. "#006CE4") ───────────────────────
  // Returns null if not overridden — app uses compiled AppTheme colors
  String? get primaryColorHex  => _config['primaryColor']  as String?;
  String? get secondaryColorHex=> _config['secondaryColor'] as String?;

  // ── App-wide popup / modal announcement ──────────────────────────────────────
  String get popupTitle   => _config['popupTitle']   as String? ?? '';
  String get popupMessage => _config['popupMessage'] as String? ?? '';
  String get popupCta     => _config['popupCta']     as String? ?? '';
  String get popupRoute   => _config['popupRoute']   as String? ?? '';
  bool   get showPopup    => popupTitle.isNotEmpty && popupMessage.isNotEmpty;

  // ── Feature flags — toggle any feature ON/OFF without a new build ───────────
  // Usage: rc.featureEnabled('showFlights') — defaults to true if not set
  bool featureEnabled(String key, {bool defaultValue = true}) {
    final flags = _config['featureFlags'];
    if (flags is Map && flags.containsKey(key)) return flags[key] as bool? ?? defaultValue;
    return defaultValue;
  }

  // ── Web route overrides — replace any screen with a website WebView ─────────
  // Set in admin: { "webRoutes": { "/blogs": "https://www.ylootrips.com/blogs" } }
  // Any route listed here opens as a WebView instead of the Flutter screen.
  String? webRouteUrl(String route) {
    final routes = _config['webRoutes'];
    if (routes is Map) return routes[route] as String?;
    return null;
  }

  // ── Force update ─────────────────────────────────────────────────────────────
  // Set minAppVersion to a version > current to prompt users to update.
  String get minAppVersion => _config['minAppVersion'] as String? ?? '0.0.0';
  String get updateMessage => _config['updateMessage'] as String?
      ?? 'A new version is available! Please update to get the latest features.';
  String get updateUrl => _config['updateUrl'] as String?
      ?? 'https://play.google.com/store/apps/details?id=com.ylootrips.app';

  // ── Maintenance mode ─────────────────────────────────────────────────────────
  bool get maintenanceMode => _config['maintenanceMode'] as bool? ?? false;
  String get maintenanceMessage => _config['maintenanceMessage'] as String?
      ?? 'We are doing a quick update. Please check back in a few minutes.';

  // ── Load ────────────────────────────────────────────────────────────────────

  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();

    // Step 1: load cached config instantly (offline-first)
    final cached = prefs.getString('remote_config_v2');
    if (cached != null) {
      try {
        _config = jsonDecode(cached) as Map<String, dynamic>;
        _loaded = true;
        notifyListeners();
      } catch (_) {}
    } else {
      // First launch: use defaults immediately
      _loaded = true;
      notifyListeners();
    }

    // Step 2: fetch fresh from API in background
    _fetchAndUpdate(prefs);
  }

  Future<void> _fetchAndUpdate(SharedPreferences prefs) async {
    try {
      final res = await http
          .get(Uri.parse('${AppConfig.apiUrl}/mobile/config'),
              headers: {'Accept': 'application/json'})
          .timeout(const Duration(seconds: 10));

      if (res.statusCode == 200) {
        final fresh = jsonDecode(res.body) as Map<String, dynamic>;
        _config = fresh;
        _loaded = true;
        await prefs.setString('remote_config_v2', res.body);
        notifyListeners();
      }
    } catch (_) {
      // Silently use cached / default
    }
  }

  /// Force refresh (e.g. pull-to-refresh)
  Future<void> refresh() async {
    final prefs = await SharedPreferences.getInstance();
    await _fetchAndUpdate(prefs);
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  List<String> _strList(String key, List<String> fallback) {
    final v = _config[key];
    if (v is List) return v.map((e) => e.toString()).toList();
    return fallback;
  }

  List<Map<String, dynamic>> _mapList(String key, List<Map<String, dynamic>> fallback) {
    final v = _config[key];
    if (v is List) return v.map((e) => Map<String, dynamic>.from(e as Map)).toList();
    return fallback;
  }

  // ── Defaults (used on first launch / API failure) ───────────────────────────

  static const _defaultBanners = [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85',
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=85',
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=85',
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=85',
  ];

  static const _defaultBannerLabels = [
    'Taj Mahal, Agra',
    'Dal Lake, Kashmir',
    'Bali, Indonesia',
    'Kerala Backwaters',
  ];

  static const _defaultStats = {
    'travellers': '25,000+',
    'rating': '4.9★',
    'destinations': '150+',
    'since': '2022',
  };

  static const _defaultTrending = [
    {'name': 'Bali', 'country': 'Indonesia', 'image': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&q=80', 'price': '₹42,999', 'duration': '6N/7D'},
    {'name': 'Kashmir', 'country': 'India', 'image': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=500&q=80', 'price': '₹24,999', 'duration': '5N/6D'},
    {'name': 'Maldives', 'country': 'Maldives', 'image': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=500&q=80', 'price': '₹89,999', 'duration': '4N/5D'},
    {'name': 'Dubai', 'country': 'UAE', 'image': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&q=80', 'price': '₹35,999', 'duration': '5N/6D'},
    {'name': 'Thailand', 'country': 'Thailand', 'image': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=500&q=80', 'price': '₹28,999', 'duration': '5N/6D'},
  ];

  static const _defaultCategories = [
    {'emoji': '🏖️', 'label': 'Beach', 'id': 'beach'},
    {'emoji': '💑', 'label': 'Honeymoon', 'id': 'honeymoon'},
    {'emoji': '🏔️', 'label': 'Adventure', 'id': 'adventure'},
    {'emoji': '🏛️', 'label': 'Heritage', 'id': 'heritage'},
    {'emoji': '🌿', 'label': 'Offbeat', 'id': 'offbeat'},
    {'emoji': '🌍', 'label': 'International', 'id': 'international'},
  ];

  static const _defaultDeals = [
    {
      'title': 'Bali Honeymoon Special', 'subtitle': '6N/7D · Overwater Villa Included',
      'image': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
      'originalPrice': '₹89,999', 'salePrice': '₹62,999', 'discount': '30%',
      'seats': 3, 'category': 'Honeymoon', 'badge': '🔥 Flash Sale',
      'whatsappMsg': 'Hi! I want to book Bali Honeymoon at ₹62,999',
    },
    {
      'title': 'Kashmir Valley Dreams', 'subtitle': '5N/6D · Houseboat + Gondola',
      'image': 'https://www.ylootrips.com/reviews/sagar-kashmir.jpg',
      'originalPrice': '₹34,999', 'salePrice': '₹24,999', 'discount': '28%',
      'seats': 5, 'category': 'Adventure', 'badge': '⚡ Early Bird',
      'whatsappMsg': 'Hi! I want to book Kashmir Valley Dreams at ₹24,999',
    },
    {
      'title': 'Maldives Luxury Escape', 'subtitle': '4N/5D · Private Beach Resort',
      'image': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80',
      'originalPrice': '₹1,29,999', 'salePrice': '₹89,999', 'discount': '31%',
      'seats': 2, 'category': 'International', 'badge': '💎 Luxury Pick',
      'whatsappMsg': 'Hi! I want to book Maldives Luxury Escape at ₹89,999',
    },
    {
      'title': 'Rajasthan Royal Circuit', 'subtitle': '7N/8D · Heritage Hotels',
      'image': 'https://www.ylootrips.com/reviews/karan-rajasthan.jpg',
      'originalPrice': '₹49,999', 'salePrice': '₹35,999', 'discount': '28%',
      'seats': 8, 'category': 'Heritage', 'badge': '🏰 Bestseller',
      'whatsappMsg': 'Hi! I want to book Rajasthan Royal Circuit at ₹35,999',
    },
    {
      'title': 'Thailand Beach & Culture', 'subtitle': '5N/6D · Phuket + Bangkok',
      'image': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80',
      'originalPrice': '₹42,999', 'salePrice': '₹28,999', 'discount': '32%',
      'seats': 6, 'category': 'International', 'badge': '✈️ Group Deal',
      'whatsappMsg': 'Hi! I want to book Thailand trip at ₹28,999',
    },
  ];

  static const _defaultQuickActions = [
    {'icon': 'flight',        'label': 'Flights',  'color': '#006CE4', 'route': '/flights'},
    {'icon': 'hotel',         'label': 'Hotels',   'color': '#0F766E', 'route': '/hotels'},
    {'icon': 'beach_access',  'label': 'Holidays', 'color': '#E64057', 'route': '/trips'},
    {'icon': 'directions_bus','label': 'Bus',      'color': '#B45309', 'route': '/trips'},
    {'icon': 'directions_car','label': 'Cabs',     'color': '#7C3AED', 'route': '/trips'},
    {'icon': 'flight_land',   'label': 'Visa',     'color': '#0F766E', 'route': '/visa-guide'},
    {'icon': 'auto_awesome',  'label': 'AI Plan',  'color': '#6366F1', 'route': '/planner'},
    {'icon': 'local_offer',   'label': 'Offers',   'color': '#EF4444', 'route': '/offers'},
  ];

  static const _defaultPromos = [
    {'emoji': '🎁', 'code': 'YLOO10', 'title': '10% off on first booking', 'sub': 'Use code at checkout'},
    {'emoji': '💳', 'code': 'HDFC20', 'title': '₹3,000 off on HDFC cards', 'sub': 'Min. booking ₹30,000'},
    {'emoji': '💰', 'code': 'EMI0', 'title': '0% EMI on all bookings', 'sub': 'No cost EMI up to 12 months'},
    {'emoji': '🏆', 'code': 'WANDERLOOT', 'title': 'Double cashback this week', 'sub': 'Earn 20% WanderLoot'},
  ];
}
