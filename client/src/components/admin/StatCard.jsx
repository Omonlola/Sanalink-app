export function StatCard({ title, value, subtitle, icon: Icon, color = 'brand', trend, trendLabel }) {
    const colorMap = {
        brand: { bg: 'bg-brand-50', border: 'border-brand-200', icon: 'text-brand-500', value: 'text-brand-700', iconBg: 'bg-brand-100' },
        green: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-600', value: 'text-emerald-700', iconBg: 'bg-emerald-100' },
        yellow: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', value: 'text-amber-700', iconBg: 'bg-amber-100' },
        red: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-500', value: 'text-red-700', iconBg: 'bg-red-100' },
        purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600', value: 'text-purple-700', iconBg: 'bg-purple-100' },
        blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', value: 'text-blue-700', iconBg: 'bg-blue-100' },
    };
    const c = colorMap[color] || colorMap.brand;

    return (
        <div className={`rounded-2xl border ${c.border} ${c.bg} p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-white/80 backdrop-blur`}>
            <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm font-medium">{title}</p>
                {Icon && (
                    <div className={`w-9 h-9 rounded-xl ${c.iconBg} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${c.icon}`} />
                    </div>
                )}
            </div>
            <div>
                <p className={`text-3xl font-bold ${c.value}`}>{value}</p>
                {subtitle && <p className="text-slate-400 text-xs mt-1">{subtitle}</p>}
            </div>
            {trend !== undefined && (
                <div className={`text-xs font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel || 'vs mois dernier'}
                </div>
            )}
        </div>
    );
}
