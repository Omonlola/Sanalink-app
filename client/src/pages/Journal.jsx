import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Calendar } from 'lucide-react';

export function Journal() {
    const { user } = useAuth();
    const [entries, setEntries] = useState([]);
    const [newEntry, setNewEntry] = useState('');
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
                    mood: 'neutral' // Could add mood selector later
                })
            });

            if (res.ok) {
                const savedEntry = await res.json();
                setEntries([savedEntry, ...entries]);
                setNewEntry('');
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

    if (loading) return <div className="p-8 text-center text-slate-500">Chargement de votre journal...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold text-slate-900">Mon Journal Intime</h1>
                <p className="text-slate-600">Un espace sécurisé pour vos pensées et vos réflexions.</p>
            </div>

            {/* New Entry Input */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-brand-500" />
                    Nouvelle entrée
                </h2>
                <textarea
                    className="w-full h-32 p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none transition-all"
                    placeholder="Comment vous sentez-vous aujourd'hui ?"
                    value={newEntry}
                    onChange={(e) => setNewEntry(e.target.value)}
                />
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={submitting || !newEntry.trim()}
                        className="bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {submitting ? 'Sauvegarde...' : 'Enregistrer'}
                    </button>
                </div>
            </div>

            {/* Entries List */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-800">Historique</h2>
                {entries.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500">
                        Votre journal est vide. Commencez par écrire quelque chose aujourd'hui !
                    </div>
                ) : (
                    <div className="space-y-4">
                        {entries.map(entry => (
                            <div key={entry.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 group hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(entry.date).toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(entry.id)}
                                        className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap">
                                    {entry.content}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
