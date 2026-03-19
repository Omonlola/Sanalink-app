import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Calendar, SmilePlus, Smile, Meh, Frown, CloudRain, Bot } from 'lucide-react';

const MOODS = [
    { label: 'Génial', icon: SmilePlus, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Bien', icon: Smile, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Moyen', icon: Meh, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Difficile', icon: Frown, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Mauvais', icon: CloudRain, color: 'text-rose-500', bg: 'bg-rose-50' },
];

export function Journal() {
    const { user } = useAuth();
    const [entries, setEntries] = useState([]);
    const [newEntry, setNewEntry] = useState('');
    const [selectedMood, setSelectedMood] = useState('Moyen');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Fetch entries
    useEffect(() => {
        if (user?.id) {
            fetch(`http://localhost:3000/api/journals/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setEntries(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch journal entries', err);
                    setLoading(false);
                });
        }
    }, [user?.id]);

    const handleSave = async () => {
        if (!newEntry.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch('http://localhost:3000/api/journals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    content: newEntry,
                    mood: selectedMood
                })
            });

            if (res.ok) {
                const savedEntry = await res.json();
                setEntries([savedEntry, ...entries]);
                setNewEntry('');
                setSelectedMood('Moyen');
            }
        } catch (err) {
            console.error('Failed to save entry', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cette entrée ?')) return;

        try {
            const res = await fetch(`http://localhost:3000/api/journals/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setEntries(entries.filter(e => e.id !== id));
            }
        } catch (err) {
            console.error('Failed to delete entry', err);
        }
    };

    const getAIFeedback = (mood) => {
        switch (mood) {
            case 'Génial':
            case 'Heureux': // Legacy support
                return "C'est formidable ! Gardez cette belle énergie et n'hésitez pas à noter ce qui a rendu cette journée si spéciale.";
            case 'Bien':
                return "Une bonne journée en perspective. Profitez de ce sentiment positif pour avancer sur vos projets ou vous détendre.";
            case 'Moyen':
            case 'Neutre': // Legacy support
                return "Prenez toujours le temps de vous recentrer sur vous-même. Chaque jour a son propre rythme.";
            case 'Difficile':
            case 'Triste': // Legacy support
                return "Je suis là pour vous. C'est tout à fait humain de ressentir cela. Pensez à l'Espace Détente pour souffler un peu.";
            case 'Mauvais':
                return "Cela semble être une période particulièrement rude. Vous n'êtes pas seul et en parler à un psychologue pourrait vous soulager.";
            default:
                return "C'est merveilleux que vous preniez ce temps pour vous. Chaque réflexion vous rapproche de vous-même.";
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Chargement de votre journal...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            <div className="space-y-4 text-center md:text-left">
                <h1 className="text-3xl font-bold text-slate-900">Journal Intelligent (The Best Friend)</h1>
                <p className="text-slate-600">Partagez vos pensées et recevez un retour bienveillant de votre IA.</p>
            </div>

            {/* New Entry Input */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        Comment vous sentez-vous ?
                    </h2>
                    <div className="flex flex-wrap gap-2 md:gap-4">
                        {MOODS.map((m) => {
                            const Icon = m.icon;
                            return (
                                <button
                                    key={m.label}
                                    onClick={() => setSelectedMood(m.label)}
                                    className={`flex-1 min-w-[60px] flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${selectedMood === m.label
                                        ? `border-indigo-500 ${m.bg} ${m.color}`
                                        : 'border-slate-100 text-slate-400 hover:border-slate-200'
                                        }`}
                                >
                                    <Icon className="w-6 h-6" />
                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-tight truncate w-full text-center">{m.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-2">
                    <textarea
                        className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all placeholder:text-slate-300"
                        placeholder="Qu'avez-vous sur le cœur aujourd'hui ?"
                        value={newEntry}
                        onChange={(e) => setNewEntry(e.target.value)}
                    />
                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={submitting || !newEntry.trim()}
                            className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            {submitting ? 'Envoi...' : 'Enregistrer & Parler à IA'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Entries List */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-800 px-2">Mon Historique</h2>
                {entries.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                        Votre journal est encore vierge. Laissez votre première trace ici.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {entries.map(entry => (
                            <div key={entry.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg bg-slate-50 text-indigo-500`}>
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 capitalize">
                                                    {new Date(entry.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                </div>
                                                <div className="text-xs text-slate-400 font-medium">
                                                    Humeur: <span className="text-indigo-600">{entry.mood || 'Neutre'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(entry.id)}
                                            className="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                        {entry.content}
                                    </div>
                                </div>
                                <div className="bg-indigo-50/50 p-4 border-t border-indigo-50 flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                        <Bot className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Note de l'IA</p>
                                        <p className="text-sm text-indigo-800 italic leading-relaxed">
                                            {getAIFeedback(entry.mood)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
