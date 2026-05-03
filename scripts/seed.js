import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Patient from '../models/Patient.js';
import Donor from '../models/Donor.js';
import Hospital from '../models/Hospital.js';

dotenv.config({ path: './.env' });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        
        await Patient.deleteMany();
        await Donor.deleteMany();
        await Hospital.deleteMany();

        console.log('Clearing existing data...');

       
        const hospital = await Hospital.create({
            hospitalName: "City General Hospital",
            email: "city-hospital@demo.com",
            password: "pass123",
            licenseNumber: "LIC-998877",
            address: "123 Medical Ave, New York",
            contactNumber: "555-0101"
        });

       
        const patients = await Patient.create([
            {
                name: "John Doe",
                email: "john-doe@demo.com",
                password: "pass123",
                age: 45,
                bloodType: "B+",
                organNeeded: "Kidney",
                medicalHistory: "Chronic kidney disease for 3 years.",
                contactNumber: "555-0202",
                address: "45 River Rd, Brooklyn"
            },
            {
                name: "Jane Smith",
                email: "jane-smith@demo.com",
                password: "pass123",
                age: 32,
                bloodType: "O-",
                organNeeded: "Heart",
                medicalHistory: "Congenital heart defect.",
                contactNumber: "555-0303",
                address: "10 Hill St, Queens"
            }
        ]);

      
        const donors = await Donor.create([
            {
                name: "Michael Rose",
                email: "michael-rose@demo.com",
                password: "pass123",
                age: 28,
                bloodType: "B+",
                organsAvailable: ["Kidney", "Liver"],
                medicalHistory: "None. Fit and healthy.",
                contactNumber: "555-0404",
                address: "22 Park Ave, Manhattan",
                isAvailable: true
            },
            {
                name: "Sarah Jane",
                email: "sarah-jane@demo.com",
                password: "pass123",
                age: 50,
                bloodType: "O-",
                organsAvailable: ["Heart", "Cornea"],
                medicalHistory: "Registered organ donor.",
                contactNumber: "555-0505",
                address: "88 Pine St, Bronx",
                isAvailable: true
            }
        ]);

        console.log(' Dummy data seeded successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error seeding data: ${error.message}`);
        process.exit(1);
    }
};

seedData();
