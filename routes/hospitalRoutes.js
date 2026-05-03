import express from 'express';
import { 
    getHospitalProfile, 
    updateHospitalProfile, 
    getAllPatients, 
    getAllDonors, 
    getDonorById, 
    getPatientById, 
    getAllMatches,
    notifyMatch
} from '../controllers/hospitalController.js';
import protect from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(roleMiddleware('hospital'));

router.get('/profile', getHospitalProfile);
router.put('/profile', updateHospitalProfile);
router.get('/all-patients', getAllPatients);
router.get('/all-donors', getAllDonors);
router.get('/all-donors/:id', getDonorById);
router.get('/all-patients/:id', getPatientById);
router.get('/matches', getAllMatches);
router.post('/notify-match', notifyMatch);

export default router;
