import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export function useMenuItemsConfig() {
  const { t } = useTranslation();

  return useMemo(() => [
    { name: t("home"), path: "/" },
    {
      name: t("sortiment"),
      submenu: [
        { name: t("adaptery"), path: "/adaptery" },
        { name: t("brzdice"), path: "/brzdice" },
        { name: t("desticky"), path: "/desticky" },
        { name: t("hadicky"), path: "/hadicky" },
        { name: t("kotouce"), path: "/kotouce" },
        { name: t("pumpy"), path: "/pumpy" },
        { name: t("prislusenstvi"), path: "/prislusenstvi" },
      ],
    },
    { name: t("kontakt"), path: "/contact" },
  ], [t]);
}
