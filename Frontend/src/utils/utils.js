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
