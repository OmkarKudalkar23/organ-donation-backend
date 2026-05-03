import Donor from '../models/Donor.js';
import Patient from '../models/Patient.js';

export const getDonorProfile = async (req, res) => {
    try {
        const donor = await Donor.findById(req.user._id).select('-password');
        res.json(donor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update donor profile
export const updateDonorProfile = async (req, res) => {
    try {
        const donor = await Donor.findById(req.user._id);
        if (donor) {
            donor.name = req.body.name || donor.name;
            donor.age = req.body.age || donor.age;
            donor.bloodType = req.body.bloodType || donor.bloodType;
            donor.organsAvailable = req.body.organsAvailable || donor.organsAvailable;
            donor.medicalHistory = req.body.medicalHistory || donor.medicalHistory;
            donor.contactNumber = req.body.contactNumber || donor.contactNumber;
            donor.address = req.body.address || donor.address;
            donor.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : donor.isAvailable;

            const updatedDonor = await donor.save();
            res.json(updatedDonor);
        } else {
            res.status(404).json({ message: 'Donor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Toggle availability
export const toggleAvailability = async (req, res) => {
    try {
        const donor = await Donor.findById(req.user._id);
        if (donor) {
            donor.isAvailable = !donor.isAvailable;
            await donor.save();
            res.json({ message: `Donor is now ${donor.isAvailable ? 'available' : 'unavailable'}`, isAvailable: donor.isAvailable });
        } else {
            res.status(404).json({ message: 'Donor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Accept a match notification
export const acceptNotification = async (req, res) => {
    try {
        const donor = await Donor.findById(req.user._id);
        if (!donor) return res.status(404).json({ message: 'Donor not found' });

        const notification = donor.notifications.id(req.params.notificationId);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        notification.status = 'accepted';
        await donor.save();

        // Notify the patient that the donor accepted
        const patientId = notification.patientId;
        if (patientId) {
            const patient = await Patient.findById(patientId);
            if (patient) {
                // Update the original notification status if it exists
                const patientNotif = patient.notifications.find(n =>
                    n.donorId === donor._id.toString() && n.status === 'pending' && n.type === 'match'
                );
                if (patientNotif) {
                    patientNotif.status = 'accepted';
                }
                // Also push a new notification about acceptance
                patient.notifications.push({
                    message: `Donor ${donor.name} has accepted your match request for ${patient.organNeeded}. Please contact the hospital for next steps.`,
                    from: donor.name,
                    type: 'match_response',
                    status: 'accepted',
                    date: new Date()
                });
                await patient.save();
            }
        }

        res.json({ message: 'Match request accepted successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Decline a match notification
export const declineNotification = async (req, res) => {
    try {
        const donor = await Donor.findById(req.user._id);
        if (!donor) return res.status(404).json({ message: 'Donor not found' });

        const notification = donor.notifications.id(req.params.notificationId);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        notification.status = 'declined';
        await donor.save();

        // Notify the patient that the donor declined
        const patientId = notification.patientId;
        if (patientId) {
            const patient = await Patient.findById(patientId);
            if (patient) {
                // Update the original notification status if it exists
                const patientNotif = patient.notifications.find(n =>
                    n.donorId === donor._id.toString() && n.status === 'pending' && n.type === 'match'
                );
                if (patientNotif) {
                    patientNotif.status = 'declined';
                }
                patient.notifications.push({
                    message: `Donor ${donor.name} has declined your match request for ${patient.organNeeded}. We'll continue searching for other donors.`,
                    from: donor.name,
                    type: 'match_response',
                    status: 'declined',
                    date: new Date()
                });
                await patient.save();
            }
        }

        res.json({ message: 'Match request declined' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
