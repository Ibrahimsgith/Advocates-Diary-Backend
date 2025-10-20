import { Router } from 'express';
import Client from '../models/client.model.js';

const router = Router();

/**
 * TEMP: Public (no auth). When you add login, re-enable:
 *   import { authRequired } from '../middleware/auth.js';
 *   router.use(authRequired);
 */

// Create
router.post('/', async (req, res, next) => {
  try {
    const created = await Client.create(req.body);
    res.status(201).json(created);
  } catch (err) { next(err); }
});

// List
router.get('/', async (_req, res, next) => {
  try {
    const list = await Client.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { next(err); }
});

// Get one
router.get('/:id', async (req, res, next) => {
  try {
    const item = await Client.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
});

// Update
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { next(err); }
});

// Delete
router.delete('/:id', async (req, res, next) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
