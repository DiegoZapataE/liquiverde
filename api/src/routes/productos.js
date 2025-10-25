// src/routes/productos.js
import express from "express";
import Producto from "../models/Producto.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

router.get("/buscar", async (req, res) => {
  try {
    const { nombre } = req.query;
    if (!nombre) return res.status(400).json({ error: "Falta el parámetro 'nombre'" });

    const productos = await Producto.find({
      nombre: { $regex: nombre, $options: "i" },
    });

    if (productos.length === 0)
      return res.status(404).json({ mensaje: "No se encontraron productos relacionados" });

    res.json(productos);
  } catch (error) {
    console.error("Error en búsqueda:", error);
    res.status(500).json({ error: "Error al buscar productos" });
  }
});

export default router;
