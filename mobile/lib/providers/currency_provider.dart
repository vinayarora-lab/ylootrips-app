import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CurrencyProvider extends ChangeNotifier {
  String _currency = 'INR';
  static const Map<String, double> _rates = {
    'INR': 1.0,
    'USD': 0.012,
    'GBP': 0.0095,
    'EUR': 0.011,
    'AUD': 0.018,
  };
  static const Map<String, String> _symbols = {
    'INR': '₹',
    'USD': '\$',
    'GBP': '£',
    'EUR': '€',
    'AUD': 'A\$',
  };

  String get currency => _currency;
  String get symbol => _symbols[_currency] ?? '₹';
  List<String> get currencies => _rates.keys.toList();

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    _currency = prefs.getString('currency') ?? 'INR';
    notifyListeners();
  }

  Future<void> setCurrency(String c) async {
    _currency = c;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('currency', c);
    notifyListeners();
  }

  double convert(double inr) => inr * (_rates[_currency] ?? 1.0);

  String format(double inr) {
    final converted = convert(inr);
    if (_currency == 'INR') {
      return '₹${_formatINR(converted.round())}';
    }
    return '$symbol${converted.toStringAsFixed(0)}';
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
