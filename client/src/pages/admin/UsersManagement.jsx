import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { Search, UserX, UserCheck, Eye } from 'lucide-react';

export function UsersManagement() {
    const { api } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        api.get('/admin/users').then(r => { setUsers(r.data); setLoading(false); });
    }, []);

    const updateStatus = async (id, status) => {
        await api.put(`/admin/users/${id}/status`, { status });
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
        if (selected?.id === id) setSelected(s => ({ ...s, status }));
    };

    const filtered = users.filter(u => {
        const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' || u.status === filter;
        return matchSearch && matchFilter;
    });

    const statusBtns = [
        { key: 'all', label: 'Tous' },
        { key: 'active', label: 'Actifs' },
        { key: 'inactive', label: 'Inactifs' },
        { key: 'suspended', label: 'Suspendus' },
    ];

    return (
        <AdminLayout title="Gestion des Patients" breadcrumb="Patients">
            <div className="space-y-5">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom ou email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-brand-200 rounded-xl text-slate-700 placeholder-slate-400 text-sm focus:outline-none focus:border-brand-400 shadow-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        {statusBtns.map(b => (
                            <button key={b.key} onClick={() => setFilter(b.key)}
                                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${filter === b.key ? 'bg-brand-600 text-white shadow-sm' : 'bg-white border border-brand-200 text-slate-500 hover:text-brand-700 hover:border-brand-300'}`}>
                                {b.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-brand-100 bg-white/80 backdrop-blur shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-brand-100 bg-brand-50/60">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-brand-600 uppercase tracking-wider">Patient</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-brand-600 uppercase tracking-wider hidden md:table-cell">Profession</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-brand-600 uppercase tracking-wider">Statut</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-brand-600 uppercase tracking-wider hidden lg:table-cell">Consultations</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-brand-600 uppercase tracking-wider hidden lg:table-cell">Inscrit le</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-brand-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan={6} className="py-16 text-center text-slate-400">Chargement...</td></tr>
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan={6} className="py-16 text-center text-slate-400">Aucun patient trouvé</td></tr>
                                ) : filtered.map(u => (
                                    <tr key={u.id} className="hover:bg-brand-50/40 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-600 text-sm font-bold flex-shrink-0">
                                                    {u.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-slate-800 font-medium text-sm">{u.name}</p>
                                                    <p className="text-slate-400 text-xs">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="text-slate-600 text-sm">{u.profession || '—'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={u.status} />
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <span className="text-slate-600 text-sm">{u.consultationsCount}</span>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <span className="text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setSelected(u)} title="Voir détails"
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {u.status !== 'suspended' ? (
                                                    <button onClick={() => updateStatus(u.id, 'suspended')} title="Suspendre"
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                                                        <UserX className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button onClick={() => updateStatus(u.id, 'active')} title="Réactiver"
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                                                        <UserCheck className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <p className="text-slate-400 text-sm">{filtered.length} patient{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}</p>
            </div>

            {/* Detail modal */}
            {selected && (
                <div className="fixed inset-0 z-50 bg-brand-900/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
                    <div className="bg-white border border-brand-100 shadow-2xl rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-14 h-14 rounded-2xl bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-600 text-xl font-bold">
                                {selected.name?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-brand-900 font-bold text-lg">{selected.name}</h3>
                                <p className="text-slate-400 text-sm">{selected.email}</p>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm">
                            {[
                                { label: 'Statut', value: <StatusBadge status={selected.status} /> },
                                { label: 'Âge', value: selected.age ? `${selected.age} ans` : '—' },
                                { label: 'Profession', value: selected.profession || '—' },
                                { label: 'Motif de consultation', value: selected.reason || '—' },
                                { label: 'État émotionnel', value: selected.emotionalState || '—' },
                                { label: 'Consultations', value: selected.consultationsCount },
                                { label: 'Inscrit le', value: new Date(selected.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) },
                            ].map(row => (
                                <div key={row.label} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                                    <span className="text-slate-400">{row.label}</span>
                                    <span className="text-slate-700">{row.value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-5">
                            {selected.status !== 'suspended' ? (
                                <button onClick={() => updateStatus(selected.id, 'suspended')}
                                    className="flex-1 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium hover:bg-red-100 transition-all">
                                    Suspendre
                                </button>
                            ) : (
                                <button onClick={() => updateStatus(selected.id, 'active')}
                                    className="flex-1 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition-all">
                                    Réactiver
                                </button>
                            )}
                            <button onClick={() => setSelected(null)}
                                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-all">
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
