import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Minus, Globe, Car, Bolt, Info } from "lucide-react";
import { useFetchMetrics } from "../../hooks/HomePage_APIHook.jsx";
import { getCountryFlag } from "../../utils/GetCountryFlags";
const api_key = import.meta.env.VITE_LOGO_DEV_API_KEY;

export default function DashboardMain_Layout() {
  const [metrics, setMetrics] = useState(null);
  const [manufacturesData, setManufactures] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todaysChangePercentage, setTodaysChangePercentage] = useState(0);
  const [monthlyChangePercentage, setMonthlyChangePercentage] = useState(0);
  const { fetchMetrics } = useFetchMetrics();

  // Czech month names
  const czechMonths = [
    "Leden",
    "Únor",
    "Březen",
    "Duben",
    "Květen",
    "Červen",
    "Červenec",
    "Srpen",
    "Září",
    "Říjen",
    "Listopad",
    "Prosinec",
  ];

  // Get formatted dates
  const getFormattedDates = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Format: DD.MM.YYYY
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };

    // Get current and previous month names
    const currentMonth = czechMonths[today.getMonth()];
    const currentYear = today.getFullYear();

    const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1);
    const lastMonth = czechMonths[lastMonthDate.getMonth()];
    const lastMonthYear = lastMonthDate.getFullYear();

    return {
      today: formatDate(today),
      yesterday: formatDate(yesterday),
      currentMonth: `${currentMonth} ${currentYear}`,
      lastMonth: `${lastMonth} ${lastMonthYear}`,
    };
  };

  // Get formatted dates
  const dates = getFormattedDates();

  // Percentage change calculation
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Fetch data from API
  useEffect(() => {
    const loadMetrics = async () => {
      try {
        // Fetch metrics data
        setLoading(true);
        const data = await fetchMetrics("/api/goldfren/internal/metrics/homepage");
        const manu = await fetchMetrics("/api/goldfren/internal/metrics/homepage/manufacturers");

        // Set state with fetched data
        setManufactures(manu);
        setMetrics(data);

        // Calculate percentage changes
        if (data.today && data.yesterday > 0) {
          setTodaysChangePercentage(
            calculatePercentageChange(data.today, data.yesterday)
          );
        }

        if (data.this_month && data.last_month > 0) {
          setMonthlyChangePercentage(
            calculatePercentageChange(data.this_month, data.last_month)
          );
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  // Render change indicator
  const renderChangeIndicator = (percentage) => {
    if (percentage === 0) {
      return (
        <div className="flex items-center">
          <Minus className="w-9 h-9 text-gray-400" strokeWidth={3} />
        </div>
      );
    } else if (percentage > 0) {
      return (
        <div className="flex items-center">
          <ArrowUp className="w-9 h-9 text-green-700" strokeWidth={3} />
          <span className="text-green-700 font-bold text-[32px]">
            {percentage.toFixed(0)}%
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center">
          <ArrowDown className="w-9 h-9 text-red-700" strokeWidth={3} />
          <span className="text-red-700 font-bold text-[32px]">
            {Math.abs(percentage).toFixed(0)}%
          </span>
        </div>
      );
    }
  };

  // Skeleton loading components
  const SkeletonMetricCard = () => (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
        <div className="h-10 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/3"></div>
      </div>
    </div>
  );

  // Skeleton for country card
  const SkeletonCountryCard = () => (
    <div className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-200">
      <div className="animate-pulse flex items-center gap-3 w-full">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <div className="h-4 bg-gray-300 rounded w-24"></div>
        <div className="ml-auto h-5 bg-gray-300 rounded w-8"></div>
      </div>
    </div>
  );

  // Data freshness skeleton
  const DataFreshnessSkeleton = () => (
    <div className="flex items-center justify-end gap-2 mt-2 mb-4 min-h-[24px]">
      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
    </div>
  );

  const CompanyLogo = ({ name }) => {
    const [hasError, setHasError] = useState(false);
    
    // Format the name to create a domain
    const domain = `${name.toLowerCase().replace(/\s+/g, '')}.com`;
    const logoUrl = `https://img.logo.dev/${domain}?token=${api_key}`;

    // Fallback to globe icon on error
    if (hasError) {
      return <Globe className="w-8 h-8 text-gray-400" />;
    }

    return (
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className="w-8 h-8 object-contain"
        crossOrigin="anonymous"
        onError={() => setHasError(true)}
      />
    );
  };

  // Error handling
  if (error) {
    return (
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Chyba: {error}</div>
      </div>
    );
  }

  // Format generated_at timestamp
  const formatGeneratedAt = (isoDate) => {
  if (!isoDate) return null;

  const date = new Date(isoDate);
  return date.toLocaleString("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

  return (
    <div className="min-h-auto px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="bg-white rounded-lg shadow-sm pt-8 pl-8 pr-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">
          GOLDfren webový katalog
        </h1>
        <p className="text-gray-600 text-lg">
          Vítejte na administrační stránce vašeho webového katalogu
        </p>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Metrics */}
          <div className="lg:col-span-1 space-y-4">
            {loading ? (
              <>
                <SkeletonMetricCard />
                <SkeletonMetricCard />
              </>
            ) : (
              <>
                {/* Today's visitors */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Návštěvníků dnes
                  </h3>
                  <div className="text-gray-700 text-[36px] font-black flex items-center gap-1">
                    <span>{metrics?.today || 0}</span>
                    {renderChangeIndicator(todaysChangePercentage)}
                  </div>
                </div>

                {/* Yesterdays visitors */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Návštěvníků včera
                  </h3>
                  <div className="text-gray-700 text-[36px] font-black flex items-center gap-1">
                    <span>{metrics?.yesterday || 0}</span>
                  </div>
                </div>

                {/* This month's visitors */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Návštěvníků tento měsíc
                  </h3>
                  <div className="text-gray-700 text-[36px] font-black flex items-center gap-1">
                    <span>{metrics?.this_month || 0}</span>
                    {renderChangeIndicator(monthlyChangePercentage)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {dates.currentMonth}
                  </p>
                </div>

                {/* Last month's visitors */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Návštěvníků minulý měsíc
                  </h3>
                  <div className="text-gray-700 text-[36px] font-black flex items-center gap-1">
                    <span>{metrics?.last_month || 0}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {dates.lastMonth}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Right column - Countries */}
          <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-6 h-6 text-gray-800" />
              <h3 className="text-lg font-bold text-gray-800">
                Návštěvníci webu během 30 dnů
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto">
              {loading ? (
                <>
                  {[...Array(8)].map((_, i) => (
                    <SkeletonCountryCard key={i} />
                  ))}
                </>
              ) : (
                metrics?.countries?.map((country, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">
                        {getCountryFlag(country.country)}
                      </div>
                      <span className="text-gray-800 font-medium">
                        {country.country}
                      </span>
                    </div>
                    <span className="text-gray-600 font-semibold text-lg">
                      {country.activeUsers}
                    </span>
                  </div>
                ))
              )}
            </div>

            {!loading && metrics?.countries?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Celkem zemí:</span>
                  <span className="font-bold text-gray-800">
                    {metrics.countries.length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-600">
                    Celkem unikátních uživatelů:
                  </span>
                  <span className="font-bold text-gray-800">
                    {metrics.countries.reduce(
                      (sum, c) => sum + c.activeUsers,
                      0
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <DataFreshnessSkeleton />
        ) : metrics?.generated_at ? (
          <div className="flex items-center justify-end gap-2 mt-2 mb-4 min-h-[24px]">
            <Info className="w-4 h-4 text-gray-500 shrink-0" />
            <p className="text-sm text-gray-500 text-right leading-tight">
              Data jsou aktualizována jednou za hodinu. Poslední aktualizace:{" "}
              <span className="font-medium text-gray-600">
                {formatGeneratedAt(metrics.generated_at)}
              </span>
            </p>
          </div>
        ) : (
          <DataFreshnessSkeleton />
        )}

      </div>

      <div className="bg-white rounded-lg shadow-sm pt-8 pl-8 pr-8 mt-8 mb-8 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Car className="w-8 h-8 text-gray-800" />
          <h3 className="text-xl font-bold text-gray-800">
            Nejčastěji vyhledavané značky vozidel během 30 dnů
          </h3>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto">
            {loading ? (
              <>
                {[...Array(8)].map((_, i) => (
                  <SkeletonCountryCard key={i} />
                ))}
              </>
            ) : (
                Object.entries(manufacturesData?.manufacturers ?? {}).map(([name, count], index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded">
                        <CompanyLogo name={name} />
                    </div>
                    <span className="text-gray-800 font-medium">
                      {name}
                    </span>
                  </div>
                  <span className="text-gray-600 font-semibold text-lg">
                    {count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {loading ? (
          <DataFreshnessSkeleton />
        ) : manufacturesData?.generated_at ? (
          <div className="flex items-center justify-end gap-2 mt-2 mb-4 min-h-[24px]">
            <Info className="w-4 h-4 text-gray-500 shrink-0" />
            <p className="text-sm text-gray-500 text-right leading-tight">
              Data jsou aktualizována jednou za hodinu. Poslední aktualizace:{" "}
              <span className="font-medium text-gray-600">
                {formatGeneratedAt(manufacturesData.generated_at)}
              </span>
            </p>
          </div>
        ) : (
          <DataFreshnessSkeleton />
        )}

      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 mt-8 mb-8 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Bolt className="w-8 h-8 text-gray-800" />
          <h3 className="text-xl font-bold text-gray-800">
            Nejčastěji vyhledavaný sortiment
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Quick Stats
            </h3>
            <div className="text-blue-700">
              Dashboard statistics will appear here
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Recent Activity
            </h3>
            <div className="text-green-700">
              Recent activity will appear here
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              Notifications
            </h3>
            <div className="text-purple-700">
              Notifications will appear here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
