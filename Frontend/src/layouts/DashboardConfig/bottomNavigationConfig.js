import { User, LogOut, Globe, Languages } from "lucide-react";

export const bottomNavigationConfig = [
  { id: "lang_switcher", label: null, icon: Languages, to: null, type: "lang_switcher" },
  { id: "homepage", label: "homepage", icon: Globe, to: "/", type: "link" },
  { id: "account", label: "account", icon: User, to: "admin/account", type: "link" },
  { id: "logout", label: "logout", icon: LogOut, type: "button", colorTheme: "red" }
];