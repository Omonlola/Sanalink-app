# Spécifications Techniques - Backend (Serveur)

Ce document détaille les implémentations techniques côté serveur de l'application Sanalink. Le backend est développé en **Node.js** avec le framework **Express**, et utilise **Prisma ORM** pour interfacer avec une base de données **PostgreSQL**.

---

## 1. Schéma de Base de Données (Prisma)
Prisma agit comme l'unique source de vérité pour la structure des données. Il assure le typage et la sécurisation des requêtes.

**Extrait de modélisation : `server/prisma/schema.prisma`**
```prisma
model User {
  id              String   @id @default(uuid())
  email           String   @unique
  password        String
  name            String
  type            String   // 'user', 'psychologist', 'admin'
  
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

## 2. Architecture API & Sécurité

L'API expose des routes REST. La sécurité est assurée par le hachage des mots de passe côté serveur avec `bcryptjs` avant la persistance en base de données.

### 2.1. Inscription (Register)
Vérification de la duplication, hachage, puis création via Prisma.

**Extrait : `server/index.js`**
```javascript
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, type } = req.body;
        
        // Sécurité : Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Intégration Base de Données
        const newUser = await prisma.user.create({
            data: { email, password: hashedPassword, name, type, status: 'active' }
        });

        // Exclusion du mot de passe de la réponse
        const { password: _, ...userWithoutPass } = newUser;
        res.status(201).json(userWithoutPass);
    } catch (error) {
        console.error('Register Error Details:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});
```

### 2.2. Espace Psychologue : Gestion des Notes
Les données métier, comme les notes saisies par les professionnels, disposent de leurs propres endpoints CRUD.

**Extrait : `server/index.js`**
```javascript
// Création d'une note
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

// Récupération des notes d'un psy
app.get('/api/notes/:psyId', async (req, res) => {
    try {
        const notes = await prisma.note.findMany({
            where: { psyId: req.params.psyId },
            orderBy: { date: 'desc' }
        });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes' });
    }
});
```

---

## 3. Déploiement et Conteneurisation (Render)

Le serveur est conçu pour être déployé sur des plateformes PaaS comme **Render**. 
Il intègre un `Dockerfile` qui assure la compatibilité avec Prisma et ses librairies C++ internes (OpenSSL).

**Aspects techniques du déploiement :**
1.  **Image de base :** Utilisation de `node:18-slim` (Debian) pour garantir la présence des librairies SSL nécessaires à Prisma.
2.  **Synchronisation BDD :** Le script de démarrage (`start`) exécute systématiquement `npx prisma db push` avec la variable `sslmode=require` pour garantir que les tables PostgreSQL sont toujours à jour avant de lancer Express.
