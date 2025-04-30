import React from "react";
import { ImageOff } from "lucide-react";

const DetailImage = ({ title, imageUrl, altText, noImageText }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">{title}</h3>
      {imageUrl ? (
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={imageUrl}
            alt={altText}
            className="w-full h-64 object-contain rounded shadow-sm cursor-pointer p-4"
          />
        </a>
      ) : (
        <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-100 rounded space-y-2">
            <ImageOff className="w-8 h-8 text-gray-400 mb-4" />
            <p className="text-gray-500">{noImageText}</p>
        </div>
      )}
    </div>
  );
};

export default DetailImage;