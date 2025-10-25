import { useState } from "react";
import { api } from "../api/apiClient";

export default function Sostenibilidad() {
  const [producto, setProducto] = useState({
    nombre: "",
    energia_kcal_100g: 0,
    grasas_100g: 0,
    azucares_100g: 0,
    proteinas_100g: 0,
  });
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: parseFloat(value) || 0 });
  };

  const handleAnalizar = async () => {
    if (!producto.nombre.trim()) return;
    setLoading(true);
    const data = await api.analizarSostenibilidad(producto);
    setResultado(data.sostenibilidad);
    setLoading(false);
  };

  // Función para definir color del puntaje
  const scoreColor = (puntaje: number) => {
    if (puntaje >= 80) return "text-green-500";
    if (puntaje >= 50) return "text-yellow-400";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center pt-28 px-6">
      <h1 className="text-3xl font-bold text-green-400 mb-8">
        Análisis de Sostenibilidad
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-3xl">
        <input
          name="nombre"
          placeholder="Nombre del producto"
          value={producto.nombre}
          onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
          className="col-span-2 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
        />
        <input
          name="energia_kcal_100g"
          type="number"
          placeholder="Energía (kcal/100g)"
          onChange={handleChange}
          className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
        />
        <input
          name="grasas_100g"
          type="number"
          placeholder="Grasas (g/100g)"
          onChange={handleChange}
          className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
        />
        <input
          name="azucares_100g"
          type="number"
          placeholder="Azúcares (g/100g)"
          onChange={handleChange}
          className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
        />
        <input
          name="proteinas_100g"
          type="number"
          placeholder="Proteínas (g/100g)"
          onChange={handleChange}
          className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
        />
      </div>

      <button
        onClick={handleAnalizar}
        disabled={loading}
        className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
      >
        {loading ? "Analizando..." : "Analizar"}
      </button>

      {resultado && (
        <div className="mt-8 bg-green-50/10 border border-green-400/30 rounded-xl p-6 w-full max-w-3xl shadow-lg">
          <h2 className="text-2xl font-bold text-green-400 mb-4">
            Resultados para <span className="text-white">{producto.nombre}</span>:
          </h2>

          <div className="grid grid-cols-2 gap-3 text-lg">
            <p><b className="text-green-300">Impacto Ambiental:</b> {resultado.impacto_ambiental}</p>
            <p><b className="text-green-300">Impacto Económico:</b> {resultado.impacto_economico}</p>
            <p><b className="text-green-300">Salud:</b> {resultado.salud}</p>
            <p>
              <b className="text-green-300">Puntaje Global:</b>{" "}
              <span className={`${scoreColor(resultado.puntaje_global)} font-bold`}>
                {resultado.puntaje_global}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
