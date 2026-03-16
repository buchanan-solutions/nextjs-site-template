# Developer Guidelines

Strapi vesion:  5-somthing
Next version:   16.1.1

The typical flow for editing your website project is as follows:

1. Create content types in CMS
2. Build utility files to extract content from CMS
3. Build/extend components / templates to consume new data types
4. Test
5. Commit
6. Deploy

## Modifying the CMS Content Types

Whether you are running the Strapi CMS locally (`yarn develop`) or you are running it in Docker locally, the process to modify the CMS Content Types (add / edit fields or add new content types altogether) is as follows:

1. Open `http://localhost:1337`
2. Log in with admin credentials
3. Go to Content Manager
4. Modify / create content types
   Note: Strapi's server will restart every time you save the schema to regenerate it's schema files (TS and JSON). The bind-mount when running the CMS locally in Docker means that it's changes to to schema files are reflected into the repo folder itself (and available for commit) and vice-versa. Then, if you are running the CMS actually locally (not in Docker), then changes are saved to the relevant folders as well and also available for commit.
5. Confirm changes are correct, commit, and Push / submit PR

## 