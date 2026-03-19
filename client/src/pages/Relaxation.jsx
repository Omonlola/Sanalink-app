import React, { useState } from 'react';
import { Card } from '../components/Card';
import BreathingExercise from '../components/relaxation/BreathingExercise';
import BubblePop from '../components/relaxation/BubblePop';
import { Wind, CircleSlash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Relaxation = () => {
    const [activeTab, setActiveTab] = useState('breathing');

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-slate-900">Espace Détente</h1>
                <p className="text-slate-600 mt-2">Prenez un moment pour vous ressourcer.</p>
            </div>

            <div className="flex justify-center mb-8">
                <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex gap-1">
                    <button
                        onClick={() => setActiveTab('breathing')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${activeTab === 'breathing'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Wind className="w-5 h-5" />
                        <span className="font-medium">Respiration</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('bubbles')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${activeTab === 'bubbles'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <CircleSlash className="w-5 h-5" />
                        <span className="font-medium">Bubble Pop</span>
                    </button>
                </div>
            </div>

            <Card className="min-h-[500px] flex flex-col items-center justify-center p-8 relative overflow-hidden bg-gradient-to-br from-white to-slate-50">
                <AnimatePresence mode="wait">
                    {activeTab === 'breathing' ? (
                        <motion.div
                            key="breathing"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full"
                        >
                            <BreathingExercise />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="bubbles"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full h-full flex flex-col items-center"
                        >
                            <BubblePop />
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <h4 className="font-bold text-indigo-900 mb-1">Pourquoi respirer ?</h4>
                    <p className="text-sm text-indigo-800">La respiration contrôlée réduit instantanément le cortisol, l'hormone du stress.</p>
                </div>
                <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
                    <h4 className="font-bold text-teal-900 mb-1">Effet Bubble Pop</h4>
                    <p className="text-sm text-teal-800">Une activité ludique et sensorielle pour détourner l'attention des pensées anxieuses.</p>
                </div>
            </div>
        </div>
    );
};

export default Relaxation;
