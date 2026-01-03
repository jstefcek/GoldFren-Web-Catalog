// Transforms traffic API data to Nivo line chart format
export function LineDataTransform(
  dataApi,
  keyValue = "traffic_over_time",
  metrics = ["activeUsers", "sessions", "screenPageViews"]
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

  // Get rows at specified key path
  const rows = getAtPath(dataApi, keyValue) ?? [];

  // Normalize rows to array of objects
  const asArray = Array.isArray(rows)
    ? rows
    : rows === "object" && rows !== null
    ? Object.entries(rows).map(([date, vals]) => ({ date, ...(vals || {}) }))
    : [];

  // Map each metric to Nivo line chart format
  return metrics.map((metric) => ({
    id: metric,
    data: asArray
      .filter((r) => r && (r.date ?? r.x))
      .map((r) => ({
        x: r.date ?? r.x,
        y: Number(r?.[metric] ?? 0),
      })),
  }));
}
