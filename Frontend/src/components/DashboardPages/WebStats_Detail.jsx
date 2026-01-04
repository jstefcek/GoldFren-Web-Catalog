import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../../services/authContext";
import AlertDialog from "../ui/Custom_AlertDialog";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { CustomSelect } from "../SearchForm/ui/CustomSelect";
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { useStatsAPI } from "../../hooks/Stats_APIHook";
import { SkeletonMetricCard, SkeletonCountryCard, ErrorMetricCard, ErrorCountrySection } from "../ui/Custom_SkeletonUI.jsx"
import { LineDataTransform } from "../../hooks/DataTransformers/GraphTransformer";

export default function StatisticsPage_Layout() {
  const { userInfo } = useAuth();
  const [alertData, setAlertData] = useState(null);
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(30);

  // Reusable design
  const cardTitle = "text-sm font-medium text-gray-500 mb-1";
  const cardText = "text-gray-900 text-[36px] font-black flex items-center gap-1";
  const divTitle = "text-3xl font-bold text-gray-900 mb-4";

  // Series colors
  const SERIES_COLORS = {
  screenPageViews: "#22c55e",
  sessions: "#3b82f6",
  activeUsers: "#ef4444",
};

  // Handle closing the alert dialog
  const handleCloseAlert = () => {
    setAlertData(null);
  };

  // Prepare endpoint URLs
  const days = selectedDate?.value || selectedDate;
  const summaryWebReq = `/api/goldfren/internal/metrics/stats/summary?days=${days}`;
  const trafficWebReq = `/api/goldfren/internal/metrics/stats/traffic?days=${days}`;
  const EngagementQualityReq = `/api/goldfren/internal/metrics/stats/engagement?days=${days}`;

  // Fetch data
  const summaryRes = useStatsAPI(summaryWebReq, userInfo?.access_token, { auto: false });
  const trafficRes = useStatsAPI(trafficWebReq, userInfo?.access_token, { auto: false });
  const engagementRes = useStatsAPI(EngagementQualityReq, userInfo?.access_token, { auto: false });

  // Destructure data and loading states
  const { data: summaryWebData } = summaryRes;
  const { data: trafficWebData } = trafficRes;
  const { data: engagementWebData } = engagementRes;

  // Combine loading and error states
  const loading = summaryRes.loading || trafficRes.loading || engagementRes.loading;
  const error = summaryRes.error || trafficRes.error || engagementRes.error;

  // Transform traffic data for line chart
  const LineData = useMemo(() => LineDataTransform(trafficWebData, "traffic_over_time", ["activeUsers", "sessions", "screenPageViews"]), [trafficWebData]);
  const EngagementLineData = useMemo(() => LineDataTransform(engagementWebData, "engagment_quality", ["engagementRate"]), [engagementWebData]);
  const TimeSpentLineData = useMemo(() => LineDataTransform(engagementWebData, "engagment_quality", ["averageSessionDuration"]), [engagementWebData]);

  // Initial data fetch on component mount
  useEffect(() => {
    summaryRes.refetch();
    trafficRes.refetch();
    engagementRes.refetch();
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

  // Sample data for the pie chart
  const PieData = []

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

              {/* Line Chart Graph */}
              <div className="h-[360px]">
                <ResponsiveLine
                  data={LineData}
                  margin={{ top: 10, right: 30, bottom: 80, left: 60 }}
                  yScale={{ type: "linear", min: "auto", max: "auto", stacked: false, reverse: false }}
                  axisBottom={{ legend: t("admin.statistics.web.traffic_chart_legend_y"), legendOffset: 45, tickValues: 5 }}
                  axisLeft={{ legend: t("admin.statistics.web.traffic_chart_legend_x"), legendOffset: -45 }}
                  enableSlices="x"
                  useMesh={false}
                  theme={{
                    axis: {
                      legend: { text: { fontSize: 14, fontWeight: 700, fill: "#111827" } },
                    },
                    tooltip: {
                      container: { background: "white", color: "#111827", fontSize: 14 },
                    },
                  }}
                  sliceTooltip={({ slice }) => (
                    <div
                      style={{
                        background: "white",
                        color: "#111827",
                        padding: 12,
                        borderRadius: 6,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                        minWidth: 260,
                        boxSizing: "border-box",
                      }}
                    >
                      <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>
                        {t("admin.statistics.web.traffic_chart_legend_y")}:{" "}
                        <span style={{ fontWeight: 800 }}>
                          {slice.points?.[0]?.data?.xFormatted ?? slice.points?.[0]?.data?.x}
                        </span>
                      </div>
                      {slice.points
                        .slice()
                        .sort((a, b) => (b.data.y ?? 0) - (a.data.y ?? 0))
                        .map((p) => {
                          const rawLabel = p.serieId ?? p.serie?.id ?? p.serie?.label ?? p.id ?? "Series";
                          const cleanLabel = String(rawLabel).replace(/\.\d+$/, "");
                          const color = SERIES_COLORS[cleanLabel] ?? "#9CA3AF";

                          return (
                            <div
                              key={p.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 12,
                                marginTop: 6,
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                                <span
                                  style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: 999,
                                    backgroundColor: color,
                                    flex: "0 0 auto",
                                    border: "1px solid rgba(0,0,0,0.08)",
                                  }}
                                />

                                <span
                                  style={{
                                    fontWeight: 700,
                                    color: "#111827",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                  title={cleanLabel}
                                >
                                  {cleanLabel}
                                </span>
                              </div>

                              <span style={{ fontWeight: 800, color: "#111827" }}>
                                {p.data.yFormatted ?? p.data.y}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  )}
                  colors={{ scheme: 'set1' }}
                  lineWidth={2}
                  pointSize={4}
                  pointColor={{ theme: 'background' }}
                  pointBorderWidth={6}
                  pointBorderColor={{ from: 'seriesColor' }}
                  pointLabelYOffset={-12}
                  enableTouchCrosshair={true}
                  legends={[
                    {
                      anchor: "bottom",
                      direction: "row",
                      justify: false,
                      translateX: 0,
                      translateY: 80,
                      itemsSpacing: 16,
                      itemWidth: 120,
                      itemHeight: 20,
                      symbolSize: 10,
                      symbolShape: "circle",
                      itemDirection: "left-to-right",
                      itemOpacity: 1,
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemOpacity: 1,
                          },
                        },
                      ],
                    },
                  ]}
                  motionConfig="slow"
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

              {/* Line Chart Graph */}
              <div className="h-[360px]">
                <ResponsiveLine
                  data={EngagementLineData}
                  margin={{ top: 10, right: 30, bottom: 80, left: 60 }}
                  yScale={{ type: 'linear', min: 'auto', max: 100, stacked: false, reverse: false }}
                  axisBottom={{ legend: t("admin.statistics.web.engagement_trend_chart_legend_y"), legendOffset: 45, tickValues: 5 }}
                  axisLeft={{ legend: t("admin.statistics.web.engagement_trend_chart_legend_x"), legendOffset: -45 }}
                  theme={{
                    axis: {
                      legend: {
                        text: {
                          fontSize: 14,
                          fontWeight: 700,
                          fill: '#111827'
                        }
                      }
                    }
                  }}
                  tooltip={({ point }) => (
                    <div style={{ 
                        background: 'white', 
                        padding: 12, 
                        borderRadius: 6, 
                        boxShadow: '0 1px 4px rgba(0,0,0,0.15)', 
                        minWidth: 240, 
                        maxWidth: 420,
                        boxSizing: 'border-box',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word'
                      }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>
                        {point.serieId || (point.serie && point.serie.id) || t("admin.statistics.web.engagement_trend_title")}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 400 }}>
                        {t("admin.statistics.web.engagement_trend_chart_legend_y")}: <span style={{ fontWeight: 800 }}>{point.data.xFormatted ?? point.data.x}</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 400 }}>
                        {t("admin.statistics.web.engagement_trend_chart_legend_x")}: <span style={{ fontWeight: 800 }}>{point.data.y}</span>
                      </div>
                    </div>
                  )}
                  colors={{ scheme: 'set1' }}
                  lineWidth={4}
                  pointSize={8}
                  pointColor={{ theme: 'background' }}
                  pointBorderWidth={6}
                  pointBorderColor={{ from: 'seriesColor' }}
                  pointLabelYOffset={-12}
                  enableTouchCrosshair={true}
                  useMesh={true}
                  legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        translateX: 0,
                        translateY: 80,
                        itemWidth: 120,
                        itemHeight: 20,
                        symbolShape: 'circle',
                    }
                  ]}
                  motionConfig="slow"
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

              {/* Line Chart Graph */}
              <div className="h-[360px]">
                <ResponsiveLine
                  data={TimeSpentLineData}
                  margin={{ top: 10, right: 30, bottom: 80, left: 60 }}
                  yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
                  axisBottom={{ legend: t("admin.statistics.web.engagement_time_spend_chart_legend_y"), legendOffset: 45, tickValues: 5 }}
                  axisLeft={{ legend: t("admin.statistics.web.engagement_time_spend_chart_legend_x"), legendOffset: -45 }}
                  theme={{
                    axis: {
                      legend: {
                        text: {
                          fontSize: 14,
                          fontWeight: 700,
                          fill: '#111827'
                        }
                      }
                    }
                  }}
                  tooltip={({ point }) => (
                    <div style={{ 
                        background: 'white', 
                        padding: 12, 
                        borderRadius: 6, 
                        boxShadow: '0 1px 4px rgba(0,0,0,0.15)', 
                        minWidth: 240, 
                        maxWidth: 420,
                        boxSizing: 'border-box',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word'
                      }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>
                        {point.serieId || (point.serie && point.serie.id) || t("admin.statistics.web.engagement_time_spend_title")}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 400 }}>
                        {t("admin.statistics.web.engagement_time_spend_chart_legend_y")}: <span style={{ fontWeight: 800 }}>{point.data.xFormatted ?? point.data.x}</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 400 }}>
                        {t("admin.statistics.web.engagement_time_spend_chart_legend_x")}: <span style={{ fontWeight: 800 }}>{point.data.y}</span>
                      </div>
                    </div>
                  )}
                  colors={{ scheme: 'set1' }}
                  lineWidth={4}
                  pointSize={8}
                  pointColor={{ theme: 'background' }}
                  pointBorderWidth={6}
                  pointBorderColor={{ from: 'seriesColor' }}
                  pointLabelYOffset={-12}
                  enableTouchCrosshair={true}
                  useMesh={true}
                  legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        translateX: 0,
                        translateY: 80,
                        itemWidth: 160,
                        itemHeight: 20,
                        symbolShape: 'circle',
                    }
                  ]}
                  motionConfig="slow"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Traffic Sources Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-4 items-center mb-4">
          {/* Channel Distribution */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4 px-4 py-4 sm:px-6">
              {/* Title */}
              <h3 className={divTitle}>
                {t("admin.statistics.web.traffic_channel_distribution_title")}
              </h3>

              {/* Pie Chart */}
              <div className="h-[320px]">
                <ResponsivePie
                  data={PieData}
                  margin={{ top: 0, right: 85, bottom: 0, left: 85 }}
                  innerRadius={0.4}
                  padAngle={0.8}
                  cornerRadius={5}
                  colors={{ scheme: 'set1' }}
                  activeOuterRadiusOffset={8}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                  legends={[]}
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

              {/* Bar Chart */}
              <div className="h-[320px]">
                <ResponsiveBar
                  data={BarData}
                  keys={['engagementRate']}
                  indexBy="source"
                  padding={0.3}
                  groupMode="stacked"
                  labelSkipWidth={20}
                  labelSkipHeight={20}
                  colors={{ scheme: 'set1' }}
                  legends={[
                      {
                          dataFrom: 'keys',
                          anchor: 'bottom',
                          direction: 'row',
                          translateX: 20,
                          translateY: 70,
                          itemsSpacing: 3,
                          itemWidth: 100,
                          itemHeight: 16,
                      }
                  ]}
                  axisBottom={{ tickSize: 6, tickPadding: 4, legend: 'source', legendOffset: 32 }}
                  axisLeft={{ legend: 'food', legendOffset: -40 }}
                  margin={{ top: 10, right: 50, bottom: 70, left: 60 }}
                />
              </div>

            </div>
          </div>
        </div>

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
