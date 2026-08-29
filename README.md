# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## CI/CD (GitHub Actions)

### Local development in Docker

To run the app in a container with hot reload (instead of `npm run dev` on the host):

```bash
# build & start the dev container (Nuxt dev server on http://localhost:3002)
npm run docker:dev

# stop it
npm run docker:dev:down
```

Configuration: `docker-compose.dev.yml` + `Dockerfile.dev`. Optional overrides go into a local `.env` (see `.env.dev.example`). Source files (`app/`, `i18n/`, `nuxt.config.ts`) are mounted so edits hot-reload instantly; `node_modules` and `.nuxt` stay inside the container.

### CI/CD (GitHub Actions)

The repo ships one GitHub Actions workflow in `.github/workflows/`:

- **`deploy.yml`** — builds a Docker image, pushes it to GitHub Container Registry (GHCR) and deploys to a real host over SSH when pushing to `master`/`main`/`production`.

### Deployment setup (production)

1. Configure the following GitHub **Secrets** (Settings → Secrets and variables → Actions):
   - `HOST` — VPS IP/hostname
   - `USERNAME` — SSH user (must be able to use `docker compose`)
   - `SSH_PRIVATE_KEY` — private SSH key (ed25519/rsa) for the deploy user
   - `SSH_KNOWN_HOSTS` — the VPS IP/hostname (used by `ssh-key-action`)

   > SSH port is fixed to `22` in the workflow.

2. Configure GitHub **Variables** (same menu → Variables):
   - `DOMAIN` — your real domain, e.g. `app.example.com`
   - `NUXT_PUBLIC_API_BASE_URL` — relative API base, e.g. `/api/v1`
   - `NUXT_PUBLIC_API_MODE` — `mock` or `real`

3. On the server: the external docker network **`barcode_shared`** must already exist (created by the base barcode compose). The frontend container joins it and Envoy routes `/` → `frontend:80`, sharing the origin with the API — so no CORS, no Caddy, no separate TLS for the front.

4. The workflow will upload `docker-compose.prod.yml` to `~/barcode/front` on the server, generate a real `.env` there from the GitHub variables, pull the nginx image from GHCR and run `docker compose up -d`.

> Note: the SSH key must be added to `~/.ssh/authorized_keys` of the deploy user on the server, and the user needs permissions to run `docker`/`docker compose` (e.g. add to the `docker` group).
