import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../config/theme.dart';
import '../../models/flight.dart';
import '../../services/api_service.dart';
import '../../widgets/flight_card.dart';

class FlightResultsScreen extends StatefulWidget {
  final Map<String, dynamic> searchParams;
  const FlightResultsScreen({super.key, required this.searchParams});

  @override
  State<FlightResultsScreen> createState() => _FlightResultsScreenState();
}

class _FlightResultsScreenState extends State<FlightResultsScreen> {
  FlightSearchResult? _result;
  bool _loading = true;
  String? _error;

  // Filters
  String _stopFilter = 'all'; // all | direct | 1stop
  String _timeFilter = 'all'; // all | morning | afternoon | evening | night
  List<String> _airlineFilter = [];
  String _sortBy = 'price'; // price | duration | departure | arrival

  @override
  void initState() {
    super.initState();
    _search();
  }

  Future<void> _search() async {
    setState(() { _loading = true; _error = null; });
    try {
      final result = await ApiService().searchFlights(
        origin: widget.searchParams['origin'] ?? '',
        destination: widget.searchParams['destination'] ?? '',
        date: widget.searchParams['date'] ?? '',
        adults: widget.searchParams['adults'] ?? 1,
      );
      setState(() { _result = result; _loading = false; });
    } catch (e) {
      setState(() { _error = e.toString(); _loading = false; });
    }
  }

  List<String> get _availableAirlines {
    if (_result == null) return [];
    return _result!.flights.map((f) => f.airline).toSet().toList()..sort();
  }

  int _depHour(Flight f) {
    final parts = f.departure.time.split(':');
    return parts.isNotEmpty ? int.tryParse(parts[0]) ?? 0 : 0;
  }

  int _arrHour(Flight f) {
    final parts = f.arrival.time.split(':');
    return parts.isNotEmpty ? int.tryParse(parts[0]) ?? 0 : 0;
  }

  List<Flight> get _filtered {
    if (_result == null) return [];
    var flights = List<Flight>.from(_result!.flights);

    // Stop filter
    if (_stopFilter == 'direct') {
      flights = flights.where((f) => f.stops == 0).toList();
    } else if (_stopFilter == '1stop') {
      flights = flights.where((f) => f.stops == 1).toList();
    }

    // Time filter (departure hour)
    if (_timeFilter != 'all') {
      flights = flights.where((f) {
        final h = _depHour(f);
        switch (_timeFilter) {
          case 'morning':   return h >= 6 && h < 12;
          case 'afternoon': return h >= 12 && h < 18;
          case 'evening':   return h >= 18 && h < 22;
          case 'night':     return h >= 22 || h < 6;
          default: return true;
        }
      }).toList();
    }

    // Airline filter
    if (_airlineFilter.isNotEmpty) {
      flights = flights.where((f) => _airlineFilter.contains(f.airline)).toList();
    }

    // Sort
    switch (_sortBy) {
      case 'price':
        flights.sort((a, b) => a.pricePerPerson.compareTo(b.pricePerPerson));
      case 'duration':
        flights.sort((a, b) => a.durationMinutes.compareTo(b.durationMinutes));
      case 'departure':
        flights.sort((a, b) => a.departure.time.compareTo(b.departure.time));
      case 'arrival':
        flights.sort((a, b) => a.arrival.time.compareTo(b.arrival.time));
    }
    return flights;
  }

  int get _activeFilterCount =>
      (_stopFilter != 'all' ? 1 : 0) +
      (_timeFilter != 'all' ? 1 : 0) +
      _airlineFilter.length;

