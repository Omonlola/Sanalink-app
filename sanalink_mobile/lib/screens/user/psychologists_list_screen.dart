import 'package:flutter/material.dart';
import 'package:sanalink_mobile/services/api_service.dart';

class PsychologistsListScreen extends StatefulWidget {
  const PsychologistsListScreen({super.key});

  @override
  State<PsychologistsListScreen> createState() => _PsychologistsListScreenState();
}

class _PsychologistsListScreenState extends State<PsychologistsListScreen> {
  List<dynamic> _psychs = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadPsychs();
  }

  Future<void> _loadPsychs() async {
    try {
      final psychs = await ApiService.getPsychologists();
      setState(() {
        _psychs = psychs;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Nos Psychologues')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _psychs.length,
              itemBuilder: (context, index) {
                final psych = _psychs[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 40,
                          backgroundImage: NetworkImage(psych['image'] ?? 'https://via.placeholder.com/150'),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(psych['name'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                              Text(psych['specialty'], style: TextStyle(color: Colors.grey.shade600)),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  const Icon(Icons.star, color: Colors.amber, size: 16),
                                  Text(' ${psych['rating'] ?? "N/A"}', style: const TextStyle(fontSize: 14)),
                                ],
                              ),
                              const SizedBox(height: 8),
                              ElevatedButton(
                                onPressed: () {},
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF6C63FF),
                                  foregroundColor: Colors.white,
                                  minimumSize: const Size(double.infinity, 36),
                                ),
                                child: const Text('Prendre RDV'),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
