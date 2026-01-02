import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';
import { HeartPulse } from 'lucide-react';

export function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 w-full z-50 glass border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-brand-500 p-2 rounded-lg">
                            <HeartPulse className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-700 to-brand-500">
                            SANALINK
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-slate-600 hover:text-brand-600 font-medium">Accueil</Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-slate-800">
                                    {user.name} ({user.type === 'psychologist' ? 'Psy' : 'Patient'})
                                </span>
                                <Link to="/dashboard">
                                    <Button variant="outline" className="py-1.5 text-sm">Tableau de bord</Button>
                                </Link>
                                <Link to="/profile">
                                    <Button variant="ghost" className="py-1.5 text-sm">Mon Profil</Button>
                                </Link>
                                <Button variant="ghost" onClick={handleLogout} className="py-1.5 text-sm">Déconnexion</Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login">
                                    <Button variant="ghost">Se connecter</Button>
                                </Link>
                                <Link to="/register">
                                    <Button>S'inscrire</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
