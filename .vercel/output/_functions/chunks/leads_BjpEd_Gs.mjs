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
function formatShortDate(iso) {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}
function commissionForAmount(amount) {
  return Math.round(amount * COMMISSION_RATE * 100) / 100;
}
const MAX_CUOTAS = 2;
function canLeadAcceptMorePayments(pagos) {
  if (pagos.some((p) => p.tipo === "completo")) return false;
  if (pagos.filter((p) => p.tipo === "fraccionado").length >= MAX_CUOTAS) {
    return false;
  }
  return true;
}
function validateNewPago(existingPagos, newPago) {
  if (existingPagos.some((p) => p.mes === newPago.mes)) {
    return {
      ok: false,
      error: "Ya hay un cobro registrado para esta clienta en este mes."
    };
  }
  if (existingPagos.some((p) => p.tipo === "completo")) {
    return {
      ok: false,
      error: "Esta clienta ya tiene un pago único registrado."
    };
  }
  const cuotas = existingPagos.filter((p) => p.tipo === "fraccionado");
  if (cuotas.length >= MAX_CUOTAS) {
    return {
      ok: false,
      error: "Esta clienta ya tiene las 2 cuotas registradas."
    };
  }
  if (newPago.tipo === "completo" && cuotas.length > 0) {
    return {
      ok: false,
      error: "No puedes registrar pago único: ya hay cuotas registradas para esta clienta."
    };
  }
  return { ok: true };
}

export { COMMISSION_RATE as C, MOMENTO_LABELS as M, canLeadAcceptMorePayments as a, formatShortDate as b, commissionForAmount as c, formatEuro as f, getMomentoLabel as g, validateNewPago as v };
