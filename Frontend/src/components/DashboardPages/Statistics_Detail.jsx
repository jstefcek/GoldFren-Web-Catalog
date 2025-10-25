import { useState } from "react";
//import { useAuth } from "../../services/authContext";
import AlertDialog from "../ui/Custom_AlertDialog";

//const serverUrl = import.meta.env.VITE_API_URL;

export default function StatisticsPage_Layout() {
  //const { userInfo } = useAuth();
  const [alertData, setAlertData] = useState(null);

  const handleCloseAlert = () => {
    setAlertData(null);
  };

  return (
    <div className="min-h-auto px-4 sm:px-6 lg:px-8 bg-gray-50 relative">
      <div className="max-w-auto mx-auto mt-4">
        {/* Display page label */}
        <h2 className="text-3xl font-bold text-gray-900">
          Statistická data o webu
        </h2>
      </div>

      {/* Alert Dialog */}
      {alertData && (
        <AlertDialog
          title={alertData.title}
          message={alertData.message}
          type={alertData.type}
          duration={alertData.duration}
          onClose={handleCloseAlert}
        />
      )}
    
    </div>
  );
}