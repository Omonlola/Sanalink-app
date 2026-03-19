import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sanalink_mobile/providers/auth_provider.dart';
import 'package:sanalink_mobile/screens/user/journal_screen.dart';
import 'package:sanalink_mobile/screens/user/profile_screen.dart';
import 'package:sanalink_mobile/screens/user/relaxation_space.dart';
import 'package:sanalink_mobile/screens/user/psychologists_list_screen.dart';

class UserDashboard extends StatefulWidget {
  const UserDashboard({super.key});

  @override
  State<UserDashboard> createState() => _UserDashboardState();
}

class _UserDashboardState extends State<UserDashboard> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const DashboardHome(),
    const JournalScreen(),
    const RelaxationSpace(),
    const ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        type: BottomNavigationBarType.fixed,
        selectedItemColor: const Color(0xFF6C63FF),
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.book_outlined), label: 'Journal'),
          BottomNavigationBarItem(icon: Icon(Icons.spa_outlined), label: 'Détente'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profil'),
        ],
      ),
    );
  }
}

class DashboardHome extends StatelessWidget {
  const DashboardHome({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('SanaLink', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Bonjour, ${auth.userName} 👋',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'Comment vous sentez-vous aujourd\'hui ?',
              style: TextStyle(color: Colors.grey, fontSize: 16),
            ),
            const SizedBox(height: 24),
            // Mood Weather Section
            const MoodWeatherSection(),
            const SizedBox(height: 24),
            // Fast Access Cards
            Row(
              children: [
                Expanded(
                  child: _buildActionCard(
                    context,
                    'Mon Journal',
                    'The Best Friend IA',
                    Icons.edit_note,
                    const Color(0xFF6C63FF),
                    () => DefaultTabController.of(context).animateTo(1),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildActionCard(
                    context,
                    'Consultation',
                    'Voir catalogue',
                    Icons.medical_services_outlined,
                    const Color(0xFF00D2FF),
                    () => Navigator.push(context, MaterialPageRoute(builder: (_) => const PsychologistsListScreen())),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            const Text(
              'Exercice Recommandé',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.green.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.air, color: Colors.green),
                ),
                title: const Text('Respiration Profonde'),
                subtitle: const Text('Réduisez votre stress en 5 minutes'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {},
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCard(BuildContext context, String title, String subtitle, IconData icon, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.3),
              blurRadius: 10,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: Colors.white, size: 32),
            const SizedBox(height: 16),
            Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
            Text(subtitle, style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 14)),
          ],
        ),
      ),
    );
  }
}

class MoodWeatherSection extends StatelessWidget {
  const MoodWeatherSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Votre Météo des Humeurs', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: const [
              MoodIcon(emoji: '😊', label: 'Heureux'),
              MoodIcon(emoji: '😔', label: 'Triste'),
              MoodIcon(emoji: '😤', label: 'Stressé'),
              MoodIcon(emoji: '😴', label: 'Fatigué'),
              MoodIcon(emoji: '🌈', label: 'Calme'),
            ],
          ),
        ],
      ),
    );
  }
}

class MoodIcon extends StatelessWidget {
  final String emoji;
  final String label;

  const MoodIcon({super.key, required this.emoji, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(emoji, style: const TextStyle(fontSize: 32)),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
      ],
    );
  }
}
