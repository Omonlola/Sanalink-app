import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sanalink_mobile/providers/auth_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Mon Profil')),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          const Center(
            child: CircleAvatar(
              radius: 60,
              backgroundImage: NetworkImage('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'),
            ),
          ),
          const SizedBox(height: 24),
          const Center(
            child: Text(
              'Modifier la photo',
              style: TextStyle(color: Color(0xFF6C63FF), fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(height: 32),
          _buildProfileField('Nom d\'utilisateur', auth.userName ?? ''),
          _buildProfileField('Sexe', 'Non précisé'),
          _buildProfileField('À propos de moi', 'Je suis ici pour améliorer mon bien-être.'),
          const Divider(height: 48),
          _buildProfileField('Changer le mot de passe', '********', isPassword: true),
          const SizedBox(height: 48),
          ElevatedButton(
            onPressed: () => auth.logout(),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red.shade50,
              foregroundColor: Colors.red,
              side: BorderSide(color: Colors.red.shade100),
              minimumSize: const Size(double.infinity, 50),
            ),
            child: const Text('Déconnexion'),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileField(String label, String value, {bool isPassword = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey, fontSize: 14)),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500)),
              const Icon(Icons.edit_outlined, size: 20, color: Colors.grey),
            ],
          ),
        ],
      ),
    );
  }
}
