import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/app_config.dart';
import '../models/flight.dart';
import '../models/package.dart';

class ApiService {
  static final ApiService _instance = ApiService._();
  ApiService._();
  factory ApiService() => _instance;

  final _client = http.Client();
  static const _timeout = Duration(seconds: 20);

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

  // ─── Flights ────────────────────────────────────────────────────────────────

  Future<FlightSearchResult> searchFlights({
    required String origin,
    required String destination,
    required String date,
    required int adults,
  }) async {
    final uri = Uri.parse(
      '${AppConfig.apiUrl}/flights/search?origin=$origin&destination=$destination&date=$date&adults=$adults',
    );
    try {
      final res = await _client.get(uri, headers: _headers).timeout(_timeout);
      if (res.statusCode == 200) {
        return FlightSearchResult.fromJson(
            jsonDecode(res.body) as Map<String, dynamic>);
      }
    } catch (_) {}
    // Return demo flights on API error (e.g. CORS in web preview)
    return FlightSearchResult(isDemo: true, flights: _demoFlights(origin, destination, adults));
  }

  List<Flight> _demoFlights(String origin, String destination, int adults) {
    final routes = [
      {'airline': 'IndiGo', 'code': '6E', 'color': '#3a2cbf', 'logo': 'https://www.gstatic.com/flights/airline_logos/70px/6E.png', 'fn': '6E 2451', 'dep': '06:00', 'arr': '08:15', 'dur': 135, 'stops': 0, 'price': 4500},
      {'airline': 'Air India', 'code': 'AI', 'color': '#c8102e', 'logo': 'https://www.gstatic.com/flights/airline_logos/70px/AI.png', 'fn': 'AI 441', 'dep': '09:30', 'arr': '11:50', 'dur': 140, 'stops': 0, 'price': 5800},
      {'airline': 'SpiceJet', 'code': 'SG', 'color': '#e21836', 'logo': 'https://www.gstatic.com/flights/airline_logos/70px/SG.png', 'fn': 'SG 162', 'dep': '14:00', 'arr': '16:20', 'dur': 140, 'stops': 0, 'price': 3900},
      {'airline': 'Akasa Air', 'code': 'QP', 'color': '#f97316', 'logo': 'https://www.gstatic.com/flights/airline_logos/70px/QP.png', 'fn': 'QP 1110', 'dep': '17:45', 'arr': '20:05', 'dur': 140, 'stops': 0, 'price': 4200},
      {'airline': 'IndiGo', 'code': '6E', 'color': '#3a2cbf', 'logo': 'https://www.gstatic.com/flights/airline_logos/70px/6E.png', 'fn': '6E 6261', 'dep': '05:30', 'arr': '09:45', 'dur': 255, 'stops': 1, 'price': 3200},
      {'airline': 'Air India Express', 'code': 'IX', 'color': '#d4002a', 'logo': 'https://www.gstatic.com/flights/airline_logos/70px/IX.png', 'fn': 'IX 1056', 'dep': '20:15', 'arr': '22:40', 'dur': 145, 'stops': 0, 'price': 5200},
    ];
    return routes.asMap().entries.map((e) {
      final r = e.value;
      return Flight(
        id: 'DEMO-${e.key}', isDemo: true,
        airline: r['airline'] as String, airlineCode: r['code'] as String,
        airlineColor: r['color'] as String, airlineLogo: r['logo'] as String,
        flightNumber: r['fn'] as String,
        departure: FlightEndpoint(airport: origin, terminal: '', time: r['dep'] as String),
        arrival: FlightEndpoint(airport: destination, terminal: '', time: r['arr'] as String),
        durationFormatted: '${(r['dur'] as int) ~/ 60}h ${(r['dur'] as int) % 60}m',
        durationMinutes: r['dur'] as int,
        stops: r['stops'] as int,
        stopInfo: (r['stops'] as int) == 0 ? 'Non-stop' : '1 stop',
        pricePerPerson: (r['price'] as int) * adults,
        totalPrice: (r['price'] as int) * adults,
        currency: 'INR',
      );
    }).toList();
  }

