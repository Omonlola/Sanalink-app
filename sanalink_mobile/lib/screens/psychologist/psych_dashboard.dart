import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sanalink_mobile/providers/auth_provider.dart';

class PsychDashboard extends StatelessWidget {
  const PsychDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Espace Psychologue'),
        actions: [
          IconButton(icon: const Icon(Icons.logout), onPressed: () => auth.logout()),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Bienvenue, ${auth.userName}', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            _buildStatCard('Consultations', '12', Icons.calendar_today, Colors.blue),
            const SizedBox(height: 16),
            _buildStatCard('Revenus Totaux', '960 DT', Icons.account_balance_wallet, Colors.green),
            const SizedBox(height: 32),
            const Text('Mon Profil Professionnel', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    ListTile(
                      title: const Text('Expertise'),
                      subtitle: const Text('Psychologie Clinique, TCC'),
                      trailing: const Icon(Icons.edit),
                      onTap: () {},
                    ),
                    const Divider(),
                    ListTile(
                      title: const Text('Prix Consultation'),
                      subtitle: const Text('80 DT / Séance'),
                      trailing: const Icon(Icons.edit),
                      onTap: () {},
                    ),
                    const Divider(),
                    ListTile(
                      title: const Text('Disponibilités'),
                      subtitle: const Text('Lundi - Vendredi: 09:00 - 17:00'),
                      trailing: const Icon(Icons.calendar_month),
                      onTap: () {},
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: TextStyle(color: color, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text(value, style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: color)),
            ],
          ),
          Icon(icon, color: color, size: 40),
        ],
      ),
    );
  }
}
