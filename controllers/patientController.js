import Patient from '../models/Patient.js';
import Donor from '../models/Donor.js';
import Hospital from '../models/Hospital.js';
import getMatchedDonors from '../utils/matchingAlgorithm.js';

// @desc Get profile
export const getPatientProfile = async (req, res) => {
    try {
        const patient = await Patient.findById(req.user._id).select('-password');
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update profile
export const updatePatientProfile = async (req, res) => {
    try {
        const patient = await Patient.findById(req.user._id);
        if (patient) {
            patient.name = req.body.name || patient.name;
            patient.age = req.body.age || patient.age;
            patient.bloodType = req.body.bloodType || patient.bloodType;
            patient.organNeeded = req.body.organNeeded || patient.organNeeded;
            patient.medicalHistory = req.body.medicalHistory || patient.medicalHistory;
            patient.contactNumber = req.body.contactNumber || patient.contactNumber;
            patient.address = req.body.address || patient.address;

            const updatedPatient = await patient.save();
            res.json(updatedPatient);
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get hospitals with locations
export const getAllHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find({}).select('hospitalName address contactNumber location email');
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get matched donors
export const getMatchedDonorsForPatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.user._id);
        const donorsArray = await Donor.find({ isAvailable: true });
        const matches = getMatchedDonors(patient, donorsArray);
        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc Request a match for a donor
export const requestMatch = async (req, res) => {
    try {
        const { donorId } = req.body;
        const patient = await Patient.findById(req.user._id);
        const donor = await Donor.findById(donorId);

        if (!patient || !donor) {
            return res.status(404).json({ message: 'Patient or Donor not found' });
        }

        // Add to matchedDonors if not already added
        if (!patient.matchedDonors.includes(donorId)) {
            patient.matchedDonors.push(donorId);
        }

        // Add a notification for the patient
        patient.notifications.push({
            message: `You have requested a match with donor ${donor.name} for your ${patient.organNeeded}. Awaiting donor response.`,
            from: "Patient Dashboard",
            type: "match",
            status: "pending",
            donorId: donor._id.toString(),
            donorName: donor.name,
            date: new Date()
        });

        // Add a notification for the donor
        donor.notifications.push({
            message: `Patient ${patient.name} needs a ${patient.organNeeded}. You are a compatible match. Please review this request.`,
            from: patient.name,
            type: "match",
            status: "pending",
            patientId: patient._id.toString(),
            date: new Date()
        });

        await patient.save();
        await donor.save();
        res.json({ message: 'Match request sent successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc Proxy OSM data to avoid CORS
export const getOSMHospitals = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ message: "Latitude and Longitude are required" });
        }
        
        const query = `[out:json];node["amenity"="hospital"](around:5000,${lat},${lng});out;`;
        const osmRes = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
        
        if (!osmRes.ok) {
            throw new Error(`OSM API responded with status ${osmRes.status}`);
        }

        const osmData = await osmRes.json();
        res.json(osmData || { elements: [] });
    } catch (error) {
        console.error("OSM Proxy Error:", error);
        res.status(500).json({ message: error.message, elements: [] });
    }
};
