import { Page } from "../../types/page";

export interface MenuItem {
  id: string;
  label: string;
  page?: Page;
  external_url?: string;
  submenu_items?: MenuSubItem[];
  order?: number;
  // hidden?: boolean;
}

export interface MenuSubItem {
  id: string;
  label: string;
  page?: Page;
  external_url?: string;
  order?: number;
  hidden?: boolean;
}
