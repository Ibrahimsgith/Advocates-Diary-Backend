import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import Case from '../models/case.model.js';

const router = Router();

router.use(authRequired);

// Create
router.post('/', async (req, res) => {
  const created = await Case.create(req.body);
  res.status(201).json(created);
});

// Read (list)
router.get('/', async (_req, res) => {
  const list = await Case.find().populate('client').sort({ createdAt: -1 });
  res.json(list);
});

// Read one
router.get('/:id', async (req, res) => {
  const item = await Case.findById(req.params.id).populate('client');
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// Update
router.put('/:id', async (req, res) => {
  const updated = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete
router.delete('/:id', async (req, res) => {
  await Case.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export default router;