  void _showFilterSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => StatefulBuilder(
        builder: (ctx, setModal) {
          final airlines = _availableAirlines;
          return DraggableScrollableSheet(
            expand: false,
            initialChildSize: 0.7,
            maxChildSize: 0.9,
            builder: (_, sc) => Padding(
              padding: const EdgeInsets.all(20),
              child: ListView(
                controller: sc,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Filters', style: GoogleFonts.inter(
                          fontSize: 16, fontWeight: FontWeight.w800)),
                      TextButton(
                        onPressed: () {
                          setModal(() {});
                          setState(() {
                            _stopFilter = 'all';
                            _timeFilter = 'all';
                            _airlineFilter = [];
                          });
                          Navigator.pop(ctx);
                        },
                        child: Text('Reset', style: GoogleFonts.inter(
                            color: AppTheme.secondary, fontWeight: FontWeight.w600)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text('Stops', style: GoogleFonts.inter(
                      fontSize: 13, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: [
                      for (final s in [
                        ('all', 'Any stops'),
                        ('direct', 'Non-stop'),
                        ('1stop', '1 Stop'),
                      ])
                        ChoiceChip(
                          label: Text(s.$2),
                          selected: _stopFilter == s.$1,
                          onSelected: (_) {
                            setModal(() {});
                            setState(() => _stopFilter = s.$1);
                          },
                          selectedColor: AppTheme.amberLight,
                          labelStyle: GoogleFonts.inter(
                            fontSize: 12,
                            color: _stopFilter == s.$1 ? AppTheme.amber : AppTheme.textGray,
                            fontWeight: _stopFilter == s.$1 ? FontWeight.w600 : FontWeight.w400,
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Text('Departure Time', style: GoogleFonts.inter(
                      fontSize: 13, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      for (final t in [
                        ('all', 'Any time', ''),
                        ('morning', 'Morning', '6am–12pm'),
                        ('afternoon', 'Afternoon', '12pm–6pm'),
                        ('evening', 'Evening', '6pm–10pm'),
                        ('night', 'Night', '10pm–6am'),
                      ])
                        ChoiceChip(
                          label: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(t.$2, style: GoogleFonts.inter(fontSize: 12,
                                fontWeight: _timeFilter == t.$1 ? FontWeight.w600 : FontWeight.w400,
                                color: _timeFilter == t.$1 ? AppTheme.amber : AppTheme.textGray)),
                              if (t.$3.isNotEmpty)
                                Text(t.$3, style: GoogleFonts.inter(fontSize: 9, color: AppTheme.textGray)),
                            ],
                          ),
                          selected: _timeFilter == t.$1,
                          onSelected: (_) {
                            setModal(() {});
                            setState(() => _timeFilter = t.$1);
                          },
                          selectedColor: AppTheme.amberLight,
                        ),
                    ],
                  ),
                  if (airlines.isNotEmpty) ...[
                    const SizedBox(height: 20),
                    Text('Airlines', style: GoogleFonts.inter(
                        fontSize: 13, fontWeight: FontWeight.w700)),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: airlines.map((a) => FilterChip(
                        label: Text(a, style: GoogleFonts.inter(
                          fontSize: 12,
                          color: _airlineFilter.contains(a) ? AppTheme.amber : AppTheme.textGray,
                          fontWeight: _airlineFilter.contains(a) ? FontWeight.w600 : FontWeight.w400,
                        )),
                        selected: _airlineFilter.contains(a),
                        onSelected: (v) {
                          setModal(() {});
                          setState(() {
                            if (v) {
                              _airlineFilter = [..._airlineFilter, a];
                            } else {
                              _airlineFilter = _airlineFilter.where((x) => x != a).toList();
                            }
                          });
                        },
                        selectedColor: AppTheme.amberLight,
                        checkmarkColor: AppTheme.amber,
                      )).toList(),
                    ),
                  ],
                  const SizedBox(height: 28),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => Navigator.pop(ctx),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.secondary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      child: Text(
                        _activeFilterCount > 0
                            ? 'Apply $_activeFilterCount Filter${_activeFilterCount > 1 ? 's' : ''}'
                            : 'Apply',
                        style: GoogleFonts.inter(fontWeight: FontWeight.w600),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  void _openBookingScreen(Flight flight) {
    context.push('/flights/book', extra: {
      'airline': flight.airline,
      'code': flight.airlineCode,
      'flightNum': flight.flightNumber,
      'from': flight.departure.airport,
      'to': flight.arrival.airport,
      'dep': flight.departure.time,
      'arr': flight.arrival.time,
      'date': widget.searchParams['date'],
      'dateDisplay': widget.searchParams['dateDisplay'],
      'dur': flight.durationFormatted,
      'stops': flight.stops,
      'pax': widget.searchParams['adults'],
      'price': flight.totalPrice,
      'isDemo': flight.isDemo,
    });
  }

  @override
  Widget build(BuildContext context) {
    final params = widget.searchParams;
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(
                  '${params['origin']} → ${params['destination']}',
                  style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.charcoal),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppTheme.amberLight,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    params['tripType'] == 'roundtrip' ? 'Round' : 'One-way',
                    style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w700, color: AppTheme.amber),
                  ),
                ),
              ],
            ),
            Text(
              params['tripType'] == 'roundtrip'
                  ? '${params['dateDisplay'] ?? params['date']} – ${params['returnDateDisplay'] ?? ''} · ${params['adults']} Pax'
                  : '${params['dateDisplay'] ?? params['date']} · ${params['adults']} Pax',
              style: GoogleFonts.inter(
                  fontSize: 11, color: AppTheme.textGray),
            ),
          ],
        ),
        leading: const BackButton(),
      ),
      body: Column(
        children: [
          // Filter bar
          Container(
            color: AppTheme.white,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  // Filters button
                  GestureDetector(
                    onTap: _showFilterSheet,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                      decoration: BoxDecoration(
                        color: _activeFilterCount > 0 ? AppTheme.amberLight : AppTheme.white,
                        border: Border.all(
                          color: _activeFilterCount > 0 ? AppTheme.amber : AppTheme.borderGray,
                        ),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.tune, size: 14,
                              color: _activeFilterCount > 0 ? AppTheme.amber : AppTheme.textGray),
                          const SizedBox(width: 4),
                          Text(
                            _activeFilterCount > 0 ? 'Filters ($_activeFilterCount)' : 'Filters',
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              color: _activeFilterCount > 0 ? AppTheme.amber : AppTheme.textGray,
                              fontWeight: _activeFilterCount > 0 ? FontWeight.w600 : FontWeight.w400,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),

                  // Sort chips
                  ...[
                    ['price', 'Cheapest'],
                    ['duration', 'Fastest'],
                    ['departure', 'Earliest'],
                    ['arrival', 'Arrival'],
                  ].map((s) => Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ChoiceChip(
                          label: Text(s[1]),
                          selected: _sortBy == s[0],
                          onSelected: (_) => setState(() => _sortBy = s[0]),
                          selectedColor: AppTheme.amberLight,
                          labelStyle: GoogleFonts.inter(
                            fontSize: 12,
                            color: _sortBy == s[0] ? AppTheme.amber : AppTheme.textGray,
                            fontWeight: _sortBy == s[0] ? FontWeight.w600 : FontWeight.w400,
                          ),
                        ),
                      )),
                ],
              ),
            ),
          ),

