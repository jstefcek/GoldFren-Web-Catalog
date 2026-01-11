import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Minus, Globe, Car, Info, AlertCircle, RefreshCw } from "lucide-react";
import { useFetchMetrics } from "../../hooks/HomePage_APIHook.jsx";
import { getCountryFlag } from "../../utils/GetCountryFlags";
import { useTranslation } from "react-i18next";
import { SkeletonMetricCard, SkeletonCountryCard, DataFreshnessSkeleton, ErrorMetricCard, ErrorCountrySection } from "../ui/Custom_SkeletonUI.jsx"

export default function DashboardMain_Layout() {
  const [metrics, setMetrics] = useState(null);
  const [manufacturesData, setManufactures] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todaysChangePercentage, setTodaysChangePercentage] = useState(0);
  const [monthlyChangePercentage, setMonthlyChangePercentage] = useState(0);
  const { fetchMetrics } = useFetchMetrics();
  const { t } = useTranslation();

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

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };

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

  const dates = getFormattedDates();

  // Calcuate precentage of change 
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return ((current - previous) / 1) * 100;
    else if (current === 0) return -100;
    else return ((current - previous) / previous) * 100;
  };

  // Fetch data from API
  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMetrics("/api/goldfren/internal/metrics/homepage");
      const manu = await fetchMetrics("/api/goldfren/internal/metrics/homepage/manufacturers");

      setManufactures(manu);
      setMetrics(data);

      if (Number.isFinite(data.today) && Number.isFinite(data.yesterday)) {
        setTodaysChangePercentage(
          calculatePercentageChange(Number(data.today), Number(data.yesterday))
        );
      }

      if (Number.isFinite(data.this_month) && Number.isFinite(data.last_month)) {
        setMonthlyChangePercentage(
          calculatePercentageChange(Number(data.this_month), Number(data.last_month))
        );
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

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

  // Company logo component with fallback to initials
  const getInitials = (companyName) => {
    if (!companyName) return "?";

    if (companyName.includes('&')) {
      const parts = companyName.split('&');
      const firstInitial = parts[0].trim()[0];
      const secondInitial = parts[1].trim()[0];
      return `${firstInitial}&${secondInitial}`.toUpperCase();
    }

    const cleanName = companyName.replace(/[^a-zA-Z0-9\s]/g, '');
    const words = cleanName.trim().split(/\s+/).filter(word => word.length > 0);

    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1) {
      return words[0][0].toUpperCase();
    }
    
    return "?";
  };

  // Company logo component
  const CompanyLogo = ({ name }) => {
    const [hasError, setHasError] = useState(false);
    
    const initials = getInitials(name);
    const domain = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const logoUrl = `https://cdn.simpleicons.org/${domain}`;

    if (hasError) {
      return (
        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded border border-gray-200 text-gray-500 text-xs font-bold select-none">
          {initials}
        </div>
      );
    }

    return (
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className="w-8 h-8 object-contain bg-white"
        crossOrigin="anonymous"
        onError={() => setHasError(true)}
      />
    );
  };

  // Format generated_at date
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
          {t("admin.home_title")}
        </h1>
        <p className="text-gray-600 text-lg">
          {t("admin.home_title_paragraph")}
        </p>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 mb-1">
                {t("admin.error_loading_data")}
              </h3>
              <p className="text-sm text-red-600 mb-3">
                {t("admin.error_fetching_data")}: {error}
              </p>
              <button
                onClick={loadMetrics}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                {t("admin.retry_loading")}
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Metrics */}
          <div className="lg:col-span-1 space-y-4">
            {loading ? (
              <>
                <SkeletonMetricCard />
                <SkeletonMetricCard />
              </>
            ) : error ? (
              <>
                <ErrorMetricCard />
                <ErrorMetricCard />
                <ErrorMetricCard />
                <ErrorMetricCard />
              </>
            ) : (
              <>
                {/* Today's visitors */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {t("admin.home_metrics_visitors_today")}
                  </h3>
                  <div className="text-gray-700 text-[36px] font-black flex items-center gap-1">
                    <span>{metrics?.today || 0}</span>
                    {renderChangeIndicator(todaysChangePercentage)}
                  </div>
                </div>

                {/* Yesterdays visitors */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {t("admin.home_metrics_visitors_yesterday")}
                  </h3>
                  <div className="text-gray-700 text-[36px] font-black flex items-center gap-1">
                    <span>{metrics?.yesterday || 0}</span>
                  </div>
                </div>

                {/* This month's visitors */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {t("admin.home_metrics_visitors_this_month")}
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
                    {t("admin.home_metrics_visitors_last_month")}
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
                {t("admin.home_metrics_visitors_country")}
              </h3>
            </div>

            {error ? (
              <ErrorCountrySection />
            ) : (
              <>
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
                      <span className="text-gray-600">{t("admin.home_metrics_visitors_country_count_text")}</span>
                      <span className="font-bold text-gray-800">
                        {metrics.countries.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-gray-600">
                        {t("admin.home_metrics_visitors_country_unique_text")}
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
              </>
            )}
          </div>
        </div>

        {loading ? (
          <DataFreshnessSkeleton />
        ) : error ? (
          <div className="mt-2 mb-4 min-h-[24px]" />
        ) : metrics?.generated_at ? (
          <div className="flex items-center justify-end gap-2 mt-2 mb-4 min-h-[24px]">
            <Info className="w-4 h-4 text-gray-500 shrink-0" />
            <p className="text-sm text-gray-500 text-right leading-tight">
              {t("admin.home_metrics_update_text")}{" "}
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
            {t("admin.home_metrics_manufacturers_title")}
          </h3>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          {error ? (
            <ErrorCountrySection />
          ) : (
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
          )}
        </div>

        {loading ? (
          <DataFreshnessSkeleton />
        ) : error ? (
          <div className="mt-2 mb-4 min-h-[24px]" />
        ) : manufacturesData?.generated_at ? (
          <div className="flex items-center justify-end gap-2 mt-2 mb-4 min-h-[24px]">
            <Info className="w-4 h-4 text-gray-500 shrink-0" />
            <p className="text-sm text-gray-500 text-right leading-tight">
              {t("admin.home_metrics_update_text")}{" "}
              <span className="font-medium text-gray-600">
                {formatGeneratedAt(manufacturesData.generated_at)}
              </span>
            </p>
          </div>
        ) : (
          <DataFreshnessSkeleton />
        )}
      </div>
    </div>
  );
}