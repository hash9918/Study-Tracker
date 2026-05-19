# Study Tracker

A modern, minimal MERN stack application that allows users to build a custom daily schedule, track completed blocks, and visualize their consistency via a heatmap and streak counter.

## Features

- **Custom Schedule Builder**: Set your own time blocks for each day, dynamically incrementing as you add tasks.
- **Daily Check-off**: Mark each block complete seamlessly with real-time syncing.
- **Consistency Heatmap**: A GitHub-style graph that displays your task completion ratio over the last 90 days.
- **Streak Counter**: Track your consecutive days of perfect consistency.
- **History View**: Review all your past schedules and what you accomplished.
- **Authentication**: Secure JWT-based login and registration.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router, date-fns, Lucide React (Icons).
- **Backend**: Node.js, Express, MongoDB, Mongoose, JSON Web Tokens (JWT), bcryptjs.

## Getting Started

### 1. Database Setup
You will need a MongoDB database (local or Atlas).
1. Create a `.env` file in the `backend/` directory.
2. Add your MongoDB connection string and a JWT secret:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/study-tracker  # Or your Atlas URI
   JWT_SECRET=your_jwt_secret_here
   ```

### 2. Run the Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at [http://localhost:5173](http://localhost:5173).

## Design
The application features a dark mode design (`zinc-900`) with vibrant `indigo` and `emerald` accents, utilizing CSS Grid and Flexbox for a responsive experience across Desktop, Tablet, and Mobile.
