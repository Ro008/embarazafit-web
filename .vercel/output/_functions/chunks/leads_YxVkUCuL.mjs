const COMMISSION_RATE = 0.17;
const MOMENTO_LABELS = {
  "embarazo-primeras": "Estoy embarazada (primeras semanas)",
  "embarazo-segundo-tercer": "Estoy embarazada (segundo/tercer trimestre)",
  posparto: "Estoy en pleno posparto",
  "busqueda-embarazo": "Estoy buscando el embarazo / Salud hormonal"
};
function getMomentoLabel(value) {
  return MOMENTO_LABELS[value] ?? value;
}
function formatEuro(amount) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR"
  }).format(amount);
}
function commissionForAmount(amount) {
  return Math.round(amount * COMMISSION_RATE * 100) / 100;
}

export { COMMISSION_RATE as C, MOMENTO_LABELS as M, commissionForAmount as c, formatEuro as f, getMomentoLabel as g };
