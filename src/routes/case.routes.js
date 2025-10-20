import { Router } from "express";
import * as db from "../localdb.js";

const router = Router();
const TABLE = "cases";

// helper to join client info
async function withClient(row) {
  if (!row?.clientId) return row;
  const client = await db.get("clients", row.clientId);
  return { ...row, client: client || null };
}

// Create
router.post("/", async (req, res, next) => {
  try {
    const { title, caseNumber, court, status, clientId, advocate, notes } = req.body || {};
    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    const created = await db.create(TABLE, {
      title: String(title).trim(),
      caseNumber: caseNumber ?? "",
      court: court ?? "",
      status: ["PENDING","ACTIVE","CLOSED"].includes(status) ? status : "PENDING",
      clientId: clientId && String(clientId).trim() || undefined,
      advocate: advocate ?? "",
      notes: notes ?? ""
    });
    res.status(201).json(await withClient(created));
  } catch (e) { next(e); }
});

// List
router.get("/", async (_req, res, next) => {
  try {
    const rows = await db.list(TABLE);
    rows.sort((a,b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    const out = [];
    for (const r of rows) out.push(await withClient(r));
    res.json(out);
  } catch (e) { next(e); }
});

// Get one
router.get("/:id", async (req, res, next) => {
  try {
    const item = await db.get(TABLE, req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(await withClient(item));
  } catch (e) { next(e); }
});

// Update
router.put("/:id", async (req, res, next) => {
  try {
    const patch = { ...req.body };
    if (patch.status && !["PENDING","ACTIVE","CLOSED"].includes(patch.status)) delete patch.status;
    if (typeof patch.title === "string") patch.title = patch.title.trim();
    const updated = await db.update(TABLE, req.params.id, patch);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(await withClient(updated));
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
