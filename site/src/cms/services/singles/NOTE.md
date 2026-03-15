This pattern in `src/services/cms/singles` (and really any other `src/idiomatic_react_folder/cmd/...`) is the "pattern that implementers of `@buchanan-solutions/strapi-react` SDK will follow.

The seperation is perfectly described below:

```tsx
// src/services/cms/singles/home.ts
import type { Home } from "@/cms/types/home";
import { fetchSingle } from "@/lib/cms/single/single-factory";

export async function getHome(locale: string): Promise<Home | null> {
  return fetchSingle<Home>({
    resource: "home",
    locale: locale,
    params: {
      populate: ["Letter"],
    },
  });
}
```

The SDK will not know that the user has a Global single, or a Home single. They can build their own utilities but the main point is that the fetchSingle utility allows them to pass in an interface, specify the resource name, pass in the Strapi CMS specific params, and to get back an awaitable result of their data point (or an error / warning).
