import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import Client from '../models/client.model.js';

const router = Router();
router.use(authRequired);

router.post('/', async (req, res) => {
  const created = await Client.create(req.body);
  res.status(201).json(created);
});

router.get('/', async (_req, res) => {
  const list = await Client.find().sort({ createdAt: -1 });
  res.json(list);
});

router.get('/:id', async (req, res) => {
  const item = await Client.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

router.put('/:id', async (req, res) => {
  const updated = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await Client.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export default router;