          // Results
          Expanded(
            child: _loading
                ? const Center(
                    child: CircularProgressIndicator(color: AppTheme.amber))
                : _error != null
                    ? _ErrorView(onRetry: _search)
                    : _filtered.isEmpty
                        ? _EmptyView(
                            onClear: () => setState(() {
                              _stopFilter = 'all';
                              _timeFilter = 'all';
                              _airlineFilter = [];
                            }))
                        : RefreshIndicator(
                            onRefresh: _search,
                            color: AppTheme.amber,
                            child: ListView.builder(
                              padding:
                                  const EdgeInsets.symmetric(vertical: 8),
                              itemCount: _filtered.length,
                              itemBuilder: (_, i) => FlightCard(
                                flight: _filtered[i],
                                onBook: () =>
                                    _openBookingScreen(_filtered[i]),
                              ),
                            ),
                          ),
          ),
        ],
      ),
    );
  }
}

class _ErrorView extends StatelessWidget {
  final VoidCallback onRetry;
  const _ErrorView({required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.wifi_off_outlined,
                size: 48, color: AppTheme.textGray),
            const SizedBox(height: 12),
            Text('Could not load flights',
                style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.charcoal)),
            const SizedBox(height: 8),
            Text('Please check your connection',
                style:
                    GoogleFonts.inter(fontSize: 13, color: AppTheme.textGray)),
            const SizedBox(height: 20),
            ElevatedButton(onPressed: onRetry, child: const Text('Retry')),
          ],
        ),
      ),
    );
  }
}

class _EmptyView extends StatelessWidget {
  final VoidCallback onClear;
  const _EmptyView({required this.onClear});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.flight_outlined,
                size: 48, color: AppTheme.textGray),
            const SizedBox(height: 12),
            Text('No flights found',
                style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.charcoal)),
            const SizedBox(height: 8),
            Text('Try removing filters',
                style:
                    GoogleFonts.inter(fontSize: 13, color: AppTheme.textGray)),
            const SizedBox(height: 20),
            TextButton(onPressed: onClear, child: const Text('Clear Filters')),
          ],
        ),
      ),
    );
  }
}
