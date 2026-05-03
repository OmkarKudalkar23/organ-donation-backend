import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    senderRole: { type: String, enum: ['patient', 'donor'], required: true },
    receiverId: { type: String, required: true },
    receiverName: { type: String, required: true },
    receiverRole: { type: String, enum: ['patient', 'donor'], required: true },
    chatId: { type: String, required: true, index: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
