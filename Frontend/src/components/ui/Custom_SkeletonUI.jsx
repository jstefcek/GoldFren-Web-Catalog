import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";

export const SkeletonMetricCard = () => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
      <div className="h-10 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-1/3"></div>
    </div>
  </div>
);

export const SkeletonCountryCard = () => (
  <div className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-200">
    <div className="animate-pulse flex items-center gap-3 w-full">
      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      <div className="h-4 bg-gray-300 rounded w-24"></div>
      <div className="ml-auto h-5 bg-gray-300 rounded w-8"></div>
    </div>
  </div>
);

export const DataFreshnessSkeleton = () => (
  <div className="flex items-center justify-end gap-2 mt-2 mb-4 min-h-[24px]">
    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
  </div>
);

export const ErrorMetricCard = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-4 h-4 text-red-600" />
        <h3 className="text-sm font-medium text-red-800">
          {t("admin.error_loading_data")}
        </h3>
      </div>
      <div className="text-gray-500 text-2xl font-bold">--</div>
    </div>
  );
};

export const ErrorCountrySection = ({ error }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-red-50 p-6 rounded-lg border border-red-200">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-600 mb-3" />
        <h3 className="text-lg font-semibold text-red-800 mb-1">
          {t("admin.error_loading_data")}
        </h3>
        <p className="text-sm text-red-600 max-w-md">
          {t("admin.error_fetching_data")}: {error}
        </p>
      </div>
    </div>
  );
};
