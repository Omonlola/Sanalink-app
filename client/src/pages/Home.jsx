import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { HeartPulse, Phone, ShieldCheck, Clock } from 'lucide-react';

export function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-200 via-slate-50 to-slate-50 opacity-70"></div>
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                        </span>
                        <span className="text-sm font-medium">La santé mentale accessible à tous</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-700 to-brand-500">
                            Votre santé.
                        </span> <br />
                        Votre accès. <br />
                        <span className="text-slate-800">Votre rythme.</span>
                    </h1>

                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                        SANALINK révolutionne l'accès aux soins psychologiques au Bénin. Consultez des experts certifiés, où que vous soyez.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register">
                            <Button size="lg" className="h-12 px-8 text-lg">Commencer maintenant</Button>
                        </Link>

                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4 bg-white/50">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Phone className="w-8 h-8 text-brand-500" />}
                        title="Téléconsultation"
                        desc="Consultez en vidéo ou audio via Google Meet. Simple, sécurisé et confidentiel."
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="w-8 h-8 text-brand-500" />}
                        title="Experts Certifiés"
                        desc="Accédez à un réseau de psychologues et professionnels de santé vérifiés."
                    />
                    <FeatureCard
                        icon={<Clock className="w-8 h-8 text-brand-500" />}
                        title="Disponibilité"
                        desc="Prenez rendez-vous selon votre emploi du temps, en présentiel ou en remote."
                    />
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="mb-4 bg-brand-50 w-16 h-16 rounded-2xl flex items-center justify-center">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600">{desc}</p>
        </div>
    );
}
