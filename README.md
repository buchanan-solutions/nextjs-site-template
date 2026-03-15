# Strapi & NEXTJS Website Template

## Strapi v5 CMS & NEXTJS Website Setup process

### Running CMS Locally for Development
Starting the CMS for development leverages the Strapi CMS DATABASE_CLIENT = 'sqlite' which generates a local `./cms/.tmp` folder with a bind-mount volume to the container so any created sample data persists container restarts for developer experience.

1. Bootstrap CMS Container with SQLITE Database  
    
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

2. Create "Read + i18n" CMS API KEY
    
    You will need a Strapi API KEY to authenticate the NEXTJS site project and will need to grant it internationalization permissions as this project implements internationalizatoin (i18n) by default and Strapi's default Read API Key does not allow granting this permission.

    1. Go to Strapi Admin (cog icon on left-hand sidebar)
    2. Create new API Token
        Name: `Read + i18n` 
        Token Duration: Unlimited
        Token type: Full Access > Read > Custom (will inherit Read Permissions on switch)
    3. Grant `I18n` `listLocales` permission
    4. Save & copy token to ./site/.env `STRAPI_CMS_API_TOKEN`