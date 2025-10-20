import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import Client from "../models/client.model.js";
import Case from "../models/case.model.js";
import Hearing from "../models/hearing.model.js";
// If you're using the editable metrics model, also import it:
// import PortalSetting from "../models/portalSetting.model.js";

const router = Router();

/** PUBLIC: Overview cards data */
router.get("/", async (_req, res, next) => {
  try {
    const now = new Date();
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (7 - now.getDay() || 7));

    const [clients, casesTotal, activeMatters, filingsPending, hearingsThisWeek] =
      await Promise.all([
        Client.countDocuments(),
        Case.countDocuments(),
        Case.countDocuments({ status: "ACTIVE" }),
        Case.countDocuments({ status: "PENDING" }),
        Hearing.countDocuments({ date: { $gte: now, $lte: endOfWeek } }),
      ]);

    res.json({
      stats: {
        clients,
        cases: casesTotal,
        activeMatters,
        hearingsThisWeek,
        filingsPending,
        teamUtilisation: 0,
      },
    });
  } catch (err) { next(err); }
});

/** OPTIONAL: keep writes protected so only logged-in users can “Save metrics” */
router.post("/", authRequired, async (req, res, next) => {
  try {
    // If you’re not storing metrics yet, you can remove this block entirely
    // or return 200 OK and ignore until auth UI exists.
    return res.status(501).json({ error: "Saving metrics not enabled yet" });
  } catch (err) { next(err); }
});

export default router;
