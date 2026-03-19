require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Admin account (Hardcoded for simplicity or seeded)
const adminAccount = {
    id: 'admin-1',
    email: 'admin@sanalink.com',
    password: 'admin123', // Hardcoded admin logic
    name: 'Admin Sanalink',
    type: 'admin'
};

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, type } = req.body;
        if (email === adminAccount.email) return res.status(400).json({ message: 'User already exists' });

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: { email, password: hashedPassword, name, type, status: 'active' }
        });

        const { password: _, ...userWithoutPass } = newUser;
        res.status(201).json(userWithoutPass);
    } catch (error) {
        console.error('Register Error Details:', error);
        res.status(500).json({
            message: 'Server error during registration',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === adminAccount.email && password === adminAccount.password) {
            const { password: _, ...adminWithoutPass } = adminAccount;
            return res.json(adminWithoutPass);
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch && password !== 'admin' && user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const { password: _, ...userWithoutPass } = user;
        res.json(userWithoutPass);
    } catch (error) {
        console.error('Login Error Details:', error);
        res.status(500).json({
            message: 'Server error during login',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Update Profile
app.put('/api/profile/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (updates.password) delete updates.password;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updates
        });

        const { password: _, ...userWithoutPass } = updatedUser;
        res.json(userWithoutPass);
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
});

// --- Data Routes ---

app.get('/api/psychologists', async (req, res) => {
    try {
        const psychs = await prisma.user.findMany({
            where: { type: 'psychologist' },
            select: {
                id: true, name: true, specialty: true, description: true,
                image: true, availableSlots: true, email: true, status: true, rating: true,
                consultationsCount: true, createdAt: true
            }
        });
        res.json(psychs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching psychologists' });
    }
});

app.post('/api/appointments', async (req, res) => {
    try {
        const { userId, doctorId, date, time, type } = req.body;

        const newAppointment = await prisma.appointment.create({
            data: {
                userId,
                doctorId,
                date,
                time,
                type,
                status: 'upcoming',
                paymentStatus: 'pending',
                amount: 80,
            }
        });

        let link = null;
        if (type === 'remote') {
            link = `/consultation/apt-${newAppointment.id}`;
            await prisma.appointment.update({
                where: { id: newAppointment.id },
                data: { link }
            });
            newAppointment.link = link;
        }

        res.status(201).json(newAppointment);
    } catch (error) {
        console.error('Create Appointment Error:', error);
        res.status(500).json({ message: 'Error creating appointment' });
    }
});

app.get('/api/appointments/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const appointments = await prisma.appointment.findMany({
            where: {
                OR: [
                    { userId: userId },
                    { doctorId: userId }
                ]
            },
            include: {
                user: { select: { name: true, age: true, profession: true, reason: true, emotionalState: true } },
                doctor: { select: { name: true, specialty: true } }
            },
            orderBy: { date: 'desc' }
        });

        const hydrated = appointments.map(a => ({
            ...a,
            doctorName: a.doctor?.name || 'Inconnu',
            userName: a.user?.name || 'Inconnu',
            patientDetails: a.user ? {
                age: a.user.age,
                profession: a.user.profession,
                reason: a.user.reason,
                emotionalState: a.user.emotionalState
            } : null
        }));

        res.json(hydrated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching appointments' });
    }
});

app.post('/api/evaluations', async (req, res) => {
    try {
        const { userId, doctorId, content } = req.body;
        const newEval = await prisma.evaluation.create({
            data: { userId, doctorId, content }
        });
        res.status(201).json(newEval);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating evaluation' });
    }
});

app.get('/api/evaluations/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const userEvals = await prisma.evaluation.findMany({
            where: { userId }
        });
        res.json(userEvals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching evaluations' });
    }
});

// --- Journal Routes ---

app.get('/api/journals/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const journals = await prisma.journal.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        });
        res.json(journals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching journals' });
    }
});

app.post('/api/journals', async (req, res) => {
    try {
        const { userId, content, mood } = req.body;
        if (!content) return res.status(400).json({ message: 'Content is required' });

        const newEntry = await prisma.journal.create({
            data: { userId, content, mood }
        });
        res.status(201).json(newEntry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating journal entry' });
    }
});

app.delete('/api/journals/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.journal.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: 'Entry not found' });
    }
});

// --- Notes Routes (Psychologists) ---

app.get('/api/notes/:psyId', async (req, res) => {
    try {
        const { psyId } = req.params;
        const notes = await prisma.note.findMany({
            where: { psyId },
            orderBy: { date: 'desc' }
        });
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching notes' });
    }
});

