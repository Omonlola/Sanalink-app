import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Send, Users, UserCheck, User, Bell, Mail, CheckCircle } from 'lucide-react';

const targetOptions = [
    { value: 'all', label: 'Tous les utilisateurs', icon: Users },
    { value: 'users', label: 'Patients uniquement', icon: User },
    { value: 'psychologists', label: 'Psychologues uniquement', icon: UserCheck },
];

const typeOptions = [
    { value: 'notification', label: 'Notification in-app', icon: Bell },
    { value: 'email', label: 'Email', icon: Mail },
];

export function CommunicationCenter() {
    const { api } = useAuth();
    const [history, setHistory] = useState([]);
    const [form, setForm] = useState({ to: 'all', subject: '', message: '', type: 'notification' });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/communications').then(r => { setHistory(r.data); setLoading(false); });
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!form.subject.trim() || !form.message.trim()) return;
        setSending(true);
        try {
            const res = await api.post('/admin/notify', form);
            setHistory(prev => [res.data.communication, ...prev]);
            setForm(f => ({ ...f, subject: '', message: '' }));
            setSent(true);
            setTimeout(() => setSent(false), 3000);
        } finally {
            setSending(false);
        }
    };

    const targetLabels = { all: 'Tous', users: 'Patients', psychologists: 'Psychologues' };

    return (
        <AdminLayout title="Centre de Communication" breadcrumb="Communication">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Compose form */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <h2 className="text-white font-semibold text-base mb-5">Nouvelle communication</h2>
                    <form onSubmit={handleSend} className="space-y-4">
                        {/* Target */}
                        <div>
                            <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Destinataires</label>
                            <div className="grid grid-cols-3 gap-2">
                                {targetOptions.map(({ value, label, icon: Icon }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setForm(f => ({ ...f, to: value }))}
                                        className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${form.to === value ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'}`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Type</label>
                            <div className="grid grid-cols-2 gap-2">
                                {typeOptions.map(({ value, label, icon: Icon }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setForm(f => ({ ...f, type: value }))}
                                        className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${form.type === value ? 'bg-purple-500/20 border-purple-500/40 text-purple-400' : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'}`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Sujet</label>
                            <input
                                type="text"
                                value={form.subject}
                                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                                placeholder="Objet du message..."
                                required
                                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500"
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Message</label>
                            <textarea
                                value={form.message}
                                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                placeholder="Contenu du message..."
                                required
                                rows={5}
                                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={sending || !form.subject.trim() || !form.message.trim()}
                            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                        >
                            {sent ? (
                                <><CheckCircle className="w-4 h-4" /> Envoyé !</>
                            ) : sending ? (
                                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Envoi...</>
                            ) : (
                                <><Send className="w-4 h-4" /> Envoyer la communication</>
                            )}
                        </button>
                    </form>
                </div>

                {/* History */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <h2 className="text-white font-semibold text-base mb-5">
                        Historique des communications
                        <span className="ml-2 text-xs text-slate-500 font-normal">({history.length})</span>
                    </h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                        {loading ? (
                            <p className="text-slate-500 text-sm text-center py-8">Chargement...</p>
                        ) : history.length === 0 ? (
                            <p className="text-slate-500 text-sm text-center py-8">Aucune communication envoyée</p>
                        ) : history.map(c => (
                            <div key={c.id} className="p-4 rounded-xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800/60 transition-all">
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <h4 className="text-white text-sm font-medium line-clamp-1">{c.subject}</h4>
                                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${c.type === 'email' ? 'bg-blue-500/15 text-blue-400' : 'bg-purple-500/15 text-purple-400'}`}>
                                        {c.type === 'email' ? 'Email' : 'Notif.'}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-xs line-clamp-2 mb-2">{c.message}</p>
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span>→ {targetLabels[c.to] || c.to}</span>
                                    <span>{new Date(c.sentAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