  Future<Map<String, dynamic>> initiateFlightPayment(
      Map<String, dynamic> bookingData) async {
    final uri = Uri.parse('${AppConfig.apiUrl}/flights/initiate-payment');
    try {
      final res = await _client
          .post(uri, headers: _headers, body: jsonEncode(bookingData))
          .timeout(_timeout);
      final decoded = jsonDecode(res.body);
      if (decoded is Map<String, dynamic>) return decoded;
      return {'message': 'Unexpected server response. Please try again.'};
    } catch (e) {
      return {'message': 'Network error. Please check your connection and try again.'};
    }
  }

  // ─── Packages ────────────────────────────────────────────────────────────────

  Future<List<TourPackage>> getPackages({String? category}) async {
    try {
      final params = category != null ? '?category=$category' : '';
      // Use Next.js API — returns all website packages (domestic + international)
      final uri = Uri.parse('${AppConfig.apiUrl}/packages$params');
      final res = await _client.get(uri, headers: _headers).timeout(_timeout);
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final list = (data is List ? data : data['data'] ?? data['packages'] ?? []) as List;
        if (list.isNotEmpty) {
          return list
              .map((e) => TourPackage.fromJson(e as Map<String, dynamic>))
              .toList();
        }
      }
    } catch (_) {}
    return demoPackages;
  }

  // ─── Trip Planner ─────────────────────────────────────────────────────────

  Future<String> planTrip(String userMessage) async {
    final uri = Uri.parse('${AppConfig.apiUrl}/trip-planner');
    final enriched = _buildTripPrompt(userMessage);
    try {
      final res = await _client
          .post(
            uri,
            headers: _headers,
            body: jsonEncode({'message': enriched}),
          )
          .timeout(const Duration(seconds: 60));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body) as Map<String, dynamic>;
        return data['itinerary']?.toString() ??
            data['response']?.toString() ??
            data['text']?.toString() ??
            _fallbackItinerary(userMessage);
      }
    } catch (_) {}
    return _fallbackItinerary(userMessage);
  }

  String _buildTripPrompt(String userRequest) =>
      'You are an expert luxury travel planner for YlooTrips, specializing in India travel and international destinations. '
      'A traveler is asking: "$userRequest"\n\n'
      'Create a detailed travel itinerary with:\n'
      '- Complete day-by-day plan with specific activities and timings\n'
      '- Hotel recommendations (2-3 options: luxury, mid-range, budget)\n'
      '- Transportation: how to reach destination and local transport\n'
      '- Must-try local foods and restaurants\n'
      '- Cost breakdown (accommodation, food, transport, activities)\n'
      '- Best time to visit and weather notes\n'
      '- 5 insider tips and hidden gems\n\n'
      'Use plain text formatting with Day 1, Day 2 headings and bullet points (use - or •). '
      'Be specific, practical and helpful. Mention actual place names, not generic descriptions.';

  String _fallbackItinerary(String message) {
    final lower = message.toLowerCase();
    final dest = lower.contains('rajasthan') ? 'Rajasthan'
        : lower.contains('kerala') ? 'Kerala'
        : lower.contains('goa') ? 'Goa'
        : lower.contains('kashmir') ? 'Kashmir'
        : lower.contains('himachal') ? 'Himachal Pradesh'
        : lower.contains('bali') ? 'Bali'
        : lower.contains('thailand') ? 'Thailand'
        : lower.contains('maldives') ? 'Maldives'
        : 'your chosen destination';

    return 'Here is a suggested itinerary for $dest:\n\n'
        'Day 1 - Arrival\n'
        '- Arrive and check into hotel\n'
        '- Evening: explore local market\n'
        '- Dinner at a popular local restaurant\n\n'
        'Day 2-3 - Main Attractions\n'
        '- Morning: visit top sightseeing spots\n'
        '- Afternoon: cultural experiences & heritage sites\n'
        '- Evening: sunset viewpoint or riverside walk\n\n'
        'Day 4 - Day Trip\n'
        '- Full-day excursion to nearby highlights\n'
        '- Local food trail and shopping\n\n'
        'Day 5 - Leisure & Departure\n'
        '- Morning: spa or leisure time\n'
        '- Checkout and departure\n\n'
        'For a fully personalized luxury itinerary with exact pricing, '
        'WhatsApp our travel experts — we beat every agent\'s price! 🌟';
  }

  // ─── Hotels ──────────────────────────────────────────────────────────────

  Future<Map<String, dynamic>> searchHotels({
    required String city,
    required String checkIn,
    required String checkOut,
    required int guests,
  }) async {
    try {
      final uri = Uri.parse(
          '${AppConfig.apiUrl}/hotels/search?q=$city&check_in=$checkIn&check_out=$checkOut&guests=$guests');
      final res = await _client.get(uri, headers: _headers).timeout(_timeout);
      if (res.statusCode == 200) {
        final body = jsonDecode(res.body) as Map<String, dynamic>;
        final rawList = (body['data'] as List<dynamic>?) ?? [];
        final hotels = rawList.map((h) {
          final m = h as Map<String, dynamic>;
          return {
            'name': m['name'] ?? 'Hotel',
            'location': m['type'] ?? city,
            'rating': m['overallRating']?.toString() ?? '4.0',
            'pricePerNight': m['pricePerNight'] ?? 2999,
            'thumbnail': m['thumbnail'] ?? '',
            'link': m['link'] ?? '',
            'amenities': m['amenities'] ?? [],
          };
        }).toList();
        return {'hotels': hotels, 'isDemo': body['isDemo'] ?? false};
      }
    } catch (_) {}
    return {'hotels': _demoHotels(city), 'isDemo': true};
  }

  List<Map<String, dynamic>> _demoHotels(String city) {
    return [
      {
        'name': 'The Royal Heritage Palace',
        'location': 'Luxury Hotel',
        'rating': '4.8',
        'pricePerNight': 8500,
        'thumbnail': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
        'amenities': ['Pool', 'Spa', 'Restaurant', 'WiFi'],
        'link': '',
      },
      {
        'name': 'Boutique Haveli — $city',
        'location': 'Heritage Hotel',
        'rating': '4.6',
        'pricePerNight': 4200,
        'thumbnail': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
        'amenities': ['Rooftop', 'Breakfast', 'WiFi'],
        'link': '',
      },
      {
        'name': 'Luxury Resort & Spa — $city',
        'location': 'Resort',
        'rating': '4.9',
        'pricePerNight': 12000,
        'thumbnail': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
        'amenities': ['Private Pool', 'Spa', 'Fine Dining', 'Gym'],
        'link': '',
      },
      {
        'name': 'Garden View Inn',
        'location': 'Boutique Hotel',
        'rating': '4.4',
        'pricePerNight': 2800,
        'thumbnail': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
        'amenities': ['Garden', 'Breakfast', 'Parking', 'WiFi'],
        'link': '',
      },
      {
        'name': 'Treehouse Retreat — $city',
        'location': 'Eco Resort',
        'rating': '4.7',
        'pricePerNight': 6500,
        'thumbnail': 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&q=80',
        'amenities': ['Nature', 'Eco-friendly', 'Trekking', 'Meals'],
        'link': '',
      },
    ];
  }

  // ─── Contact / Inquiry ───────────────────────────────────────────────────

  Future<bool> sendInquiry(Map<String, dynamic> data) async {
    try {
      final uri = Uri.parse('${AppConfig.apiUrl}/contact');
      final res = await _client
          .post(uri, headers: _headers, body: jsonEncode(data))
          .timeout(_timeout);
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  // ─── Package payment ─────────────────────────────────────────────────────

  Future<Map<String, dynamic>> initiatePackagePayment(
      Map<String, dynamic> bookingData) async {
    final uri =
        Uri.parse('${AppConfig.apiUrl}/payment/initiate-partial');
    try {
      final res = await _client
          .post(uri, headers: _headers, body: jsonEncode(bookingData))
          .timeout(_timeout);
      final decoded = jsonDecode(res.body);
      if (decoded is Map<String, dynamic>) return decoded;
      return {'message': 'Unexpected server response. Please try again.'};
    } catch (e) {
      return {'message': 'Network error. Please check your connection and try again.'};
    }
  }
}
