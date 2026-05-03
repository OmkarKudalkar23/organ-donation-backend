# Organ Donation Management Platform - Backend

This is the backend for the Organ Donation Management Platform, built with Node.js, Express, and MongoDB.

## Features
- Unified Authentication (Patient, Donor, Hospital Admin)
- Role-based Access Control
- Organ Matching Algorithm based on Blood Type Compatibility
- Dashboards for Patients, Donors, and Hospital Admins

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Security:** JWT, bcryptjs
- **Environment:** dotenv, CORS

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Run the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Auth
- `POST /api/auth/register/patient` - Register a patient
- `POST /api/auth/register/donor` - Register a donor
- `POST /api/auth/register/hospital` - Register a hospital admin
- `POST /api/auth/login` - Login for all roles (detects role automatically)

### Patient
- `GET /api/patient/profile` - Get patient profile (Protected)
- `PUT /api/patient/profile` - Update patient profile (Protected)
- `GET /api/patient/matched-donors` - Get list of compatible donors (Protected)

### Donor
- `GET /api/donor/profile` - Get donor profile (Protected)
- `PUT /api/donor/profile` - Update donor profile (Protected)
- `PUT /api/donor/toggle-availability` - Toggle donor availability (Protected)

### Hospital
- `GET /api/hospital/profile` - Get hospital profile (Protected/Hospital Only)
- `PUT /api/hospital/profile` - Update hospital profile (Protected/Hospital Only)
- `GET /api/hospital/all-patients` - Get all patients (Protected/Hospital Only)
- `GET /api/hospital/all-donors` - Get all donors (Protected/Hospital Only)
- `GET /api/hospital/all-donors/:id` - Get donor details (Protected/Hospital Only)
- `GET /api/hospital/all-patients/:id` - Get patient details (Protected/Hospital Only)
- `GET /api/hospital/matches` - Get all matches (Protected/Hospital Only)

## Matching Logic
Matches are filtered based on:
1. Organ needed exists in donor's available organs.
2. Donor's blood type is compatible with patient's blood type.
3. Donor is marked as available.
