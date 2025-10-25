import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import Producto from "./models/Producto.js";

dotenv.config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    const data = JSON.parse(fs.readFileSync("./data/productos.json", "utf-8"));

    await Producto.deleteMany({});
    console.log("Colección limpiada");

    await Producto.insertMany(data);
    console.log(`Se insertaron ${data.length} productos en MongoDB`);

    mongoose.connection.close();
    console.log("Carga completada y conexión cerrada");
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    mongoose.connection.close();
  }
}

seedDatabase();
