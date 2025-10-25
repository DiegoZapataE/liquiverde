const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const api = {
  async buscarProducto(nombre: string) {
    const res = await fetch(`${API_URL}/externos/openfood?nombre=${nombre}`);
    return res.json();
  },

  async buscarPorCodigo(codigo: string) {
    const res = await fetch(`${API_URL}/externos/openfood/barcode/${codigo}`);
    return res.json();
  },

  async analizarSostenibilidad(producto: any) {
    const res = await fetch(`${API_URL}/analisis/sostenibilidad`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ producto }),
    });
    return res.json();
  },

  async optimizarMochila(productos: any[], presupuesto: number) {
    const res = await fetch(`${API_URL}/analisis/mochila`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productos, presupuesto }),
    });
    return res.json();
  },

  async sugerirSustitutos(producto: any, alternativas: any[]) {
    const res = await fetch(`${API_URL}/analisis/sustitucion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ producto, alternativas }),
    });
    return res.json();
  },
};
