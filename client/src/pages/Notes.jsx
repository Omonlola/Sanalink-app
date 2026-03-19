import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Calendar, User, FileText } from 'lucide-react';

export function Notes() {
    const { user } = useAuth();
    const [notes, setNotes] = useState([]);
    const [newEntry, setNewEntry] = useState('');
    const [patientName, setPatientName] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (user?.id) {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            fetch(`${baseUrl}/api/notes/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setNotes(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch notes', err);
                    setLoading(false);
                });
        }
    }, [user?.id]);

    const handleSave = async () => {
        if (!newEntry.trim() || !patientName.trim()) return;

        setSubmitting(true);
        try {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const res = await fetch(`${baseUrl}/api/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    psyId: user.id,
                    patientName: patientName,
                    content: newEntry
                })
            });

            if (res.ok) {
                const savedNote = await res.json();
                setNotes([savedNote, ...notes]);
                setNewEntry('');
                setPatientName('');
            }
        } catch (err) {
            console.error('Failed to save note', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cette note ?')) return;

        try {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const res = await fetch(`${baseUrl}/api/notes/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setNotes(notes.filter(n => n.id !== id));
            }
        } catch (err) {
            console.error('Failed to delete note', err);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Chargement de vos notes...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 mt-16">
            <div className="space-y-4 text-center md:text-left">
                <h1 className="text-3xl font-bold text-slate-900">Notes de Consultation</h1>
                <p className="text-slate-600">Gardez une trace sécurisée de vos observations pour chaque patient.</p>
            </div>

            {/* New Note Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-800">Nom du patient</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Ex: Jean Dupont"
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-800">Remarques et impressions</label>
                    <textarea
                        className="w-full h-32 p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                        placeholder="Saisissez vos notes d'observation ici..."
                        value={newEntry}
                        onChange={(e) => setNewEntry(e.target.value)}
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={submitting || !newEntry.trim() || !patientName.trim()}
                        className="bg-brand-600 text-white px-6 py-2.5 rounded-lg hover:bg-brand-700 transition shadow-sm disabled:opacity-50 font-bold flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        {submitting ? 'Enregistrement...' : 'Ajouter la note'}
                    </button>
                </div>
            </div>

            {/* Notes List */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-brand-500" />
                    Historique des Notes
                </h2>

                {notes.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                        Vous n'avez pas encore de notes de consultation.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {notes.map(note => (
                            <div key={note.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-3 group">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{note.patientName}</h3>
                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(note.date).toLocaleDateString('fr-FR', {
                                                    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(note.id)}
                                        className="text-slate-300 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50"
                                        title="Supprimer la note"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="text-slate-700 text-sm whitespace-pre-wrap mt-2 pl-10 border-l-2 border-slate-100">
                                    {note.content}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
