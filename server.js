import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import caseRoutes from './src/routes/case.routes.js';
import clientRoutes from './src/routes/client.routes.js';
import hearingRoutes from './src/routes/hearing.routes.js';
import portalRoutes from './src/routes/portal.routes.js';

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// DB
await connectDB();

// Routes
app.get('/', (_req, res) => res.json({ ok: true, name: 'Advocates Diary API' }));
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/hearings', hearingRoutes);
app.use('/api/portal', portalRoutes);

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API running on :${PORT}`));