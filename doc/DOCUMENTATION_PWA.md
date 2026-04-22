# Documentation Officielle - Sanalink (PWA)

## 1. Vue d'ensemble du Projet
Sanalink est une application Web Progressive (PWA) dédiée au bien-être mental. Elle met en relation des patients avec des psychologues qualifiés, tout en offrant des outils personnels comme un journal interactif ("Le Meilleur Ami") et un espace de relaxation. 

L'architecture est scindée en deux parties :
*   **Frontend (Client)** : Application React propulsée par Vite.js avec support PWA natif.
*   **Backend (Serveur)** : API RESTful en Node.js/Express, interagissant avec une base de données PostgreSQL via l'ORM Prisma.

---

## 2. Configuration PWA (Progressive Web App)

Le frontend est configuré pour être installable (PWA) et fonctionner avec une mise en cache avancée via les Service Workers.

**Extrait : `client/vite.config.js`**
```javascript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
            manifest: {
                name: 'SanaLink - Mental Wellness',
                short_name: 'SanaLink',
                theme_color: '#6C63FF',
                background_color: '#ffffff',
                display: 'standalone',
                icons: [
                    { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
                    { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
                ]
            }
        })
    ],
})
```

---

## 3. Architecture des Données (Backend Prisma)

Le backend utilise Prisma pour définir un schéma de données robuste prenant en charge les trois rôles principaux : `user` (Patient), `psychologist` (Psy), et `admin` (Administrateur).

**Extrait : `server/prisma/schema.prisma`**
```prisma
model User {
  id              String   @id @default(uuid())
  email           String   @unique
  password        String
  name            String
  type            String   // 'user', 'psychologist', 'admin'
  status          String   @default("active")
  
  // Relations
  patientAppointments Appointment[] @relation("PatientAppointments")
  doctorAppointments  Appointment[] @relation("DoctorAppointments")
  journals            Journal[]
  psyNotes            Note[]
}

model Appointment {
  id            String   @id @default(uuid())
  userId        String
  doctorId      String
  date          String
  status        String   @default("upcoming")
  user          User     @relation("PatientAppointments", fields: [userId], references: [id])
  doctor        User     @relation("DoctorAppointments", fields: [doctorId], references: [id])
}
```

---

## 4. Fonctionnalités Implémentées

### 4.1. Authentification & Sécurité
Le système gère l'inscription, la connexion et le hachage sécurisé des mots de passe. Le frontend maintient l'état global via un `AuthContext`.

**Extrait Backend : `server/index.js` (Endpoint Register)**
```javascript
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, type } = req.body;
        
        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Sauvegarde via Prisma
        const newUser = await prisma.user.create({
            data: { email, password: hashedPassword, name, type, status: 'active' }
        });

        const { password: _, ...userWithoutPass } = newUser;
        res.status(201).json(userWithoutPass);
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration' });
    }
});
```

### 4.2. Espace Patient (User)
Les fonctionnalités réservées aux patients incluent :
*   **Le Meilleur Ami (Journal)** : Un espace où l'utilisateur saisit son humeur du jour et son journal.
*   **Espace Relaxation** : Intègre des composants visuels comme un exercice de respiration guidée (BreathingExercise).
*   **Annuaire des Psychologues** : Liste dynamique des professionnels avec prise de rendez-vous.

**Extrait Frontend : Routage protégé (App.jsx)**
```javascript
{/* Seul un utilisateur de type 'user' peut accéder à l'espace Relaxation */}
{user && user.type === 'user' && (
    <Route path="/relaxation" element={<Relaxation />} />
)}
```

### 4.3. Espace Psychologue (Psychologist)
L'espace psychologue est centré sur la gestion des patients :
*   **Tableau de bord des rendez-vous** : Affichage des consultations à venir.
*   **Salle de Consultation Vidéo** : Intégration `getUserMedia` pour les appels vidéo intégrés à la plateforme.
*   **Prise de Notes Sécurisée** : Les psychologues peuvent rédiger des notes post-consultation liées à un patient.

**Extrait Backend : `server/index.js` (Endpoint Notes)**
```javascript
app.post('/api/notes', async (req, res) => {
    try {
        const { psyId, patientName, content } = req.body;
        const newNote = await prisma.note.create({
            data: { psyId, patientName, content }
        });
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: 'Error creating note' });
    }
});
```

### 4.4. Panneau Administrateur (Admin)
L'administrateur dispose d'une vue d'ensemble de la plateforme.
*   **Suivi PMF (Product-Market Fit)** : Tableau de bord qui piste l'acquisition et la rétention des utilisateurs pour valider le modèle économique de Sanalink.
*   **Gestion des utilisateurs** : Vue sur les psychologues et patients inscrits.

---

## 5. Déploiement
*   **Frontend** : Déployé sur **Vercel** en tant que Single Page Application (SPA) avec configuration de la PWA.
*   **Backend** : Déployé sur **Render** (Node.js).
*   **Base de données** : Instance PostgreSQL gérée sur **Render**, liée de manière sécurisée via SSL (`sslmode=require`) au backend.
