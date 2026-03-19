import 'package:flutter/material.dart';
import 'package:sanalink_mobile/services/api_service.dart';

class AuthProvider with ChangeNotifier {
  Map<String, dynamic>? _user;
  bool _isLoading = false;

  bool get isAuthenticated => _user != null;
  bool get isLoading => _isLoading;
  String? get userType => _user?['type'];
  String? get userId => _user?['id'];
  String? get userName => _user?['name'];

  Future<void> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();
    try {
      _user = await ApiService.login(email, password);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void logout() {
    _user = null;
    notifyListeners();
  }
}
