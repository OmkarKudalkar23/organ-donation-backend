import express from 'express';
import { registerPatient, registerDonor, registerHospital, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register/patient', registerPatient);
router.post('/register/donor', registerDonor);
router.post('/register/hospital', registerHospital);
router.post('/login', login);

export default router;
