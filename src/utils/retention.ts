export function getYearMonth(dateStr?: string | null) {
  if (!dateStr) return null;
  const m = String(dateStr).match(/^(\d{4}-\d{2})/);
  if (m) return m[1];
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function lastNMonths(n: number, refDate = new Date()) {
  const months: string[] = [];
  let year = refDate.getFullYear();
  let month = refDate.getMonth();
  for (let i = 0; i < n; i++) {
    months.push(`${year}-${String(month + 1).padStart(2, '0')}`);
    month -= 1;
    if (month < 0) { month = 11; year -= 1; }
  }
  return months;
}

export function pruneTransactionsToLastNMonths(items: any[], dateKey = 'date', n = 6) {
  const allowed = new Set(lastNMonths(n));
  return (items || []).filter(it => {
    const ym = getYearMonth(it?.[dateKey]);
    return !!ym && allowed.has(ym);
  });
}

export function pruneDebtorsDebtsToLastNMonths(debtors: any[], dateKey = 'date', n = 6) {
  const allowed = new Set(lastNMonths(n));
  return (debtors || []).map(d => ({
    ...d,
    debts: (d.debts || []).filter((dd: any) => {
      const ym = getYearMonth(dd?.[dateKey]);
      return !!ym && allowed.has(ym);
    })
  }));
}

export default { getYearMonth, lastNMonths, pruneTransactionsToLastNMonths, pruneDebtorsDebtsToLastNMonths };
