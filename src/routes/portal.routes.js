import { Router } from "express";
import * as db from "../localdb.js";

const router = Router();

/** Public dashboard snapshot */
router.get("/", async (_req, res, next) => {
  try {
    const [clients, cases, hearings] = await Promise.all([
      db.list("clients"),
      db.list("cases"),
      db.list("hearings")
    ]);

    const activeMatters = cases.filter(c => c.status === "ACTIVE").length;
    const filingsPending = cases.filter(c => c.status === "PENDING").length;

    const now = new Date();
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (7 - now.getDay() || 7));
    const hearingsThisWeek = hearings.filter(h => {
      if (!h.date) return false;
      const d = new Date(h.date);
      return d >= now && d <= endOfWeek;
    }).length;

    res.json({
      stats: {
        clients: clients.length,
        cases: cases.length,
        activeMatters,
        hearingsThisWeek,
        filingsPending,
        teamUtilisation: 0
      }
    });
  } catch (e) { next(e); }
});

export default router;
