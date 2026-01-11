import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../../services/authContext";
import AlertDialog from "../ui/Custom_AlertDialog";
import { useTranslation } from "react-i18next";
import { CustomSelect } from "../SearchForm/ui/CustomSelect";
import { Custom_ResponsiveLine } from "../ui/Custom_ResponsiveLine.jsx";
import { Custom_ResponsivePie } from "../ui/Custom_ResponsivePie.jsx";
import { Custom_ResponsiveBar } from "../ui/Custom_ResponsiveBar.jsx";
import { useStatsAPI } from "../../hooks/Stats_APIHook";
import { SkeletonMetricCard, SkeletonCountryCard, ErrorMetricCard, ErrorCountrySection } from "../ui/Custom_SkeletonUI.jsx"
import { LineDataTransform, PieDataTransform, BarDataTransform } from "../../hooks/DataTransformers/GraphTransformer";
import { Globe, TimerIcon, User2, View } from "lucide-react";

export default function StatisticsPage_Layout() {
  const { userInfo } = useAuth();
  const [alertData, setAlertData] = useState(null);
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(30);

  // Reusable design
  const cardTitle = "text-sm font-medium text-gray-600";
  const cardText = "text-gray-900 text-[36px] font-black flex items-center gap-1";
  const divTitle = "text-3xl font-bold text-gray-900";
  const parGraphText = "text-gray-500 text-xs sm:text-sm mb-4";

  // Handle closing the alert dialog
  const handleCloseAlert = () => {
    setAlertData(null);
  };

  // Prepare endpoint URLs
  const days = selectedDate?.value || selectedDate;
  const summaryWebReq = `/api/goldfren/internal/metrics/stats/summary?days=${days}`;
  const trafficWebReq = `/api/goldfren/internal/metrics/stats/traffic?days=${days}`;
  const engagementQualityReq = `/api/goldfren/internal/metrics/stats/engagement?days=${days}`;
  const sessionWebReq = `/api/goldfren/internal/metrics/stats/sessions?days=${days}`;
  const pagesWebReq = `/api/goldfren/internal/metrics/stats/pages?limit=11&days=${days}`;
  const deviceWebReq = `/api/goldfren/internal/metrics/stats/device?days=${days}`;

  // Fetch data
  const summaryRes = useStatsAPI(summaryWebReq, userInfo?.access_token, { auto: false });
  const trafficRes = useStatsAPI(trafficWebReq, userInfo?.access_token, { auto: false });
  const engagementRes = useStatsAPI(engagementQualityReq, userInfo?.access_token, { auto: false });
  const sessionRes = useStatsAPI(sessionWebReq, userInfo?.access_token, { auto: false });
  const pagesRes = useStatsAPI(pagesWebReq, userInfo?.access_token, { auto: false });
  const deviceRes = useStatsAPI(deviceWebReq, userInfo?.access_token, { auto: false });

  // Destructure data and loading states
  const { data: summaryWebData } = summaryRes;
  const { data: trafficWebData } = trafficRes;
  const { data: engagementWebData } = engagementRes;
  const { data: sessionWebData } = sessionRes;
  const { data: pagesWebData } = pagesRes;
  const { data: deviceWebData } = deviceRes;

  // Combine loading and error states
  const loading = summaryRes.loading || trafficRes.loading || engagementRes.loading || sessionRes.loading || pagesRes.loading;
  const error = summaryRes.error || trafficRes.error || engagementRes.error || sessionRes.error || pagesRes.error;

  // Transform data for line chart
  const LineData = useMemo(() => LineDataTransform(trafficWebData, "traffic_over_time", ["activeUsers", "sessions", "screenPageViews"]), [trafficWebData]);
  const EngagementLineData = useMemo(() => LineDataTransform(engagementWebData, "engagment_quality", ["engagementRate"]), [engagementWebData]);
  const TimeSpentLineData = useMemo(() => LineDataTransform(engagementWebData, "engagment_quality", ["averageSessionDuration"]), [engagementWebData]);

  // Transform data for pie chart
  const SessionNameData = useMemo(() => PieDataTransform(sessionWebData, "sessions", "sessions"), [sessionWebData]);
  const DeviceNameData = useMemo(() => PieDataTransform(deviceWebData, "device_engagement", "sessions"), [deviceWebData]);

  // Transform data for bar chart
  const SessionEngagementData = useMemo(() => BarDataTransform(sessionWebData, "sessions", "engagementRate"), [sessionWebData]);
  const DeviceEngagementData = useMemo(() => BarDataTransform(deviceWebData, "device_engagement", "engagementRate"), [deviceWebData]);

  // Initial data fetch on component mount
  useEffect(() => {
    summaryRes.refetch();
    trafficRes.refetch();
    engagementRes.refetch();
    sessionRes.refetch();
    pagesRes.refetch();
    deviceRes.refetch();
  }, []);

  // Get today's date once
  const todayDate = new Date();

  // Format date for label display
  const getFormattedDate = (date, datePeriod) => {
    const baseDate = new Date(date);

    let fromDate = new Date(baseDate);
    let toDate = new Date(baseDate);

    // Handle periods
    if (Number.isInteger(datePeriod)) {
      fromDate.setDate(fromDate.getDate() - datePeriod);
    }

    // Format dates as DD.MM.YYYY
    const format = (d) =>
      `${String(d.getDate()).padStart(2, "0")}.${String(
        d.getMonth() + 1
      ).padStart(2, "0")}.${d.getFullYear()}`;

    // Return formatted date range
    return `${format(fromDate)} - ${format(toDate)}`;
  };

  // Prepare date range options
  const dateRangeOptions = [
    { value: 1, label: t("admin.statistics.web.today") + ` (${getFormattedDate(todayDate, 0)})`, },
    { value: 7, label: t("admin.statistics.web.last_7_days") + ` (${getFormattedDate(todayDate, 7)})`, },
    { value: 14, label: t("admin.statistics.web.last_14_days") + ` (${getFormattedDate(todayDate, 14)})`, },
    { value: 30, label: t("admin.statistics.web.last_30_days") + ` (${getFormattedDate(todayDate, 30)})`, },
    { value: 90, label: t("admin.statistics.web.last_90_days") + ` (${getFormattedDate(todayDate, 90)})`, },
    { value: 180, label: t("admin.statistics.web.last_180_days") + ` (${getFormattedDate(todayDate, 180)})`, },
    { value: 365, label: t("admin.statistics.web.last_365_days") + ` (${getFormattedDate(todayDate, 365)})`, },
  ];

  // Bar chart data
  const BarData = []

  return (
    <div className="min-h-auto px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-2 sm:px-6 sm:py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left side - Title and Paragraph */}
            <div className="lg:col-span-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {t("admin.statistics.web.page_title")}
              </h1>
              <p className="text-gray-600 text-xs sm:text-base">
                {t("admin.statistics.web.title_paragraph")}
              </p>
            </div>

            {/* Right side - Controls */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {/* Select Input */}
              <div className="w-full">
                <CustomSelect
                  label="admin.statistics.web.select_text"
                  name="date_range"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  options={dateRangeOptions}
                  optional={false}
                  placeholder="admin.statistics.web.select_text_placeholder"
                  disabled={null}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 lg:gap-4 items-center mt-4">
            <div className="lg:col-span-1"><SkeletonMetricCard /></div>
            <div className="lg:col-span-1"><SkeletonMetricCard /></div>
            <div className="lg:col-span-1"><SkeletonMetricCard /></div>
            <div className="lg:col-span-1"><SkeletonMetricCard /></div>
            <div className="lg:col-span-1"><SkeletonMetricCard /></div>
          </div>
        ) : error ? (
          <div className="mt-4">
            <ErrorCountrySection error={error.message || String(error)} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 lg:gap-4 items-center">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4 px-4 py-4 sm:px-6">
                  <h4 className={cardTitle}>{t("admin.statistics.web.active_users")}</h4>
                  <p className={cardText}>{summaryWebData?.activeUsers ?? "—"}</p>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-2 sm:mt-4 px-4 py-4 sm:px-6">
                  <h4 className={cardTitle}>{t("admin.statistics.web.sessions")}</h4>
                  <p className={cardText}>{summaryWebData?.sessions ?? "—"}</p>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-2 sm:mt-4 px-4 py-4 sm:px-6">
                  <h4 className={cardTitle}>{t("admin.statistics.web.page_views")}</h4>
                  <p className={cardText}>{summaryWebData?.screenPageViews ?? "—"}</p>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-2 sm:mt-4 px-4 py-4 sm:px-6">
                  <h4 className={cardTitle}>{t("admin.statistics.web.engagement_rate")}</h4>
                  <p className={cardText}>{summaryWebData?.engagementRate ?? "—"} %</p>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-2 sm:mt-4 px-4 py-4 sm:px-6">
                  <h4 className={cardTitle}>{t("admin.statistics.web.avg_engagement_time")}</h4>
                  <p className={cardText}>{summaryWebData?.averageSessionDuration ?? "—"} s</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Traffic Trend Line Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 lg:gap-4 items-center">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4 px-4 py-4 sm:px-6">
              {/* Title */}
              <h3 className={divTitle}>
                {t("admin.statistics.web.traffic_trend_title")}
              </h3>
              {/* Graph description */}
              <p className={parGraphText}>
                Graf zobrazuje vývoj návštevnosti na webu za zvolené období. V grafu je vidět počet aktivních uživatelů, počet relací a počet zobrazení stránek.
              </p>

              {/* Line Chart Graph */}
              <div className="h-[360px]">
                <Custom_ResponsiveLine 
                  Data={LineData}
                  axisBottomText="admin.statistics.web.traffic_chart_legend_x" 
                  axisLeftText="admin.statistics.web.traffic_chart_legend_y" 
                  tooltipLabel="admin.statistics.web.traffic_trend_title"
                  tickValue={10}
                />
              </div>

            </div>
          </div>
        </div>

        {/* Engagement Quality Trend Line Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-4 items-center">
          {/* Engagement Trend Line Chart */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4 px-4 py-4 sm:px-6">
              {/* Title */}
              <h3 className={divTitle}>
                {t("admin.statistics.web.engagement_trend_title")}
              </h3>
              {/* Graph description */}
              <p className={parGraphText}>
                Graf zobrazuje kvalitu zapojení/interakce návštěvníků na webu za zvolené období.
              </p>

              {/* Line Chart Graph */}
              <div className="h-[280px]">
                <Custom_ResponsiveLine 
                  Data={EngagementLineData}
                  axisBottomText="admin.statistics.web.engagement_trend_chart_legend_x" 
                  axisLeftText="admin.statistics.web.engagement_trend_chart_legend_y" 
                  tooltipLabel="admin.statistics.web.engagement_trend_title"
                  tickValue={10}
                />
              </div>

            </div>
          </div>
          
          {/* Time Spent Trend Chart Line Chart */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-2 sm:mt-4 px-4 py-4 sm:px-6">
              {/* Title */}
              <h3 className={divTitle}>
                {t("admin.statistics.web.engagement_time_spend_title")}
              </h3>
              {/* Graph description */}
              <p className={parGraphText}>
                Graf zobrazuje průměrný čas strávený návštěvníky na webu za zvolené období.
              </p>

              {/* Line Chart Graph */}
              <div className="h-[280px]">
                <Custom_ResponsiveLine 
                  Data={TimeSpentLineData}
                  axisBottomText="admin.statistics.web.engagement_time_spend_chart_legend_x" 
                  axisLeftText="admin.statistics.web.engagement_time_spend_chart_legend_y" 
                  tooltipLabel="admin.statistics.web.engagement_time_spend_title"
                  tickValue={10}
                />
              </div>

            </div>
          </div>
        </div>

        {/* Sessions Sources Content */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-4 items-center">
          {/* Channel Distribution */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4 px-4 py-4 sm:px-6">
              {/* Title */}
              <h3 className={divTitle}>
                {t("admin.statistics.web.traffic_channel_distribution_title")}
              </h3>
              {/* Graph description */}
              <p className={parGraphText}>
                Graf zobrazuje rozdělení návštěv na webu podle různých kanálů (zdroje) za zvolené období.
              </p>

              {/* Pie Chart */}
              <div className="h-[280px]">
                <Custom_ResponsivePie 
                  Data={SessionNameData} 
                />
              </div>

            </div>
          </div>

          {/* Channel Quality */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4 px-4 py-4 sm:px-6">
              {/* Title */}
              <h3 className={divTitle}>
                {t("admin.statistics.web.traffic_channel_quality_title")}
              </h3>
              {/* Graph description */}
              <p className={parGraphText}>
                Graf zobrazuje kvalitu návštěv na webu podle různých kanálů za zvolené období. Kvalita je měřena pomocí míry zapojení návštěvníků (zapojení = interakce na webu).
              </p>

              {/* Bar Chart */}
              <div className="h-[280px]">
                <Custom_ResponsiveBar 
                  Data={SessionEngagementData}
                  keys={["value"]}
                  indexBy={"label"}
                  axisBottomText="admin.statistics.web.traffic_channel_quality_legend_x"
                  axisLeftText="admin.statistics.web.traffic_channel_quality_legend_y"
                  tooltipLabel="admin.statistics.web.traffic_channel_quality_title"
                  tooltipValueName="admin.statistics.web.traffic_channel_quality_tooltip_name"
                  tooltipValueText="%"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Top viewed pages on website */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 lg:gap-4 items-center">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4 px-4 py-4 sm:px-6">
              {/* Title */}
              <h3 className={divTitle}>
                {t("admin.statistics.web.top_viewed_pages_title")}
              </h3>
              {/* Table description */}
              <p className={parGraphText}>
                Tabulka zobrazuje nejnavštěvovanějších stránky webu, počet unikátních návštěvníků a průměrnou dobu trvání relace.
              </p>

              {/* Table with content */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto">
                {error ? (
                  <ErrorCountrySection />
                ) : loading ? (
                  <>
                    {[...Array(8)].map((_, i) => (
                      <SkeletonCountryCard key={i} />
                    ))}
                  </>
                ) : (
                  pagesWebData?.pages?.map((name, index) => (
                    <div
                      key={index}
                      className="w-full flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      {/* Page name with icon */}
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">
                          <Globe />
                        </div>
                        <span className="text-gray-800 font-medium">
                          {name.name}
                        </span>
                      </div>

                      {/* Page values */}
                      <div className="grid grid-cols-3 gap-4 text-right">
                        {/* Views */}
                        <div className="min-w-[70px] flex flex-col items-end gap-1">
                          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-50 text-blue-600">
                            <View className="w-4 h-4" />
                          </div>
                          <div className="text-gray-900 font-bold text-lg tabular-nums">
                            {name.screenPageViews}
                          </div>
                        </div>

                        {/* Users */}
                        <div className="min-w-[70px] flex flex-col items-end gap-1">
                          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-50 text-emerald-600">
                            <User2 className="w-4 h-4" />
                          </div>
                          <div className="text-gray-900 font-bold text-lg tabular-nums">
                            {name.activeUsers}
                          </div>
                        </div>

                        {/* Time */}
                        <div className="min-w-[90px] flex flex-col items-end gap-1">
                          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-purple-50 text-purple-600">
                            <TimerIcon className="w-4 h-4" />
                          </div>
                          <div className="text-gray-900 font-bold text-lg tabular-nums">
                            {name.averageSessionDuration} s
                          </div>
                        </div>
                      </div>


                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Device Content */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-4 items-center">
          {/* Device Quality */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4 px-4 py-4 sm:px-6">
              {/* Title */}
              <h3 className={divTitle}>
                {t("admin.statistics.web.device_engagment_quality_title")}
              </h3>
              {/* Graph description */}
              <p className={parGraphText}>
                Graf zobrazuje kvalitu návštěv na webu podle typu připojeného zařízení za zvolené období. Kvalita je měřena pomocí míry zapojení návštěvníků (zapojení = interakce na webu).
              </p>

              {/* Bar Chart */}
              <div className="h-[280px]">
                <Custom_ResponsiveBar 
                  Data={DeviceEngagementData}
                  keys={["value"]}
                  indexBy={"label"}
                  axisBottomText="admin.statistics.web.device_engagment_quality_legend_x"
                  axisLeftText="admin.statistics.web.device_engagment_quality_legend_y"
                  tooltipLabel="admin.statistics.web.device_engagment_quality_title"
                  tooltipValueName="admin.statistics.web.traffic_channel_quality_tooltip_name"
                  tooltipValueText="%"
                />
              </div>

            </div>
          </div>
          
          {/* Channel Distribution */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4 px-4 py-4 sm:px-6">
              {/* Title */}
              <h3 className={divTitle}>
                {t("admin.statistics.web.device_engagment_distribution_title")}
              </h3>
              {/* Graph description */}
              <p className={parGraphText}>
                Graf zobrazuje rozdělení návštěv na webu podle různých typů zařízení za zvolené období.
              </p>

              {/* Pie Chart */}
              <div className="h-[280px]">
                <Custom_ResponsivePie 
                  Data={DeviceNameData} 
                />
              </div>

            </div>
          </div>

        </div>

        {/* Ending div */}
        <div className="mb-8"></div>

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
