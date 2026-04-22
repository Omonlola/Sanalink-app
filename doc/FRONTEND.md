# Spécifications Techniques - Frontend (PWA)

Ce document détaille les implémentations techniques côté client de l'application Sanalink. Le frontend est développé avec **React**, bundlé avec **Vite**, et configuré comme une **Progressive Web App (PWA)**.

---

## 1. Configuration PWA & Offline
L'application est installable sur n'importe quel appareil mobile ou desktop. Le plugin `vite-plugin-pwa` génère le manifeste et enregistre le Service Worker.

**Extrait du fichier `vite.config.js` :**
```javascript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'SanaLink',
                theme_color: '#6C63FF',
                display: 'standalone',
                // Configuration des icônes pour iOS, Android et Desktop
            }
        })
    ]
})
```

---

## 2. Gestion de l'Authentification (AuthContext)
Le statut de l'utilisateur est géré globalement via l'API Context de React. Cela permet d'isoler les requêtes API (via une instance Axios configurée) et de gérer les tokens ou l'état local persisté.

**Extrait : `client/src/context/AuthContext.jsx`**
```javascript
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:3000/api'
});

const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data);
    localStorage.setItem('sanalink_user', JSON.stringify(res.data));
    return res.data;
};
```

---

## 3. Interfaces et Fonctionnalités Clés

### 3.1. Routage Protégé basé sur les Rôles
Les utilisateurs (`user`), les psychologues (`psychologist`) et les administrateurs (`admin`) accèdent à des interfaces différentes sécurisées par le composant racine.

**Extrait : `client/src/App.jsx`**
```javascript
<Routes>
    {/* Espace Patient */}
    {user && user.type === 'user' && (
        <>
            <Route path="/journal" element={<Journal />} />
            <Route path="/relaxation" element={<Relaxation />} />
        </>
    )}
    {/* Espace Psychologue */}
    {user && user.type === 'psychologist' && (
        <Route path="/notes" element={<Notes />} />
    )}
</Routes>
```

### 3.2. Consultation Vidéo (In-Platform)
Le frontend intègre nativement une salle de consultation vidéo via l'API WebRTC / `getUserMedia` du navigateur, permettant des sessions fluides sans outils externes.

**Extrait : `client/src/pages/ConsultationRoom.jsx`**
```javascript
const startVideo = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    } catch (err) {
        console.error("Erreur d'accès à la caméra", err);
    }
};
```

### 3.3. Dashboard Administrateur (PMF Tracker)
Un outil métier a été développé en React pour l'administration : le traceur de "Product-Market Fit" (PMF), qui analyse les cohortes d'engagement.

**Extrait : `client/src/components/admin/PMFTracker.jsx`**
```javascript
// Affichage conditionnel des métriques d'engagement (Cohortes)
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-gray-500 text-sm font-medium">Utilisateurs confirmés</h3>
        <p className="text-3xl font-bold text-[#2B3674]">{metrics.confirmedUsers}</p>
    </div>
</div>
```

---

## 4. Déploiement Frontend
Le code source est déployé sur **Vercel**. Lors du build, la variable d'environnement `VITE_API_URL` est injectée dynamiquement pour relier l'interface au backend de production hébergé sur Render.
