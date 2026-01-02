import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';

export function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('user'); // 'user' or 'psychologist'
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, type);
            // Automatically login after register or redirect to login? 
            // Let's redirect to login for clarity
            navigate('/login');
        } catch (err) {
            setError('Erreur lors de l\'inscription. L\'email existe peut-être déjà.');
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-brand-900">Inscription</h2>

                <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
                    <button
                        type="button"
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'user' ? 'bg-white shadow text-brand-700' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setType('user')}
                    >
                        Patient
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'psychologist' ? 'bg-white shadow text-brand-700' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setType('psychologist')}
                    >
                        Psychologue
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nom complet"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Mot de passe"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <Button type="submit" className="w-full">Créer un compte</Button>

                    <p className="text-center text-sm text-slate-600">
                        Déjà un compte ? <Link to="/login" className="text-brand-600 font-medium hover:underline">Se connecter</Link>
                    </p>
                </form>
            </Card>
        </div>
    );
}
