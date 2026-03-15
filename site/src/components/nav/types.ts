import { LucideIcon } from "lucide-react";

export interface NavigationItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  items?: NavigationItem[];
  disabled?: boolean;
  hidden?: boolean;
  comingSoon?: boolean;
}
