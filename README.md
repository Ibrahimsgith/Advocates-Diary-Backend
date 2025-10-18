# Advocates Diary — Backend (Express + MongoDB)

Minimal, production-ready API with JWT auth and CRUD for Users, Clients, Cases, Hearings.

## Quick start
```bash
npm install
cp .env.example .env  # then fill values
npm run dev           # local dev (nodemon)
```

## Endpoints
- `GET /` — health
- `POST /api/auth/register` — {name, email, password}
- `POST /api/auth/login` — returns { token }
- `GET /api/clients` (auth)
- `POST /api/clients` (auth)
- `GET /api/cases` (auth)
- `POST /api/cases` (auth)
- `GET /api/hearings` (auth)
- `POST /api/hearings` (auth)

### Auth
Add header: `Authorization: Bearer <token>`.

## Deploy to Render (free tier)
1. Push this folder to GitHub.
2. Create a **Web Service** on Render.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add env vars: `MONGO_URI`, `JWT_SECRET`, `PORT=10000` (Render sets PORT automatically; you can omit).

## MongoDB Atlas
- Create a free cluster → Database Access user → Network Access (allow your IP / 0.0.0.0 for testing).
- Get SRV connection string and paste into `MONGO_URI` in `.env`.
- Recommended database name: `advocates-diary`.