import Hospital from '../models/Hospital.js';
import Patient from '../models/Patient.js';
import Donor from '../models/Donor.js';
import getMatchedDonors from '../utils/matchingAlgorithm.js';

export const getHospitalProfile = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.user._id).select('-password');
        res.json(hospital);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update profile
export const updateHospitalProfile = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.user._id);
        if (hospital) {
            hospital.hospitalName = req.body.hospitalName || hospital.hospitalName;
            hospital.licenseNumber = req.body.licenseNumber || hospital.licenseNumber;
            hospital.address = req.body.address || hospital.address;
            hospital.contactNumber = req.body.contactNumber || hospital.contactNumber;

            const updatedHospital = await hospital.save();
            res.json(updatedHospital);
        } else {
            res.status(404).json({ message: 'Hospital not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get all patients
export const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find({}).select('-password');
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get all donors
export const getAllDonors = async (req, res) => {
    try {
        const donors = await Donor.find({}).select('-password');
        res.json(donors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get specific donor
export const getDonorById = async (req, res) => {
    try {
        const donor = await Donor.findById(req.params.id).select('-password');
        if (donor) res.json(donor);
        else res.status(404).json({ message: 'Donor not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get specific patient
export const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).select('-password');
        if (patient) res.json(patient);
        else res.status(404).json({ message: 'Patient not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get all matches
export const getAllMatches = async (req, res) => {
    try {
        const patients = await Patient.find({});
        const donors = await Donor.find({ isAvailable: true });
        
        const matches = patients.map(patient => {
            return {
                patient: {
                    id: patient._id,
                    name: patient.name,
                    bloodType: patient.bloodType,
                    organNeeded: patient.organNeeded
                },
                matchedDonors: getMatchedDonors(patient, donors)
            };
        });

        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Notify match to patient and donor
export const notifyMatch = async (req, res) => {
    try {
        const { patientId, donorId, message } = req.body;
        const patient = await Patient.findById(patientId);
        const donor = await Donor.findById(donorId);
        const hospital = await Hospital.findById(req.user._id);

        if (!patient || !donor) {
            return res.status(404).json({ message: 'Patient or Donor not found' });
        }

        // Notify donor about the match request
        donor.notifications.push({
            message: `Match request: Patient ${patient.name} needs a ${patient.organNeeded}. You are a compatible donor.`,
            from: hospital.hospitalName,
            type: 'match',
            status: 'pending',
            patientId: patient._id.toString(),
            date: new Date()
        });

        // Notify patient that request was sent
        const patientMsg = message || `Match request sent to donor ${donor.name} for your ${patient.organNeeded} transplant. Awaiting response.`;

        patient.notifications.push({
            message: patientMsg,
            from: hospital.hospitalName,
            type: 'match',
            status: 'pending',
            donorId: donor._id.toString(),
            donorName: donor.name,
            date: new Date()
        });

        await donor.save();
        await patient.save();
        res.json({ message: 'Donor and patient notified successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
