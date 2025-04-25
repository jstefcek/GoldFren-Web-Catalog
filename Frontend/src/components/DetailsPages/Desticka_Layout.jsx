import { useState } from "react";
import { Car, Bike, Plane } from "lucide-react";

export default function BrakePadDetail() {
  // Get the ID from the URL (would work with React Router)
  const id = window.location.pathname.split("/").pop();

  // State for controlling vehicle compatibility loading
  const [showVehicles, setShowVehicles] = useState(false);

  // Static mock data
  const padData = {
    title: "Brake pad",
    type: "001",
    material: "AD, K1, K5, K5-LX, S33, S3",
    dimensions: {
      width: 62.3,
      height: 41,
      thickness: 9,
      backplateThickness: 4,
    },
    oem: [
      "43082 1090",
      "43082 1118",
      "43082 1131",
      "43082 1137",
      "43082 1151",
      "69100 15810",
      "69140 03D00",
      "69140 15D00",
      "69140 28C00",
      "5XT W0046 50",
    ],
    equivalents: {
      sbs: "632",
      ebc: "FA 152",
      ferodo: "FDB 659",
      a2z: "",
      rapco: "",
      grove: "",
      cleveland: "",
      matco: "",
    },
    imageUrl: "/api/placeholder/400/320",
    svgUrl: "/api/vector/brake-pad-001.svg", // Added SVG URL to data
  };

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {padData.title} - {id}
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Left column with image and vector drawing */}
        <div className="lg:w-[70%] rounded-lg shadow border border-gray-200 bg-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Image</h3>
              <img
                src={padData.imageUrl}
                alt="Brake pad"
                className="w-full h-auto object-contain rounded shadow-sm"
              />
            </div>

            {/* Technical Drawing */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Technical Drawing</h3>
              <div className="w-full flex justify-center">
                <img
                  src={padData.svgUrl}
                  alt="Brake pad technical drawing"
                  className="w-full h-auto object-contain rounded shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column with OEM numbers */}
        <div className="lg:w-[30%] rounded-lg shadow border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            OEM Reference Numbers
          </h2>
          <div className="flex flex-wrap gap-2">
            {padData.oem.map((code, index) => (
              <span
                key={index}
                className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {code}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom sections in a grid */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Compatibility table */}
        <div className="lg:w-[80%] rounded-lg shadow border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Compatibility Table
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                    Code
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(padData.equivalents).map(([brand, code]) => (
                  <tr
                    key={brand}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 capitalize">
                        {brand}
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{code || "—"}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Material section */}
        <div className="lg:w-[20%] rounded-lg shadow border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Material Composition
          </h2>
          <div className="flex flex-wrap gap-2">
            {padData.material.split(", ").map((material, index) => (
              <span
                key={index}
                className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {material}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Vehicle Compatibility Section */}
      <div className="rounded-lg shadow border border-gray-200 bg-white p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Compatible Vehicles
          </h2>
          {!showVehicles && (
            <button
              onClick={() => setShowVehicles(true)}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors flex items-center gap-2"
            >
              <span>Load Compatible Vehicles</span>
            </button>
          )}
        </div>

        {showVehicles ? (
          <div className="mt-4">
            {/* Import and use DataGrid component when vehicles should be shown */}
            <DataGrid category="vehicles" apiUrl={`/api/compatibility/${id}`} />
          </div>
        ) : (
          <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-md">
            <div className="flex items-center mb-2">
              <Car className="h-8 w-8 mr-4 text-gray-500" />
              <Bike className="h-8 w-8 mr-4 text-gray-500" />
              <Plane className="h-8 w-8 mr-4 text-gray-500" />
            </div>
            <p className="text-gray-500">
              Click the button above to load compatible vehicles
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Mock implementation of DataGrid component to make the code complete
function DataGrid({ category, apiUrl }) {
  // This is a placeholder - in your actual implementation, you would
  // import the real DataGrid component from your second code snippet
  return (
    <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
      <p>Loading vehicle compatibility data from: {apiUrl}</p>
      <p>
        This would be replaced by the actual DataGrid component showing vehicle
        compatibility. Used category {category}
      </p>
    </div>
  );
}
