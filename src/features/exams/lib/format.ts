export function formatExamDate(
  value: string | null | undefined,
  locale: string,
) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatExamDateTime(
  value: string | null | undefined,
  locale: string,
) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString(locale === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPercent(value: number, locale: string) {
  return `${value.toLocaleString(locale === "ar" ? "ar-EG" : "en-US", {
    maximumFractionDigits: 1,
  })}%`;
}

export function formatMinutes(value: number, locale: string) {
  const formatted = value.toLocaleString(locale === "ar" ? "ar-EG" : "en-US");
  return locale === "ar" ? `${formatted} دقيقة` : `${formatted} min`;
}
