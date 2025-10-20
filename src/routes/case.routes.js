import { Router } from "express";
import * as db from "../localdb.js";

const router = Router();
const TABLE = "cases";

// Normalize status to our 3 allowed values
function normalizeStatus(s) {
  const v = String(s || "").toUpperCase();
  if (["PENDING", "ACTIVE", "CLOSED"].includes(v)) return v;
  return "PENDING";
}

// Build a title if none provided
function makeTitle({ title, caseNumber, client, opponent }) {
  const t = (title ?? "").toString().trim();
  if (t) return t;
  const cn = (caseNumber ?? "").toString().trim();
  if (cn) return cn; // e.g., "MC 26/2024"
  const c = (client ?? "").toString().trim();
  const o = (opponent ?? "").toString().trim();
  if (c && o) return `${c} v. ${o}`;
  if (c) return c;
  // last resort
  return `Matter ${new Date().toISOString().slice(0,16).replace("T"," ")}`;
}

/* ----------------------- Create ----------------------- */
router.post("/", async (req, res, next) => {
  try {
    const {
      title,
      caseNumber,
      court,
      status,
      client,          // name string from your form
      opponent,        // name string from your form
      practiceArea,    // string
      clientId,        // if your UI later sends an ID
      advocate,        // string
      notes
    } = req.body || {};

    // Build a permissive record
    const record = {
      title: makeTitle({ title, caseNumber, client, opponent }),
      caseNumber: (caseNumber ?? "").toString().trim(),
      court: (court ?? "").toString().trim(),
      status: normalizeStatus(status),
      clientId: (clientId ?? "").toString().trim() || undefined,
      advocate: (advocate ?? "").toString().trim(),
      notes: (notes ?? "").toString().trim(),

      // extra fields your UI cares about:
      client: (client ?? "").toString().trim(),
      opponent: (opponent ?? "").toString().trim(),
      practiceArea: (practiceArea ?? "").toString().trim()
    };

    // Simple guard: at least one meaningful field
    if (!record.title && !record.caseNumber && !record.client) {
      return res.status(400).json({ error: "Please provide some case details." });
    }

    const created = await db.create(TABLE, record);
    return res.status(201).json(created);
  } catch (e) {
    return next(e);
  }
});

/* ------------------------ List ------------------------ */
router.get("/", async (_req, res, next) => {
  try {
    const rows = await db.list(TABLE);
    rows.sort((a,b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    res.json(rows);
  } catch (e) { next(e); }
});

/* ----------------------- Get one ---------------------- */
router.get("/:id", async (req, res, next) => {
  try {
    const item = await db.get(TABLE, req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (e) { next(e); }
});

/* ----------------------- Update ----------------------- */
router.put("/:id", async (req, res, next) => {
  try {
    const patch = { ...req.body };

    if (patch.status) patch.status = normalizeStatus(patch.status);
    if (typeof patch.title === "string") patch.title = patch.title.trim();
    if (typeof patch.caseNumber === "string") patch.caseNumber = patch.caseNumber.trim();
    if (typeof patch.client === "string") patch.client = patch.client.trim();
    if (typeof patch.opponent === "string") patch.opponent = patch.opponent.trim();
    if (typeof patch.practiceArea === "string") patch.practiceArea = patch.practiceArea.trim();

    const updated = await db.update(TABLE, req.params.id, patch);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (e) { next(e); }
});

/* ----------------------- Delete ----------------------- */
router.delete("/:id", async (req, res, next) => {
  try {
    const ok = await db.remove(TABLE, req.params.id);
    if (!ok) return res.status(404).json({ error: "Not found" });
    res.status(204).send();
  } catch (e) { next(e); }
});

export default router;
