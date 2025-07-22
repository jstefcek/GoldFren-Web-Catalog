import { Home, Package, Users, 
  ImportIcon, Car, PackageSearch
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
    label: "Sortiment Výrobce",
    icon: PackageSearch,
    type: "link",
    to: "/admin/manufacturer",
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
      { label: "Hadičky", to: "/admin/sortiment/hadicky", icon: Package },
      { label: "Pumpy", to: "/admin/sortiment/pumpy", icon: Package },
      { label: "Příslušenství", to: "/admin/sortiment/prislusenstvi", icon: Package }
    ]
  },
  {
    id: "vehicles",
    label: "Vozidla",
    icon: Car,
    type: "dropdown",
    permissions: ["isInternal", "isActive"],
    items: [
      { label: "Automobily", to: "/admin/vehicles/automobily", iconPath: "/icons/car.svg" },
      { label: "Motocykly", to: "/admin/vehicles/motocykly", iconPath: "/icons/motorbike.svg" },
      { label: "Motokáry", to: "/admin/vehicles/motokary", iconPath: "/icons/kart.svg" },
      { label: "Jízndní kola", to: "/admin/vehicles/kola", iconPath: "/icons/bike.svg" },
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
  }
];