// ----------------------------------------------------------------
// Transforms API data to Nivo line chart format
export function LineDataTransform(
  dataApi,
  keyValue = "",
  metrics = []
) {
  // Helper to get nested value at path
  const getAtPath = (obj, path) => {
    if (obj == null) return undefined;
    if (Array.isArray(path)) {
      return path.reduce((o, k) => (o == null ? undefined : o[k]), obj);
    }
    if (typeof path === "string") {
      if (path === "") return obj;
      return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
    }
    return obj[path];
  };

  // Convert value to number or null
  const toNumberOrNull = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  // Convert ISO date string or Date to Date object or null
  const toDateOrNull = (isoOrDate) => {
    if (!isoOrDate) return null;

    // already a Date
    if (isoOrDate instanceof Date) {
      return Number.isNaN(isoOrDate.getTime()) ? null : isoOrDate;
    }

    // parse ISO date string "YYYY-MM-DD"
    const d = new Date(`${isoOrDate}T00:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  // Get rows at specified key path
  const rows = getAtPath(dataApi, keyValue);

  // Normalize rows to array of objects
  const asArray = Array.isArray(rows)
    ? rows
    : typeof rows === "object" && rows !== null
      ? Object.entries(rows).map(([date, vals]) => ({ date, ...(vals || {}) }))
      : [];

  return metrics.map((metric) => ({
    id: metric,
    data: asArray
      .map((r) => {
        const x = toDateOrNull(r?.date ?? r?.x);
        const y = toNumberOrNull(r?.[metric]);
        return { x, y };
      })
      .filter((p) => p.x !== null && p.y !== null),
  }));
}

// ----------------------------------------------------------------
// Transforms API data to Nivo pie chart format
export function PieDataTransform(apiResult, keyValue = "", metric = "") {
  const root = apiResult?.data ?? apiResult;

  const getAtPath = (obj, path) => {
    if (obj == null) return undefined;
    if (typeof path === "string") {
      if (path === "") return obj;
      return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
    }
    return obj[path];
  };

  const toNumberOrNull = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const rows = getAtPath(root, keyValue);

  const asArray = Array.isArray(rows)
    ? rows
    : typeof rows === "object" && rows !== null
      ? Object.entries(rows).map(([key, vals]) => ({ key, ...(vals || {}) }))
      : [];

  return asArray
    .map((r) => {
      const id = r?.name ?? r?.country ?? r?.deviceCategory ?? r?.key ?? "unknown";
      const value = toNumberOrNull(r?.[metric]);
      return { id, value };
    })
    .filter((p) => p.value !== null && p.id !== "unknown");
}

// ----------------------------------------------------------------
// Transforms API data to Nivo bar chart format
export function BarDataTransform(
  dataApi,
  keyValue = "",
  metric = ""
) {
  // Helper to get nested value at path
  const getAtPath = (obj, path) => {
    if (obj == null) return undefined;
    if (Array.isArray(path)) {
      return path.reduce((o, k) => (o == null ? undefined : o[k]), obj);
    }
    if (typeof path === "string") {
      if (path === "") return obj;
      return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
    }
    return obj[path];
  };

  // Convert value to number or null
  const toNumberOrNull = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  // Get rows at specified key path
  const rows = getAtPath(dataApi, keyValue);

  // Normalize rows to array of objects
  const asArray = Array.isArray(rows)
    ? rows
    : typeof rows === "object" && rows !== null
      ? Object.entries(rows).map(([key, vals]) => ({ key, ...(vals || {}) }))
      : [];

  return asArray
    .map((r) => {
      const label = r?.name || r?.key || r?.deviceCategory || "unknown";
      const value = toNumberOrNull(r?.[metric]);
      return { label, value };
    })
    .filter((p) => p.value !== null);
}