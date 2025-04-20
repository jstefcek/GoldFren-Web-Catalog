import { useState } from "react";
import { useTranslation } from "react-i18next";

export const TextTruncate = ({ 
  text, 
  maxRows = 3, 
  lineHeight = 1.5,
  className = "" 
}) => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();
  
  // Calculate max height based on number of rows and line height
  const maxHeight = maxRows * lineHeight + "rem";
  
  if (!text) return <span className={className}>—</span>;

  // Only check if truncation likely needed
  const needsTruncation = text.length > maxRows * 40 || text.split('\n').length > maxRows;
  
  return (
    <div className={`${className}`}>
      <div
        className={`${!expanded && needsTruncation ? "overflow-hidden" : ""}`}
        style={{ maxHeight: expanded || !needsTruncation ? "none" : maxHeight }}
      >
        <div className="whitespace-pre-line mt-2">
          {text}
        </div>
      </div>
      
      {needsTruncation && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-red-600 hover:text-red-700 text-sm font-medium px-2 py-0.5 transition-colors cursor-pointer"
        >
          {expanded ? t("datagrid.show_less") : t("datagrid.show_more")}
        </button>
      )}
    </div>
  );
};