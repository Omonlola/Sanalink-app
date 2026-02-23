import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { Search, Star, CheckCircle, XCircle } from 'lucide-react';

export function PsychologistsManagement() {
    const { api } = useAuth();
    const [psychs, setPsychs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        api.get('/admin/psychologists').then(r => { setPsychs(r.data); setLoading(false); });
    }, []);

    const updateStatus = async (id, status) => {
        await api.put(`/admin/psychologists/${id}/status`, { status });
        setPsychs(prev => prev.map(p => p.id === id ? { ...p, status } : p));
        if (selected?.id === id) setSelected(s => ({ ...s, status }));
    };

    const filtered = psychs.filter(p => {
        const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || p.specialty?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' || p.status === filter;
        return matchSearch && matchFilter;
    });

    const filterBtns = [
        { key: 'all', label: 'Tous' },
        { key: 'validated', label: 'Validés' },
        { key: 'pending', label: 'En attente' },
        { key: 'suspended', label: 'Suspendus' },
    ];

    const RatingStars = ({ rating }) => (
        <div className="flex items-center gap-1">
            {rating ? (
                <>
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-amber-600 text-sm font-medium">{rating}</span>
                </>
            ) : (
                <span className="text-slate-400 text-sm">—</span>
            )}
        </div>
    );

    return (
        <AdminLayout title="Gestion des Psychologues" breadcrumb="Psychologues">
            <div className="space-y-5">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom ou spécialité..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-brand-200 rounded-xl text-slate-700 placeholder-slate-400 text-sm focus:outline-none focus:border-brand-400 shadow-sm"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {filterBtns.map(b => (
                            <button key={b.key} onClick={() => setFilter(b.key)}
                                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${filter === b.key ? 'bg-brand-600 text-white shadow-sm' : 'bg-white border border-brand-200 text-slate-500 hover:text-brand-700 hover:border-brand-300'}`}>
                                {b.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filtered.map(p => (
                            <div key={p.id} className="bg-white border border-brand-100 rounded-2xl p-5 hover:border-brand-300 hover:shadow-md transition-all">
                                <div className="flex items-start gap-4 mb-4">
                                    <img
                                        src={p.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100'}
                                        alt={p.name}
                                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-brand-100"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-slate-800 font-semibold text-sm truncate">{p.name}</h3>
                                        <p className="text-slate-400 text-xs truncate">{p.specialty}</p>
                                        <div className="mt-1"><StatusBadge status={p.status} /></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <div className="text-center p-2 rounded-lg bg-brand-50 border border-brand-100">
                                        <p className="text-brand-700 font-bold text-lg">{p.totalConsultations || 0}</p>
                                        <p className="text-slate-400 text-xs">Consult.</p>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-brand-50 border border-brand-100">
                                        <p className="text-brand-700 font-bold text-lg">{p.completedConsultations || 0}</p>
                                        <p className="text-slate-400 text-xs">Terminées</p>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-brand-50 border border-brand-100">
                                        <RatingStars rating={p.rating} />
                                        <p className="text-slate-400 text-xs">Note</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button onClick={() => setSelected(p)}
                                        className="flex-1 py-1.5 rounded-lg border border-brand-200 text-brand-600 text-xs hover:bg-brand-50 transition-all">
                                        Voir profil
                                    </button>
                                    {p.status === 'pending' && (
                                        <button onClick={() => updateStatus(p.id, 'validated')}
                                            className="flex-1 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs hover:bg-emerald-100 transition-all flex items-center justify-center gap-1">
                                            <CheckCircle className="w-3 h-3" />Valider
                                        </button>
                                    )}
                                    {p.status === 'validated' && (
                                        <button onClick={() => updateStatus(p.id, 'suspended')}
                                            className="flex-1 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs hover:bg-red-100 transition-all flex items-center justify-center gap-1">
                                            <XCircle className="w-3 h-3" />Suspendre
                                        </button>
                                    )}
                                    {p.status === 'suspended' && (
                                        <button onClick={() => updateStatus(p.id, 'validated')}
                                            className="flex-1 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs hover:bg-emerald-100 transition-all flex items-center justify-center gap-1">
                                            <CheckCircle className="w-3 h-3" />Réactiver
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <div className="col-span-3 text-center py-16 text-slate-400">Aucun psychologue trouvé</div>
                        )}
                    </div>
                )}
                <p className="text-slate-400 text-sm">{filtered.length} psychologue{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}</p>
            </div>

            {selected && (
                <div className="fixed inset-0 z-50 bg-brand-900/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
                    <div className="bg-white border border-brand-100 shadow-2xl rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-4 mb-5">
                            <img src={selected.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100'}
                                alt={selected.name} className="w-16 h-16 rounded-2xl object-cover border border-brand-100" />
                            <div>
                                <h3 className="text-brand-900 font-bold text-lg">{selected.name}</h3>
                                <p className="text-slate-400 text-sm">{selected.specialty}</p>
                                <StatusBadge status={selected.status} />
                            </div>
                        </div>
                        <div className="space-y-3 text-sm">
                            {[
                                { label: 'Email', value: selected.email },
                                { label: 'Note', value: selected.rating ? `${selected.rating} / 5` : '—' },
                                { label: 'Consultations totales', value: selected.totalConsultations || 0 },
                                { label: 'Consultations terminées', value: selected.completedConsultations || 0 },
                                { label: 'Revenus générés', value: `${selected.revenue || 0} €` },
                                { label: 'Membre depuis', value: selected.createdAt ? new Date(selected.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
                            ].map(row => (
                                <div key={row.label} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                                    <span className="text-slate-400">{row.label}</span>
                                    <span className="text-slate-700">{row.value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-5">
                            {selected.status === 'pending' && <button onClick={() => updateStatus(selected.id, 'validated')} className="flex-1 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium hover:bg-emerald-100">Valider</button>}
                            {selected.status === 'validated' && <button onClick={() => updateStatus(selected.id, 'suspended')} className="flex-1 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium hover:bg-red-100">Suspendre</button>}
                            {selected.status === 'suspended' && <button onClick={() => updateStatus(selected.id, 'validated')} className="flex-1 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium hover:bg-emerald-100">Réactiver</button>}
                            <button onClick={() => setSelected(null)} className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200">Fermer</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
