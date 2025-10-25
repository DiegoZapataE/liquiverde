import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Buscador from "./pages/Buscador";
import Sostenibilidad from "./pages/Sostenibilidad";
import Mochila from "./pages/Mochila";
import Sustitucion from "./pages/Sustitucion";

function App() {
  return (
    <BrowserRouter>
      {/* Header global, siempre visible */}
      <header className="fixed top-0 left-0 w-full bg-green-700/95 backdrop-blur-md shadow-md p-4 flex justify-center z-50">
  <nav className="flex gap-8 text-lg font-semibold text-white">
    <Link to="/" className="hover:text-green-300">Inicio</Link>
    <Link to="/buscador" className="hover:text-green-300">Buscador</Link>
    <Link to="/sostenibilidad" className="hover:text-green-300">Análisis</Link>
    <Link to="/mochila" className="hover:text-green-300">Optimización</Link>
    <Link to="/sustitucion" className="hover:text-green-300">Sustitución</Link>
  </nav>
</header>

      {/* Contenido dinámico, con margen superior para no taparse con el header */}
      <main className="pt-24 px-4 flex justify-center">
  <div className="w-full max-w-6xl">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/buscador" element={<Buscador />} />
      <Route path="/sostenibilidad" element={<Sostenibilidad />} />
      <Route path="/mochila" element={<Mochila />} />
      <Route path="/sustitucion" element={<Sustitucion />} />
    </Routes>
  </div>
</main>

    </BrowserRouter>
  );
}

export default App;
