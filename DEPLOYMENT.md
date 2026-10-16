# Red Phone for JOSS — deployment

## 1. Upload to GitHub
1. Unzip this project.
2. Create a repository at https://github.com/new.
3. Upload the contents of this folder to the repository root, keeping `public/` and `functions/` as folders.

## 2. Create Cloudflare Pages site
1. Sign in at https://dash.cloudflare.com/.
2. Open **Workers & Pages** and create a Pages application connected to your GitHub repository.
3. Choose **None** for the framework preset if offered, leave the build command blank, and set the build output directory to `public`.
4. Deploy. Cloudflare will give you a `*.pages.dev` address.

## 3. Connect private message storage (required for submissions)
1. In Cloudflare, create a D1 database, e.g. `red-phone-messages`.
2. Open the D1 SQL console and run all commands in `schema.sql`.
3. Open your Pages project **Settings → Bindings** and add a D1 database binding named exactly `DB`.
4. Select the database and save, then redeploy if prompted.

Until D1 is connected, the website can display, but the form will return a setup message instead of storing submissions.

## 4. Test
Submit a test message, then in D1 run:
`SELECT id, category, message, status, created_at FROM messages ORDER BY id DESC LIMIT 10;`
Confirm it has `status = 'pending'`, then delete the test record.

## Safety and privacy
Submissions are private and not shown publicly. This starter project does not include an admin dashboard; review entries in the D1 console and never expose the database publicly. Add rate limiting and a deletion/retention policy before launch. Hosting/security systems may process technical data, so do not promise absolute anonymity. The account is an unofficial student-run project; review submissions for identifying details and harmful content before sharing.
