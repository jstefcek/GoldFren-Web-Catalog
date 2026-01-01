import { useState } from "react";
//import { useAuth } from "../../services/authContext";
import AlertDialog from "../ui/Custom_AlertDialog";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { CustomSelect } from "../SearchForm/ui/CustomSelect";
//import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';

//const serverUrl = import.meta.env.VITE_API_URL;

export default function StatisticsPage_Layout() {
  //const { userInfo } = useAuth();
  const [alertData, setAlertData] = useState(null);
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState("this_month");

  // Example data
  const exampleData = [
  {
    "datum": "01.12.2025",
    "active_users": 24,
  },
  {
    "datum": "02.12.2025",
    "active_users": 69,
  },
  {
    "datum": "03.12.2025",
    "active_users": 123,
  },
  {
    "datum": "04.12.2025",
    "active_users": 115,
  },
  {
    "datum": "05.12.2025",
    "active_users": 199,
  },
  {
    "datum": "06.12.2025",
    "active_users": 158,
  },
  {
    "datum": "07.12.2025",
    "active_users": 181,
  }
]

  // Handle closing the alert dialog
  const handleCloseAlert = () => {
    setAlertData(null);
  };

  // Handle search button click
  const handleSearch = () => {
    if (!selectedDate) {
      setAlertData({
        title: t("admin.statistics.web.error_title"),
        message: t("admin.statistics.web.error_select_date"),
        type: "error",
        duration: 3000,
      });
      return;
    }

    // Add your search/filter logic here
    console.log("Fetching statistics for:", selectedDate, "days");
  };

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
    } else {
      switch (datePeriod) {
        case "this_month":
          // First day of this month
          fromDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);

          // Last day of this month
          toDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
          break;

        case "half_year":
          // First day 6 months ago
          fromDate = new Date(baseDate.getFullYear(), baseDate.getMonth() - 6, 1);

          // Last day of this month
          toDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
          break;

        case "this_year":
          // First day of this year
          fromDate = new Date(baseDate.getFullYear(), 0, 1);

          // Last day of this month
          toDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
          break;
      }
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
    { value: "today", label: t("admin.statistics.web.today") + ` (${getFormattedDate(todayDate, "today")})`, },
    { value: 7, label: t("admin.statistics.web.last_7_days") + ` (${getFormattedDate(todayDate, 7)})`, },
    { value: 14, label: t("admin.statistics.web.last_14_days") + ` (${getFormattedDate(todayDate, 14)})`, },
    { value: 30, label: t("admin.statistics.web.last_30_days") + ` (${getFormattedDate(todayDate, 30)})`, },
    { value: "this_month", label: t("admin.statistics.web.this_month") + ` (${getFormattedDate(todayDate, "this_month")})`, },
    { value: "half_year", label: t("admin.statistics.web.half_year") + ` (${getFormattedDate(todayDate, "half_year")})`, },
    { value: "this_year", label: t("admin.statistics.web.this_year") + ` (${getFormattedDate(todayDate, "this_year")})`, },
    { value: 365, label: t("admin.statistics.web.last_365_days") + ` (${getFormattedDate(todayDate, 365)})`, },
  ];

  return (
    <div className="min-h-auto px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-2 sm:px-8 sm:py-4">
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

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={!selectedDate}
                className="w-full px-6 py-2.5 bg-red-700 text-white inline-flex cursor-pointer items-center justify-center gap-2 font-semibold rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
              >
                <Search className="w-5 h-5" />
                <span className="whitespace-nowrap">
                  {t("admin.statistics.web.search_text")}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4 sm:px-8 sm:py-5 mt-4">
              {/* Unique visitors displayed in Line Chart */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("admin.statistics.web.unique_web_visit_title")}
              </h2>
              <div style={{ height: '400px' }}>
                <ResponsiveBar
                  data={exampleData}
                  keys={["active_users"]}
                  indexBy="datum"
                  labelSkipWidth={20}
                  labelSkipHeight={20}
                  labelTextColor="white"
                  colors={{ scheme: 'red_grey' }}
                  animate={true}
                  legends={[
                      {
                          dataFrom: 'keys',
                          anchor: 'bottom',
                          direction: 'row',
                          translateX: 0,
                          itemsSpacing: 0,
                          itemWidth: 90,
                          itemHeight: -120
                      }
                  ]}
                  axisBottom={{ legend: t("admin.statistics.web.unique_visitors_x_axis"), legendOffset: 32 }}
                  axisLeft={{ legend: t("admin.statistics.web.unique_visitors_y_axis"), legendOffset: -40 }}
                  margin={{ top: 20, right: 0, bottom: 70, left: 50 }}
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4 sm:px-8 sm:py-5 mt-4">
              {/* Visitors used Languages in Pie Chart */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("admin.statistics.web.visitors_languages_title")}
              </h2>
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
