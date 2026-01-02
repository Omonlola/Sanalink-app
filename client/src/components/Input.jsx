import { clsx } from 'clsx';

export function Input({ label, error, className, ...props }) {
    return (
        <div className={className}>
            {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
            <input
                className={clsx(
                    "w-full px-4 py-2 rounded-lg border bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none",
                    error ? "border-red-500" : "border-slate-200"
                )}
                {...props}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
