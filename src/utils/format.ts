export function formatCLP(value: number) {
  try {
    const n = Math.round(value || 0);
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);
  } catch (e) {
    // fallback
    const n = Math.round(value || 0);
    return `CLP ${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  }
}

// Format a number/string for input display (no currency symbol, thousands separated)
export function formatNumberInput(raw: string | number) {
  const s = raw == null ? '' : String(raw);
  const digits = s.replace(/\D/g, '');
  if (!digits) return '';
  try {
    return Number(digits).toLocaleString('es-CL');
  } catch (e) {
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}

export function parseNumberFromFormatted(formatted: string) {
  if (!formatted) return 0;
  const digits = String(formatted).replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
}
