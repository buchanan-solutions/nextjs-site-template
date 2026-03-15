# Strapi & NEXTJS Website Template

## Strapi v5 CMS & NEXTJS Website Setup process

### Running CMS Locally for Development
Starting the CMS for development leverages the Strapi CMS DATABASE_CLIENT = 'sqlite' which generates a local `./cms/.tmp` folder with a bind-mount volume to the container so any created sample data persists container restarts for developer experience.

To start the CMS application in Docker in development mode (hot-reload supported and generated content types sync) execute the following commands:

```bash
cd cms
docker compose -f compose.local.sqlite.yaml up cms
```

Then browse to `http://localhost:1337` and when running for the first time will have to register an account.

Use a familar email and can enter an insecure & easy-to-remember password:

First Name: Your first name
Email: your@email.com
Password: Password1

Once you register, you will be brought to the Strapi CMS homepage and can now create / modify content types as well as create sample content to hydrate pages on load.