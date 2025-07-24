# Boma Rental Platform

Boma is a MERN stack web application that connects tenants and landlords, providing local insights, community communication tools, and verified rental listings. The platform features anonymous reviews, per-building forums, and role-based dashboards for tenants, landlords, and admins.

## Features
- **Authentication:** Register/login as tenant, landlord, or admin
- **Role-based Dashboards:** Different dashboards for tenants, landlords, and admins
- **Listings:** Browse, add, and manage rental listings (with verification)
- **Silent Reviews:** Anonymous ratings for safety, water, and landlord reliability
- **Community Forums:** Per-building complaint/discussion boards
- **Responsive UI:** Modern, mobile-friendly design with Tailwind CSS and dark mode toggle

## Tech Stack
- **Frontend:** React, Tailwind CSS, shadcn/ui, Heroicons, Axios, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, CORS, dotenv

## Setup Instructions

### 1. Clone the Repository
```sh
git clone https://github.com/PLP-MERN-Stack-Development/week-8-capstone_-Ronald-Wesh.git
cd week-8-capstone_-Ronald-Wesh
```

### 2. Backend Setup
```sh
cd server
pnpm install # or npm install
```
- Create a `.env` file in `/server` with:
  ```env
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  PORT=5000
  ```
- Start the backend:
  ```sh
  pnpm dev # or npm run dev or node server.js
  ```

### 3. Frontend Setup
```sh
cd ../client
pnpm install # or npm install
```
- Start the frontend:
  ```sh
  pnpm dev # or npm run dev
  ```

### 4. Access the App
- Open [http://localhost:5173](http://localhost:5173) in your browser (or the port shown in your terminal).
- The backend runs on [http://localhost:5000](http://localhost:5000).

## Usage Notes
- Register as a tenant, landlord, or admin to access the app.
- Dashboards and features are role-based.
- Use the theme toggle in the navbar to switch between light and dark mode.
- Listings, reviews, and forums are only accessible after login.

## License
MIT 