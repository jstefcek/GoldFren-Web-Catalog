import DataGrid from "../DataGrid/DataGrid";
import { useAuth } from "../../services/authContext";

const serverUrl = import.meta.env.VITE_API_URL;

export default function Users_Detail_Layout() {
  const { userInfo } = useAuth();

  return (
    <div className="min-h-auto px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-auto mx-auto mt-4">
            {/* Main title */}
            <h1 className="text-3xl font-bold text-gray-900">
                Přehled interních uživatelů
            </h1>

            {/* List internal users */}
            <div className="mt-4">
                <DataGrid
                    category="users"
                    apiUrl={`${serverUrl}/api/goldfren/internal/users/?group=Internal`}
                    access_token={userInfo?.access_token}
                    show_checkbox={false}
                />
            </div>

            {/* External users */}
            <h1 className="text-3xl font-bold text-gray-900 mt-8">
                Přehled externích uživatelů
            </h1>

            {/* List external users */}
            <div className="mt-4 mb-8">
                <DataGrid
                    category="users"
                    apiUrl={`${serverUrl}/api/goldfren/internal/users/?group=External`}
                    access_token={userInfo?.access_token}
                    show_checkbox={false}
                />
            </div>
            
        </div>
    </div>
  );
}