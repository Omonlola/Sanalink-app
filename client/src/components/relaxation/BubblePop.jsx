import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BubblePop = () => {
    const [bubbles, setBubbles] = useState([]);
    const [score, setScore] = useState(0);

    const createBubble = useCallback(() => {
        const id = Math.random().toString(36).substr(2, 9);
        const x = Math.random() * 80 + 10; // 10% to 90%
        const size = Math.random() * 40 + 40; // 40px to 80px
        const duration = Math.random() * 3 + 4; // 4s to 7s

        const colors = [
            'rgba(108, 99, 255, 0.4)', // Indigo
            'rgba(0, 210, 255, 0.4)',  // Teal
            'rgba(255, 99, 132, 0.4)', // Pink
            'rgba(255, 205, 86, 0.4)',  // Yellow
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        setBubbles(prev => [...prev, { id, x, size, duration, color }]);
    }, []);

    useEffect(() => {
        const interval = setInterval(createBubble, 1000);
        return () => clearInterval(interval);
    }, [createBubble]);

    const popBubble = (id) => {
        setBubbles(prev => prev.filter(b => b.id !== id));
        setScore(s => s + 1);
    };

    return (
        <div className="w-full h-[400px] relative overflow-hidden bg-slate-900 rounded-2xl cursor-crosshair">
            <div className="absolute top-4 right-6 text-white text-2xl font-bold z-10 select-none">
                Score: <span className="text-teal-400">{score}</span>
            </div>

            <AnimatePresence>
                {bubbles.map(bubble => (
                    <motion.div
                        key={bubble.id}
                        initial={{ y: 500, opacity: 0 }}
                        animate={{ y: -100, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0, transition: { duration: 0.15 } }}
                        transition={{ duration: bubble.duration, ease: "linear" }}
                        onAnimationComplete={() => setBubbles(prev => prev.filter(b => b.id !== bubble.id))}
                        onClick={() => popBubble(bubble.id)}
                        className="absolute rounded-full border-2 border-white/30 backdrop-blur-[2px]"
                        style={{
                            left: `${bubble.x}%`,
                            width: bubble.size,
                            height: bubble.size,
                            backgroundColor: bubble.color,
                            boxShadow: 'inset -5px -5px 15px rgba(255,255,255,0.2)'
                        }}
                    >
                        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/40 rounded-full blur-[1px]" />
                    </motion.div>
                ))}
            </AnimatePresence>

            <div className="absolute bottom-4 left-0 w-full text-center text-slate-500 text-xs uppercase tracking-widest pointer-events-none">
                Touchez les bulles pour les faire éclater
            </div>
        </div>
    );
};

export default BubblePop;
