import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BreathingExercise = () => {
    const [phase, setPhase] = useState('inspire'); // 'inspire', 'hold', 'expire'
    const [text, setText] = useState('Inspirez...');

    useEffect(() => {
        let timer;
        const cycle = () => {
            setPhase('inspire');
            setText('Inspirez...');

            timer = setTimeout(() => {
                setPhase('hold');
                setText('Maintenez...');

                timer = setTimeout(() => {
                    setPhase('expire');
                    setText('Expirez...');

                    timer = setTimeout(cycle, 4000);
                }, 2000);
            }, 4000);
        };

        cycle();
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center space-y-12 py-10">
            <div className="relative flex items-center justify-center">
                {/* Outer glowing rings */}
                <motion.div
                    animate={{
                        scale: phase === 'inspire' ? 1.5 : phase === 'expire' ? 1 : 1.5,
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: phase === 'hold' ? 2 : 4, ease: "easeInOut" }}
                    className="absolute w-64 h-64 rounded-full bg-indigo-400 blur-2xl"
                />

                {/* Main breathing circle */}
                <motion.div
                    animate={{
                        scale: phase === 'inspire' ? 1.4 : phase === 'expire' ? 0.8 : 1.4,
                    }}
                    transition={{ duration: phase === 'hold' ? 2 : 4, ease: "easeInOut" }}
                    className="relative w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500 to-teal-400 shadow-2xl flex items-center justify-center border-4 border-white/20"
                >
                    <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm" />
                </motion.div>
            </div>

            <motion.div
                key={text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold text-indigo-600 font-serif lowercase italic"
            >
                {text}
            </motion.div>
        </div>
    );
};

export default BreathingExercise;
