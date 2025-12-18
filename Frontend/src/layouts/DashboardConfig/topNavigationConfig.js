import { 
  Home, Package, Users, ImportIcon, Car, PackageSearch, ChartArea
} from "lucide-react";

export const topNavigationConfig = [
  {
    id: "dashboard",
    label: "Přehled webu",
    icon: Home,
    to: "/admin/dashboard",
    type: "link"
  },
  {
    id: "sortiment-vyrobce",
    label: "Sortiment výrobců",
    icon: PackageSearch,
    type: "link",
    to: "/admin/manufacturer-data",
    permissions: ["isInternal", "isActive"],
  },
  {
    id: "sortiment",
    label: "Sortiment",
    icon: Package,
    type: "dropdown",
    permissions: ["isInternal", "isActive"],
    items: [
      { label: "Adaptéry", to: "/admin/sortiment/adaptery", iconPath: "/icons/adapter.svg" },
      { label: "Brzdiče", to: "/admin/sortiment/brzdice", iconPath: "/icons/caliper.svg" },
      { label: "Destičky", to: "/admin/sortiment/desticky", iconPath: "/icons/pad.svg" },
      { label: "Kotouče", to: "/admin/sortiment/kotouce", iconPath: "/icons/disc.svg" },
      { label: "Hadičky", to: "/admin/sortiment/hadicky", iconPath: "/icons/brake_hoses.svg" },
      { label: "Pumpy", to: "/admin/sortiment/pumpy", iconPath: "/icons/brake_pump.svg" },
      { label: "Příslušenství", to: "/admin/sortiment/prislusenstvi", iconPath: "/icons/accessories.svg" }
    ]
  },
  {
    id: "vehicles",
    label: "Vozidla",
    icon: Car,
    type: "dropdown",
    permissions: ["isInternal", "isActive"],
    items: [
      { label: "Výrobce vozidel", to: "/admin/manufacturer", iconPath: "/icons/manufacturer.svg" },
      { label: "Automobily", to: "/admin/vehicles/automobily", iconPath: "/icons/car.svg" },
      { label: "Motocykly", to: "/admin/vehicles/motocykly", iconPath: "/icons/motorbike.svg" },
      { label: "Motokáry", to: "/admin/vehicles/motokary", iconPath: "/icons/kart.svg" },
      { label: "Jízdní kola", to: "/admin/vehicles/kola", iconPath: "/icons/bike.svg" },
      { label: "Letadla", to: "/admin/vehicles/letadla", iconPath: "/icons/plane.svg" },
      { label: "Průmysl", to: "/admin/vehicles/prumysl", iconPath: "/icons/industry.svg" }
    ]
  },
  {
    id: "users",
    label: "Uživatelé",
    icon: Users,
    to: "/admin/users",
    permissions: ["isAdmin", "isActive"],
    type: "link"
  },
  {
    id: "import",
    label: "Import dat",
    icon: ImportIcon,
    to: "/admin/import-data",
    permissions: ["isAdmin", "isActive"],
    type: "link"
  },
  {
    id: "statistics",
    label: "Statistiky webu",
    icon: ChartArea,
    to: "/admin/statistics",
    permissions: ["isAdmin", "isActive"],
    type: "link"
  }
];