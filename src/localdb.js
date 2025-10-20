// src/localdb.js
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.resolve(__dirname, "..", "..", "data"); // local fallback

async function ensureDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

function tablePath(table) {
  return path.join(dataDir, `${table}.json`);
}

async function readTable(table) {
  await ensureDir();
  const p = tablePath(table);
  try {
    const txt = await fs.readFile(p, "utf-8");
    return JSON.parse(txt);
  } catch (e) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
}

async function writeTable(table, rows) {
  const p = tablePath(table);
  const tmp = `${p}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(rows, null, 2), "utf-8");
  await fs.rename(tmp, p);
}

export async function list(table) {
  return readTable(table);
}

export async function get(table, id) {
  const rows = await readTable(table);
  return rows.find(r => r.id === id) || null;
}

export async function create(table, data) {
  const rows = await readTable(table);
  const now = new Date().toISOString();
  const row = { id: randomUUID(), createdAt: now, updatedAt: now, ...data };
  rows.push(row);
  await writeTable(table, rows);
  return row;
}

export async function update(table, id, patch) {
  const rows = await readTable(table);
  const i = rows.findIndex(r => r.id === id);
  if (i === -1) return null;
  rows[i] = { ...rows[i], ...patch, updatedAt: new Date().toISOString() };
  await writeTable(table, rows);
  return rows[i];
}

export async function remove(table, id) {
  const rows = await readTable(table);
  const next = rows.filter(r => r.id !== id);
  const changed = next.length !== rows.length;
  if (changed) await writeTable(table, next);
  return changed;
}
