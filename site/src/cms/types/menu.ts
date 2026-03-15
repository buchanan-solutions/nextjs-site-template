// ./site/src/cms/types/menu.ts

import type { Document } from "@/lib/cms/types/document";
import type { Button } from "@/cms/components/buttons/button";
import type { MenuItem } from "@/cms/components/menu/menu-item";

export interface Menu extends Document {
  items: MenuItem[];
  buttons: Button[];
}
