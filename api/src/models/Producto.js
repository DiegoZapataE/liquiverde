import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  marca: { type: String, default: "Desconocida" },
  categoria: { type: String, default: "N/D" },
  energia_kcal_100g: { type: Number, default: 0 },
  grasas_100g: { type: Number, default: 0 },
  azucares_100g: { type: Number, default: 0 },
  proteinas_100g: { type: Number, default: 0 },
  precio: { type: Number, default: 0 },
  imagen: { type: String, default: "" },
  sostenibilidad: {
    puntaje_global: { type: Number, default: 0 },
    impacto_ambiental: { type: Number, default: 0 },
    impacto_economico: { type: Number, default: 0 },
    salud: { type: String, default: "Desconocida" },
  },
  codigo_barras: { type: String, default: "" },
});

export default mongoose.model("Producto", productoSchema);
