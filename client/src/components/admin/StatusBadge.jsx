const statusConfig = {
    active: { label: 'Actif', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    inactive: { label: 'Inactif', cls: 'bg-slate-100 text-slate-500 border-slate-200' },
    suspended: { label: 'Suspendu', cls: 'bg-red-100 text-red-600 border-red-200' },
    pending: { label: 'En attente', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    validated: { label: 'Validé', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    completed: { label: 'Terminée', cls: 'bg-brand-100 text-brand-700 border-brand-200' },
    upcoming: { label: 'À venir', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
    cancelled: { label: 'Annulée', cls: 'bg-red-100 text-red-600 border-red-200' },
    paid: { label: 'Payé', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    refunded: { label: 'Remboursé', cls: 'bg-purple-100 text-purple-700 border-purple-200' },
    rejected: { label: 'Rejeté', cls: 'bg-red-100 text-red-600 border-red-200' },
};

export function StatusBadge({ status }) {
    const config = statusConfig[status] || { label: status, cls: 'bg-slate-100 text-slate-500 border-slate-200' };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.cls}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-60"></span>
            {config.label}
        </span>
    );
}
