import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Hospital from './models/Hospital.js';
import dotenv from 'dotenv';

dotenv.config();

const hospitals = [
    {
        hospitalName: "City General Hospital",
        email: "city-hospital@demo.com",
        password: "pass123",
        address: "7th Precinct, Downtown Mumbai",
        contactNumber: "+91 98765 43210",
        location: { lat: 19.0760, lng: 72.8777 }
    },
    {
        hospitalName: "Holy Family Hospital",
        email: "holy-family@demo.com",
        password: "pass123",
        address: "St. Andrews Road, Bandra West",
        contactNumber: "+91 22 6267 0101",
        location: { lat: 19.0560, lng: 72.8277 }
    },
    {
        hospitalName: "Lilavati Hospital",
        email: "lilavati@demo.com",
        password: "pass123",
        address: "Bandstand, Bandra West",
        contactNumber: "+91 22 2675 1000",
        location: { lat: 19.0514, lng: 72.8217 }
    },
    {
        hospitalName: "Nanavati Max Hospital",
        email: "nanavati@demo.com",
        password: "pass123",
        address: "S V Road, Vile Parle West",
        contactNumber: "+91 22 2626 7500",
        location: { lat: 19.1025, lng: 72.8364 }
    },
    {
        hospitalName: "SevenHills Hospital",
        email: "sevenhills@demo.com",
        password: "pass123",
        address: "Marol Maroshi Road, Andheri East",
        contactNumber: "+91 22 6767 6767",
        location: { lat: 19.1136, lng: 72.8837 }
    },
    {
        hospitalName: "H. N. Reliance Foundation",
        email: "reliance@demo.com",
        password: "pass123",
        address: "Prarthana Samaj, Girgaon",
        contactNumber: "+91 22 3547 5000",
        location: { lat: 18.9567, lng: 72.8202 }
    },
    {
        hospitalName: "Fortis Hospital Mulund",
        email: "fortis-mulund@demo.com",
        password: "pass123",
        address: "Mulund Goregaon Link Rd",
        contactNumber: "+91 22 4365 4365",
        location: { lat: 19.1678, lng: 72.9348 }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/organ-donation');
        console.log("Connected to MongoDB for seeding...");

        for (const hData of hospitals) {
            const exists = await Hospital.findOne({ email: hData.email });
            if (!exists) {
                const newHospital = new Hospital(hData);
                await newHospital.save();
                console.log(`Seeded: ${hData.hospitalName}`);
            } else {
                // Update location if exists
                await Hospital.updateOne({ email: hData.email }, { $set: { location: hData.location } });
                console.log(`Updated: ${hData.hospitalName}`);
            }
        }
        
        console.log("Seeding complete!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
