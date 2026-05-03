import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const hospitalSchema = new mongoose.Schema({
    hospitalName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    licenseNumber: { type: String },
    address: { type: String },
    contactNumber: { type: String },
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },
    role: { type: String, default: "hospital" },
    createdAt: { type: Date, default: Date.now }
});

hospitalSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

hospitalSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Hospital = mongoose.model('Hospital', hospitalSchema);
export default Hospital;
