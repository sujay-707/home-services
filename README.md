# Home Services Platform - Starter (MERN)

This starter contains a simple MERN (MongoDB, Express, React, Node) project skeleton:
- Frontend: React + Bootstrap
- Backend: Node + Express + Mongoose
- Database: MongoDB (use your own Atlas or local URI)

See `backend/.env.example` and `frontend/.env.example` for environment variables.

## Quickstart
1. Start MongoDB (or use MongoDB Atlas) and get the MONGO_URI.
2. Backend:
   - cd backend
   - cp .env.example .env  (edit MONGO_URI)
   - npm install
   - npm run dev
3. Frontend:
   - cd frontend
   - cp .env.example .env  (edit REACT_APP_API_URL if needed)
   - npm install
   - npm start
