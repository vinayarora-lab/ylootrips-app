class FlightEndpoint {
  final String airport;
  final String terminal;
  final String time;

  const FlightEndpoint({
    required this.airport,
    required this.terminal,
    required this.time,
  });

  factory FlightEndpoint.fromJson(Map<String, dynamic> j) => FlightEndpoint(
        airport: j['airport'] ?? '',
        terminal: j['terminal'] ?? '',
        time: j['time'] ?? '',
      );
}

class Flight {
  final String id;
  final bool isDemo;
  final String airline;
  final String airlineCode;
  final String airlineColor;
  final String airlineLogo;
  final String flightNumber;
  final FlightEndpoint departure;
  final FlightEndpoint arrival;
  final String durationFormatted;
  final int durationMinutes;
  final int stops;
  final String stopInfo;
  final int pricePerPerson;
  final int totalPrice;
  final String currency;
  final int? seatsLeft;

  const Flight({
    required this.id,
    required this.isDemo,
    required this.airline,
    required this.airlineCode,
    required this.airlineColor,
    required this.airlineLogo,
    required this.flightNumber,
    required this.departure,
    required this.arrival,
    required this.durationFormatted,
    required this.durationMinutes,
    required this.stops,
    required this.stopInfo,
    required this.pricePerPerson,
    required this.totalPrice,
    required this.currency,
    this.seatsLeft,
  });

  factory Flight.fromJson(Map<String, dynamic> j) => Flight(
        id: j['id'] ?? '',
        isDemo: j['isDemo'] ?? false,
        airline: j['airline'] ?? '',
        airlineCode: j['airlineCode'] ?? '',
        airlineColor: j['airlineColor'] ?? '#6B7355',
        airlineLogo: j['airlineLogo'] ?? '',
        flightNumber: j['flightNumber'] ?? '',
        departure: FlightEndpoint.fromJson(
            j['departure'] as Map<String, dynamic>? ?? {}),
        arrival: FlightEndpoint.fromJson(
            j['arrival'] as Map<String, dynamic>? ?? {}),
        durationFormatted: j['durationFormatted'] ?? '',
        durationMinutes: j['durationMinutes'] ?? 0,
        stops: j['stops'] ?? 0,
        stopInfo: j['stopInfo'] ?? '',
        pricePerPerson: (j['pricePerPerson'] ?? 0).toInt(),
        totalPrice: (j['totalPrice'] ?? 0).toInt(),
        currency: j['currency'] ?? 'INR',
        seatsLeft: j['seatsLeft'],
      );
}

class FlightSearchResult {
  final bool isDemo;
  final List<Flight> flights;

  const FlightSearchResult({required this.isDemo, required this.flights});

  factory FlightSearchResult.fromJson(Map<String, dynamic> j) =>
      FlightSearchResult(
        isDemo: j['isDemo'] ?? false,
        flights: (j['data'] as List<dynamic>? ?? [])
            .map((e) => Flight.fromJson(e as Map<String, dynamic>))
            .toList(),
      );
}
