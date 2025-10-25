import express from "express";

const router = express.Router();

/**
 * POST /api/analisis/sostenibilidad
 * Calcula un puntaje global basado en impacto ambiental, salud y accesibilidad.
 */
router.post("/sostenibilidad", async (req, res) => {
  try {
    const { producto } = req.body;

    if (!producto) {
      return res.status(400).json({ error: "Falta el campo 'producto' en el cuerpo del request" });
    }

    const {
      nombre,
      energia_kcal_100g = 0,
      grasas_100g = 0,
      azucares_100g = 0,
      proteinas_100g = 0,
    } = producto;

    // --- 1. Impacto ambiental estimado (menor es mejor)
    // Simplificado: más calorías o grasa => mayor impacto
    const impactoAmbiental =
      Math.min(100, (energia_kcal_100g * 0.05 + grasas_100g * 2)).toFixed(2);

    // --- 2. Impacto económico (más proteína = más nutritivo = mejor valor)
    const impactoEconomico = Math.min(100, (proteinas_100g * 5 + 30)).toFixed(2);

    // --- 3. Salud nutricional (más azúcar o grasa => menos saludable)
    const salud =
      Math.max(0, 100 - (azucares_100g * 1.5 + grasas_100g * 1.2)).toFixed(2);

    // --- 4. Puntaje global (ponderado)
    const puntajeGlobal = (
      (100 - impactoAmbiental * 0.4) +
      impactoEconomico * 0.3 +
      salud * 0.3
    ).toFixed(2);

    res.json({
      producto: nombre,
      sostenibilidad: {
        impacto_ambiental: Number(impactoAmbiental),
        impacto_economico: Number(impactoEconomico),
        salud: Number(salud),
        puntaje_global: Number(puntajeGlobal),
      },
    });
  } catch (error) {
    console.error("Error al calcular sostenibilidad:", error.message);
    res.status(500).json({ error: "Error al calcular sostenibilidad" });
  }
});

/**
 * POST /api/analisis/mochila
 * Optimiza una lista de compras usando algoritmo de mochila multi-objetivo.
 */
router.post("/mochila", async (req, res) => {
  try {
    const { productos, presupuesto } = req.body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: "Debe incluir una lista de productos válida" });
    }

    if (!presupuesto || presupuesto <= 0) {
      return res.status(400).json({ error: "Debe incluir un presupuesto mayor a 0" });
    }

    // --- Convertimos productos al formato esperado
    const items = productos.map((p) => ({
      nombre: p.nombre,
      precio: p.precio || 1000, // valor estimado si no viene
      proteinas: p.proteinas_100g || 0,
      sostenibilidad: p.sostenibilidad?.puntaje_global || 50,
    }));

    const n = items.length;
    const W = presupuesto;

    // --- Programación dinámica básica de mochila
    const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

    for (let i = 1; i <= n; i++) {
      const { precio, proteinas, sostenibilidad } = items[i - 1];
      const valor = proteinas * 2 + sostenibilidad; // peso combinado

      for (let w = 0; w <= W; w++) {
        if (precio <= w) {
          dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - precio] + valor);
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    // --- Recuperar los productos seleccionados
    let resPresupuesto = W;
    const seleccionados = [];

    for (let i = n; i > 0 && resPresupuesto > 0; i--) {
      if (dp[i][resPresupuesto] !== dp[i - 1][resPresupuesto]) {
        seleccionados.push(items[i - 1]);
        resPresupuesto -= items[i - 1].precio;
      }
    }

    const total = seleccionados.reduce(
      (acc, p) => ({
        precio: acc.precio + p.precio,
        proteinas: acc.proteinas + p.proteinas,
        sostenibilidad: acc.sostenibilidad + p.sostenibilidad,
      }),
      { precio: 0, proteinas: 0, sostenibilidad: 0 }
    );

    res.json({
      presupuesto_usado: total.precio,
      productos_seleccionados: seleccionados.reverse(),
      totales: total,
    });
  } catch (error) {
    console.error("Error en optimización de mochila:", error.message);
    res.status(500).json({ error: "Error al ejecutar el algoritmo de mochila" });
  }
});

/**
 * POST /api/analisis/sustitucion
 * Sugiere productos alternativos más sostenibles o saludables.
 */
router.post("/sustitucion", async (req, res) => {
  try {
    const { producto, alternativas } = req.body;

    if (!producto || !alternativas || !Array.isArray(alternativas)) {
      return res.status(400).json({
        error: "Debe incluir el producto base y una lista de alternativas",
      });
    }

    const {
      nombre,
      categoria = "",
      sostenibilidad: baseSos = {},
      azucares_100g = 0,
      grasas_100g = 0,
    } = producto;

    const puntajeBase = baseSos?.puntaje_global || 50;

    // --- Filtrar productos similares (misma categoría o nombre relacionado)
    const similares = alternativas.filter(
      (p) =>
        p.nombre.toLowerCase().includes(nombre.toLowerCase().split(" ")[0]) ||
        p.categoria === categoria
    );

    if (similares.length === 0) {
      return res.json({
        mensaje: `No se encontraron alternativas similares a ${nombre}.`,
      });
    }

    // --- Calcular un score compuesto para cada alternativa
    const recomendadas = similares
      .map((p) => {
        const sos = p.sostenibilidad?.puntaje_global || 50;
        const penalizacionAzucar = (p.azucares_100g || 0) * 1.2;
        const penalizacionGrasa = (p.grasas_100g || 0) * 0.8;
        const score = sos - penalizacionAzucar - penalizacionGrasa;

        return {
          nombre: p.nombre,
          marca: p.marca || "Desconocido",
          categoria: p.categoria || "Sin categoría",
          puntaje_sostenibilidad: sos,
          score_compuesto: Number(score.toFixed(2)),
          imagen: p.imagen || null,
        };
      })
      // --- Ordenar por score compuesto descendente
      .sort((a, b) => b.score_compuesto - a.score_compuesto)
      // --- Mostrar solo las 3 mejores opciones
      .slice(0, 3);

    // --- Comparación directa con el producto base
    res.json({
      producto_original: {
        nombre,
        categoria,
        azucares_100g,
        grasas_100g,
        puntaje_global: puntajeBase,
      },
      sustitutos_recomendados: recomendadas,
    });
  } catch (error) {
    console.error("Error en sustitución inteligente:", error.message);
    res.status(500).json({ error: "Error al generar sustituciones" });
  }
});


export default router;
