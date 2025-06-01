export default function DashboardMain_Layout() {
  return (
    <div className="min-h-auto px-4 sm:px-6 lg:px-8 bg-gray-50">
      {/* Main div with information */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Přehled webu GOLDfren katalog
        </h1>
        <p className="text-gray-600 text-lg">
          Vítejte na administrační stránce webu!
        </p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Viewers this day */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Návštěvníků dnes
            </h3>
            <p className="text-gray-700 text-[36px] font-black">87</p>
          </div>

          {/* Viewers this months */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Návštěvníků tento měsíc
            </h3>
            <p className="text-gray-700 text-[36px] font-black">3613</p>
          </div>

          {/* Viewers location */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Návštěvnící dle země
            </h3>
            <p className="text-gray-700">Zde bude world graf...</p>
          </div>
        </div>
      </div>

      {/* Vehicle Div */}
      <div className="bg-white rounded-lg shadow-sm p-8 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Nejčastěji vyhledavané produkty
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Quick Stats
            </h3>
            <p className="text-blue-700">
              Dashboard statistics will appear here
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Recent Activity
            </h3>
            <p className="text-green-700">Recent activity will appear here</p>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              Notifications
            </h3>
            <p className="text-purple-700">Notifications will appear here</p>
          </div>

          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Test</h3>
            <p className="text-red-700">Test div here</p>
          </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              Notifications
            </h3>
            <p className="text-purple-700">Notifications will appear here</p>
          </div>

          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Test</h3>
            <p className="text-red-700">Test div here</p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Recent Activity
            </h3>
            <p className="text-green-700">Recent activity will appear here</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Quick Stats
            </h3>
            <p className="text-blue-700">
              Dashboard statistics will appear here
            </p>
          </div>

        </div>
      </div>

      {/* Another div */}
      <div className="bg-white rounded-lg shadow-sm p-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Quick Stats
            </h3>
            <p className="text-blue-700">
              Dashboard statistics will appear here
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Recent Activity
            </h3>
            <p className="text-green-700">Recent activity will appear here</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              Notifications
            </h3>
            <p className="text-purple-700">Notifications will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
