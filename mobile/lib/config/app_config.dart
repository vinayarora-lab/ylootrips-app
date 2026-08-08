class AppConfig {
  // Base URLs
  static const String siteUrl = 'https://www.ylootrips.com';
  static const String apiUrl = 'https://www.ylootrips.com/api';
  static const String backendUrl =
      'https://trip-backend-65232427280.asia-south1.run.app/api';

  // Contact
  static const String whatsappNumber = '918427831127';
  static const String contactEmail = 'hello@ylootrips.com';
  static const String phone = '+91-8427831127';

  // Payment success/failure URLs (Easebuzz expects these)
  static const String paymentSuccessUrl =
      'https://www.ylootrips.com/payment/success';
  static const String paymentFailureUrl =
      'https://www.ylootrips.com/payment/failure';
  static const String flightSuccessUrl =
      'https://www.ylootrips.com/flights/booking-success';

  // WhatsApp deep link
  static String whatsappUrl(String message) =>
      'https://wa.me/$whatsappNumber?text=${Uri.encodeComponent(message)}';

  // App info
  static const String appName = 'YlooTrips';
  static const String tagline = 'Luxury India Travel';

  // Demo / fallback images
  static const List<String> heroBanners = [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
  ];
}
