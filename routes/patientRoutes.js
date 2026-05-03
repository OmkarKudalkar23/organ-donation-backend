import express from 'express';
import { 
    getPatientProfile, 
    updatePatientProfile, 
    getMatchedDonorsForPatient, 
    getAllHospitals,
    requestMatch 
} from '../controllers/patientController.js';
import protect from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/profile', protect, roleMiddleware('patient'), getPatientProfile);
router.put('/profile', protect, roleMiddleware('patient'), updatePatientProfile);
router.get('/matched-donors', protect, roleMiddleware('patient'), getMatchedDonorsForPatient);
router.get('/hospitals', protect, roleMiddleware('patient'), getAllHospitals);
router.post('/request-match', protect, roleMiddleware('patient'), requestMatch);

export default router;
