import { useLocation } from "react-router-dom";
import { formatUrlLinkPathtoLable } from "../../utils/utils";

export default function SortimentLayout() {
  // Extract the sortiment type from the URL path
  const location = useLocation();
  const sortimentType = location.pathname.split("/").pop();

  // Format the sortiment type to label
  const sortimentLabel = formatUrlLinkPathtoLable(sortimentType);

  return (
    <div className="min-h-auto px-4 sm:px-6 lg:px-8 bg-gray-50 relative">
      <div className="max-w-auto mx-auto mt-4">
        {/* Page label */}
        <h2 className="text-3xl font-bold text-gray-900">
          Detail Sortimentu - {sortimentLabel}
        </h2>
      </div>
    </div>
  );
}
