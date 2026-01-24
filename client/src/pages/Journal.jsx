import { useState } from 'react';

export function Journal() {
    const [entry, setEntry] = useState('');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        localStorage.setItem('journal_entry', entry);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    useState(() => {
        const savedEntry = localStorage.getItem('journal_entry') || '';
        setEntry(savedEntry);
    }, []);

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4 text-brand-900">Mon Journal Intime</h1>
            <textarea
                className="w-full h-64 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 mb-4"
                value={entry}
                onChange={e => setEntry(e.target.value)}
                placeholder="Écris ici tes pensées, tes ressentis, ta journée..."
            />
            <button
                className="bg-brand-600 text-white px-6 py-2 rounded hover:bg-brand-700 transition"
                onClick={handleSave}
            >
                Sauvegarder
            </button>
            {saved && <p className="text-green-600 mt-2">Entrée sauvegardée !</p>}
        </div>
    );
}
