import { useState, useEffect, useCallback } from "react";
import { X, Download } from "lucide-react";

export function CustomImageViewer({ src, alt = "Preview image", fullSize = false, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = alt || "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!src) return null;

  return (
    <>
      {/* Thumbnail */}
      <button
        onClick={() => setIsOpen(true)}
        className="transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 rounded cursor-pointer"
        aria-label={`Open image viewer: ${alt}`}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`rounded shadow object-contain ${
            fullSize
              ? `${className}`
              : "max-w-[100px] sm:max-w-[120px] max-h-[80px] sm:max-h-[100px]"
          }`}
        />
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm p-4"
          onClick={() => setIsOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          {/* Top right group */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex gap-2 z-50">
            {/* Download Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="p-2 text-white bg-black/60 rounded-full hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
              aria-label="Download image"
            >
              <Download size={22} />
            </button>

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-2 text-white bg-black/60 rounded-full hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
              aria-label="Close image viewer"
            >
              <X size={22} />
            </button>
          </div>

          {/* Image wrapper */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain rounded-md shadow-lg border border-gray-300 bg-white p-2"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </>
  );
}