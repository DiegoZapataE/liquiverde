import { Router } from 'express';
import Producto from '../models/Producto.js';
import { optimizarLista } from '../algorithms/knapsack.js';
const router = Router();
router.post('/optimize', async (req, res) => {
  const { presupuesto } = req.body;
  const productos = await Producto.find();
  const resultado = optimizarLista(productos, presupuesto);
  res.json({ mejorValor: resultado });
});
export default router;