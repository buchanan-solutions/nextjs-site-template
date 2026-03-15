import { Page } from "@/cms/types/page";
import { Component } from "@/lib/cms/types/component";

export interface MenuItem extends Component {
  label: string;
  page?: Page;
  href?: string;
  submenu_items?: SubmenuItem[];
}

export interface SubmenuItem extends Component {
  label: string;
  page?: Page;
  href?: string;
}
