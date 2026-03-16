import type { Schema, Struct } from '@strapi/strapi';

export interface ButtonButton extends Struct.ComponentSchema {
  collectionName: 'components_button_buttons';
  info: {
    displayName: 'Button';
    icon: 'code';
  };
  attributes: {
    className: Schema.Attribute.String;
    disabled: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    href: Schema.Attribute.String;
    page: Schema.Attribute.Relation<'oneToOne', 'api::page.page'>;
    size: Schema.Attribute.Enumeration<['default', 'sm', 'lg', 'icon']> &
      Schema.Attribute.DefaultTo<'default'>;
    text: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<
      ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']
    > &
      Schema.Attribute.DefaultTo<'default'>;
  };
}

export interface MenuMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_menu_menu_items';
  info: {
    displayName: 'Menu Item';
    icon: 'bulletList';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    page: Schema.Attribute.Relation<'oneToOne', 'api::page.page'>;
    submenu_items: Schema.Attribute.Component<'menu.submenu-item', true>;
  };
}

export interface MenuMenuItemZone extends Struct.ComponentSchema {
  collectionName: 'components_menu_menu_item_zones';
  info: {
    displayName: 'menu-item-zone';
  };
  attributes: {
    label2: Schema.Attribute.String;
  };
}

export interface MenuSubmenuItem extends Struct.ComponentSchema {
  collectionName: 'components_menu_submenu_items';
  info: {
    displayName: 'Submenu Item';
    icon: 'stack';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    page: Schema.Attribute.Relation<'oneToOne', 'api::page.page'>;
  };
}

export interface PageHeaderPolicy extends Struct.ComponentSchema {
  collectionName: 'components_page_header_policies';
  info: {
    displayName: 'Header-Policy';
    icon: 'code';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface TextTextWAccent extends Struct.ComponentSchema {
  collectionName: 'components_text_text_w_accents';
  info: {
    displayName: 'Text w Accent';
    icon: 'bold';
  };
  attributes: {
    main: Schema.Attribute.String;
    secondary: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'button.button': ButtonButton;
      'menu.menu-item': MenuMenuItem;
      'menu.menu-item-zone': MenuMenuItemZone;
      'menu.submenu-item': MenuSubmenuItem;
      'page.header-policy': PageHeaderPolicy;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'text.text-w-accent': TextTextWAccent;
    }
  }
}
