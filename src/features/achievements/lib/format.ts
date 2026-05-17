export function formatAchievementPercent(value: number, locale: string) {
  return `${value.toLocaleString(locale === "ar" ? "ar-EG" : "en-US", {
    maximumFractionDigits: 1,
  })}%`;
}

export function formatAchievementDate(value: string, locale: string) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatAchievementNumber(value: number, locale: string) {
  return value.toLocaleString(locale === "ar" ? "ar-EG" : "en-US");
}
