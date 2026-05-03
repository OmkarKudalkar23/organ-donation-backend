import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const donorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    bloodType: { type: String },
    organsAvailable: [{ type: String }],
    medicalHistory: { type: String },
    contactNumber: { type: String },
    address: { type: String },
    isAvailable: { type: Boolean, default: true },
    role: { type: String, default: "donor" },
    notifications: [{
        message: String,
        from: String,
        type: { type: String, default: 'match' },
        status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
        patientId: { type: String },
        date: { type: Date, default: Date.now },
        read: { type: Boolean, default: false }
    }],
    createdAt: { type: Date, default: Date.now }
});

donorSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

donorSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Donor = mongoose.model('Donor', donorSchema);
export default Donor;
