import { Router } from 'express';
import Case from '../models/case.model.js';

const router = Router();

/** Utility: turn "" into undefined; strip unknown keys */
function cleanCaseInput(body = {}) {
  const allowed = [
    'title',
    'caseNumber',
    'court',
    'status',
    'client',
    'advocate',
    'notes'
  ];
  const cleaned = {};
  for (const k of allowed) {
    if (body[k] === '') continue;                 // drop empty string
    if (body[k] === null) continue;
    if (typeof body[k] === 'string' && body[k].trim() === '') continue;
    if (body[k] !== undefined) cleaned[k] = body[k];
  }
  return cleaned;
}

// Create
router.post('/', async (req, res, next) => {
  try {
    const data = cleanCaseInput(req.body);

    // Basic validation (so we return 400 instead of 500)
    if (!data.title || typeof data.title !== 'string') {
      return res.status(400).json({ error: 'Title is required' });
    }

    // If client/advocate are empty or invalid ObjectIds, drop them
    for (const refField of ['client', 'advocate']) {
      if (data[refField] && typeof data[refField] !== 'string') delete data[refField];
      if (data[refField] && !/^[0-9a-fA-F]{24}$/.test(data[refField])) delete data[refField];
    }

    const created = await Case.create(data);
    return res.status(201).json(created);
  } catch (err) {
    // Handle Mongoose validation/cast errors as 400
    if (err?.name === 'ValidationError' || err?.name === 'CastError') {
      return res.status(400).json({ error: err.message });
    }
    return next(err);
  }
});

// List
router.get('/', async (_req, res, next) => {
  try {
    const list = await Case.find().populate('client').sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { next(err); }
});

// Get one
router.get('/:id', async (req, res, next) => {
  try {
    const item = await Case.findById(req.params.id).populate('client');
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    if (err?.name === 'CastError') return res.status(404).json({ error: 'Not found' });
    next(err);
  }
});

// Update
router.put('/:id', async (req, res, next) => {
  try {
    const data = cleanCaseInput(req.body);
    const updated = await Case.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    if (err?.name === 'ValidationError' || err?.name === 'CastError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// Delete
router.delete('/:id', async (req, res, next) => {
  try {
    const out = await Case.findByIdAndDelete(req.params.id);
    if (!out) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (err) {
    if (err?.name === 'CastError') return res.status(404).json({ error: 'Not found' });
    next(err);
  }
});

export default router;
