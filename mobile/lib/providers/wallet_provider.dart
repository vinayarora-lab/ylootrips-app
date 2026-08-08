import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class WalletProvider extends ChangeNotifier {
  double _balance = 0;
  final List<Map<String, dynamic>> _transactions = [];

  double get balance => _balance;
  List<Map<String, dynamic>> get transactions =>
      List.unmodifiable(_transactions);

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    _balance = prefs.getDouble('wallet_balance') ?? 0;
    // Load persisted transactions
    final txList = prefs.getStringList('wallet_transactions') ?? [];
    _transactions.clear();
    for (final s in txList) {
      try {
        _transactions.add(jsonDecode(s) as Map<String, dynamic>);
      } catch (_) {}
    }
    notifyListeners();
  }

  /// Returns true if this is a new user (first launch) and credits 1000 welcome bonus.
  Future<bool> grantWelcomeCredit() async {
    final prefs = await SharedPreferences.getInstance();
    if (prefs.getBool('welcome_credit_granted') == true) return false;
    await prefs.setBool('welcome_credit_granted', true);
    await addCashback(1000, 'Welcome Bonus 🎉');
    return true;
  }

  Future<void> addCashback(double amount, String reason) async {
    _balance += amount;
    _transactions.insert(0, {
      'type': 'credit',
      'amount': amount,
      'reason': reason,
      'date': DateTime.now().toIso8601String(),
    });
    await _save();
    notifyListeners();
  }

  Future<void> deduct(double amount, String reason) async {
    if (amount > _balance) return;
    _balance -= amount;
    _transactions.insert(0, {
      'type': 'debit',
      'amount': amount,
      'reason': reason,
      'date': DateTime.now().toIso8601String(),
    });
    await _save();
    notifyListeners();
  }

  double maxDeductible(double bookingValue) => bookingValue * 0.10;

  Future<void> _save() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setDouble('wallet_balance', _balance);
    await prefs.setStringList(
      'wallet_transactions',
      _transactions.map((t) => jsonEncode(t)).toList(),
    );
  }
}