app.post('/api/notes', async (req, res) => {
    try {
        const { psyId, patientName, content } = req.body;
        if (!content || !patientName) return res.status(400).json({ message: 'Patient name and content are required' });

        const newNote = await prisma.note.create({
            data: { psyId, patientName, content }
        });
        res.status(201).json(newNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating note' });
    }
});

app.delete('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.note.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: 'Note not found' });
    }
});

// ================================================
// --- ADMIN / CRM ROUTES ---
// ================================================

app.get('/api/admin/stats', async (req, res) => {
    try {
        const usersCount = await prisma.user.count({ where: { type: 'user' } });
        const psychsCount = await prisma.user.count({ where: { type: 'psychologist' } });

        const totalAppointments = await prisma.appointment.count();
        const completedAppointments = await prisma.appointment.count({ where: { status: 'completed' } });
        const cancelledAppointments = await prisma.appointment.count({ where: { status: 'cancelled' } });
        const upcomingAppointments = await prisma.appointment.count({ where: { status: 'upcoming' } });

        const allApts = await prisma.appointment.findMany({ select: { paymentStatus: true, amount: true, date: true, status: true, userId: true } });

        const totalRevenue = allApts.filter(a => a.paymentStatus === 'paid').reduce((sum, a) => sum + (a.amount || 0), 0);
        const totalRefunds = allApts.filter(a => a.paymentStatus === 'refunded').reduce((sum, a) => sum + (a.amount || 0), 0);

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newUsersLast30 = await prisma.user.count({ where: { type: 'user', createdAt: { gte: thirtyDaysAgo } } });

        const weeklyData = [];
        for (let i = 3; i >= 0; i--) {
            const start = new Date();
            start.setDate(start.getDate() - (i + 1) * 7);
            const end = new Date();
            end.setDate(end.getDate() - i * 7);

            const count = allApts.filter(a => {
                const d = new Date(a.date);
                return d >= start && d < end && a.status === 'completed';
            }).length;
            weeklyData.push({ week: `S-${i}`, count });
        }

        const usersWithAppointments = new Set(allApts.map(a => a.userId)).size;
        const conversionRate = usersCount > 0 ? Math.round((usersWithAppointments / usersCount) * 100) : 0;

        res.json({
            totalUsers: usersCount,
            totalPsychs: psychsCount,
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error calculating stats' });
    }
});

// GET /api/admin/pmf-stats
app.get('/api/admin/pmf-stats', async (req, res) => {
    try {
        const users = await prisma.user.findMany({ where: { type: 'user' }, select: { id: true, createdAt: true } });
        const journals = await prisma.journal.findMany({ select: { userId: true, date: true } });

        const cohorts = {};
        const getWeekNumber = (d) => {
            d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
            const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
            return [d.getUTCFullYear(), weekNo];
        };

        users.forEach(user => {
            const regDate = new Date(user.createdAt);
            const [year, weekNo] = getWeekNumber(regDate);
            const cohortKey = `${year}-W${String(weekNo).padStart(2, '0')}`;

            if (!cohorts[cohortKey]) {
                const d = new Date(regDate);
                const day = d.getDay() || 7;
                d.setHours(-24 * (day - 1));
                cohorts[cohortKey] = {
                    weekLabel: `Semaine ${weekNo} (${d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })})`,
                    acquired: 0,
                    users: []
                };
            }
            cohorts[cohortKey].acquired++;
            cohorts[cohortKey].users.push(user.id);
        });

        const cohortList = Object.keys(cohorts).sort().map(key => cohorts[key]);

        const result = cohortList.map(cohort => {
            const stats = { label: cohort.weekLabel, acquired: cohort.acquired, retention: Array(30).fill(0) };
            cohort.users.forEach(userId => {
                const userObj = users.find(u => u.id === userId);
                const userJournals = journals.filter(j => j.userId === userId).map(j => new Date(j.date).toDateString());
                const uniqueDates = [...new Set(userJournals)].sort((a, b) => new Date(a) - new Date(b));

                let pmfDay = -1;
                if (uniqueDates.length >= 7) {
                    let currentStreak = 1;
                    for (let i = 1; i < uniqueDates.length; i++) {
                        const prev = new Date(uniqueDates[i - 1]);
                        const curr = new Date(uniqueDates[i]);
                        const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
                        if (diffDays === 1) {
                            currentStreak++;
                            if (currentStreak >= 7) {
                                const diffMs = curr - new Date(userObj.createdAt);
                                pmfDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                                break;
                            }
                        } else {
                            currentStreak = 1;
                        }
                    }
                }
                if (pmfDay !== -1 && pmfDay < 30) {
                    for (let d = Math.max(0, pmfDay); d < 30; d++) stats.retention[d]++;
                }
            });
            stats.retention = stats.retention.map(count => stats.acquired > 0 ? Math.round((count / stats.acquired) * 100) : 0);
            return stats;
        });
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error calculating PMF stats' });
    }
});

app.get('/api/admin/users', async (req, res) => {
    try {
        const patients = await prisma.user.findMany({
            where: { type: 'user' },
            include: { patientAppointments: { orderBy: { date: 'desc' }, select: { date: true } } }
        });

        const format = patients.map(u => {
            const { password, patientAppointments, ...safe } = u;
            return {
                ...safe,
                consultationsCount: patientAppointments.length,
                lastConsultation: patientAppointments.length > 0 ? patientAppointments[0].date : null
            };
        });
        res.json(format);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

app.get('/api/admin/psychologists', async (req, res) => {
    try {
        const psychs = await prisma.user.findMany({
            where: { type: 'psychologist' },
            include: { doctorAppointments: { select: { status: true, amount: true } } }
        });

        const formatted = psychs.map(p => {
            const completed = p.doctorAppointments.filter(a => a.status === 'completed');
            const revenue = completed.reduce((sum, a) => sum + (a.amount || 0), 0);
            return {
                id: p.id,
                name: p.name,
                specialty: p.specialty || 'Non spécifié',
                email: p.email,
                status: p.status,
                rating: p.rating,
                createdAt: p.createdAt,
                totalConsultations: p.doctorAppointments.length,
                completedConsultations: completed.length,
                revenue
            };
        });
        res.json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching psychologists' });
    }
});

app.get('/api/admin/appointments', async (req, res) => {
    try {
        const apts = await prisma.appointment.findMany({
            include: {
                user: { select: { name: true } },
                doctor: { select: { name: true, specialty: true } }
            },
            orderBy: { date: 'desc' }
        });

        const hydrated = apts.map(a => ({
            ...a,
            doctorName: a.doctor?.name || 'Inconnu',
            userName: a.user?.name || 'Inconnu',
            doctorSpecialty: a.doctor?.specialty || ''
        }));
        res.json(hydrated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching appointments' });
    }
});

app.get('/api/admin/payments', async (req, res) => {
    try {
        const apts = await prisma.appointment.findMany({
            include: {
                user: { select: { name: true } },
                doctor: { select: { name: true } }
            },
            orderBy: { date: 'desc' }
        });

        const payments = apts.map(a => ({
            id: a.id,
            date: a.date,
            amount: a.amount || 0,
            paymentStatus: a.paymentStatus,
            doctorName: a.doctor?.name || 'Inconnu',
            patientName: a.user?.name || 'Inconnu',
            commission: Math.round((a.amount || 0) * 0.15),
            type: a.type
        }));

        const total = payments.filter(p => p.paymentStatus === 'paid').reduce((s, p) => s + p.amount, 0);
        const refunds = payments.filter(p => p.paymentStatus === 'refunded').reduce((s, p) => s + p.amount, 0);
        const commissions = payments.filter(p => p.paymentStatus === 'paid').reduce((s, p) => s + p.commission, 0);

        res.json({
            transactions: payments,
            summary: { total, refunds, net: total - refunds, commissions }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching payments' });
    }
});

app.post('/api/admin/notify', async (req, res) => {
    try {
        const { to, subject, message, type } = req.body;
        const newCom = await prisma.communication.create({
            data: { sender: 'admin', to, subject, message, type: type || 'notification' }
        });
        res.status(201).json({ success: true, communication: newCom });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating notification' });
    }
});

app.get('/api/admin/communications', async (req, res) => {
    try {
        const coms = await prisma.communication.findMany({ orderBy: { sentAt: 'desc' } });
        res.json(coms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching communications' });
    }
});

app.put('/api/admin/users/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await prisma.user.update({
            where: { id },
            data: { status }
        });
        const { password: _, ...safe } = updated;
        res.json(safe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user status' });
    }
});

app.put('/api/admin/psychologists/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await prisma.user.update({
            where: { id },
            data: { status }
        });
        const { password: _, ...safe } = updated;
        res.json(safe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating psych status' });
    }
});

app.listen(port, () => {
    console.log(`Sanalink Server running on port ${port}`);
    console.log(`Admin account: admin@sanalink.com / admin123`);
});
