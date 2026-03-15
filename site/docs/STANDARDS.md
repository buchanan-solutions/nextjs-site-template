# DEVELOPMENT & CODING STANDARDS

The following is a list of coding standards, approaches, strategies, patterns, and implementations that must be adhered to when developing the NEXTJS site app code in this project.

- [DEVELOPMENT \& CODING STANDARDS](#development--coding-standards)
  - [App Setup](#app-setup)
    - [Environment Detection](#environment-detection)


## App Setup

### Environment Detection

To determine the nodeEnv on any client-side component, use the app context:

```ts
import { useApp } from "@/providers/app-setup-provider";

// Inside your component:
const { nodeEnv } = useApp(); // "development" | "production" | "test"
```

**Rules:** 
- Do not read `process.env.NODE_ENV` in client code. Use `useApp().nodeEnv` so behavior matches the server-resolved value.
- You can override when running in development mode by setting .env variable accordingly:
  ```text
  NEXT_PUBLIC_UI_NODE_ENV_OVERRIDE=production
  ``` 
  - If running the NEXTJS app in actual production mode (NODE_ENV=production) can never override back to development (production always takes presedence)