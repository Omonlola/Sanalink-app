import 'package:flutter/material.dart';
import 'dart:async';
import 'dart:math';

class RelaxationSpace extends StatelessWidget {
  const RelaxationSpace({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Espace Détente'),
          bottom: const TabBar(
            indicatorColor: Color(0xFF6C63FF),
            labelColor: Color(0xFF6C63FF),
            tabs: [
              Tab(text: 'Respiration', icon: Icon(Icons.air)),
              Tab(text: 'Bubble Pop', icon: Icon(Icons.bubble_chart)),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            BreathingExercise(),
            BubblePopGame(),
          ],
        ),
      ),
    );
  }
}

class BreathingExercise extends StatefulWidget {
  const BreathingExercise({super.key});

  @override
  State<BreathingExercise> createState() => _BreathingExerciseState();
}

class _BreathingExerciseState extends State<BreathingExercise> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  String _message = 'Inspirez...';

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 4));
    _animation = Tween<double>(begin: 0.6, end: 1.2).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    )..addStatusListener((status) {
        if (status == AnimationStatus.completed) {
          setState(() => _message = 'Expirez...');
          _controller.reverse();
        } else if (status == AnimationStatus.dismissed) {
          setState(() => _message = 'Inspirez...');
          _controller.forward();
        }
      });
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          ScaleTransition(
            scale: _animation,
            child: Container(
              height: 200,
              width: 200,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [const Color(0xFF00D2FF).withOpacity(0.5), const Color(0xFF6C63FF).withOpacity(0.8)],
                ),
                boxShadow: [
                  BoxShadow(color: const Color(0xFF6C63FF).withOpacity(0.3), blurRadius: 40, spreadRadius: 10),
                ],
              ),
            ),
          ),
          const SizedBox(height: 60),
          Text(
            _message,
            style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Color(0xFF6C63FF)),
          ),
        ],
      ),
    );
  }
}

class BubblePopGame extends StatefulWidget {
  const BubblePopGame({super.key});

  @override
  State<BubblePopGame> createState() => _BubblePopGameState();
}

class _BubblePopGameState extends State<BubblePopGame> {
  final List<Bubble> _bubbles = [];
  int _score = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startGame();
  }

  void _startGame() {
    _timer = Timer.periodic(const Duration(milliseconds: 800), (timer) {
      if (mounted) {
        setState(() {
          _bubbles.add(Bubble(
            id: Random().nextInt(1000000),
            x: Random().nextDouble() * (MediaQuery.of(context).size.width - 60),
            y: MediaQuery.of(context).size.height,
            color: Colors.primaries[Random().nextInt(Colors.primaries.length)].withOpacity(0.6),
          ));
        });
      }
    });

    Timer.periodic(const Duration(milliseconds: 50), (timer) {
      if (mounted) {
        setState(() {
          for (var b in _bubbles) {
            b.y -= 2;
          }
          _bubbles.removeWhere((b) => b.y < -100);
        });
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned(
          top: 16,
          right: 16,
          child: Text('Score: $_score', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
        ),
        ..._bubbles.map((bubble) => Positioned(
              left: bubble.x,
              top: bubble.y,
              child: GestureDetector(
                onTap: () {
                  setState(() {
                    _bubbles.removeWhere((b) => b.id == bubble.id);
                    _score++;
                  });
                },
                child: Container(
                  height: 60,
                  width: 60,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: bubble.color,
                    border: Border.all(color: Colors.white, width: 1),
                  ),
                ),
              ),
            )),
      ],
    );
  }
}

class Bubble {
  final int id;
  double x;
  double y;
  final Color color;

  Bubble({required this.id, required this.x, required this.y, required this.color});
}
