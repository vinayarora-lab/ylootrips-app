import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../config/theme.dart';
import '../models/flight.dart';

class FlightCard extends StatelessWidget {
  final Flight flight;
  final VoidCallback onBook;

  const FlightCard({super.key, required this.flight, required this.onBook});

  Color _hexColor(String hex) {
    try {
      return Color(int.parse(hex.replaceFirst('#', 'FF'), radix: 16));
    } catch (_) {
      return AppTheme.secondary;
    }
  }

  @override
  Widget build(BuildContext context) {
    final airlineColor = _hexColor(flight.airlineColor);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        children: [
          // Demo banner
          if (flight.isDemo)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
              decoration: const BoxDecoration(
                color: Color(0xFFE8E2D9),
                borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline,
                      size: 12, color: AppTheme.secondary),
                  const SizedBox(width: 4),
                  Text(
                    'Sample price — actual fares may vary',
                    style: GoogleFonts.inter(
                        fontSize: 10,
                        color: AppTheme.secondary,
                        fontWeight: FontWeight.w500),
                  ),
                ],
              ),
            ),

          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              children: [
                // Main flight info row
                Row(
                  children: [
                    // Airline badge
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: airlineColor.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Center(
                        child: Text(
                          flight.airlineCode.length >= 2
                              ? flight.airlineCode.substring(0, 2)
                              : flight.airlineCode,
                          style: GoogleFonts.inter(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: airlineColor,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),

                    // Departure
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          flight.departure.time,
                          style: GoogleFonts.inter(
                            fontSize: 22,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.charcoal,
                          ),
                        ),
                        Text(
                          flight.departure.airport,
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.textGray,
                          ),
                        ),
                      ],
                    ),

                    // Duration line
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        child: Column(
                          children: [
                            Text(
                              flight.durationFormatted,
                              style: GoogleFonts.inter(
                                  fontSize: 10, color: AppTheme.textGray),
                            ),
                            const SizedBox(height: 4),
                            Stack(
                              alignment: Alignment.center,
                              children: [
                                Container(
                                  height: 1,
                                  color: AppTheme.borderGray,
                                ),
                                Transform.rotate(
                                  angle: 0,
                                  child: const Icon(Icons.flight,
                                      size: 14, color: AppTheme.secondary),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: flight.stops == 0
                                    ? const Color(0xFFD1FAE5)
                                    : const Color(0xFFFEF3C7),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                flight.stopInfo,
                                style: GoogleFonts.inter(
                                  fontSize: 9,
                                  fontWeight: FontWeight.w600,
                                  color: flight.stops == 0
                                      ? const Color(0xFF059669)
                                      : AppTheme.secondary,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    // Arrival
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          flight.arrival.time,
                          style: GoogleFonts.inter(
                            fontSize: 22,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.charcoal,
                          ),
                        ),
                        Text(
                          flight.arrival.airport,
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.textGray,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),

                const SizedBox(height: 12),
                const Divider(height: 1, color: AppTheme.borderGray),
                const SizedBox(height: 12),

                // Bottom row: airline name, seats, price, book
                Row(
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          flight.airline,
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.charcoal,
                          ),
                        ),
                        Text(
                          flight.flightNumber,
                          style: GoogleFonts.inter(
                              fontSize: 11, color: AppTheme.textGray),
                        ),
                      ],
                    ),
                    const Spacer(),
                    if (flight.seatsLeft != null)
                      Container(
                        margin: const EdgeInsets.only(right: 10),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 6, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFEE2E2),
                          borderRadius: BorderRadius.circular(5),
                        ),
                        child: Text(
                          '${flight.seatsLeft} seats',
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.red,
                          ),
                        ),
                      ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          '₹${_formatINR(flight.pricePerPerson)}',
                          style: GoogleFonts.inter(
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.primary,
                          ),
                        ),
                        Text(
                          'per person',
                          style: GoogleFonts.inter(
                              fontSize: 10, color: AppTheme.textGray),
                        ),
                      ],
                    ),
                    const SizedBox(width: 10),
                    GestureDetector(
                      onTap: onBook,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 9),
                        decoration: BoxDecoration(
                          color: AppTheme.primary,
                          borderRadius: BorderRadius.circular(7),
                        ),
                        child: Text(
                          'Book',
                          style: GoogleFonts.inter(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.cream,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatINR(int amount) {
    final s = amount.toString();
    if (s.length <= 3) return s;
    final last3 = s.substring(s.length - 3);
    final rest = s.substring(0, s.length - 3);
    final formatted = rest.replaceAllMapped(
        RegExp(r'(\d{1,2})(?=(\d{2})+$)'), (m) => '${m[1]},');
    return '$formatted,$last3';
  }
}
