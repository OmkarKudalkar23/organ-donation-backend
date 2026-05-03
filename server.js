import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import donorRoutes from './routes/donorRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import Message from './models/Message.js';
import Patient from './models/Patient.js';
import Donor from './models/Donor.js';

dotenv.config();

connectDB();

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins for deployment flexibility
        methods: ['GET', 'POST']
    }
});

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/donor', donorRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/stats', (req, res) => {
    res.json({
        organsDonated: 1375,
        fundsCollected: 1267000
    });
});

app.get('/', (req, res) => {
    res.send('Organ Donation Management API is running...');
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('register', (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`User ${userId} registered`);
    });

    socket.on('send_message', async (data) => {
        const { senderId, senderName, senderRole, receiverId, receiverName, receiverRole, message } = data;
        const chatId = [senderId, receiverId].sort().join('-');

        const newMessage = new Message({
            senderId,
            senderName,
            senderRole,
            receiverId,
            receiverName,
            receiverRole,
            chatId,
            message
        });

        await newMessage.save();

        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receive_message', {
                ...newMessage.toObject(),
                chatId
            });
        }

        io.to(socket.id).emit('message_sent', {
            ...newMessage.toObject(),
            chatId
        });

        const notification = {
            message: `New message from ${senderName}: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`,
            from: senderName,
            type: 'chat',
            status: 'accepted',
            date: new Date(),
            chatId
        };

        if (receiverRole === 'patient') {
            await Patient.findByIdAndUpdate(receiverId, {
                $push: { notifications: notification }
            });
        } else if (receiverRole === 'donor') {
            await Donor.findByIdAndUpdate(receiverId, {
                $push: { notifications: notification }
            });
        }

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('new_notification', notification);
        }
    });

    socket.on('disconnect', () => {
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
