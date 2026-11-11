# Hostinger deployment configuration

The production workflow builds and smoke-tests the site for pull requests, but deploys only for a push to `main` or a manual dispatch whose selected ref is `main` and whose deployment target input is `main`. The `hostinger-production` environment remains required.

## GitHub environment secrets

Add these secrets to the `hostinger-production` environment:

- `HOSTINGER_FTP_SERVER`: the Hostinger FTP hostname whose TLS certificate matches that exact name.
- `HOSTINGER_FTP_USERNAME`: the restricted deployment account username.
- `HOSTINGER_FTP_PASSWORD`: that account's password.
- `HOSTINGER_FTP_DIRECTORY`: the manually verified path relative to the FTP account's visible root, including a trailing slash. Do not put the absolute Hostinger filesystem path here.

Hostinger lists `/home/u252911033/domains/adsrow.com/public_html` as the account directory, and says this account is restricted to that directory. The FTP action's `server-dir` is resolved by the FTP server relative to the account's FTP-visible working root. If the restricted account opens directly inside its assigned directory, the correct value is `./`; this must be confirmed by logging in with this restricted account and checking its initial directory before the secret is set. Do not use `/home/u252911033/domains/adsrow.com/public_html/` as `server-dir` unless the FTP client visibly exposes that path and the action can access it. The workflow requires a relative path ending in `/` and rejects absolute paths and parent traversal.

## Explicit FTPS verification

`SamKirkland/FTP-Deploy-Action@v4.3.5` supports `protocol: ftps` (explicit TLS), port selection, and strict certificate verification. A read-only handshake to `ftp.adsrow.com:21` received `AUTH SSL successful`, confirming explicit FTPS is enabled at the endpoint. The endpoint's certificate validation then failed with `SEC_E_WRONG_PRINCIPAL`: the certificate does not match `ftp.adsrow.com`. The workflow therefore uses explicit FTPS with `security: strict`, and will stop before transferring files until `HOSTINGER_FTP_SERVER` is set to a Hostinger-provided hostname matching the certificate, or Hostinger corrects the certificate. Do not change security to `loose` or fall back to plain FTP for production credentials.

Hostinger's standard FTP setup guide currently tells customers to use plain FTP on port 21, so confirm the correct FTPS hostname and certificate with the exact hPanel account before the first run. See [Hostinger's FTP details guide](https://www.hostinger.com/support/1714427-how-to-find-ftp-details-on-hostinger-dashboard-at-hostinger/) and the [FTP-Deploy-Action v4.3.5 configuration](https://github.com/SamKirkland/FTP-Deploy-Action/blob/v4.3.5/README.md).

## First-run checks

- Verify the account's FTP-visible root using the restricted deployment account; set `HOSTINGER_FTP_DIRECTORY` to `./` only if the initial directory is the website root.
- Confirm the hPanel-provided FTPS hostname matches its TLS certificate; keep `security: strict`.
- Create `hostinger-production` and configure required reviewers if available.
- Add the FTP values as environment secrets. Never place the password in repository files or logs.
- Review the deployment diff and ensure `dist/.htaccess`, `dist/app.html`, `dist/index.html`, and route documents are present in the artifact.
- Allow the first deployment only from `main` after these checks. Do not run a production deployment as part of configuration verification.

The artifact upload explicitly includes hidden files. The FTP deploy uses only the downloaded `dist/` artifact, retains `.htaccess`, excludes repository metadata, and keeps `dangerous-clean-slate: false`. No DNS changes or Vercel changes are part of this workflow.
