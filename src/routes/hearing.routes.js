import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import Hearing from '../models/hearing.model.js';

const router = Router();
router.use(authRequired);

router.post('/', async (req, res) => {
  const created = await Hearing.create(req.body);
  res.status(201).json(created);
});

router.get('/', async (_req, res) => {
  const list = await Hearing.find().sort({ date: -1 });
  res.json(list);
});

router.get('/:id', async (req, res) => {
  const item = await Hearing.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

router.put('/:id', async (req, res) => {
  const updated = await Hearing.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await Hearing.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export default router;