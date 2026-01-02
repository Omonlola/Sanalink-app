import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function Profile() {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    // Common State
    const [name, setName] = useState(user.name || '');
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');

    // Patient State
    const [age, setAge] = useState(user.age || '');
    const [profession, setProfession] = useState(user.profession || '');
    const [reason, setReason] = useState(user.reason || '');
    const [emotionalState, setEmotionalState] = useState(user.emotionalState || '');

    // Psychologist State
    const [description, setDescription] = useState(user.description || '');
    const [specialty, setSpecialty] = useState(user.specialty || '');
    const [consultationFee, setConsultationFee] = useState(user.consultationFee || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        try {
            const updates = { name, phoneNumber };
            if (user.type === 'user') {
                Object.assign(updates, { age, profession, reason, emotionalState });
            } else {
                Object.assign(updates, { description, specialty, consultationFee });
            }

            await updateProfile(user.id, updates);
            setSuccess('Profil mis à jour avec succès !');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 pb-12 px-4 max-w-3xl mx-auto">
            <Card>
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Mon Profil ({user.type === 'user' ? 'Patient' : 'Psychologue'})</h1>

                {success && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Nom complet"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <Input
                        label="Numéro de téléphone (Mobile Money)"
                        type="tel"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        placeholder="Ex: +229 97 00 00 00"
                    />

                    {user.type === 'user' ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Âge"
                                    type="number"
                                    value={age}
                                    onChange={e => setAge(e.target.value)}
                                />
                                <Input
                                    label="Profession"
                                    value={profession}
                                    onChange={e => setProfession(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Raison principale de la consultation</label>
                                <textarea
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white/50 min-h-[100px]"
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                    placeholder="Ex: Anxiété, Stress au travail, Difficultés relationnelles..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">État émotionnel (Profil type)</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white/50"
                                    value={emotionalState}
                                    onChange={e => setEmotionalState(e.target.value)}
                                >
                                    <option value="">Sélectionner un état...</option>
                                    <option value="calm">Calme / Serein</option>
                                    <option value="anxious">Anxieux / Stressé</option>
                                    <option value="sad">Triste / Déprimé</option>
                                    <option value="overwhelmed">Débordé / Épuisé</option>
                                    <option value="angry">Irritable / En colère</option>
                                </select>
                            </div>
                        </>
                    ) : (
                        <>
                            <Input
                                label="Spécialité"
                                value={specialty}
                                onChange={e => setSpecialty(e.target.value)}
                                placeholder="Ex: Psychologie Clinique, Pédopsychiatrie..."
                            />
                            <Input
                                label="Montant de la consultation (FCFA)"
                                type="number"
                                value={consultationFee}
                                onChange={e => setConsultationFee(e.target.value)}
                                placeholder="Ex: 5000"
                            />
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Ma présentation (Pour vos patients)</label>
                                <textarea
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white/50 min-h-[150px]"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Décrivez votre approche, votre expérience et ce qui vous rend unique..."
                                />
                                <p className="text-xs text-slate-500 mt-1">Ce texte sera visible par les patients qui consultent votre profil.</p>
                            </div>
                        </>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
