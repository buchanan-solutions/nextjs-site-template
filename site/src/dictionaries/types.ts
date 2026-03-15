// Dictionary type definitions for better type safety
export type Dictionary = {
  site?: {
    name?: string;
    tagline?: {
      main?: string;
      accent?: string;
    };
  };
  button?: {
    contact_us?: string;
    try_now?: string;
    view_profile?: string;
    read_article?: string;
  };
  headings?: {
    about?: string;
    accreditations?: string;
  };
  cta?: {
    title?: string;
    subtitle?: string;
    body?: string;
  };
};
