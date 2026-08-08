import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../config/theme.dart';
import '../../services/analytics_service.dart';

// Complete list of supported airports
const _cities = [
  {'name': 'New Delhi', 'code': 'DEL'},
  {'name': 'Mumbai', 'code': 'BOM'},
  {'name': 'Bangalore', 'code': 'BLR'},
  {'name': 'Chennai', 'code': 'MAA'},
  {'name': 'Hyderabad', 'code': 'HYD'},
  {'name': 'Kolkata', 'code': 'CCU'},
  {'name': 'Jaipur', 'code': 'JAI'},
  {'name': 'Goa (Dabolim)', 'code': 'GOI'},
  {'name': 'Kochi', 'code': 'COK'},
  {'name': 'Pune', 'code': 'PNQ'},
  {'name': 'Ahmedabad', 'code': 'AMD'},
  {'name': 'Varanasi', 'code': 'VNS'},
  {'name': 'Amritsar', 'code': 'ATQ'},
  {'name': 'Leh (Ladakh)', 'code': 'IXL'},
  {'name': 'Srinagar', 'code': 'SXR'},
  {'name': 'Port Blair (Andaman)', 'code': 'IXZ'},
  {'name': 'Udaipur', 'code': 'UDR'},
  {'name': 'Jodhpur', 'code': 'JDH'},
  {'name': 'Bagdogra (Darjeeling)', 'code': 'IXB'},
  {'name': 'Chandigarh', 'code': 'IXC'},
  {'name': 'Dehradun', 'code': 'DED'},
  {'name': 'Indore', 'code': 'IDR'},
  {'name': 'Dubai', 'code': 'DXB'},
  {'name': 'Singapore', 'code': 'SIN'},
  {'name': 'Bangkok', 'code': 'BKK'},
  {'name': 'London Heathrow', 'code': 'LHR'},
  {'name': 'New York (JFK)', 'code': 'JFK'},
  {'name': 'Sydney', 'code': 'SYD'},
  {'name': 'Kuala Lumpur', 'code': 'KUL'},
  {'name': 'Tokyo Narita', 'code': 'NRT'},
];

class FlightSearchScreen extends StatefulWidget {
  const FlightSearchScreen({super.key});

  @override
  State<FlightSearchScreen> createState() => _FlightSearchScreenState();
}

class _FlightSearchScreenState extends State<FlightSearchScreen> {
  // Trip type
  bool _isRoundTrip = false;

  Map<String, String> _origin =
      const {'name': 'New Delhi', 'code': 'DEL'};
  Map<String, String> _destination =
      const {'name': 'Mumbai', 'code': 'BOM'};
  DateTime _date = DateTime.now().add(const Duration(days: 7));
  DateTime _returnDate = DateTime.now().add(const Duration(days: 14));
  int _adults = 1;

  @override
  void initState() {
    super.initState();
    AnalyticsService.screen('flight_search');
  }

  Future<void> _pickCity(bool isOrigin) async {
    final result = await showModalBottomSheet<Map<String, String>>(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => _CityPicker(
        title: isOrigin ? 'From' : 'To',
        excludeCode: isOrigin ? _destination['code'] : _origin['code'],
      ),
    );
    if (result != null) {
      setState(
          () => isOrigin ? _origin = result : _destination = result);
    }
  }

