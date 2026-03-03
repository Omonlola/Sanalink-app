import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Target, Users } from 'lucide-react';

export function PMFTracker() {
    const { api } = useAuth();
    const [pmfData, setPmfData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/pmf-stats')
            .then(r => {
                setPmfData(r.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const getCellColor = (value) => {
        if (value === 0) return 'bg-slate-50 text-slate-300';
        if (value < 10) return 'bg-red-100 text-red-700';
        if (value < 30) return 'bg-orange-100 text-orange-700';
        if (value < 50) return 'bg-yellow-100 text-yellow-700';
        if (value < 75) return 'bg-lime-100 text-lime-700';
        return 'bg-emerald-100 text-emerald-700';
    };

    if (loading) return (
        <div className="flex items-center justify-center h-48 bg-white border border-brand-100 rounded-2xl">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="rounded-2xl border border-brand-100 bg-white/80 backdrop-blur shadow-sm p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-brand-900 font-semibold text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-brand-500" />
                        Indicateur PMF : Cohortes Journalier
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        % d'utilisateurs ayant réalisé une série de 7 jours consécutifs (cumulé par jour après inscription)
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100">
                    <Users className="w-4 h-4 text-brand-600" />
                    <span className="text-brand-700 text-xs font-semibold">Objectif PMF: 75%</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1200px]">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="py-3 px-4 text-slate-500 font-medium text-xs uppercase tracking-wider sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Cohorte (Semaine)</th>
                            <th className="py-3 px-4 text-slate-500 font-medium text-xs uppercase tracking-wider">Acquis.</th>
                            {[...Array(30)].map((_, i) => (
                                <th key={i} className="py-3 px-1 text-center text-slate-400 font-medium text-[10px]">
                                    J{i + 1}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {pmfData.map((cohort, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 px-4 whitespace-nowrap sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                    <span className="text-slate-700 font-medium text-sm">{cohort.label}</span>
                                </td>
                                <td className="py-3 px-4">
                                    <span className="text-slate-500 font-semibold text-sm">{cohort.acquired}</span>
                                </td>
                                {cohort.retention.map((value, dIdx) => (
                                    <td key={dIdx} className="py-1 px-0.5">
                                        <div className={`
                                            w-8 h-8 flex items-center justify-center rounded-sm text-[9px] font-bold transition-all
                                            ${getCellColor(value)}
                                            ${value >= 75 ? 'ring-1 ring-emerald-500 shadow-sm' : ''}
                                        `}>
                                            {value > 0 ? `${value}%` : '-'}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {pmfData.length === 0 && (
                            <tr>
                                <td colSpan={14} className="py-12 text-center text-slate-400 text-sm">
                                    Aucune donnée de cohorte disponible.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 items-center justify-center border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-100 rounded-sm" />
                    <span className="text-xs text-slate-500">&lt; 10%</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-100 rounded-sm" />
                    <span className="text-xs text-slate-500">10-30%</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-100 rounded-sm" />
                    <span className="text-xs text-slate-500">30-50%</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-lime-100 rounded-sm" />
                    <span className="text-xs text-slate-500">50-75%</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-100 rounded-sm ring-1 ring-emerald-500" />
                    <span className="text-xs text-slate-500">75%+ (PMF)</span>
                </div>
            </div>
        </div>
    );
}
