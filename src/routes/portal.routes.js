// src/routes/portal.routes.js
import { Router } from "express";
import * as db from "../localdb.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const [clients, cases, hearings] = await Promise.all([
      db.list("clients"),
      db.list("cases"),
      db.list("hearings"),
    ]);

    // ---- basic stats
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

    const priorityAll = hearings.filter(h => !!h.priority);
    const priorityHearings = priorityAll.length;
    const priorityThisWeek = priorityAll.filter(h => {
      if (!h.date) return false;
      const d = new Date(h.date);
      return d >= now && d <= endOfWeek;
    }).length;

    // ---- build "upcoming priority" block with joined case titles
    const caseTitleById = new Map(cases.map(c => [String(c.id), c.title || c.caseNumber || "Untitled case"]));

    const upcomingPriority = priorityAll
      .filter(h => h.date)                                 // must have a date
      .filter(h => new Date(h.date) >= now)                // upcoming only
      .sort((a, b) => (a.date || "").localeCompare(b.date || "")) // soonest first
      .slice(0, 5)                                         // show top 5
      .map(h => ({
        hearingId: h.id,
        caseId: h.caseId || "",
        caseTitle: caseTitleById.get(String(h.caseId)) || "Untitled case",
        date: h.date,
        priorityLevel: h.priorityLevel || null,
        purpose: h.purpose || "",
      }));

    res.json({
      stats: {
        clients: clients.length,
        cases: cases.length,
        activeMatters,
        hearingsThisWeek,
        filingsPending,
        teamUtilisation: 0,
        priorityHearings,
        priorityThisWeek,
      },
      priority: {
        upcoming: upcomingPriority,
      },
    });
  } catch (e) {
    next(e);
  }
});

export default router;
