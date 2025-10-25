export function calcularPuntaje(producto) {
  const { precio, co2, etico } = producto;
  const eco = 100 - co2 * 10;
  const social = etico ? 100 : 60;
  const economico = Math.max(0, 100 - precio * 2);
  return Math.round(eco * 0.4 + social * 0.3 + economico * 0.3);
}