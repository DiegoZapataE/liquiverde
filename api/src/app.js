import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './utils/db.js';
import productosRoutes from './routes/productos.routes.js';
import listasRoutes from './routes/listas.routes.js';
import externosRouter from "./routes/externos.js";
import analisisRoutes from "./routes/analisis.js";
import productosRouter from "./routes/productos.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/productos', productosRoutes);
app.use('/api/listas', listasRoutes);
app.use("/api/externos", externosRouter);
app.use("/api/analisis", analisisRoutes);
app.use("/api/productos", productosRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API corriendo en puerto ${PORT}`));