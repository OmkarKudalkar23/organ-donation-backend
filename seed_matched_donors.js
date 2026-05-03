import mongoose from 'mongoose';
import Patient from './models/Patient.js';
import Donor from './models/Donor.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/organ-donation';

const seedMatchedDonors = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if John Doe exists, if not create him
        let patient = await Patient.findOne({ email: 'john-doe@demo.com' });
        if (!patient) {
            patient = new Patient({
                name: 'John Doe',
                email: 'john-doe@demo.com',
                password: 'pass123', // Will be hashed by pre-save
                age: 45,
                bloodType: 'O+',
                organNeeded: 'Kidney',
                contactNumber: '+91 98765 43210',
                address: 'Mumbai, India',
                isMatched: false
            });
            await patient.save();
            console.log('Patient John Doe created');
        } else {
            // Update to ensure matching criteria
            patient.bloodType = 'O+';
            patient.organNeeded = 'Kidney';
            await patient.save();
            console.log('Patient John Doe updated');
        }

        const donorsToCreate = [
            {
                name: 'Robert Wilson',
                email: 'robert.wilson@demo.com',
                password: 'pass123',
                age: 34,
                bloodType: 'O+',
                organsAvailable: ['Kidney', 'Liver'],
                contactNumber: '+91 97654 32101',
                address: 'Pune, India'
            },
            {
                name: 'Sarah Parker',
                email: 'sarah.parker@demo.com',
                password: 'pass123',
                age: 28,
                bloodType: 'O+',
                organsAvailable: ['Kidney'],
                contactNumber: '+91 96543 21012',
                address: 'Nagpur, India'
            },
            {
                name: 'David Miller',
                email: 'david.miller@demo.com',
                password: 'pass123',
                age: 41,
                bloodType: 'O+',
                organsAvailable: ['Kidney', 'Heart'],
                contactNumber: '+91 95432 10123',
                address: 'Nashik, India'
            }
        ];

        for (const donorData of donorsToCreate) {
            const existingDonor = await Donor.findOne({ email: donorData.email });
            if (!existingDonor) {
                const donor = new Donor(donorData);
                await donor.save();
                console.log(`Donor ${donorData.name} created`);
            } else {
                console.log(`Donor ${donorData.name} already exists`);
            }
        }

        console.log('Seeding complete');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedMatchedDonors();
