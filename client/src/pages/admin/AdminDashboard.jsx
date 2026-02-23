import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatCard } from '../../components/admin/StatCard';
import {
    Users, UserCheck, Calendar, DollarSign,
    TrendingUp, AlertCircle, Clock, CheckCircle
} from 'lucide-react';

export function AdminDashboard() {
    const { api } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/stats').then(r => {
            setStats(r.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const maxWeek = stats ? Math.max(...stats.weeklyConsultations.map(w => w.count), 1) : 1;

    return (
        <AdminLayout title="Tableau de Bord" breadcrumb="Vue d'ensemble">
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="space-y-8">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="Patients inscrits" value={stats?.totalUsers || 0} icon={Users} color="brand" trend={12} subtitle={`+${stats?.newUsersLast30 || 0} ce mois`} />
                        <StatCard title="Psychologues" value={stats?.totalPsychs || 0} icon={UserCheck} color="purple" subtitle="Actifs sur la plateforme" />
                        <StatCard title="Consultations" value={stats?.totalAppointments || 0} icon={Calendar} color="blue" subtitle={`${stats?.completedAppointments || 0} terminées`} trend={8} />
                        <StatCard title="Revenus nets" value={`${stats?.netRevenue || 0} €`} icon={DollarSign} color="green" subtitle={`Commissions: ${stats?.commissions || 0} €`} trend={5} />
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="À venir" value={stats?.upcomingAppointments || 0} icon={Clock} color="yellow" subtitle="Consultations planifiées" />
                        <StatCard title="Annulées" value={stats?.cancelledAppointments || 0} icon={AlertCircle} color="red" subtitle="Ce mois-ci" />
                        <StatCard title="Taux de conversion" value={`${stats?.conversionRate || 0}%`} icon={TrendingUp} color="green" subtitle="Patients avec consultation" />
                        <StatCard title="Remboursements" value={`${stats?.totalRefunds || 0} €`} icon={CheckCircle} color="purple" subtitle="Total remboursé" />
                    </div>

                    {/* Weekly chart */}
                    <div className="rounded-2xl border border-brand-100 bg-white/80 backdrop-blur shadow-sm p-6">
                        <h2 className="text-brand-900 font-semibold text-base mb-6">Consultations par semaine</h2>
                        <div className="flex items-end gap-4 h-40">
                            {stats?.weeklyConsultations.map((week, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <span className="text-brand-600 text-xs font-medium">{week.count}</span>
                                    <div className="w-full rounded-t-lg bg-brand-100 border border-brand-200 transition-all duration-500"
                                        style={{ height: `${Math.round((week.count / maxWeek) * 120) || 4}px` }}>
                                        <div className="w-full h-full rounded-t-lg bg-brand-400/70" />
                                    </div>
                                    <span className="text-slate-400 text-xs">{week.week === 'S-0' ? 'Cette sem.' : week.week}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Status breakdown */}
                        <div className="rounded-2xl border border-brand-100 bg-white/80 backdrop-blur shadow-sm p-6">
                            <h2 className="text-brand-900 font-semibold text-base mb-4">Répartition des consultations</h2>
                            {[
                                { label: 'Terminées', value: stats?.completedAppointments || 0, total: stats?.totalAppointments || 1, color: 'bg-emerald-400' },
                                { label: 'À venir', value: stats?.upcomingAppointments || 0, total: stats?.totalAppointments || 1, color: 'bg-brand-400' },
                                { label: 'Annulées', value: stats?.cancelledAppointments || 0, total: stats?.totalAppointments || 1, color: 'bg-red-400' },
                            ].map(item => (
                                <div key={item.label} className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600">{item.label}</span>
                                        <span className="text-slate-400">{item.value} ({Math.round((item.value / item.total) * 100)}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                                        <div className={`${item.color} h-1.5 rounded-full transition-all duration-700`}
                                            style={{ width: `${Math.round((item.value / item.total) * 100)}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Revenue breakdown */}
                        <div className="rounded-2xl border border-brand-100 bg-white/80 backdrop-blur shadow-sm p-6">
                            <h2 className="text-brand-900 font-semibold text-base mb-4">Résumé financier</h2>
                            <div className="space-y-3">
                                {[
                                    { label: 'Revenus bruts', value: `${stats?.totalRevenue || 0} €`, color: 'text-emerald-600' },
                                    { label: 'Remboursements', value: `- ${stats?.totalRefunds || 0} €`, color: 'text-red-500' },
                                    { label: 'Revenus nets', value: `${stats?.netRevenue || 0} €`, color: 'text-brand-700 font-bold' },
                                    { label: 'Commissions Sanalink (15%)', value: `${stats?.commissions || 0} €`, color: 'text-brand-500' },
                                ].map(item => (
                                    <div key={item.label} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                                        <span className="text-slate-500 text-sm">{item.label}</span>
                                        <span className={`text-sm ${item.color}`}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
