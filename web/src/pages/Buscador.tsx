import { useState } from "react";
import { api } from "../api/apiClient";

export default function Buscador() {
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleBuscarNombre = async () => {
    if (!nombre.trim()) {
      alert("Por favor, ingresa un nombre para buscar.");
      return;
    }

    setLoading(true);
    setProductos([]);

    try {
      const data = await api.buscarProducto(nombre);

      if (
        !data ||
        data.length === 0 ||
        (Array.isArray(data) && data[0]?.mensaje)
      ) {
        alert("No se encontraron productos relacionados con ese nombre.");
        return;
      }

      setProductos(data);
    } catch (error) {
      alert("Error al buscar por nombre. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

    const handleBuscarLocales = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/productos");
      const data = await res.json();

      if (!data || data.length === 0) {
        alert("No se encontraron productos locales en la base de datos");
        setProductos([]);
        return;
      }

      setProductos(data);
    } catch (error) {
      console.error("Error al buscar productos locales:", error);
      alert("Error al conectar con la base de datos");
    } finally {
      setLoading(false);
    }
  };

  const handleBuscarCodigo = async () => {
    if (!codigo.trim()) {
      alert("Por favor, ingresa un código de barras válido.");
      return;
    }

    setLoading(true);
    setProductos([]);

    try {
      const data = await api.buscarPorCodigo(codigo);
      const result = Array.isArray(data) ? data : [data];

      if (
        !result ||
        result.length === 0 ||
        result[0]?.mensaje ||
        !result[0]?.nombre
      ) {
        alert("No se encontró ningún producto con ese código de barras.");
        return;
      }

      setProductos(result);
    } catch (error) {
      alert("Error al buscar por código. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center pt-28 px-6">
      <h1 className="text-3xl font-bold text-green-400 mb-6">
        Buscador de productos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mb-8">
        {/* Buscar por nombre */}
        <div className="flex gap-3">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Buscar por nombre (ej: Nutella)"
            className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
          />
          <button
            onClick={handleBuscarNombre}
            disabled={loading}
            className="bg-green-600 hover:bg-green-500 px-5 py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {/* Buscar por código de barras */}
        <div className="flex gap-3">
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Buscar por código de barras"
            className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleBuscarCodigo}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Buscando..." : "Por código"}
          </button>
          <button
            onClick={handleBuscarLocales}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 px-5 py-3 rounded-lg font-semibold transition disabled:opacity-50 w-full"
          >
            {loading ? "Cargando..." : "Ver productos locales"}
          </button>
        </div>
      </div>

      {/* Mensajes dinámicos */}
      {mensaje && (
        <div className="mb-6 bg-gray-800 border border-gray-700 text-yellow-300 px-4 py-3 rounded-lg text-center w-full max-w-3xl">
          {mensaje}
        </div>
      )}

      {/* Resultados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {productos.map((p, i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-green-600/40 transition flex flex-col"
          >
            <img
              src={p.imagen || "https://via.placeholder.com/150"}
              alt={p.nombre}
              className="rounded-lg w-full h-48 object-cover mb-3"
            />
            <h2 className="text-xl font-bold text-green-300 mb-1">
              {p.nombre}
            </h2>
            <p className="text-gray-400 text-sm mb-2">
              {p.marca || "Marca desconocida"}
            </p>

            <div className="text-sm space-y-1 flex-1">
              <p><b>Energía:</b> {p.energia_kcal_100g ?? "?"} kcal</p>
              <p><b>Grasas:</b> {p.grasas_100g ?? "?"} g</p>
              <p><b>Azúcares:</b> {p.azucares_100g ?? "?"} g</p>
              <p><b>Proteínas:</b> {p.proteinas_100g ?? "?"} g</p>
              <p><b>Categoría:</b> {p.categoria?.replace("en:", "") ?? "N/D"}</p>
            </div>

            {/* Bloque sostenibilidad */}
            {p.sostenibilidad && (
              <div className="mt-4 bg-gray-700/40 rounded-lg p-3 text-sm space-y-1 border border-gray-600">
                <p className="text-green-400 font-semibold text-base">
                  Sostenibilidad
                </p>
                <p>
                  <b>Impacto ambiental:</b>{" "}
                  {p.sostenibilidad.impacto_ambiental ?? "?"}%
                </p>
                <p>
                  <b>Impacto económico:</b>{" "}
                  {p.sostenibilidad.impacto_economico ?? "?"}%
                </p>
                <p>
                  <b>Puntaje global:</b>{" "}
                  {p.sostenibilidad.puntaje_global ?? "?"}%
                </p>
                <p>
                  <b>Salud:</b> {p.sostenibilidad.salud ?? "?"}
                </p>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-2 text-right">
              Código: {p.codigo_barras}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
