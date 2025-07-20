import { useEffect } from "react";
import { Bell } from "lucide-react";

export default function AlertDialog({ title, message, type = "success", onClose, duration = 3 }) {
  // Automatically close the dialog after the specified duration
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, duration * 1000);
    return () => clearTimeout(timeout);
  }, [duration, onClose]);

  // Check if the type is success or error
  const isSuccess = type === "success";
  const colorClass = isSuccess ? "text-green-600" : "text-red-600";

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="flex items-start gap-3 bg-white rounded-lg shadow-xl border border-gray-200 px-4 py-3 w-80 animate-fade-in-up">
        <div className={`mt-1 ${colorClass}`}>
          <Bell className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
}