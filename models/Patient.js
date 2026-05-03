import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    age: { type: Number },
    bloodType: { type: String },
    organNeeded: { type: String },
    medicalHistory: { type: String },
    contactNumber: { type: String },
    address: { type: String },
    isMatched: { type: Boolean, default: false },
    matchedDonors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Donor' }],
    role: { type: String, default: "patient" },
    notifications: [{
        message: String,
        from: String,
        type: { type: String, default: 'match' },
        status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
        donorId: { type: String },
        donorName: { type: String },
        date: { type: Date, default: Date.now },
        read: { type: Boolean, default: false }
    }],
    createdAt: { type: Date, default: Date.now }
});

patientSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

patientSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
