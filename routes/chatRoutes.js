import express from 'express';
import protect from '../middleware/authMiddleware.js';
import Message from '../models/Message.js';

const router = express.Router();

router.get('/chats', protect, async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        }).sort({ createdAt: 1 });

        const chatMap = {};
        messages.forEach(msg => {
            const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
            const chatKey = [userId, otherId].sort().join('-');
            
            if (!chatMap[chatKey]) {
                chatMap[chatKey] = {
                    chatId: chatKey,
                    otherId,
                    otherName: msg.senderId === userId ? msg.receiverName : msg.senderName,
                    otherRole: msg.senderId === userId ? msg.receiverRole : msg.senderRole,
                    lastMessage: msg.message,
                    lastMessageTime: msg.createdAt,
                    unread: 0
                };
            } else {
                chatMap[chatKey].lastMessage = msg.message;
                chatMap[chatKey].lastMessageTime = msg.createdAt;
            }

            if (!msg.read && msg.receiverId === userId) {
                chatMap[chatKey].unread = (chatMap[chatKey].unread || 0) + 1;
            }
        });

        const chats = Object.values(chatMap).sort((a, b) => 
            new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
        );

        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/messages/:chatId', protect, async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
        
        await Message.updateMany(
            { chatId, receiverId: req.user._id.toString(), read: false },
            { $set: { read: true } }
        );

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
