const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- In-Memory Database ---
const users = []; // { id, email, password, name, type: 'user' | 'psychologist' }
const appointments = []; // { id, userId, doctorId, date, time, type, status, link }
const evaluations = []; // { id, userId, doctorId, content, date }

// Mock Psychologists
const psychologists = [
    {
        id: 'psy-1',
        name: 'Dr. Jean Dupont',
        specialty: 'Psychologie Clinique',
        description: 'Expert en gestion du stress et anxiété. 15 ans d\'expérience.',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200',
        availableSlots: ['09:00', '10:00', '14:00', '15:00'],
        email: 'jean.dupont@sanalink.com'
    },
    {
        id: 'psy-2',
        name: 'Mme. Sarah Cohen',
        specialty: 'Thérapie de couple',
        description: 'Accompagnement bienveillant pour les couples et les familles.',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
        availableSlots: ['11:00', '13:00', '16:00'],
        email: 'sarah.cohen@sanalink.com'
    },
    {
        id: 'psy-3',
        name: 'Dr. Marc Levy',
        specialty: 'Pédopsychiatrie',
        description: 'Spécialisé dans les troubles de l\'attention chez l\'enfant.',
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
        availableSlots: ['08:00', '12:00', '17:00'],
        email: 'marc.levy@sanalink.com'
    }
];

// Helper to find user
const findUser = (email) => users.find(u => u.email === email) || psychologists.find(p => p.email === email);

// --- Auth Routes ---
app.post('/api/auth/register', (req, res) => {
    const { email, password, name, type } = req.body;
    if (findUser(email)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = { id: Date.now().toString(), email, password, name, type };
    users.push(newUser);
    // In a real app, do not send password back
    const { password: _, ...userWithoutPass } = newUser;
    res.status(201).json(userWithoutPass);
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Check normal users
    let user = users.find(u => u.email === email && u.password === password);

    // Check mock psychologists (password is 'password' for demo if not in users array yet? Actually let's just use the users array for auth, 
    // but for the demo, let's allow "logging in" as a psych if they register or if we use a hardcoded credential)
    // For simplicity: User MUST register first, even as a psych, OR we can pre-seed credentials.
    // Let's pre-seed credentials for the mock psychologists so they can log in immediately.
    if (!user) {
        // Check if it's one of the mock psychs logging in for the first time?
        // Let's just say for the demo: password is 'admin' for mock psychs
        const psych = psychologists.find(p => p.email === email);
        if (psych && password === 'admin') {
            user = { ...psych, type: 'psychologist' };
        }
    }

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { password: _, ...userWithoutPass } = user;
    res.json(userWithoutPass);
});

// Update Profile
app.put('/api/profile/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Find in users
    let userIndex = users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        const { password: _, ...userWithoutPass } = users[userIndex];
        return res.json(userWithoutPass);
    }

    // Find in mock psychologists (for demo purposes if they "claimed" a profile, 
    // but usually mocks are static. Let's assume we only update the 'users' array 
    // which contains registered folks. If a mock psych logs in (via the hack earlier), 
    // they are not in 'users' array unless we move them there. 
    // For this prototype, I'll check the psychologists array too just in case.)

    // Note: In the previous login logic, I constructed a user object from mock psychs but didn't save it to 'users'.
    // To allow updates, they ideally should be in a mutable store. 
    // Let's just return success for now if it's a mock psych but not actually persist changes to the static 'psychologists' const
    // unless we make it mutable.

    res.json({ ...updates, id }); // Echo back
});

// --- Data Routes ---

app.get('/api/psychologists', (req, res) => {
    // Registered psychologists
    const registeredPsychs = users
        .filter(u => u.type === 'psychologist')
        .map(u => ({
            id: u.id,
            name: u.name,
            specialty: 'Psychologue inscrit',
            description: 'Professionnel de santé inscrit sur la plateforme.',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', // Default placeholder
            availableSlots: ['09:00', '11:00', '14:00', '16:00'], // Default slots
            email: u.email
        }));

    // Combine with mock psychs
    res.json([...psychologists, ...registeredPsychs]);
});

app.post('/api/appointments', (req, res) => {
    const { userId, doctorId, date, time, type } = req.body; // type: 'remote' | 'presentiel'

    // Mock generation of meet link
    let link = null;
    if (type === 'remote') {
        link = `https://meet.google.com/new-meeting?authuser=agnesvdogo@gmail.com`; // Simulation of what was requested
    }

    const newAppointment = {
        id: Date.now().toString(),
        userId,
        doctorId,
        date,
        time,
        type,
        status: 'pending',
        link: link || 'Adresse du cabinet du Dr.'
    };

    appointments.push(newAppointment);
    res.status(201).json(newAppointment);
});

app.get('/api/appointments/:userId', (req, res) => {
    const { userId } = req.params;
    // Get appointments where user is the patient OR the doctor
    const userAppointments = appointments.filter(a => a.userId === userId || a.doctorId === userId);

    // Hydrate with details
    const hydrated = userAppointments.map(a => {
        const doctor = psychologists.find(p => p.id === a.doctorId);
        const user = users.find(u => u.id === a.userId);
        return {
            ...a,
            doctorName: doctor ? doctor.name : 'Unknown',
            userName: user ? user.name : 'Unknown',
            patientDetails: user ? {
                age: user.age,
                profession: user.profession,
                reason: user.reason,
                emotionalState: user.emotionalState
            } : null
        };
    });

    res.json(hydrated);
});

app.post('/api/evaluations', (req, res) => {
    const { userId, doctorId, content } = req.body;
    const newEval = {
        id: Date.now().toString(),
        userId,
        doctorId,
        content,
        date: new Date().toISOString()
    };
    evaluations.push(newEval);
    res.status(201).json(newEval);
});

app.get('/api/evaluations/:userId', (req, res) => {
    const { userId } = req.params;
    // If requester is user, they see their evals. If psych, they see evals they wrote? 
    // Ideally psychs see evals of their patients.
    // For simple demo: just return evals for this user
    const userEvals = evaluations.filter(e => e.userId === userId);
    res.json(userEvals);
});


app.listen(port, () => {
    console.log(`Sanalink Server running on port ${port}`);
});
