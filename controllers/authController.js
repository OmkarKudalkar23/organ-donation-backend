import Patient from '../models/Patient.js';
import Donor from '../models/Donor.js';
import Hospital from '../models/Hospital.js';
import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc Register patient
// @route POST /api/auth/register/patient
export const registerPatient = async (req, res) => {
    const { name, email, password, age, bloodType, organNeeded, medicalHistory, contactNumber, address } = req.body;
    try {
        const userExists = await Patient.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const patient = await Patient.create({
            name, email, password, 
            age: age ? Number(age) : undefined, 
            bloodType, organNeeded, medicalHistory, contactNumber, address
        });

        res.status(201).json({
            token: generateToken(patient._id, 'patient'),
            role: 'patient',
            user: { id: patient._id, name: patient.name, email: patient.email }
        });
    } catch (error) {
        console.error("Register Patient Error:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc Register donor
// @route POST /api/auth/register/donor
export const registerDonor = async (req, res) => {
    const { name, email, password, age, bloodType, organsAvailable, medicalHistory, contactNumber, address } = req.body;
    try {
        const userExists = await Donor.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const donor = await Donor.create({
            name, email, password, 
            age: age ? Number(age) : undefined, 
            bloodType, organsAvailable, medicalHistory, contactNumber, address
        });

        res.status(201).json({
            token: generateToken(donor._id, 'donor'),
            role: 'donor',
            user: { id: donor._id, name: donor.name, email: donor.email }
        });
    } catch (error) {
        console.error("Register Donor Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc Register hospital
// @route POST /api/auth/register/hospital
export const registerHospital = async (req, res) => {
    const { hospitalName, email, password, licenseNumber, address, contactNumber } = req.body;
    try {
        const userExists = await Hospital.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Hospital already exists' });

        const hospital = await Hospital.create({
            hospitalName, email, password, licenseNumber, address, contactNumber
        });

        res.status(201).json({
            token: generateToken(hospital._id, 'hospital'),
            role: 'hospital',
            user: { id: hospital._id, name: hospital.hospitalName, email: hospital.email }
        });
    } catch (error) {
        console.error("Register Hospital Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc Login unified
// @route POST /api/auth/login
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await Patient.findOne({ email });
        let role = 'patient';

        if (!user) {
            user = await Donor.findOne({ email });
            role = 'donor';
        }
        if (!user) {
            user = await Hospital.findOne({ email });
            role = 'hospital';
        }

        if (user && (await user.matchPassword(password))) {
            res.json({
                token: generateToken(user._id, role),
                role: role,
                user: { id: user._id, name: user.name || user.hospitalName, email: user.email }
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
