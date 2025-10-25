import { useState } from "react";

// 🧩 Tipo de producto
type Producto = {
  nombre: string;
  energia_kcal_100g: number;
  grasas_100g: number;
  azucares_100g: number;
  proteinas_100g: number;
  sostenibilidad: { puntaje_global: number };
};

export default function Sustitucion() {
  const [productoBase, setProductoBase] = useState<Producto>({
    nombre: "",
    energia_kcal_100g: 0,
    grasas_100g: 0,
    azucares_100g: 0,
    proteinas_100g: 0,
    sostenibilidad: { puntaje_global: 0 },
  });

  const [alternativas, setAlternativas] = useState<Producto[]>([]);
  const [nuevaAlt, setNuevaAlt] = useState<Producto>({
    nombre: "",
    energia_kcal_100g: 0,
    grasas_100g: 0,
    azucares_100g: 0,
    proteinas_100g: 0,
    sostenibilidad: { puntaje_global: 0 },
  });

  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Permitir números con punto o coma
  const parseNumero = (valor: string) =>
    parseFloat(valor.replace(",", ".")) || 0;

  const handleBaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductoBase({
      ...productoBase,
      [name]: parseNumero(value),
    });
  };

  const handleNuevaAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevaAlt({
      ...nuevaAlt,
      [name]: parseNumero(value),
    });
  };

  const agregarAlternativa = () => {
    if (!nuevaAlt.nombre.trim()) return;
    setAlternativas([...alternativas, nuevaAlt]);
    setNuevaAlt({
      nombre: "",
      energia_kcal_100g: 0,
      grasas_100g: 0,
      azucares_100g: 0,
      proteinas_100g: 0,
      sostenibilidad: { puntaje_global: 0 },
    });
  };

  const compararAlternativas = () => {
  setLoading(true);

  const baseScore =
    productoBase.proteinas_100g * 0.4 -
    productoBase.azucares_100g * 0.3 +
    productoBase.sostenibilidad.puntaje_global * 0.3;

  let mejorAlt: Producto | null = null;
  let mejorScore = baseScore;

  for (const alt of alternativas) {
    const score =
      alt.proteinas_100g * 0.4 -
      alt.azucares_100g * 0.3 +
      alt.sostenibilidad.puntaje_global * 0.3;

    if (score > mejorScore) {
      mejorScore = score;
      mejorAlt = alt;
    }
  }

  let motivo = "";
  if (mejorAlt !== null) {
    // 👇 Forzar a TypeScript a reconocer que mejorAlt es de tipo Producto
    const alt: Producto = mejorAlt;

    const diffProt = alt.proteinas_100g - productoBase.proteinas_100g;
    const diffAzuc = productoBase.azucares_100g - alt.azucares_100g;
    const diffSos =
      alt.sostenibilidad.puntaje_global -
      productoBase.sostenibilidad.puntaje_global;

    motivo = `Posee ${
      diffProt > 0 ? `+${diffProt}` : diffProt
    }g más de proteínas, ${
      diffAzuc > 0 ? `-${diffAzuc}` : diffAzuc
    }g menos de azúcares y un puntaje de sostenibilidad ${
      diffSos > 0 ? `+${diffSos}` : diffSos
    }% superior.`;
  } else {
    motivo = "No se encontró una alternativa claramente mejor.";
  }

  setResultado({
    producto_base: productoBase.nombre || "Desconocido",
    mejor_alternativa: mejorAlt ? mejorAlt.nombre : "Ninguna",
    motivo,
  });

  setLoading(false);
};

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center pt-28 px-6">
      <h1 className="text-3xl font-bold text-green-400 mb-10">
        Sustitución Inteligente de Productos
      </h1>

      {/* 🧱 Producto base */}
      <div className="w-full max-w-5xl mb-6 bg-green-50/10 border border-green-400/40 rounded-xl p-6">
        <h2 className="text-green-300 font-semibold mb-3">Producto base</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <input
            placeholder="Nombre"
            value={productoBase.nombre}
            onChange={(e) =>
              setProductoBase({ ...productoBase, nombre: e.target.value })
            }
            className="p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
          />
          <input
            type="text"
            name="azucares_100g"
            placeholder="Azúcares (g/100g)"
            onChange={handleBaseChange}
            className="p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
          />
          <input
            type="text"
            name="proteinas_100g"
            placeholder="Proteínas (g/100g)"
            onChange={handleBaseChange}
            className="p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
          />
          <input
            type="text"
            placeholder="Sostenibilidad (%)"
            onChange={(e) =>
              setProductoBase({
                ...productoBase,
                sostenibilidad: {
                  puntaje_global: parseNumero(e.target.value),
                },
              })
            }
            className="p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
          />
        </div>
      </div>

      {/* 🔁 Alternativas */}
      <div className="w-full max-w-5xl mb-6 bg-gray-800/40 rounded-xl p-6 border border-gray-600">
        <h2 className="text-gray-200 font-semibold mb-3">Alternativas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
          <input
            placeholder="Nombre"
            value={nuevaAlt.nombre}
            onChange={(e) => setNuevaAlt({ ...nuevaAlt, nombre: e.target.value })}
            className="p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            name="proteinas_100g"
            placeholder="Proteínas (g/100g)"
            onChange={handleNuevaAltChange}
            className="p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Sostenibilidad (%)"
            onChange={(e) =>
              setNuevaAlt({
                ...nuevaAlt,
                sostenibilidad: {
                  puntaje_global: parseNumero(e.target.value),
                },
              })
            }
            className="p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={agregarAlternativa}
          className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded font-semibold"
        >
          Agregar alternativa
        </button>

        {alternativas.length > 0 && (
          <ul className="mt-4 list-disc pl-6 text-sm text-gray-300">
            {alternativas.map((a, i) => (
              <li key={i}>
                {a.nombre} — {a.proteinas_100g}g proteínas, Score{" "}
                {a.sostenibilidad.puntaje_global}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ⚙️ Botón de comparación */}
      <button
        onClick={compararAlternativas}
        className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-semibold transition"
        disabled={loading}
      >
        {loading ? "Comparando..." : "Comparar alternativas"}
      </button>

      {/* 📊 Resultado */}
      {resultado && (
        <div className="w-full max-w-5xl bg-green-900/20 border border-green-400/40 rounded-xl p-6 mt-8">
          <h2 className="text-xl font-semibold text-green-300 mb-3">
            Resultado:
          </h2>
          <p>
            <b>Producto base:</b> {resultado.producto_base}
          </p>
          <p>
            <b>Alternativa recomendada:</b> {resultado.mejor_alternativa}
          </p>
          <p>
            <b>Motivo:</b> {resultado.motivo}
          </p>
        </div>
      )}
    </div>
  );
}
