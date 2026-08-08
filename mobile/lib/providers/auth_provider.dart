import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthProvider extends ChangeNotifier {
  String _name = 'Traveller';
  String _phone = '';
  bool _loading = false;

  bool get loading => _loading;
  bool get isLoggedIn => false; // no login required
  String get displayName => _name;
  String get phone => _phone;
  String get email => '';
  String? get photoUrl => null;

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    _name = prefs.getString('user_name') ?? 'Traveller';
    _phone = prefs.getString('user_phone') ?? '';
    notifyListeners();
  }

  Future<void> savePhone(String phone, {String? name}) async {
    _loading = true;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    _phone = phone;
    await prefs.setString('user_phone', phone);
    if (name != null && name.isNotEmpty) {
      _name = name;
      await prefs.setString('user_name', name);
    }
    _loading = false;
    notifyListeners();
  }

  Future<void> clearData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user_name');
    await prefs.remove('user_phone');
    _name = 'Traveller';
    _phone = '';
    notifyListeners();
  }
}
