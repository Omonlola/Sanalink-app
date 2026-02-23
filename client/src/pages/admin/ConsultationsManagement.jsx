import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { Search, Video, MapPin } from 'lucide-react';

export function ConsultationsManagement() {
    const { api } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        api.get('/admin/appointments').then(r => { setAppointments(r.data); setLoading(false); });
    }, []);

    const filtered = appointments.filter(a => {
        const matchSearch =
            a.userName?.toLowerCase().includes(search.toLowerCase()) ||
            a.doctorName?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || a.status === filterStatus;
        const matchType = filterType === 'all' || a.type === filterType;
        return matchSearch && matchStatus && matchType;
    });

    const statusBtns = [
        { key: 'all', label: 'Toutes' },
        { key: 'upcoming', label: 'À venir' },
        { key: 'completed', label: 'Terminées' },
        { key: 'cancelled', label: 'Annulées' },
    ];

    const typeBtns = [
        { key: 'all', label: 'Tous types' },
        { key: 'remote', label: 'Téléconsultation' },
        { key: 'presentiel', label: 'Présentiel' },
    ];

    return (
        <AdminLayout title="Suivi des Consultations" breadcrumb="Consultations">
            <div className="space-y-5">
                {/* Filters */}
                <div className="flex flex-col gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Rechercher par patient ou psychologue..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {statusBtns.map(b => (
                            <button key={b.key} onClick={() => setFilterStatus(b.key)}
                                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${filterStatus === b.key ? 'bg-brand-500 text-white' : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'}`}>
                                {b.label}
                            </button>
                        ))}
                        <div className="w-px bg-slate-700 mx-1" />
                        {typeBtns.map(b => (
                            <button key={b.key} onClick={() => setFilterType(b.key)}
                                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${filterType === b.key ? 'bg-purple-500 text-white' : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'}`}>
                                {b.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Patient</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Psychologue</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date & Heure</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Statut</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Paiement</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Montant</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {loading ? (
                                    <tr><td colSpan={7} className="py-16 text-center text-slate-500">Chargement...</td></tr>
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan={7} className="py-16 text-center text-slate-500">Aucune consultation trouvée</td></tr>
                                ) : filtered.map(a => (
                                    <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-white text-sm font-medium">{a.userName}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-slate-200 text-sm">{a.doctorName}</p>
                                                <p className="text-slate-500 text-xs">{a.doctorSpecialty}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-slate-200 text-sm">{new Date(a.date).toLocaleDateString('fr-FR')}</p>
                                            <p className="text-slate-500 text-xs">{a.time}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-slate-300 text-sm">
                                                {a.type === 'remote' ? <Video className="w-3.5 h-3.5 text-blue-400" /> : <MapPin className="w-3.5 h-3.5 text-amber-400" />}
                                                {a.type === 'remote' ? 'Téléconsult.' : 'Présentiel'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><StatusBadge status={a.status} /></td>
                                        <td className="px-6 py-4"><StatusBadge status={a.paymentStatus} /></td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="text-slate-200 text-sm font-medium">{a.amount} €</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <p className="text-slate-500 text-sm">{filtered.length} consultation{filtered.length !== 1 ? 's' : ''} affichée{filtered.length !== 1 ? 's' : ''}</p>
            </div>
        </AdminLayout>
    );
}
