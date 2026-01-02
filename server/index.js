const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect to Database
connectDB();

// --- Mongoose Models ---
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['user', 'psychologist'], default: 'user' },
    // Profile fields
    age: String,
    profession: String,
    reason: String,
    emotionalState: String,
    // Psychologist fields
    specialty: String,
    description: String,
    consultationFee: String,
    image: String,
    availableSlots: [String]
});

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    doctorId: String, // Can be ID from DB or static ID from mocks
    date: String,
    time: String,
    type: String,
    status: { type: String, default: 'pending' },
    link: String
});

const evaluationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    doctorId: String,
    content: String,
    date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);
const Evaluation = mongoose.model('Evaluation', evaluationSchema);

// --- Mock Psychologists (Static Data) ---
const mockPsychologists = [
    {
        id: 'psy-1',
        name: 'Dr. Jean Dupont',
        specialty: 'Psychologie Clinique',
        description: 'Expert en gestion du stress et anxiété. 15 ans d\'expérience.',
        consultationFee: '5000',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200',
        availableSlots: ['09:00', '10:00', '14:00', '15:00'],
        email: 'jean.dupont@sanalink.com'
    },
    {
        id: 'psy-2',
        name: 'Mme. Sarah Cohen',
        specialty: 'Thérapie de couple',
        description: 'Accompagnement bienveillant pour les couples et les familles.',
        consultationFee: '7000',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
        availableSlots: ['11:00', '13:00', '16:00'],
        email: 'sarah.cohen@sanalink.com'
    },
    {
        id: 'psy-3',
        name: 'Dr. Marc Levy',
        specialty: 'Pédopsychiatrie',
        description: 'Spécialisé dans les troubles de l\'attention chez l\'enfant.',
        consultationFee: '6000',
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
        availableSlots: ['08:00', '12:00', '17:00'],
        email: 'marc.levy@sanalink.com'
    }
];

// --- Helpers ---
// Try to find doctor in DB or Mocks
const findDoctor = async (id) => {
    // Check mocks first (they have string IDs like 'psy-1')
    const mock = mockPsychologists.find(p => p.id === id);
    if (mock) return mock;

    // Check DB
    if (mongoose.Types.ObjectId.isValid(id)) {
        return await User.findById(id);
    }
    return null;
};

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, type } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = await User.create({
            email,
            password,
            name,
            type,
            // Default fields for psychs
            specialty: type === 'psychologist' ? 'Psychologue inscrit' : undefined,
            description: type === 'psychologist' ? 'Nouveau professionnel.' : undefined,
            availableSlots: type === 'psychologist' ? ['09:00', '14:00'] : undefined
        });

        const userObj = newUser.toObject();
        delete userObj.password;

        res.status(201).json({ ...userObj, id: userObj._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check DB Users
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            const userObj = user.toObject();
            delete userObj.password;
            return res.json({ ...userObj, id: userObj._id });
        }

        // Check Mock Psychologists (Backdoor for demo)
        const mockPsy = mockPsychologists.find(p => p.email === email);
        if (mockPsy && password === 'admin') {
            return res.json({ ...mockPsy, type: 'psychologist' });
        }

        res.status(401).json({ message: 'Invalid credentials' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Profile
app.put('/api/profile/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (mongoose.Types.ObjectId.isValid(id)) {
            const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
            if (updatedUser) {
                return res.json({ ...updatedUser.toObject(), id: updatedUser._id });
            }
        }

        // If it's a mock psych, just echo back success (volatile update)
        if (mockPsychologists.find(p => p.id === id)) {
            return res.json({ ...updates, id });
        }

        res.status(404).json({ message: 'User not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Data Routes ---

app.get('/api/psychologists', async (req, res) => {
    try {
        const dbPsychs = await User.find({ type: 'psychologist' }).select('-password');
        const formattedDbPsychs = dbPsychs.map(p => ({
            ...p.toObject(),
            id: p._id,
            image: p.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
        }));

        res.json([...mockPsychologists, ...formattedDbPsychs]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/appointments', async (req, res) => {
    try {
        const { userId, doctorId, date, time, type } = req.body;

        // Mock generation of meet link
        let link = null;
        if (type === 'remote') {
            link = `https://meet.google.com/new-meeting?authuser=agnesvdogo@gmail.com`;
        }

        const newAppointment = await Appointment.create({
            userId,
            doctorId,
            date,
            time,
            type,
            status: 'pending',
            link: link || 'Adresse du cabinet du Dr.'
        });

        res.status(201).json({ ...newAppointment.toObject(), id: newAppointment._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/appointments/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find appointments for this user (as patient) OR as doctor
        // Mongoose query logic:
        const conditions = [];
        if (mongoose.Types.ObjectId.isValid(userId)) {
            conditions.push({ userId: userId }); // As patient
        }
        // As doctor (could be mongoID or string ID like 'psy-1')
        conditions.push({ doctorId: userId });

        const appointments = await Appointment.find({ $or: conditions });

        // Hydrate
        const hydrated = await Promise.all(appointments.map(async (a) => {
            const doctor = await findDoctor(a.doctorId);

            let patient = null;
            if (mongoose.Types.ObjectId.isValid(a.userId)) {
                patient = await User.findById(a.userId);
            }

            return {
                ...a.toObject(),
                id: a._id,
                doctorName: doctor ? doctor.name : 'Unknown',
                userName: patient ? patient.name : 'Unknown',
                patientDetails: patient ? {
                    age: patient.age,
                    profession: patient.profession,
                    reason: patient.reason,
                    emotionalState: patient.emotionalState
                } : null
            };
        }));

        res.json(hydrated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/evaluations', async (req, res) => {
    try {
        const { userId, doctorId, content } = req.body;
        const newEval = await Evaluation.create({ userId, doctorId, content });
        res.status(201).json({ ...newEval.toObject(), id: newEval._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/evaluations/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (mongoose.Types.ObjectId.isValid(userId)) {
            const evals = await Evaluation.find({ userId });
            return res.json(evals.map(e => ({ ...e.toObject(), id: e._id })));
        }
        res.json([]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.listen(port, () => {
    console.log(`Sanalink Server running on port ${port}`);
});

