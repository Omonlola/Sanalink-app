const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- In-Memory Database ---
const users = [
    { id: 'user-1', email: 'alice.martin@email.com', password: 'pass123', name: 'Alice Martin', type: 'user', status: 'active', createdAt: '2026-01-10T08:00:00Z', age: 32, profession: 'Enseignante', reason: 'Anxiété', emotionalState: 'Stressée' },
    { id: 'user-2', email: 'bob.dupuis@email.com', password: 'pass123', name: 'Bob Dupuis', type: 'user', status: 'active', createdAt: '2026-01-15T10:30:00Z', age: 28, profession: 'Développeur', reason: 'Dépression légère', emotionalState: 'Fatigué' },
    { id: 'user-3', email: 'claire.lemaire@email.com', password: 'pass123', name: 'Claire Lemaire', type: 'user', status: 'inactive', createdAt: '2026-01-20T14:00:00Z', age: 45, profession: 'Comptable', reason: 'Burnout', emotionalState: 'Épuisée' },
    { id: 'user-4', email: 'david.petit@email.com', password: 'pass123', name: 'David Petit', type: 'user', status: 'active', createdAt: '2026-02-01T09:00:00Z', age: 38, profession: 'Manager', reason: 'Stress professionnel', emotionalState: 'Anxieux' },
    { id: 'user-5', email: 'emma.roux@email.com', password: 'pass123', name: 'Emma Roux', type: 'user', status: 'suspended', createdAt: '2026-02-05T11:00:00Z', age: 25, profession: 'Étudiante', reason: "Troubles de l'humeur", emotionalState: 'Instable' },
    { id: 'user-6', email: 'francois.blanc@email.com', password: 'pass123', name: 'François Blanc', type: 'user', status: 'active', createdAt: '2026-02-10T16:00:00Z', age: 55, profession: 'Directeur', reason: 'Deuil', emotionalState: 'Triste' },
    { id: 'user-7', email: 'grace.simon@email.com', password: 'pass123', name: 'Grace Simon', type: 'user', status: 'active', createdAt: '2026-02-14T08:30:00Z', age: 30, profession: 'Infirmière', reason: 'Traumatisme', emotionalState: 'Vulnerable' },
    { id: 'user-8', email: 'hugo.moreau@email.com', password: 'pass123', name: 'Hugo Moreau', type: 'user', status: 'inactive', createdAt: '2026-02-17T12:00:00Z', age: 22, profession: 'Étudiant', reason: 'Phobies', emotionalState: 'Craintif' },
]; // additional registered users will be pushed here

const appointments = [
    { id: 'apt-1', userId: 'user-1', doctorId: 'psy-1', date: '2026-01-12', time: '09:00', type: 'remote', status: 'completed', link: 'https://meet.google.com/abc', paymentStatus: 'paid', amount: 80 },
    { id: 'apt-2', userId: 'user-2', doctorId: 'psy-2', date: '2026-01-18', time: '11:00', type: 'presentiel', status: 'completed', link: null, paymentStatus: 'paid', amount: 90 },
    { id: 'apt-3', userId: 'user-3', doctorId: 'psy-1', date: '2026-01-22', time: '14:00', type: 'remote', status: 'cancelled', link: 'https://meet.google.com/def', paymentStatus: 'refunded', amount: 80 },
    { id: 'apt-4', userId: 'user-4', doctorId: 'psy-3', date: '2026-02-03', time: '08:00', type: 'remote', status: 'completed', link: 'https://meet.google.com/ghi', paymentStatus: 'paid', amount: 100 },
    { id: 'apt-5', userId: 'user-1', doctorId: 'psy-1', date: '2026-02-10', time: '10:00', type: 'remote', status: 'completed', link: 'https://meet.google.com/jkl', paymentStatus: 'paid', amount: 80 },
    { id: 'apt-6', userId: 'user-6', doctorId: 'psy-2', date: '2026-02-12', time: '16:00', type: 'presentiel', status: 'completed', link: null, paymentStatus: 'paid', amount: 90 },
    { id: 'apt-7', userId: 'user-7', doctorId: 'psy-3', date: '2026-02-15', time: '12:00', type: 'remote', status: 'upcoming', link: 'https://meet.google.com/mno', paymentStatus: 'pending', amount: 100 },
    { id: 'apt-8', userId: 'user-2', doctorId: 'psy-1', date: '2026-02-20', time: '09:00', type: 'remote', status: 'upcoming', link: 'https://meet.google.com/pqr', paymentStatus: 'pending', amount: 80 },
    { id: 'apt-9', userId: 'user-4', doctorId: 'psy-2', date: '2026-02-22', time: '13:00', type: 'presentiel', status: 'upcoming', link: null, paymentStatus: 'pending', amount: 90 },
    { id: 'apt-10', userId: 'user-5', doctorId: 'psy-3', date: '2026-01-30', time: '17:00', type: 'remote', status: 'cancelled', link: 'https://meet.google.com/stu', paymentStatus: 'refunded', amount: 100 },
];

