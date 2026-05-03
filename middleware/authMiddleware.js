import jwt from 'jsonwebtoken';
import Patient from '../models/Patient.js';
import Donor from '../models/Donor.js';
import Hospital from '../models/Hospital.js';

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

           
            let user;
            if (decoded.role === 'patient') user = await Patient.findById(decoded.id).select('-password');
            else if (decoded.role === 'donor') user = await Donor.findById(decoded.id).select('-password');
            else if (decoded.role === 'hospital') user = await Hospital.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export default protect;
