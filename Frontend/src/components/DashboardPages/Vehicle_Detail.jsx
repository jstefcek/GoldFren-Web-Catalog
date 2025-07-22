import { useLocation } from "react-router-dom";
import { formatUrlLinkPathtoLable } from "../../utils/utils";

export default function VehicleLayout() {
  // Extract the vehicle type from the URL path
  const location = useLocation();
  const vehicleType = location.pathname.split("/").pop();

  // Format the vehicle type to label
  const vehicleLabel = formatUrlLinkPathtoLable(vehicleType);

  return (
    <div className="min-h-auto px-4 sm:px-6 lg:px-8 bg-gray-50 relative">
      <div className="max-w-auto mx-auto mt-4">
        {/* Page label */}
        <h2 className="text-3xl font-bold text-gray-900">
          Detail Vozidla - {vehicleLabel}
        </h2>
      </div>
    </div>
  );
}