const evaluations = [];
const journals = []; // { id, userId, content, date, mood }

const communications = [
    { id: 'com-1', from: 'admin', to: 'all', subject: 'Bienvenue sur Sanalink', message: 'Merci de faire confiance à notre plateforme.', sentAt: '2026-01-05T10:00:00Z', type: 'notification' },
    { id: 'com-2', from: 'admin', to: 'psychologists', subject: 'Mise à jour des disponibilités', message: 'Merci de mettre à jour vos créneaux pour le mois de février.', sentAt: '2026-01-28T09:00:00Z', type: 'email' },
];

// Mock Psychologists
const psychologists = [
    {
        id: 'psy-1',
        name: 'Dr. Jean Dupont',
        specialty: 'Psychologie Clinique',
        description: "Expert en gestion du stress et anxiété. 15 ans d'expérience.",
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200',
        availableSlots: ['09:00', '10:00', '14:00', '15:00'],
        email: 'jean.dupont@sanalink.com',
        status: 'validated',
        rating: 4.8,
        consultationsCount: 0,
        createdAt: '2025-12-01T10:00:00Z'
    },
    {
        id: 'psy-2',
        name: 'Mme. Sarah Cohen',
        specialty: 'Thérapie de couple',
        description: 'Accompagnement bienveillant pour les couples et les familles.',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
        availableSlots: ['11:00', '13:00', '16:00'],
        email: 'sarah.cohen@sanalink.com',
        status: 'validated',
        rating: 4.6,
        consultationsCount: 0,
        createdAt: '2025-12-05T10:00:00Z'
    },
    {
        id: 'psy-3',
        name: 'Dr. Marc Levy',
        specialty: 'Pédopsychiatrie',
        description: "Spécialisé dans les troubles de l'attention chez l'enfant.",
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
        availableSlots: ['08:00', '12:00', '17:00'],
        email: 'marc.levy@sanalink.com',
        status: 'pending',
        rating: 4.9,
        consultationsCount: 0,
        createdAt: '2026-01-15T10:00:00Z'
    },
    {
        id: 'psy-4',
        name: 'Dr. Amina Touré',
        specialty: 'TCC (Thérapie Cognitivo-Comportementale)',
        description: 'Spécialisée dans les phobies et troubles obsessionnels compulsifs.',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200',
        availableSlots: ['10:00', '14:00', '15:00'],
        email: 'amina.toure@sanalink.com',
        status: 'suspended',
        rating: 4.3,
        consultationsCount: 0,
        createdAt: '2026-02-01T10:00:00Z'
    }
];

// Admin account
const adminAccount = {
    id: 'admin-1',
    email: 'admin@sanalink.com',
    password: 'admin123',
    name: 'Admin Sanalink',
    type: 'admin'
};

// Helper to find user
const findUser = (email) => users.find(u => u.email === email) || psychologists.find(p => p.email === email);

// Helper to compute psych stats
const getPsychStats = (psychId) => {
    const apts = appointments.filter(a => a.doctorId === psychId);
    const completed = apts.filter(a => a.status === 'completed');
    const revenue = completed.reduce((sum, a) => sum + (a.amount || 0), 0);
    return { totalConsultations: apts.length, completedConsultations: completed.length, revenue };
};

// --- Auth Routes ---
app.post('/api/auth/register', (req, res) => {
    const { email, password, name, type } = req.body;
    if (findUser(email) || adminAccount.email === email) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = { id: Date.now().toString(), email, password, name, type, status: 'active', createdAt: new Date().toISOString() };
    users.push(newUser);
    const { password: _, ...userWithoutPass } = newUser;
    res.status(201).json(userWithoutPass);
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Check admin
    if (email === adminAccount.email && password === adminAccount.password) {
        const { password: _, ...adminWithoutPass } = adminAccount;
        return res.json(adminWithoutPass);
    }

    // Check normal users
    let user = users.find(u => u.email === email && u.password === password);

    if (!user) {
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

    let userIndex = users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        const { password: _, ...userWithoutPass } = users[userIndex];
        return res.json(userWithoutPass);
    }

    res.json({ ...updates, id });
});

