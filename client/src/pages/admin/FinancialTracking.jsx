import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { StatCard } from '../../components/admin/StatCard';
import { DollarSign, TrendingUp, TrendingDown, Percent } from 'lucide-react';

export function FinancialTracking() {
    const { api } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        api.get('/admin/payments').then(r => { setData(r.data); setLoading(false); });
    }, []);

    const filtered = (data?.transactions || []).filter(t =>
        filter === 'all' || t.paymentStatus === filter
    );

    return (
        <AdminLayout title="Suivi Financier" breadcrumb="Finances">
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* KPI summary */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="Revenus bruts" value={`${data?.summary?.total || 0} €`} icon={DollarSign} color="green" subtitle="Total encaissé" />
                        <StatCard title="Revenus nets" value={`${data?.summary?.net || 0} €`} icon={TrendingUp} color="brand" subtitle="Après remboursements" />
                        <StatCard title="Remboursements" value={`${data?.summary?.refunds || 0} €`} icon={TrendingDown} color="red" subtitle="Total remboursé" />
                        <StatCard title="Commissions" value={`${data?.summary?.commissions || 0} €`} icon={Percent} color="purple" subtitle="15% sur revenus nets" />
                    </div>

                    {/* By doctor summary */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                        <h2 className="text-white font-semibold text-base mb-4">Revenus par psychologue</h2>
                        <div className="overflow-x-auto">
                            {(() => {
                                const byDoctor = {};
                                (data?.transactions || []).filter(t => t.paymentStatus === 'paid').forEach(t => {
                                    if (!byDoctor[t.doctorName]) byDoctor[t.doctorName] = { total: 0, count: 0, commission: 0 };
                                    byDoctor[t.doctorName].total += t.amount;
                                    byDoctor[t.doctorName].commission += t.commission;
                                    byDoctor[t.doctorName].count++;
                                });
                                return Object.entries(byDoctor).map(([name, vals]) => (
                                    <div key={name} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 text-xs font-bold">
                                                {name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-medium">{name}</p>
                                                <p className="text-slate-400 text-xs">{vals.count} consultation{vals.count !== 1 ? 's' : ''}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-emerald-400 font-semibold text-sm">{vals.total} €</p>
                                            <p className="text-slate-500 text-xs">Comm: {vals.commission} €</p>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>

                    {/* Transactions table */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                            <h2 className="text-white font-semibold text-base">Transactions</h2>
                            <div className="flex gap-2">
                                {['all', 'paid', 'pending', 'refunded'].map(f => (
                                    <button key={f} onClick={() => setFilter(f)}
                                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${filter === f ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                                        {f === 'all' ? 'Toutes' : f === 'paid' ? 'Payées' : f === 'pending' ? 'En attente' : 'Remboursées'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-800">
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Date</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Patient</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase hidden md:table-cell">Psychologue</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Statut</th>
                                        <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Montant</th>
                                        <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase hidden lg:table-cell">Commission</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {filtered.length === 0 ? (
                                        <tr><td colSpan={6} className="py-10 text-center text-slate-500">Aucune transaction</td></tr>
                                    ) : filtered.map(t => (
                                        <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 text-slate-300 text-sm">{new Date(t.date).toLocaleDateString('fr-FR')}</td>
                                            <td className="px-6 py-4 text-white text-sm font-medium">{t.patientName}</td>
                                            <td className="px-6 py-4 text-slate-300 text-sm hidden md:table-cell">{t.doctorName}</td>
                                            <td className="px-6 py-4"><StatusBadge status={t.paymentStatus} /></td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`text-sm font-semibold ${t.paymentStatus === 'paid' ? 'text-emerald-400' : t.paymentStatus === 'refunded' ? 'text-red-400' : 'text-slate-400'}`}>
                                                    {t.paymentStatus === 'refunded' ? '-' : ''}{t.amount} €
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-slate-500 text-sm hidden lg:table-cell">
                                                {t.paymentStatus === 'paid' ? `${t.commission} €` : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
