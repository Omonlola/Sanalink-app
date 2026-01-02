import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ children, className, variant = 'primary', ...props }) {
    const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/30',
        secondary: 'bg-white text-brand-900 hover:bg-gray-50 border border-gray-200',
        outline: 'border-2 border-brand-500 text-brand-500 hover:bg-brand-50',
        ghost: 'text-brand-600 hover:bg-brand-50',
        glass: 'bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30'
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
}
