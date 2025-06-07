import { ImageOff } from "lucide-react";
import { CustomImageViewer } from "./Custom_ImageViewer";

const DetailImage = ({ title, imageUrl, altText, noImageText }) => {
  return (
    <div className="w-full max-w-lg mx-auto">
      <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-900">{title}</h3>
      <div
        className="
          w-full h-64
          flex items-center justify-center
          bg-gray-50
          p-4
          shadow-sm
          overflow-hidden
        "
      >
        {imageUrl ? (
          <CustomImageViewer
            src={imageUrl}
            alt={altText}
            className="max-w-full max-h-56 object-contain block"
            fullSize
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
            <ImageOff className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-gray-500 text-base md:text-lg">{noImageText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailImage;
