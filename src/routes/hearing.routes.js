import { Router } from "express";
import * as db from "../localdb.js";

const router = Router();
const TABLE = "hearings";

// Create
router.post("/", async (req, res, next) => {
  try {
    const { caseId, date, purpose, orders, nextDate } = req.body || {};
    if (!caseId) return res.status(400).json({ error: "caseId is required" });
    const created = await db.create(TABLE, {
      caseId: String(caseId),
      date: date ? new Date(date).toISOString() : null,
      purpose: purpose ?? "",
      orders: orders ?? "",
      nextDate: nextDate ? new Date(nextDate).toISOString() : null
    });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

// List (most recent first)
router.get("/", async (_req, res, next) => {
  try {
    const rows = await db.list(TABLE);
    rows.sort((a,b) => (b.date || "").localeCompare(a.date || ""));
    res.json(rows);
  } catch (e) { next(e); }
});

// Get one
router.get("/:id", async (req, res, next) => {
  try {
    const item = await db.get(TABLE, req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (e) { next(e); }
});

// Update
router.put("/:id", async (req, res, next) => {
  try {
    const patch = { ...req.body };
    if (patch.date) patch.date = new Date(patch.date).toISOString();
    if (patch.nextDate) patch.nextDate = new Date(patch.nextDate).toISOString();
    const updated = await db.update(TABLE, req.params.id, patch);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (e) { next(e); }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  try {
    const ok = await db.remove(TABLE, req.params.id);
    if (!ok) return res.status(404).json({ error: "Not found" });
    res.status(204).send();
  } catch (e) { next(e); }
});

export default router;
