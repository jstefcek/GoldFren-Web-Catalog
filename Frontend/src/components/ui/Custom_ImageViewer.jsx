import { useState, useEffect, useCallback, useRef } from "react";
import { X, Download, RefreshCw, Eye, Trash2 } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const fileInputRef = useRef(null);
  const modalFileInputRef = useRef(null);

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

  const handleReplaceClick = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleModalReplaceClick = (e) => {
    e.stopPropagation();
    if (modalFileInputRef.current) {
      modalFileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
      e.target.value = '';
    }
  };

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
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,.svg"
        onChange={handleFileChange}
      />

      <input
        ref={modalFileInputRef}
        type="file"
        className="hidden"
        accept="image/*,.svg"
        onChange={handleFileChange}
      />

      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`rounded shadow object-contain ${
            fullSize
              ? `${className}`
              : "max-w-[80px] sm:max-w-[96px] max-h-[64px] sm:max-h-[80px]" // Smaller default sizes
          }`}
        />

        {isHovered && (allowUpload || allowDelete || fullSize) && (
          <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center gap-2 transition-opacity">
            {/* Always show view button when fullSize is enabled */}
            {fullSize && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(true);
                }}
                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label={`View ${alt}`}
                title="View full size"
              >
                <Eye className="w-4 h-4 text-gray-700" />
              </button>
            )}

            {/* Show replace button only when upload is allowed */}
            {allowUpload && onUpload && (
              <button
                onClick={handleReplaceClick}
                className="p-2 bg-green-600 rounded-full hover:bg-green-700 transition-colors cursor-pointer" 
                title="Replace image"
              >
                <RefreshCw className="w-4 h-4 text-white" />
              </button>
            )}

            {/* Show delete button only when delete is allowed */}
            {allowDelete && onDelete && (
              <button
                onClick={handleDeleteClick}
                className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors cursor-pointer"
                aria-label={`Delete ${alt}`}
                title="Delete image"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        )}
      </div>

      {isOpen && fullSize && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setIsOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex gap-2 z-50">
            {/* Show replace button in modal only when upload is allowed */}
            {allowUpload && onUpload && (
              <button
                onClick={handleModalReplaceClick}
                className="p-3 text-white bg-green-600/80 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer transition-colors" 
                title="Replace image"
              >
                <RefreshCw size={20} />
              </button>
            )}

            {/* Show delete button in modal only when delete is allowed */}
            {allowDelete && onDelete && (
              <button
                onClick={handleDeleteClick}
                className="p-3 text-white bg-red-600/80 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer transition-colors"
                aria-label="Delete image"
                title="Delete image"
              >
                <Trash2 size={20} />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="p-3 text-white bg-gray-600/80 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer transition-colors"
              aria-label="Download image"
              title="Download image"
            >
              <Download size={20} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-3 text-white bg-gray-600/80 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer transition-colors"
              aria-label="Close image viewer"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>

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

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Smazat obrázek"
          message="Opravdu chcete odebrat tento obrázek?"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </>
  );
}