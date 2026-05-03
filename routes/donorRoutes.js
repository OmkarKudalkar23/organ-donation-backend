import express from 'express';
import { getDonorProfile, updateDonorProfile, toggleAvailability, acceptNotification, declineNotification } from '../controllers/donorController.js';
import protect from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/profile', protect, roleMiddleware('donor'), getDonorProfile);
router.put('/profile', protect, roleMiddleware('donor'), updateDonorProfile);
router.put('/toggle-availability', protect, roleMiddleware('donor'), toggleAvailability);
router.put('/notification/:notificationId/accept', protect, roleMiddleware('donor'), acceptNotification);
router.put('/notification/:notificationId/decline', protect, roleMiddleware('donor'), declineNotification);

export default router;
