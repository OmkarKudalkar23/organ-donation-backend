import mongoose from 'mongoose';
import Patient from './models/Patient.js';
import Donor from './models/Donor.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/organ-donation';

const seedMoreData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const patients = [
            { name: "Michael Chen", email: "michael.chen@demo.com", age: 32, bloodType: "A+", organNeeded: "Liver", address: "Delhi, India", contactNumber: "+91 87654 32101" },
            { name: "Emily Watson", email: "emily.watson@demo.com", age: 29, bloodType: "B-", organNeeded: "Heart", address: "Bangalore, India", contactNumber: "+91 86543 21012" },
            { name: "Liam O'Connor", email: "liam.oconnor@demo.com", age: 54, bloodType: "AB+", organNeeded: "Lung", address: "Chennai, India", contactNumber: "+91 85432 10123" }
        ];

        const donors = [
            { name: "Alice Brown", email: "alice.brown@demo.com", age: 35, bloodType: "A+", organsAvailable: ["Liver", "Kidney"], address: "Chandigarh, India", contactNumber: "+91 76543 21012" },
            { name: "Kevin Hart", email: "kevin.hart@demo.com", age: 40, bloodType: "B-", organsAvailable: ["Heart", "Lung"], address: "Hyderabad, India", contactNumber: "+91 75432 10123" },
            { name: "Sophia Lee", email: "sophia.lee@demo.com", age: 27, bloodType: "AB+", organsAvailable: ["Lung", "Bone Marrow"], address: "Kolkata, India", contactNumber: "+91 74321 01234" },
            { name: "Jason Derulo", email: "jason.derulo@demo.com", age: 45, bloodType: "O-", organsAvailable: ["Kidney", "Liver"], address: "Jaipur, India", contactNumber: "+91 73210 12345" },
            { name: "Monica Bellucci", email: "monica.bellucci@demo.com", age: 50, bloodType: "A-", organsAvailable: ["Kidney"], address: "Goa, India", contactNumber: "+91 72109 87654" }
        ];

        const password = "pass123";

        for (const p of patients) {
            const exists = await Patient.findOne({ email: p.email });
            if (!exists) {
                await Patient.create({ ...p, password });
                console.log(`Created patient ${p.name}`);
            }
        }

        for (const d of donors) {
            const exists = await Donor.findOne({ email: d.email });
            if (!exists) {
                await Donor.create({ ...d, password });
                console.log(`Created donor ${d.name}`);
            }
        }

        console.log("Database seeding complete");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seedMoreData();
