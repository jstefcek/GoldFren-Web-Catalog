import { Home, Package, Users, ImportIcon, Car } from "lucide-react";

export const navigationConfig = [
  {
    id: "dashboard",
    label: "Přehled webu",
    icon: Home,
    to: "/admin/dashboard",
    type: "link"
  },
  {
    id: "sortiment",
    label: "Sortiment",
    icon: Package,
    type: "dropdown",
    items: [
      { label: "Adaptéry", to: "/admin/edit/adaptery", iconPath: "/icons/adapter.svg" },
      { label: "Brzdiče", to: "/admin/edit/brzdice", iconPath: "/icons/caliper.svg" },
      { label: "Destičky", to: "/admin/edit/desticky", iconPath: "/icons/pad.svg" },
      { label: "Kotouče", to: "/admin/edit/kotouce", iconPath: "/icons/disc.svg" },
      { label: "Hadičky", to: "/admin/edit/hadicky", icon: Package },
      { label: "Pumpy", to: "/admin/edit/pumpy", icon: Package },
      { label: "Příslušenství", to: "/admin/edit/prislusenstvi", icon: Package }
    ]
  },
  {
    id: "vehicles",
    label: "Vozidla",
    icon: Car,
    type: "dropdown",
    items: [
      { label: "Automobily", to: "/admin/edit/automobily", iconPath: "/icons/car.svg" },
      { label: "Motorcykly", to: "/admin/edit/motorcykly", iconPath: "/icons/motorbike.svg" },
      { label: "Motokáry", to: "/admin/edit/motokary", iconPath: "/icons/kart.svg" },
      { label: "Jizndní kola", to: "/admin/edit/kola", iconPath: "/icons/bike.svg" },
      { label: "Letadla", to: "/admin/edit/letadla", iconPath: "/icons/plane.svg" },
      { label: "Průmysl", to: "/admin/edit/prumysl", iconPath: "/icons/industry.svg" }
    ]
  },
  {
    id: "users",
    label: "Uživatelé",
    icon: Users,
    to: "/admin/users",
    type: "link"
  },
  {
    id: "import",
    label: "Import dat",
    icon: ImportIcon,
    to: "/admin/import-data",
    type: "link"
  }
];