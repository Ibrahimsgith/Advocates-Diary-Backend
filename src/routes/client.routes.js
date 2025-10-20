import { Router } from "express";
import * as db from "../localdb.js";

const router = Router();
const TABLE = "clients";

// Create
router.post("/", async (req, res, next) => {
  try {
    const { name, phone, email, address, notes } = req.body || {};
    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: "Client name is required" });
    }
    const created = await db.create(TABLE, {
      name: String(name).trim(),
      phone: phone ?? "",
      email: email ?? "",
      address: address ?? "",
      notes: notes ?? ""
    });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

// List
router.get("/", async (_req, res, next) => {
  try {
    const rows = await db.list(TABLE);
    rows.sort((a,b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
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
    const updated = await db.update(TABLE, req.params.id, req.body || {});
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