  Future<void> _pickDate({bool isReturn = false}) async {
    final initial = isReturn ? _returnDate : _date;
    final first = isReturn ? _date.add(const Duration(days: 1)) : DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: first,
      lastDate: DateTime.now().add(const Duration(days: 365)),
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: Theme.of(context)
              .colorScheme
              .copyWith(primary: AppTheme.primary),
        ),
        child: child!,
      ),
    );
    if (picked != null) {
      setState(() {
        if (isReturn) {
          _returnDate = picked;
        } else {
          _date = picked;
          // Keep return date at least 1 day after depart
          if (_returnDate.isBefore(_date.add(const Duration(days: 1)))) {
            _returnDate = _date.add(const Duration(days: 7));
          }
        }
      });
    }
  }

  void _swapCities() {
    setState(() {
      final tmp = _origin;
      _origin = _destination;
      _destination = tmp;
    });
  }

  void _search() {
    if (_origin['code'] == _destination['code']) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('Origin and destination cannot be the same')),
      );
      return;
    }
    context.push('/flights/results', extra: {
      'origin': _origin['code'],
      'originName': _origin['name'],
      'destination': _destination['code'],
      'destinationName': _destination['name'],
      'tripType': _isRoundTrip ? 'roundtrip' : 'oneway',
      'date':
          '${_date.year}-${_date.month.toString().padLeft(2, '0')}-${_date.day.toString().padLeft(2, '0')}',
      'dateDisplay':
          '${_date.day} ${_monthName(_date.month)}, ${_date.year}',
      'returnDate': _isRoundTrip
          ? '${_returnDate.year}-${_returnDate.month.toString().padLeft(2, '0')}-${_returnDate.day.toString().padLeft(2, '0')}'
          : null,
      'returnDateDisplay': _isRoundTrip
          ? '${_returnDate.day} ${_monthName(_returnDate.month)}, ${_returnDate.year}'
          : null,
      'adults': _adults,
    });
  }

  String _monthName(int m) => [
        '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ][m];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bg,
      appBar: AppBar(
        title: Text('Flight Search',
            style: GoogleFonts.inter(fontWeight: FontWeight.w700, color: Colors.white)),
        leading: const BackButton(),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const SizedBox(height: 8),

            // Trip Type Toggle
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: AppTheme.cream,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Expanded(child: _TripTypeBtn(
                    label: 'One-way',
                    icon: Icons.flight_takeoff_rounded,
                    active: !_isRoundTrip,
                    onTap: () => setState(() => _isRoundTrip = false),
                  )),
                  Expanded(child: _TripTypeBtn(
                    label: 'Round Trip',
                    icon: Icons.flight_rounded,
                    active: _isRoundTrip,
                    onTap: () => setState(() => _isRoundTrip = true),
                  )),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Search Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                      color: Colors.black.withOpacity(0.06),
                      blurRadius: 12,
                      offset: const Offset(0, 4)),
                ],
              ),
              child: Column(
                children: [
                  // Origin
                  _CityField(
                    label: 'From',
                    city: _origin,
                    onTap: () => _pickCity(true),
                  ),

                  // Swap button
                  Center(
                    child: GestureDetector(
                      onTap: _swapCities,
                      child: Container(
                        margin: const EdgeInsets.symmetric(vertical: 6),
                        width: 38,
                        height: 38,
                        decoration: BoxDecoration(
                          color: AppTheme.primaryLight,
                          shape: BoxShape.circle,
                          border: Border.all(
                              color: AppTheme.primary.withValues(alpha: 0.4)),
                        ),
                        child: const Icon(Icons.swap_vert,
                            color: AppTheme.primary, size: 20),
                      ),
                    ),
                  ),

                  // Destination
                  _CityField(
                    label: 'To',
                    city: _destination,
                    onTap: () => _pickCity(false),
                  ),

                  const SizedBox(height: 14),
                  const Divider(color: AppTheme.borderGray),
                  const SizedBox(height: 14),

                  // Date & Passengers row
                  Row(
                    children: [
                      // Depart Date
                      Expanded(
                        child: GestureDetector(
                          onTap: () => _pickDate(),
                          child: _InfoBlock(
                            icon: Icons.flight_takeoff_rounded,
                            label: _isRoundTrip ? 'Depart' : 'Date',
                            value:
                                '${_date.day} ${_monthName(_date.month)}, ${_date.year}',
                          ),
                        ),
                      ),
                      if (_isRoundTrip) ...[
                        Container(width: 1, height: 40, color: AppTheme.borderGray),
                        Expanded(
                          child: GestureDetector(
                            onTap: () => _pickDate(isReturn: true),
                            child: _InfoBlock(
                              icon: Icons.flight_land_rounded,
                              label: 'Return',
                              value:
                                  '${_returnDate.day} ${_monthName(_returnDate.month)}, ${_returnDate.year}',
                            ),
                          ),
                        ),
                      ],
                      Container(
                          width: 1, height: 40, color: AppTheme.borderGray),
                      // Adults
                      Expanded(
                        child: _InfoBlock(
                          icon: Icons.person_outline,
                          label: 'Travellers',
                          value: '$_adults Adult${_adults > 1 ? 's' : ''}',
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              GestureDetector(
                                onTap: () {
                                  if (_adults > 1) {
                                    setState(() => _adults--);
                                  }
                                },
                                child: Container(
                                  width: 26,
                                  height: 26,
                                  decoration: BoxDecoration(
                                    border: Border.all(
                                        color: AppTheme.borderGray),
                                    borderRadius:
                                        BorderRadius.circular(6),
                                  ),
                                  child: const Icon(Icons.remove,
                                      size: 14, color: AppTheme.charcoal),
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 8),
                                child: Text(
                                  '$_adults',
                                  style: GoogleFonts.inter(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w700),
                                ),
                              ),
                              GestureDetector(
                                onTap: () {
                                  if (_adults < 6) {
                                    setState(() => _adults++);
                                  }
                                },
                                child: Container(
                                  width: 26,
                                  height: 26,
                                  decoration: BoxDecoration(
                                    color: AppTheme.primaryLight,
                                    border: Border.all(
                                        color: AppTheme.primary
                                            .withValues(alpha: 0.4)),
                                    borderRadius:
                                        BorderRadius.circular(6),
                                  ),
                                  child: const Icon(Icons.add,
                                      size: 14, color: AppTheme.primary),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Search button
            SizedBox(
              width: double.infinity,
              height: 54,
              child: ElevatedButton.icon(
                onPressed: _search,
                icon: const Icon(Icons.search, size: 20),
                label: const Text('Search Flights'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primary,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                  textStyle: GoogleFonts.inter(
                      fontSize: 16, fontWeight: FontWeight.w700),
                ),
              ),
            ),

            const SizedBox(height: 32),

            // Popular routes
            Align(
              alignment: Alignment.centerLeft,
              child: Text('Popular Routes',
                  style: GoogleFonts.inter(
                      fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.dark)),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                ['DEL', 'GOI', 'Delhi → Goa'],
                ['DEL', 'BOM', 'Delhi → Mumbai'],
                ['BOM', 'COK', 'Mumbai → Kochi'],
                ['DEL', 'IXL', 'Delhi → Leh'],
                ['DEL', 'SXR', 'Delhi → Srinagar'],
                ['BLR', 'GOI', 'Bangalore → Goa'],
              ].map((r) {
                return GestureDetector(
                  onTap: () {
                    final originCity = _cities
                        .firstWhere((c) => c['code'] == r[0],
                            orElse: () => {'name': r[0], 'code': r[0]});
                    final destCity = _cities
                        .firstWhere((c) => c['code'] == r[1],
                            orElse: () => {'name': r[1], 'code': r[1]});
                    setState(() {
                      _origin = Map<String, String>.from(originCity);
                      _destination = Map<String, String>.from(destCity);
                    });
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 7),
                    decoration: BoxDecoration(
                      color: AppTheme.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppTheme.borderGray),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.flight,
                            size: 12, color: AppTheme.primary),
                        const SizedBox(width: 5),
                        Text(r[2],
                            style: GoogleFonts.inter(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: AppTheme.charcoal)),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }
}

class _TripTypeBtn extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool active;
  final VoidCallback onTap;
  const _TripTypeBtn({required this.label, required this.icon, required this.active, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: active ? AppTheme.white : Colors.transparent,
          borderRadius: BorderRadius.circular(9),
          boxShadow: active
              ? [BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 8, offset: const Offset(0, 2))]
              : [],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 15, color: active ? AppTheme.primary : AppTheme.textGray),
            const SizedBox(width: 6),
            Text(label, style: GoogleFonts.inter(
              fontSize: 13,
              fontWeight: active ? FontWeight.w700 : FontWeight.w500,
              color: active ? AppTheme.charcoal : AppTheme.textGray,
            )),
          ],
        ),
      ),
    );
  }
}

class _CityField extends StatelessWidget {
  final String label;
  final Map<String, String> city;
  final VoidCallback onTap;

  const _CityField(
      {required this.label, required this.city, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppTheme.bg,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: GoogleFonts.inter(
                        fontSize: 11,
                        color: AppTheme.textGray,
                        fontWeight: FontWeight.w500)),
                const SizedBox(height: 2),
                Text(
                  city['name'] ?? '',
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.charcoal,
                  ),
                ),
              ],
            ),
            const Spacer(),
            Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: AppTheme.primaryLight,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                city['code'] ?? '',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.primary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoBlock extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Widget? trailing;

  const _InfoBlock(
      {required this.icon,
      required this.label,
      required this.value,
      this.trailing});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 13, color: AppTheme.amber),
              const SizedBox(width: 4),
              Text(label,
                  style: GoogleFonts.inter(
                      fontSize: 11, color: AppTheme.textGray)),
            ],
          ),
          const SizedBox(height: 4),
          trailing ??
              Text(value,
                  style: GoogleFonts.inter(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.charcoal)),
        ],
      ),
    );
  }
}

