import { Router } from 'express';
import Client from '../models/client.model.js';
import Case from '../models/case.model.js';
import Hearing from '../models/hearing.model.js';

const router = Router();

/**
 * PUBLIC: Returns numbers for dashboard cards.
 * Later, you can enforce auth by importing authRequired and adding:
 *   router.use(authRequired);
 */
router.get('/', async (_req, res, next) => {
  try {
    const now = new Date();
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (7 - now.getDay() || 7));

    const [clients, casesTotal, activeMatters, filingsPending, hearingsThisWeek] =
      await Promise.all([
        Client.countDocuments(),
        Case.countDocuments(),
        Case.countDocuments({ status: 'ACTIVE' }),
        Case.countDocuments({ status: 'PENDING' }), // adjust if you track filings differently
        Hearing.countDocuments({ date: { $gte: now, $lte: endOfWeek } }),
      ]);

    res.json({
      stats: {
        clients,
        cases: casesTotal,
        activeMatters,
        hearingsThisWeek,
        filingsPending,
        teamUtilisation: 0, // update when you have real utilisation logic
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * OPTIONAL (disabled): If your UI’s “Save metrics” posts to /api/portal,
 * you can return 501 for now until auth/UI is ready.
 */
router.post('/', (_req, res) => {
  res.status(501).json({ error: 'Saving metrics not enabled yet' });
});

export default router;
