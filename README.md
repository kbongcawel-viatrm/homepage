# Kevin Bongcawel — Personal Portfolio

A responsive, single-page portfolio built with Vite, Bootstrap 5, and custom CSS.

## Design direction

The layout takes inspiration from ThemeWagon's [Atom portfolio](https://preview.themewagon.com/atom/): a personal introduction, skill indicators, service cards, career history, portfolio projects, and a contact section. The implementation is independently customized for Kevin's cloud, DevOps, platform engineering, and security background.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Cloudflare Pages

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`

## Profile links

- LinkedIn: https://www.linkedin.com/in/kimagustin22/
- GitHub: https://github.com/kbongcawel-viatrm


## Cloudflare Workers Static Assets deployment

The production hostname is configured as `bio.home-security.uk`.

- Worker: `kevin-bongcawel-portfolio`
- Build command: `npm run build`
- Static asset directory: `dist/`
- Wrangler configuration: `wrangler.jsonc`
- Deployment workflow: `.github/workflows/deploy-cloudflare.yml`

### Required GitHub Actions secret

Add a Cloudflare API token to this repository:

1. Open **Settings → Secrets and variables → Actions**.
2. Create a repository secret named `CLOUDFLARE_API_TOKEN`.
3. Grant the token permission to edit Workers Scripts and manage Workers custom domains for the `home-security.uk` zone/account.
4. Run **Actions → Build and deploy portfolio to Cloudflare Workers → Run workflow**.

The workflow builds the Vite site and deploys the Worker plus `dist/` assets. Wrangler provisions the configured custom domain and TLS certificate.
