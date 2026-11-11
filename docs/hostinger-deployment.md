# Hostinger deployment

GitHub Actions builds and smoke-tests the site for pull requests to `main`. A successful push to `main`, or a manual run, then deploys the exact tested `dist/` artifact to the Hostinger temporary domain through FTP. Deployments are serialized. The FTP action does not clean the destination, so the first deployment preserves existing files; obsolete hashed assets can be removed later after the live site has been verified and a backup exists.

## GitHub setup

Create the `hostinger-production` environment in repository settings. Enable required reviewers there if the repository plan supports environment protection. Add these environment secrets after confirming the Hostinger account settings:

- `HOSTINGER_FTP_SERVER`
- `HOSTINGER_FTP_USERNAME`
- `HOSTINGER_FTP_PASSWORD`
- `HOSTINGER_FTP_DIRECTORY` — absolute FTP path to the temporary domain's document root, ending in `public_html/` (or the account's confirmed equivalent).

The repository contains no Hostinger account configuration, so the FTP server, username, and exact document-root path must be read from Hostinger hPanel. The workflow refuses deployment when the directory secret is absent or does not identify a `public_html` path. Set it to the temporary domain's root, never the primary domain's root. Upload contents are only the generated `dist/` files, including `.htaccess`.

No prior workflow files or deployment history were present in this checkout, so earlier Actions failures or timeouts could not be inspected. The build job has a 15-minute limit and the deploy job a 10-minute limit; the prerender step is included in `npm run build` and runs only once per workflow.

## Checks

CI verifies the entry documents, Apache rules, all current prerendered routes, representative JS/CSS assets and favicon. It runs the local Hostinger preview and checks the homepage, auth shell routes, prerendered routes, and genuine 404 responses for unknown paths and missing assets. No separate automated unit-test script is currently defined in `package.json`.

## Temporary-domain verification

After the first deploy, check the temporary domain over HTTP and HTTPS: homepage and hero animation on desktop/mobile; `/login`, `/signup`, `/forgot-password`, `/reset-password`, and `/network`; a prerendered page; an unknown URL and missing asset returning 404; CSS, JavaScript, WebP, and font requests; and the active `.htaccess` behavior. Confirm the FTP root from the deployed files before considering the deployment complete. The workflow itself does not claim live verification.

## adsrow.com go-live checklist

- Map `adsrow.com` to the intended Hostinger site in hPanel; confirm the temporary deployment first.
- Review DNS A/AAAA/CNAME records and TTL, then make any DNS change manually.
- Issue and verify the HTTPS certificate before enabling canonical HTTPS redirects.
- Confirm canonical metadata and sitemap URLs for `https://adsrow.com`.
- Review redirects from `www` and legacy URLs, and verify no redirect loops.
- Add production URLs to Supabase allowed redirect URLs and OAuth provider callback settings.
- Set and verify production environment variables in the hosting build/deploy configuration as needed.
- Test contact form delivery end to end.
- Review legal acceptance flow and published legal documents.
- Keep the existing Vercel deployment available as a rollback until Hostinger and domain checks pass.
