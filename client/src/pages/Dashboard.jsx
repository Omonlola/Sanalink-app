import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Calendar, Video, MapPin, User, Clock, CheckCircle } from 'lucide-react';

export function Dashboard() {
    const { user, api } = useAuth();
    const [psychologists, setPsychologists] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [selectedPsy, setSelectedPsy] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [bookingType, setBookingType] = useState('remote');
    const [isPaid, setIsPaid] = useState(false);
    const [paymentNumber, setPaymentNumber] = useState(user.phoneNumber || '');

    const fetchData = async () => {
        try {
            if (user.type === 'user') {
                const [psyRes, appRes] = await Promise.all([
                    api.get('/psychologists'),
                    api.get(`/appointments/${user.id}`)
                ]);
                setPsychologists(psyRes.data);
                setAppointments(appRes.data);
            } else {
                const appRes = await api.get(`/appointments/${user.id}`);
                setAppointments(appRes.data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    useEffect(() => {
        if (user.phoneNumber) setPaymentNumber(user.phoneNumber);
    }, [user]);

    const handleBook = async () => {
        if (!selectedPsy || !bookingDate || !bookingTime) return;
        try {
            await api.post('/appointments', {
                userId: user.id,
                doctorId: selectedPsy.id,
                date: bookingDate,
                time: bookingTime,
                type: bookingType
            });
            setSelectedPsy(null);
            fetchData(); // Refresh
            alert('Rendez-vous confirmé !');
        } catch (e) {
            alert('Erreur lors de la réservation');
        }
    };

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-brand-900 mb-8">
                Bienvenue, {user.name}
            </h1>

            {/* Profile Summary Section */}
            <section className="mb-12">
                <Card className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-brand-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-1 rounded-full shadow-sm overflow-hidden w-16 h-16 flex items-center justify-center border-2 border-white">
                            {user.image ? (
                                <img src={user.image} alt="Profile" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <User className="w-8 h-8 text-brand-500" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Mon Profil</h2>
                            <p className="text-slate-600">
                                {user.type === 'user'
                                    ? (user.age ? `${user.age} ans • ${user.profession}` : 'Complétez votre profil pour un meilleur suivi')
                                    : (user.specialty || 'Spécialité non renseignée')
                                }
                            </p>
                        </div>
                    </div>

                    <Link to="/profile">
                        <Button variant="secondary" className="whitespace-nowrap">
                            Modifier mes informations
                        </Button>
                    </Link>
                </Card>
            </section>

            {user.type === 'user' ? (
                <div className="space-y-12">
                    {/* Section Appointments */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-brand-500" />
                            Mes Rendez-vous
                        </h2>
                        {appointments.length === 0 ? (
                            <Card className="text-center py-8 text-slate-500">Aucun rendez-vous prévu.</Card>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                                {appointments.map(app => (
                                    <Card key={app.id} className="flex flex-col gap-2 border-l-4 border-l-brand-500">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-slate-900">Dr. {app.doctorName || 'Inconnu'}</h3>
                                                <p className="text-sm text-slate-600">{app.date} à {app.time}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${app.type === 'remote' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {app.type === 'remote' ? 'À distance' : 'Présentiel'}
                                            </span>
                                        </div>
                                        {app.type === 'remote' && (
                                            <div className="mt-2 text-sm bg-slate-50 p-2 rounded border border-slate-200">
                                                <p className="font-medium text-slate-700">Lien de la réunion :</p>
                                                <a href={app.link} target="_blank" rel="noreferrer" className="text-brand-600 underline truncate block">
                                                    {app.link}
                                                </a>
                                                <p className="text-xs text-slate-500 mt-1">(Envoyé par agnesvdogo@gmail.com)</p>
                                            </div>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Section Catalog */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-brand-500" />
                            Trouver un psychologue
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {psychologists.map(psy => (
                                <Card key={psy.id} className="flex flex-col h-full hover:border-brand-300 transition-colors">
                                    <div className="flex items-center gap-4 mb-4">
                                        {psy.image ? (
                                            <img src={psy.image} alt={psy.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-md">
                                                <User className="w-8 h-8 text-slate-400" />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-bold text-slate-900">{psy.name}</h3>
                                            <p className="text-sm text-brand-600 font-medium">{psy.specialty}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-4 flex-grow">{psy.description}</p>
                                    <Button onClick={() => setSelectedPsy(psy)} className="w-full mt-auto">
                                        Prendre RDV
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Psychologist View */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Planning des consultations</h2>
                        {appointments.length === 0 ? (
                            <Card className="text-center py-8 text-slate-500">Aucune consultation prévue.</Card>
                        ) : (
                            <div className="space-y-4">
                                {appointments.map(app => (
                                    <Card key={app.id} className="flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-lg">Patient: {app.userName || 'Anonyme'}</h3>
                                                <p className="text-sm text-slate-600">{app.date} à {app.time} • {app.type}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {app.type === 'remote' && (
                                                    <Button size="sm" onClick={() => window.open(app.link, '_blank')}>
                                                        Rejoindre Meet
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Patient Details (if available) */}
                                        {app.patientDetails && (
                                            <div className="bg-slate-50 p-3 rounded-lg text-sm border border-slate-200">
                                                {app.patientDetails.age && <p><span className="font-semibold">Âge:</span> {app.patientDetails.age} ans</p>}
                                                {app.patientDetails.profession && <p><span className="font-semibold">Profession:</span> {app.patientDetails.profession}</p>}
                                                {app.patientDetails.reason && <p><span className="font-semibold text-brand-700">Motif:</span> {app.patientDetails.reason}</p>}
                                                {app.patientDetails.emotionalState && <p><span className="font-semibold">État émotionnel:</span> {app.patientDetails.emotionalState}</p>}
                                            </div>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            )}

            {/* Booking Modal */}
            {selectedPsy && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-lg relative bg-white">
                        <button
                            onClick={() => { setSelectedPsy(null); setIsPaid(false); }}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold mb-6">Rendez-vous avec {selectedPsy.name}</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded-lg"
                                    value={bookingDate}
                                    onChange={e => setBookingDate(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Horaire</label>
                                <select
                                    className="w-full p-2 border rounded-lg"
                                    value={bookingTime}
                                    onChange={e => setBookingTime(e.target.value)}
                                >
                                    <option value="">Choisir un horaire</option>
                                    {selectedPsy.availableSlots.map(slot => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Type de consultation</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="remote"
                                            checked={bookingType === 'remote'}
                                            onChange={() => setBookingType('remote')}
                                        />
                                        <span>À distance (Google Meet)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="presentiel"
                                            checked={bookingType === 'presentiel'}
                                            onChange={() => setBookingType('presentiel')}
                                        />
                                        <span>En présentiel</span>
                                    </label>
                                </div>
                            </div>

                            {/* Payment Section if not yet paid */}
                            {!isPaid ? (
                                <>
                                    <div className="bg-brand-50 p-4 rounded-lg border border-brand-100 mb-4">
                                        <p className="text-sm font-medium text-brand-800 mb-1">Montant à régler</p>
                                        <p className="text-2xl font-bold text-brand-600">
                                            {selectedPsy.consultationFee ? `${selectedPsy.consultationFee} FCFA` : 'Gratuit'}
                                        </p>
                                    </div>

                                    {selectedPsy.consultationFee && (
                                        <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                            <h3 className="font-bold text-slate-800">Paiement Mobile Money</h3>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1">Numéro Momo / Flooz</label>
                                                <input
                                                    type="tel"
                                                    placeholder="+229 97 XX XX XX"
                                                    className="w-full p-2 border rounded text-sm"
                                                    value={paymentNumber}
                                                    onChange={e => setPaymentNumber(e.target.value)}
                                                />
                                            </div>
                                            <Button
                                                variant="primary"
                                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border-none"
                                                onClick={() => {
                                                    const confirm = window.confirm("Simulation: Confirmez-vous le paiement de " + selectedPsy.consultationFee + " FCFA ?");
                                                    if (confirm) setIsPaid(true);
                                                }}
                                            >
                                                Payer avec Mobile Money
                                            </Button>
                                        </div>
                                    )}

                                    {!selectedPsy.consultationFee && (
                                        <Button onClick={() => setIsPaid(true)} className="w-full mt-2">
                                            Continuer (Gratuit)
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Paiement Validé !</h3>
                                    <p className="text-slate-600 mb-6">Vous pouvez maintenant confirmer votre rendez-vous.</p>
                                    <Button onClick={handleBook} className="w-full">
                                        Confirmer le rendez-vous
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
