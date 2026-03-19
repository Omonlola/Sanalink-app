import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sanalink_mobile/providers/auth_provider.dart';
import 'package:sanalink_mobile/services/api_service.dart';

class JournalScreen extends StatefulWidget {
  const JournalScreen({super.key});

  @override
  State<JournalScreen> createState() => _JournalScreenState();
}

class _JournalScreenState extends State<JournalScreen> {
  final _contentController = TextEditingController();
  List<dynamic> _entries = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadEntries();
  }

  Future<void> _loadEntries() async {
    final userId = Provider.of<AuthProvider>(context, listen: false).userId;
    if (userId != null) {
      try {
        final entries = await ApiService.getJournals(userId);
        setState(() {
          _entries = entries;
          _isLoading = false;
        });
      } catch (e) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _showAddEntry() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) => Padding(
        padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom, top: 20, left: 20, right: 20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Cher Journal (The Best Friend)', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            TextField(
              controller: _contentController,
              maxLines: 5,
              decoration: const InputDecoration(
                hintText: 'Comment s\'est passée votre journée ?',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () async {
                  final userId = Provider.of<AuthProvider>(context, listen: false).userId;
                  if (userId != null && _contentController.text.isNotEmpty) {
                    await ApiService.createJournal(userId, _contentController.text, 'Heureux');
                    _contentController.clear();
                    Navigator.pop(context);
                    _loadEntries();
                  }
                },
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6C63FF), foregroundColor: Colors.white),
                child: const Text('Enregistrer & Parler à IA'),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Journal Intelligent')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _entries.isEmpty
              ? const Center(child: Text('Aucune entrée au journal. Commencez à écrire !'))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _entries.length,
                  itemBuilder: (context, index) {
                    final entry = _entries[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('${entry['mood']} • ${entry['date'].substring(0, 10)}', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                                const Icon(Icons.smart_toy_outlined, size: 16, color: Color(0xFF6C63FF)),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(entry['content'], style: const TextStyle(fontSize: 16)),
                            const Divider(height: 24),
                            const Text(
                              'Note de l\'IA: C\'est génial que vous ayez passé une bonne journée ! Qu\'est-ce qui vous a rendu le plus fier ?',
                              style: TextStyle(fontStyle: FontStyle.italic, color: Color(0xFF6C63FF)),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddEntry,
        backgroundColor: const Color(0xFF6C63FF),
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}
