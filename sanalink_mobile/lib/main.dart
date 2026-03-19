import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:sanalink_mobile/providers/auth_provider.dart';
import 'package:sanalink_mobile/screens/auth/login_screen.dart';
import 'package:sanalink_mobile/screens/user/user_dashboard.dart';
import 'package:sanalink_mobile/screens/psychologist/psych_dashboard.dart';
import 'package:sanalink_mobile/screens/admin/admin_dashboard.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: const SanaLinkApp(),
    ),
  );
}

class SanaLinkApp extends StatelessWidget {
  const SanaLinkApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SanaLink',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6C63FF),
          primary: const Color(0xFF6C63FF),
          secondary: const Color(0xFF00D2FF),
          surface: Colors.white,
          background: const Color(0xFFF8F9FA),
        ),
        textTheme: GoogleFonts.poppinsTextTheme(),
        useMaterial3: true,
      ),
      home: Consumer<AuthProvider>(
        builder: (context, auth, _) {
          if (!auth.isAuthenticated) {
            return const LoginScreen();
          }
          
          switch (auth.userType) {
            case 'psychologist':
              return const PsychDashboard();
            case 'admin':
              return const AdminDashboard();
            case 'user':
            default:
              return const UserDashboard();
          }
        },
      ),
    );
  }
}
