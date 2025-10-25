import { useState } from "react";
import { api } from "../api/apiClient";

export default function Mochila() {
  const [productos, setProductos] = useState<any[]>([]);
  const [nuevo, setNuevo] = useState({
    nombre: "",
    precio: "",
    proteinas_100g: "",
    sostenibilidad: { puntaje_global: "50" },
  });
  const [presupuesto, setPresupuesto] = useState<string>("");
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const soloNumeros = (valor: string) => /^(\d+(\.\d*)?|\.\d*)?$/.test(valor);

  const agregarProducto = () => {
    if (!nuevo.nombre || parseFloat(nuevo.precio) <= 0) return;
    setProductos([
      ...productos,
      {
        nombre: nuevo.nombre.trim(),
        precio: parseFloat(nuevo.precio) || 0,
        proteinas_100g: parseFloat(nuevo.proteinas_100g) || 0,
        sostenibilidad: {
          puntaje_global: parseFloat(nuevo.sostenibilidad.puntaje_global) || 0,
        },
      },
    ]);
    setNuevo({
      nombre: "",
      precio: "",
      proteinas_100g: "",
      sostenibilidad: { puntaje_global: "50" },
    });
  };

  const optimizar = async () => {
    setLoading(true);
    const data = await api.optimizarMochila(
      productos,
      parseFloat(presupuesto) || 0
    );
    setResultado(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center pt-28 px-6">
      <h1 className="text-3xl font-bold text-green-400 mb-10">
        Optimización de Lista de Compras
      </h1>

      {/* FORMULARIO DE ENTRADA */}
      {!resultado && (
        <>
          <div className="w-full max-w-5xl mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-semibold text-green-300 mb-1">
              <label>Nombre del producto</label>
              <label>Precio ($)</label>
              <label>Proteínas (g/100g)</label>
              <label>Sostenibilidad (%)</label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <input
                value={nuevo.nombre}
                onChange={(e) =>
                  setNuevo({ ...nuevo, nombre: e.target.value })
                }
                placeholder="Ej: Yogurt natural"
                className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
              />
              <input
                type="text"
                inputMode="decimal"
                value={nuevo.precio}
                onChange={(e) => {
                  const val = e.target.value;
                  if (soloNumeros(val)) setNuevo({ ...nuevo, precio: val });
                }}
                placeholder="Ej: 1200"
                className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
              />
              <input
                type="text"
                inputMode="decimal"
                value={nuevo.proteinas_100g}
                onChange={(e) => {
                  const val = e.target.value;
                  if (soloNumeros(val))
                    setNuevo({ ...nuevo, proteinas_100g: val });
                }}
                placeholder="Ej: 10"
                className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
              />
              <input
                type="text"
                inputMode="decimal"
                value={nuevo.sostenibilidad.puntaje_global}
                onChange={(e) => {
                  const val = e.target.value;
                  if (soloNumeros(val))
                    setNuevo({
                      ...nuevo,
                      sostenibilidad: { puntaje_global: val },
                    });
                }}
                placeholder="Ej: 75.2"
                className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <button
            onClick={agregarProducto}
            className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-semibold mb-8 transition"
          >
            Agregar producto
          </button>

          {/* TABLA DE PRODUCTOS */}
          {productos.length > 0 && (
            <div className="w-full max-w-5xl bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-green-300 mb-4">
                Productos agregados
              </h2>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-green-400 border-b border-gray-700">
                    <th className="py-2">Nombre</th>
                    <th>Precio</th>
                    <th>Proteínas</th>
                    <th>Sostenibilidad</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p, i) => (
                    <tr key={i} className="border-b border-gray-700">
                      <td className="py-2">{p.nombre}</td>
                      <td>${p.precio}</td>
                      <td>{p.proteinas_100g} g</td>
                      <td>{p.sostenibilidad.puntaje_global}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PRESUPUESTO */}
          {productos.length > 0 && (
            <div className="flex gap-3 items-center mb-8">
              <input
                type="text"
                inputMode="decimal"
                value={presupuesto}
                onChange={(e) => {
                  const val = e.target.value;
                  if (soloNumeros(val)) setPresupuesto(val);
                }}
                placeholder="Presupuesto total ($)"
                className="p-3 w-52 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={optimizar}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
              >
                {loading ? "Optimizando..." : "Optimizar"}
              </button>
            </div>
          )}
        </>
      )}

      {/* RESULTADOS */}
      {resultado && (
        <div className="w-full max-w-5xl bg-green-900/20 border border-green-500/50 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-green-400 mb-4">
            Resultado de la Optimización
          </h2>

          <div className="text-gray-200 mb-4 space-y-1">
            <p>
              <b>Presupuesto total:</b> ${presupuesto || 0}
            </p>
            <p>
              <b>Presupuesto usado:</b> ${resultado.presupuesto_usado}
            </p>
            <p>
              <b>Valor total:</b> {resultado.valor_total}
            </p>
            <p>
              <b>Productos seleccionados:</b> {resultado.productos_seleccionados.length}{" "}
              de {productos.length}
            </p>
          </div>

          <div className="bg-gray-800/70 rounded-lg p-4">
            <h3 className="text-green-300 font-semibold mb-2">
              Detalle de selección:
            </h3>
            <ul className="list-disc list-inside text-gray-100 space-y-1">
              {resultado.productos_seleccionados?.map((p: any, i: number) => (
                <li key={i}>
                  <span className="text-green-400 font-medium">{p.nombre}</span> — $
                  {p.precio} ({p.proteinas}g proteínas, score {p.sostenibilidad})
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setResultado(null);
                setPresupuesto("");
              }}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition"
            >
              Nueva optimización
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