// --- Data Routes ---

app.get('/api/psychologists', (req, res) => {
    const registeredPsychs = users
        .filter(u => u.type === 'psychologist')
        .map(u => ({
            id: u.id,
            name: u.name,
            specialty: 'Psychologue inscrit',
            description: 'Professionnel de santé inscrit sur la plateforme.',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
            availableSlots: ['09:00', '11:00', '14:00', '16:00'],
            email: u.email,
            status: u.status || 'pending'
        }));

    res.json([...psychologists, ...registeredPsychs]);
});

app.post('/api/appointments', (req, res) => {
    const { userId, doctorId, date, time, type } = req.body;

    let link = null;
    if (type === 'remote') {
        link = `https://meet.google.com/new-meeting`;
    }

    const newAppointment = {
        id: Date.now().toString(),
        userId,
        doctorId,
        date,
        time,
        type,
        status: 'upcoming',
        paymentStatus: 'pending',
        amount: 80,
        link: link || 'Adresse du cabinet'
    };

    appointments.push(newAppointment);
    res.status(201).json(newAppointment);
});

app.get('/api/appointments/:userId', (req, res) => {
    const { userId } = req.params;
    const userAppointments = appointments.filter(a => a.userId === userId || a.doctorId === userId);

    const hydrated = userAppointments.map(a => {
        const doctor = psychologists.find(p => p.id === a.doctorId) || users.find(u => u.id === a.doctorId);
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
    const userEvals = evaluations.filter(e => e.userId === userId);
    res.json(userEvals);
});

// --- Journal Routes ---

app.get('/api/journals/:userId', (req, res) => {
    const { userId } = req.params;
    const userJournals = journals.filter(j => j.userId === userId).sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(userJournals);
});

app.post('/api/journals', (req, res) => {
    const { userId, content, mood } = req.body;
    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }
    const newEntry = {
        id: Date.now().toString(),
        userId,
        content,
        mood,
        date: new Date().toISOString()
    };
    journals.push(newEntry);
    res.status(201).json(newEntry);
});

app.delete('/api/journals/:id', (req, res) => {
    const { id } = req.params;
    const index = journals.findIndex(j => j.id === id);
    if (index !== -1) {
        journals.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Entry not found' });
    }
});

// ================================================
// --- ADMIN / CRM ROUTES ---
// ================================================

// GET /api/admin/stats — Global KPIs
app.get('/api/admin/stats', (req, res) => {
    const totalUsers = users.filter(u => u.type === 'user').length;
    const totalPsychs = psychologists.length + users.filter(u => u.type === 'psychologist').length;
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(a => a.status === 'completed').length;
    const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;
    const upcomingAppointments = appointments.filter(a => a.status === 'upcoming').length;
    const totalRevenue = appointments.filter(a => a.paymentStatus === 'paid').reduce((sum, a) => sum + (a.amount || 0), 0);
    const totalRefunds = appointments.filter(a => a.paymentStatus === 'refunded').reduce((sum, a) => sum + (a.amount || 0), 0);

    // New users last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersLast30 = users.filter(u => new Date(u.createdAt) > thirtyDaysAgo).length;

    // Weekly consultations (last 4 weeks)
    const weeklyData = [];
    for (let i = 3; i >= 0; i--) {
        const start = new Date();
        start.setDate(start.getDate() - (i + 1) * 7);
        const end = new Date();
        end.setDate(end.getDate() - i * 7);
        const count = appointments.filter(a => {
            const d = new Date(a.date);
            return d >= start && d < end && a.status === 'completed';
        }).length;
        weeklyData.push({ week: `S-${i}`, count });
    }

    // Conversion rate (users with at least 1 appointment / total users)
    const usersWithAppointments = new Set(appointments.map(a => a.userId)).size;
    const conversionRate = totalUsers > 0 ? Math.round((usersWithAppointments / totalUsers) * 100) : 0;

    res.json({
        totalUsers,
        totalPsychs,
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        upcomingAppointments,
        totalRevenue,
        totalRefunds,
        netRevenue: totalRevenue - totalRefunds,
        commissions: Math.round((totalRevenue - totalRefunds) * 0.15),
        newUsersLast30,
        conversionRate,
        weeklyConsultations: weeklyData
    });
});

// GET /api/admin/users — All patients
app.get('/api/admin/users', (req, res) => {
    const patients = users
        .filter(u => u.type === 'user')
        .map(u => {
            const userApts = appointments.filter(a => a.userId === u.id);
            const { password: _, ...safe } = u;
            return {
                ...safe,
                consultationsCount: userApts.length,
                lastConsultation: userApts.length > 0 ? userApts[userApts.length - 1].date : null
            };
        });
    res.json(patients);
});

// GET /api/admin/psychologists — All psychologists with stats
app.get('/api/admin/psychologists', (req, res) => {
    const allPsychs = [
        ...psychologists,
        ...users.filter(u => u.type === 'psychologist').map(u => ({
            id: u.id,
            name: u.name,
            specialty: 'Non spécifié',
            email: u.email,
            status: u.status || 'pending',
            rating: null,
            createdAt: u.createdAt
        }))
    ].map(p => {
        const stats = getPsychStats(p.id);
        return { ...p, ...stats };
    });

    res.json(allPsychs);
});

// GET /api/admin/appointments — All consultations
app.get('/api/admin/appointments', (req, res) => {
    const hydrated = appointments.map(a => {
        const doctor = psychologists.find(p => p.id === a.doctorId) || users.find(u => u.id === a.doctorId);
        const user = users.find(u => u.id === a.userId);
        return {
            ...a,
            doctorName: doctor ? doctor.name : 'Inconnu',
            userName: user ? user.name : 'Inconnu',
            doctorSpecialty: doctor ? doctor.specialty : ''
        };
    });
    res.json(hydrated.sort((a, b) => new Date(b.date) - new Date(a.date)));
});

// GET /api/admin/payments — Financial data
app.get('/api/admin/payments', (req, res) => {
    const payments = appointments.map(a => {
        const doctor = psychologists.find(p => p.id === a.doctorId) || users.find(u => u.id === a.doctorId);
        const patient = users.find(u => u.id === a.userId);
        return {
            id: a.id,
            date: a.date,
            amount: a.amount || 0,
            paymentStatus: a.paymentStatus,
            doctorName: doctor ? doctor.name : 'Inconnu',
            patientName: patient ? patient.name : 'Inconnu',
            commission: Math.round((a.amount || 0) * 0.15),
            type: a.type
        };
    });

    const total = payments.filter(p => p.paymentStatus === 'paid').reduce((s, p) => s + p.amount, 0);
    const refunds = payments.filter(p => p.paymentStatus === 'refunded').reduce((s, p) => s + p.amount, 0);
    const commissions = payments.filter(p => p.paymentStatus === 'paid').reduce((s, p) => s + p.commission, 0);

    res.json({
        transactions: payments.sort((a, b) => new Date(b.date) - new Date(a.date)),
        summary: { total, refunds, net: total - refunds, commissions }
    });
});

// POST /api/admin/notify — Send notification (simulated)
app.post('/api/admin/notify', (req, res) => {
    const { to, subject, message, type } = req.body;
    const newCom = {
        id: Date.now().toString(),
        from: 'admin',
        to,
        subject,
        message,
        type: type || 'notification',
        sentAt: new Date().toISOString()
    };
    communications.push(newCom);
    res.status(201).json({ success: true, communication: newCom });
});

// GET /api/admin/communications — Get history
app.get('/api/admin/communications', (req, res) => {
    res.json(communications.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt)));
});

// PUT /api/admin/users/:id/status — Update patient status
app.put('/api/admin/users/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });
    users[userIndex].status = status;
    const { password: _, ...safe } = users[userIndex];
    res.json(safe);
});

// PUT /api/admin/psychologists/:id/status — Update psychologist status
app.put('/api/admin/psychologists/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const psychIndex = psychologists.findIndex(p => p.id === id);
    if (psychIndex !== -1) {
        psychologists[psychIndex].status = status;
        return res.json(psychologists[psychIndex]);
    }
    const userIndex = users.findIndex(u => u.id === id && u.type === 'psychologist');
    if (userIndex !== -1) {
        users[userIndex].status = status;
        const { password: _, ...safe } = users[userIndex];
        return res.json(safe);
    }
    res.status(404).json({ message: 'Psychologist not found' });
});

app.listen(port, () => {
    console.log(`Sanalink Server running on port ${port}`);
    console.log(`Admin account: admin@sanalink.com / admin123`);
});
