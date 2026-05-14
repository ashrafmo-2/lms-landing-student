/**
 * Converts a duration string in "HH:MM:SS" format to a human-readable Arabic string.
 * Examples:
 *   "05:00:06" → "٥ س ٦ ث"
 *   "00:45:00" → "٤٥ د"
 *   "01:30:20" → "١ س ٣٠ د ٢٠ ث"
 *   null / ""  → ""
 */

export function formatDuration(duration: string | number | null | undefined): string {
    if (duration === null || duration === undefined || duration === "") return "";

    if (typeof duration === "number") {
        const h = Math.floor(duration / 60);
        const m = duration % 60;
        const segments: string[] = [];
        if (h > 0) segments.push(`${h} س`);
        if (m > 0) segments.push(`${m} د`);
        return segments.length > 0 ? segments.join(" ") : "0 د";
    }

    const parts = duration.split(":").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return duration;

    const [h, m, s] = parts;
    const segments: string[] = [];

    if (h > 0) segments.push(`${h} س`);
    if (m > 0) segments.push(`${m} د`);
    if (s > 0) segments.push(`${s} ث`);

    return segments.length > 0 ? segments.join(" ") : "0 د";
}

/**
 * Short version for tight spaces — shows only the two most significant units.
 * "05:00:06" → "٥ س ٦ ث"
 * "01:30:20" → "١ س ٣٠ د"
 */

export function formatDurationShort(duration: string | number | null | undefined): string {
    if (duration === null || duration === undefined || duration === "") return "";

    if (typeof duration === "number") {
        const h = Math.floor(duration / 60);
        const m = duration % 60;
        const segments: string[] = [];
        if (h > 0) segments.push(`${h} س`);
        if (m > 0) segments.push(`${m} د`);
        return segments.length > 0 ? segments.join(" ") : "0 د";
    }

    const parts = duration.split(":").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return duration;

    const [h, m, s] = parts;
    const segments: string[] = [];

    if (h > 0) segments.push(`${h} س`);
    if (m > 0) segments.push(`${m} د`);
    if (s > 0 && segments.length < 2) segments.push(`${s} ث`);

    return segments.length > 0 ? segments.join(" ") : "0 د";
}
