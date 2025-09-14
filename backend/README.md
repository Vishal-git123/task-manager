# Cantilever Task Management - Backend

## Setup
1. Copy `.env.example` to `.env` and update `MONGO_URI` and `JWT_SECRET`.
2. Run:
   ```
   npm install
   npm run dev
   ```
3. API endpoints:
   - `POST /api/auth/register` {name,email,password}
   - `POST /api/auth/login` {email,password}
   - `GET /api/tasks` (auth required)
   - `POST /api/tasks` (auth required)
   - `PUT /api/tasks/:id` (auth, owner)
   - `DELETE /api/tasks/:id` (auth, owner)