class _CityPicker extends StatefulWidget {
  final String title;
  final String? excludeCode;
  const _CityPicker({required this.title, this.excludeCode});

  @override
  State<_CityPicker> createState() => _CityPickerState();
}

class _CityPickerState extends State<_CityPicker> {
  String _query = '';

  @override
  Widget build(BuildContext context) {
    final filtered = _cities
        .where((c) =>
            c['code'] != widget.excludeCode &&
            (c['name']!
                    .toLowerCase()
                    .contains(_query.toLowerCase()) ||
                c['code']!
                    .toLowerCase()
                    .contains(_query.toLowerCase())))
        .toList();

    return DraggableScrollableSheet(
      expand: false,
      initialChildSize: 0.85,
      builder: (_, ctrl) => Column(
        children: [
          Container(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
            child: Column(
              children: [
                Text(widget.title,
                    style: GoogleFonts.playfairDisplay(
                        fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                TextField(
                  autofocus: true,
                  onChanged: (v) => setState(() => _query = v),
                  decoration: InputDecoration(
                    hintText: 'Search city or airport code',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12)),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: AppTheme.amber),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              controller: ctrl,
              itemCount: filtered.length,
              itemBuilder: (_, i) {
                final city = filtered[i];
                return ListTile(
                  leading: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: AppTheme.amberLight,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Center(
                      child: Text(
                        city['code']!,
                        style: GoogleFonts.inter(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.amber),
                      ),
                    ),
                  ),
                  title: Text(city['name']!,
                      style:
                          GoogleFonts.inter(fontWeight: FontWeight.w500)),
                  subtitle: Text(city['code']!,
                      style: GoogleFonts.inter(
                          fontSize: 12, color: AppTheme.textGray)),
                  onTap: () => Navigator.pop(context, city),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
