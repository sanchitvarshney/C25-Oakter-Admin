/** Indian financial year: 1 Apr – 31 Mar (e.g. FY 2025-26 → "25-26"). */
export function getIndianFinancialYearSessionKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0 = Jan … 3 = Apr
  const startYear = month >= 3 ? year : year - 1;
  const endYear = startYear + 1;
  const yy = (y: number) => String(y % 100).padStart(2, "0");
  return `${yy(startYear)}-${yy(endYear)}`;
}

/** `session` header value (current Indian FY unless extended with an override later). */
export function getFinancialSessionHeaderValue(date: Date = new Date()): string {
  return getIndianFinancialYearSessionKey(date);
}
