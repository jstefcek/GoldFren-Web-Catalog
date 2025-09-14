import { useState, useEffect, useCallback } from "react";
import { X, Download, Upload, Eye, Trash2 } from "lucide-react";
import ConfirmDialog from "./Custom_ConfirmDialog";

export function CustomImageViewer({ 
  src, 
  alt = "Preview image", 
  fullSize = false, 
  className = "",
  allowUpload = false,
  onUpload = null,
  allowDelete = false,
  onDelete = null
}) {
  // Custom states to keep track
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Handle escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") setIsOpen(false);
  }, []);

  // Lock body scroll
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

  // Handle download button
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = alt || "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle upload button
  const handleUpload = (e) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
      // Reset the input value so the same file can be selected again
      e.target.value = '';
    }
  };

  // Handle delete button
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete();
    }
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  if (!src) return null;

  return (
    <>
      {/* Thumbnail with hover controls */}
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
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

        {/* Hover Controls */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center gap-3 transition-opacity">
            {/* View Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label={`View ${alt}`}
            >
              <Eye className="w-5 h-5 text-gray-700" />
            </button>

            {/* Upload Button */}
            {allowUpload && (
              <label className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                <Upload className="w-5 h-5 text-gray-700" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.svg"
                  onChange={handleUpload}
                />
              </label>
            )}

            {/* Delete Button */}
            {allowDelete && (
              <button
                onClick={handleDeleteClick}
                className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                aria-label={`Delete ${alt}`}
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
            )}
          </div>
        )}
      </div>

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

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <ConfirmDialog
          title="Smazat obrázek"
          message="Opravdu chcete smazat tento obrázek? Tato akce je nevratná."
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </>
  );
}