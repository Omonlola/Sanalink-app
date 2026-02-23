import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Users, UserCheck, Calendar,
    DollarSign, MessageSquare, LogOut, HeartPulse, ChevronRight
} from 'lucide-react';

const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Patients', icon: Users },
    { to: '/admin/psychologists', label: 'Psychologues', icon: UserCheck },
    { to: '/admin/consultations', label: 'Consultations', icon: Calendar },
    { to: '/admin/finances', label: 'Finances', icon: DollarSign },
    { to: '/admin/communications', label: 'Communication', icon: MessageSquare },
];

export function AdminLayout({ children, title, breadcrumb }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans" style={{ paddingTop: 0 }}>
            {/* Sidebar — teinte brand-800/900 du site */}
            <aside className="w-64 flex-shrink-0 flex flex-col bg-brand-900 border-r border-brand-800">
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-brand-800/60">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur">
                        <HeartPulse className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-white font-bold text-lg tracking-tight">SANALINK</span>
                        <p className="text-brand-300 text-xs -mt-0.5">Administration CRM</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-white/15 text-white border border-white/20 backdrop-blur'
                                    : 'text-brand-200 hover:text-white hover:bg-white/10'
                                }`
                            }
                        >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* User info + logout */}
                <div className="px-3 py-4 border-t border-brand-800/60">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 backdrop-blur">
                        <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-medium truncate">{user?.name}</p>
                            <p className="text-brand-300 text-xs">Administrateur</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-brand-300 hover:text-red-300 transition-colors"
                            title="Déconnexion"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top header — glass comme la navbar du site */}
                <header className="flex-shrink-0 bg-white/70 backdrop-blur-lg border-b border-brand-100 shadow-sm px-8 py-4">
                    <div className="flex items-center gap-2 text-sm text-brand-400">
                        <span>CRM</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-brand-700 font-medium">{breadcrumb || title}</span>
                    </div>
                    <h1 className="text-xl font-bold text-brand-900 mt-0.5">{title}</h1>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
                    {children}
                </main>
            </div>
        </div>
    );
}
