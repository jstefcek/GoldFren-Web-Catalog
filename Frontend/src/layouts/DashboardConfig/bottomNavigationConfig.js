import { User, LogOut, Globe } from "lucide-react";

export const bottomNavigationConfig = [
  { id: "homepage", label: "Zpět na stránku", icon: Globe, to: "/", type: "link" },
  { id: "account", label: "Můj účet", icon: User, to: "/account", type: "link" },
  { id: "logout", label: "Odhlásit se", icon: LogOut, type: "button", colorTheme: "red" }
];