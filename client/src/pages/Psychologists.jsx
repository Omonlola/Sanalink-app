import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Search, Star, MessageSquare } from 'lucide-react';
import axios from 'axios';

const Psychologists = () => {
    const [psychs, setPsychs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPsychs = async () => {
            try {
                // In a real app, this would be an API call
                // For now, mirroring the mobile app's behavior
                const response = await axios.get('http://localhost:5000/api/psychologists');
                setPsychs(response.data);
            } catch (error) {
                console.error('Error fetching psychologists:', error);
                // Mock data fallback matching mobile features
                setPsychs([
                    {
                        id: 1,
                        name: 'Dr. Sarah Martin',
                        specialty: 'Anxiété & Dépression',
                        rating: 4.9,
                        image: 'https://images.unsplash.com/photo-1559839734-2b71f1e59816?auto=format&fit=crop&q=80&w=200',
                        experience: '12 ans'
                    },
                    {
                        id: 2,
                        name: 'Marc Lefebvre',
                        specialty: 'Thérapie de couple',
                        rating: 4.7,
                        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
                        experience: '8 ans'
                    },
                    {
                        id: 3,
                        name: 'Julie Dubois',
                        specialty: 'Stress au travail',
                        rating: 4.8,
                        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200',
                        experience: '10 ans'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchPsychs();
    }, []);

    const filteredPsychs = psychs.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Nos Psychologues</h1>
                    <p className="text-slate-600 mt-1">Trouvez le professionnel qui vous correspond.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou spécialité..."
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-full md:w-80"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPsychs.map((psych) => (
                        <Card key={psych.id} className="p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <img
                                    src={psych.image}
                                    alt={psych.name}
                                    className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-900">{psych.name}</h3>
                                    <p className="text-indigo-600 text-sm font-medium">{psych.specialty}</p>
                                    <div className="flex items-center gap-1 mt-2 mb-4">
                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        <span className="text-sm font-semibold text-slate-700">{psych.rating}</span>
                                        <span className="text-xs text-slate-400 ml-1">({psych.experience})</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <Button variant="outline" className="flex items-center justify-center gap-2 text-sm">
                                    <MessageSquare className="w-4 h-4" />
                                    Profil
                                </Button>
                                <Button className="text-sm">
                                    Prendre RDV
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {!loading && filteredPsychs.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500">Aucun psychologue ne correspond à votre recherche.</p>
                </div>
            )}
        </div>
    );
};

export default Psychologists;
