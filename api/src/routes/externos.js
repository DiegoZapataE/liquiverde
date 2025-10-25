import express from "express";
import fetch from "node-fetch";

const router = express.Router();

/**
 * 🔹 Función global para calcular sostenibilidad de un producto
 */
const calcularSostenibilidad = (p) => {
  const energia = p.nutriments?.["energy-kcal_100g"] ?? 0;
  const grasa = p.nutriments?.["fat_100g"] ?? 0;
  const azucar = p.nutriments?.["sugars_100g"] ?? 0;
  const proteina = p.nutriments?.["proteins_100g"] ?? 0;

  const impactoAmbiental = Math.min(100, (energia * 0.05 + grasa * 2)).toFixed(2);
  const impactoEconomico = Math.min(100, (proteina * 5 + 30)).toFixed(2);
  const salud = Math.max(0, 100 - (azucar * 1.5 + grasa * 1.2)).toFixed(2);

  const puntajeGlobal = (
    (100 - impactoAmbiental * 0.4) +
    impactoEconomico * 0.3 +
    salud * 0.3
  ).toFixed(2);

  return {
    impacto_ambiental: Number(impactoAmbiental),
    impacto_economico: Number(impactoEconomico),
    salud: Number(salud),
    puntaje_global: Number(puntajeGlobal),
  };
};

/**
 * GET /api/externos/openfood?nombre=arroz
 * Busca productos globalmente en Open Food Facts.
 */
router.get("/openfood", async (req, res) => {
  try {
    const { nombre } = req.query;
    if (!nombre) {
      return res.status(400).json({ error: "Falta el parámetro 'nombre'" });
    }

    const baseUrl = "https://world.openfoodfacts.org/api/v2/search";
    const fields =
      "fields=code,product_name,brands,categories_tags,_keywords,nutriments,image_url";
    const sort = "sort_by=unique_scans_n&page_size=50";

    const url = `${baseUrl}?search_terms=${encodeURIComponent(
      nombre
    )}&${fields}&${sort}`;

    console.log("🔎 Consultando Open Food Facts:", url);

    const response = await fetch(url, {
      headers: { "User-Agent": "LiquiverdeApp/1.0 (https://localhost)" },
    });

    if (!response.ok)
      throw new Error(`Error en Open Food Facts: ${response.status}`);

    const data = await response.json();

    const productos = (data.products || [])
      .filter((p) => {
        const term = nombre.toLowerCase();
        const nombreLower = (p.product_name || "").toLowerCase();
        const categorias = p.categories_tags?.join(",") || "";
        const keywords = p._keywords?.join(",") || "";
        return (
          nombreLower.includes(term) ||
          categorias.includes(term) ||
          keywords.includes(term)
        );
      })
      .map((p) => ({
        codigo_barras: p.code || null,
        nombre: p.product_name || "Desconocido",
        marca: p.brands || "Sin marca",
        categoria: p.categories_tags?.[0] || "Sin categoría",
        energia_kcal_100g: p.nutriments?.["energy-kcal_100g"] ?? null,
        grasas_100g: p.nutriments?.["fat_100g"] ?? null,
        azucares_100g: p.nutriments?.["sugars_100g"] ?? null,
        proteinas_100g: p.nutriments?.["proteins_100g"] ?? null,
        imagen: p.image_url || null,
        sostenibilidad: calcularSostenibilidad(p), // ✅ agregado
      }));

    res.json(
      productos.length
        ? productos
        : [
            {
              mensaje: `No se encontraron productos relacionados con '${nombre}'.`,
            },
          ]
    );
  } catch (error) {
    console.error("Error al consultar Open Food Facts:", error.message);
    res.status(500).json({ error: "Error al consultar Open Food Facts" });
  }
});

/**
 * GET /api/externos/openfood/barcode/:codigo
 * Consulta un producto específico por su código de barras.
 */
router.get("/openfood/barcode/:codigo", async (req, res) => {
  try {
    const { codigo } = req.params;
    if (!codigo) {
      return res.status(400).json({ error: "Falta el parámetro 'codigo'" });
    }

    const url = `https://world.openfoodfacts.org/api/v0/product/${codigo}.json`;
    console.log("📦 Consultando producto por código:", url);

    const response = await fetch(url, {
      headers: { "User-Agent": "LiquiverdeApp/1.0 (https://localhost)" },
    });

    if (!response.ok)
      throw new Error(`Error en Open Food Facts: ${response.status}`);

    const data = await response.json();

    if (data.status === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const p = data.product;
    const producto = {
      codigo_barras: p.code || codigo,
      nombre: p.product_name || "Desconocido",
      marca: p.brands || "Sin marca",
      categoria: p.categories_tags?.[0] || "Sin categoría",
      energia_kcal_100g: p.nutriments?.["energy-kcal_100g"] ?? null,
      grasas_100g: p.nutriments?.["fat_100g"] ?? null,
      azucares_100g: p.nutriments?.["sugars_100g"] ?? null,
      proteinas_100g: p.nutriments?.["proteins_100g"] ?? null,
      imagen: p.image_url || null,
      sostenibilidad: calcularSostenibilidad(p), // ✅ agregado
    };

    res.json(producto);
  } catch (error) {
    console.error("Error al consultar Open Food Facts (barcode):", error.message);
    res.status(500).json({ error: "Error al consultar Open Food Facts" });
  }
});

export default router;
