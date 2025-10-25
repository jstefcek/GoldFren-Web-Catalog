// Format date to long format of czech date
export function formatDateLong(dateString) {
  const date = new Date(dateString);

  const pad = (num) => String(num).padStart(2, "0");

  // Get day, month, year, hours, minutes, seconds
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  // Return formatted date string
  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

// Format url link to label
export function formatUrlLinkPathtoLable(url_path) {
  //
  if (!url_path) return "";

  // Switch to label text for vehicle
  if (url_path === "automobily") return "Automobily";
  if (url_path === "motocykly") return "Motocykly";
  if (url_path === "motokary") return "Motokáry";
  if (url_path === "kola") return "Jízdní kola";
  if (url_path === "letadla") return "Letadla";
  if (url_path === "prumysl") return "Průmysl";

  // Switch to label text for sortiment
  if (url_path === "adaptery") return "Brzdové Adaptéry";
  if (url_path === "brzdice") return "Brzdové Třmeny";
  if (url_path === "desticky") return "Brzdové Destičky";
  if (url_path === "kotouce") return "Brzdové Kotouče";
  if (url_path === "hadicky") return "Brzdové Hadičky";
  if (url_path === "pumpy") return "Brzdové Pumpy";
  if (url_path === "prislusenstvi") return "Brzdové Příslušenství";
}

// Helper function to extract file name from a URL or path
export function extractFileName(urlOrPath) {
  return urlOrPath?.split("/").pop();
}

// Detect if a value behaves like a browser File/Blob object
export const isFileObject = (value) => {
  if (!value) return false;

  const hasFileCtor = typeof File !== "undefined";
  const hasBlobCtor = typeof Blob !== "undefined";

  if (hasFileCtor && value instanceof File) {
    return true;
  }

  if (hasBlobCtor && value instanceof Blob && typeof value.name === "string") {
    return true;
  }

  if (typeof value !== "object") return false;

  const hasName = typeof value.name === "string" && value.name.length > 0;
  const hasSize = typeof value.size === "number" && Number.isFinite(value.size);
  const hasType = typeof value.type === "string";

  // accept if it has any of these Blob-like APIs
  const hasSlice = typeof value.slice === "function";
  const hasArrayBuffer = typeof value.arrayBuffer === "function";
  const hasStream = typeof value.stream === "function";
  const hasLastModified = typeof value.lastModified === "number";

  return (
    hasName &&
    hasSize &&
    hasType &&
    (hasSlice || hasArrayBuffer || hasStream || hasLastModified)
  );
};

// Format a string to be safe for use in file names
export const fileSafe = (file_name) =>
  (file_name || "vyrobce").replace(/[\\/:*?"<>|]/g, "_");

// Format today's date as YYYY-MM-DD
export const todayStr = () => new Date().toISOString().slice(0, 10);

// Make first letter uppercase
export const CapFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);