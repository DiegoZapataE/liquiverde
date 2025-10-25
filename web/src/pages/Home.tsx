export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center">
      {/* Main content */}
      <main className="max-w-5xl mt-16 px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-white">
          Sistema de <span className="text-green-400">Análisis y Optimización</span> de Compras
        </h1>
        <p className="text-lg text-gray-300 mb-12 leading-relaxed">
          Bienvenido al panel central de <span className="font-semibold text-green-300">Liquiverde</span>. 
          Aquí podrás analizar productos, medir sostenibilidad, optimizar tu lista de compras 
          y encontrar sustitutos más saludables o sostenibles.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-green-600/40 transition">
            <h2 className="text-2xl font-bold text-green-400 mb-2">🔍 Búsqueda de Productos</h2>
            <p className="text-gray-300 mb-4">
              Busca productos globales en Open Food Facts y obtén su información nutricional.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-green-600/40 transition">
            <h2 className="text-2xl font-bold text-green-400 mb-2">🌱 Análisis de Sostenibilidad</h2>
            <p className="text-gray-300 mb-4">
              Calcula el impacto ambiental, económico y nutricional de un producto.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-green-600/40 transition">
            <h2 className="text-2xl font-bold text-green-400 mb-2">🧳 Optimización de Compras</h2>
            <p className="text-gray-300 mb-4">
              Usa el algoritmo de mochila para crear la lista más eficiente dentro de tu presupuesto.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-green-600/40 transition">
            <h2 className="text-2xl font-bold text-green-400 mb-2">♻️ Sustitución Inteligente</h2>
            <p className="text-gray-300 mb-4">
              Encuentra alternativas más sostenibles o con mejor valor nutricional.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
