import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

class AnalyticsService {
  static FirebaseAnalytics? get _fa => kIsWeb ? null : FirebaseAnalytics.instance;

  static FirebaseAnalyticsObserver get observer =>
      FirebaseAnalyticsObserver(analytics: FirebaseAnalytics.instance);

  // Screen tracking
  static Future<void> screen(String name) async =>
      _fa?.logScreenView(screenName: name);

  // Search events
  static Future<void> searchFlight({
    required String origin,
    required String destination,
  }) async =>
      _fa?.logEvent(name: 'search_flight', parameters: {
        'origin': origin,
        'destination': destination,
      });

  static Future<void> searchHotel({required String city}) async =>
      _fa?.logEvent(name: 'search_hotel', parameters: {'city': city});

  static Future<void> searchPackage({required String query}) async =>
      _fa?.logEvent(name: 'search_package', parameters: {'query': query});

  // Package events
  static Future<void> viewPackage({
    required String id,
    required String name,
    required int price,
  }) async =>
      _fa?.logViewItem(
        currency: 'INR',
        value: price.toDouble(),
        items: [AnalyticsEventItem(itemId: id, itemName: name, price: price.toDouble())],
      );

  // Booking events
  static Future<void> beginCheckout({
    required String name,
    required int price,
    required int pax,
  }) async =>
      _fa?.logBeginCheckout(
        currency: 'INR',
        value: (price * pax).toDouble(),
        items: [AnalyticsEventItem(itemName: name, price: price.toDouble(), quantity: pax)],
      );

  static Future<void> purchase({
    required String transactionId,
    required String name,
    required int amount,
  }) async =>
      _fa?.logPurchase(
        transactionId: transactionId,
        currency: 'INR',
        value: amount.toDouble(),
        items: [AnalyticsEventItem(itemName: name, price: amount.toDouble())],
      );

  // Auth events
  static Future<void> login() async => _fa?.logLogin(loginMethod: 'google');

  static Future<void> signUp() async => _fa?.logSignUp(signUpMethod: 'google');

  // Engagement
  static Future<void> whatsappTap({String source = 'unknown'}) async =>
      _fa?.logEvent(name: 'whatsapp_tap', parameters: {'source': source});

  static Future<void> wishlistAdd({required String packageId}) async =>
      _fa?.logAddToWishlist(
        currency: 'INR',
        items: [AnalyticsEventItem(itemId: packageId)],
      );
}
