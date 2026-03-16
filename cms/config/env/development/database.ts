export default ({ env }) => {
  // Default to SQLite for easy local development
  const client = env("DATABASE_CLIENT", "sqlite");

  // SQLite configuration (default)
  if (client === "sqlite") {
    return {
      connection: {
        client: "sqlite",
        connection: {
          filename: env("DATABASE_FILENAME", ".tmp/data.db"),
        },
        useNullAsDefault: true,
      },
    };
  }

  // PostgreSQL configuration (when DATABASE_CLIENT=postgres)
  if (client === "postgres") {
    return {
      connection: {
        client: "postgres",
        connection: {
          host: env("DATABASE_HOST", "0.0.0.0"),
          port: env.int("DATABASE_PORT", 5432),
          database: env("DATABASE_NAME", "strapi"),
          user: env("DATABASE_USERNAME", "strapi_admin"),
          password: env("DATABASE_PASSWORD", "password"),
          ssl: env.bool("DATABASE_SSL", false),
          schema: env("DATABASE_SCHEMA", "public"),
        },
        pool: {
          min: env.int("DATABASE_POOL_MIN", 2),
          max: env.int("DATABASE_POOL_MAX", 10),
        },
      },
    };
  }
};
