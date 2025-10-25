import { Router } from 'express';
import Producto from '../models/Producto.js';
import { calcularPuntaje } from '../algorithms/sustainability.js';
const router = Router();
router.get('/search', async (req, res) => {
  const { q } = req.query;
  const results = await Producto.find({ nombre: new RegExp(q, 'i') });
  res.json(results);
});
router.post('/analyze', async (req, res) => {
  const producto = req.body;
  const score = calcularPuntaje(producto);
  res.json({ ...producto, score });
});
export default router;