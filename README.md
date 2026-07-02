# GoldFren Web Catalog

GoldFren Web Catalog is a full-stack product catalog for GoldFren brake parts.
It combines a public searchable catalog with a protected administration area for
catalog data, users, images, statistics, and Google Analytics reporting.

Current frontend application version: `1.5.0`.

## What The Project Does

- Public catalog website for brake pads, brake discs, calipers, adapters, hoses,
  pumps, accessories, and related product categories.
- Vehicle-based search for compatible products.
- Product detail pages with images and structured catalog data.
- Multilingual frontend interface.
- Cookie consent and Google Analytics 4 integration.
- Protected dashboard for catalog management and statistics.
- Django REST API consumed by the React frontend.

## Tech Stack

Frontend:

- React 19
- Vite 8
- React Router 7
- i18next / react-i18next
- Nivo charts
- Tailwind CSS 4

Backend:

- Python 3.14 container image
- Django 6
- Django REST Framework
- JWT authentication with `djangorestframework-simplejwt`
- MySQL 8
- File-based Django cache
- Gunicorn in production

Infrastructure:

- Docker and Docker Compose
- Nginx reverse proxy
- Development and production compose files
- Certbot renewal container in production
- Optional MySQL backup container in production

## Repository Structure

```text
.
|-- Backend/                 # Django project, API, auth, services, static files
|-- Docker/
|   |-- backend/             # Backend Dockerfiles
|   |-- frontend/            # Frontend Dockerfiles
|   `-- nginx/               # Nginx development/production config
|-- Frontend/                # React + Vite application
|-- SQL/                     # MySQL schema and seed/init scripts
|-- nginx/                   # Production SSL snippets and certbot folders
|-- docker-compose.dev.yaml  # Local development stack
|-- docker-compose.prod.yaml # Production-like stack
`-- README.md
```

## Main Services

Development stack:

- `goldfren_mysql` - MySQL 8 database, exposed on host port `3306`
- `goldfren_backend` - Django development server on container port `8000`
- `goldfren_frontend` - Vite development server, exposed on host port `3000`
- `goldfren_nginx` - reverse proxy, exposed on host port `80`

Production stack:

- `goldfren_mysql` - MySQL 8 database
- `goldfren_backend` - Django served by Gunicorn
- `goldfren_frontend` - builds the Vite frontend into a shared volume
- `goldfren_nginx` - serves the built frontend and proxies API/admin traffic
- `goldfren_certbot` - renews Let's Encrypt certificates
- `goldfren_mysql_backup` - periodic MySQL backup service

## API Paths

Nginx proxies the API through these main prefixes:

- Public API: `/api/goldfren/public/`
- Internal/admin API: `/api/goldfren/internal/`
- Django admin: `/admin/`
- Media files: `/GoldFren_Media/`
- Static files: `/static/`

Major API groups include:

- `adaptery`
- `brzdice`
- `desticky`
- `kotouce`
- `hadicky`
- `pumpy`
- `prislusenstvi`
- `vozidla`
- `sortiment`
- `image`
- `users`
- `auth`
- `metrics`

## Prerequisites

- Docker
- Docker Compose v2 (`docker compose`)
- Git

For non-Docker local development you also need:

- Python compatible with the backend requirements
- Node.js compatible with the frontend lockfile
- MySQL 8

## Environment Files

The compose files expect local environment files that are not committed:

- `.env.dev` for development
- `.env.prod` for production

Start from the example file:

```bash
cp .env.example .env.dev
cp .env.example .env.prod
```

Then fill in real values for MySQL, Django, frontend, and GA4 settings.

The commands below pass these files with `--env-file`. This is important because
Compose uses those variables while parsing `docker-compose.*.yaml`, before the
container-level `env_file` settings are applied.

If a value contains `$`, wrap it in single quotes in the env file or escape the
character as `$$` so Compose does not treat it as another variable.

Important variables:

- `MYSQL_HOSTNAME`
- `MYSQL_PORT`
- `MYSQL_ROOT_USER`
- `MYSQL_ROOT_PASSWORD`
- `MYSQL_CORE_DATABASE`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `DATABASE_URL`
- `DEBUG`
- `ALLOWED_HOSTS`
- `DJANGO_SECRET_KEY`
- `VITE_API_URL`
- `VITE_APP_VERSION`
- `VITE_GA_ID`

For development, `MYSQL_HOSTNAME` should usually match the compose service name:

```env
MYSQL_HOSTNAME=goldfren_mysql
MYSQL_PORT=3306
```

## Run With Docker - Development

Build and start the full development stack:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yaml up --build
```

Start it in the background:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yaml up -d --build
```

Open the application:

- Nginx entry point: `http://localhost`
- Vite dev server: `http://localhost:3000`
- Django admin through Nginx: `http://localhost/admin/`

View logs:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yaml logs -f
docker compose --env-file .env.dev -f docker-compose.dev.yaml logs -f backend
docker compose --env-file .env.dev -f docker-compose.dev.yaml logs -f frontend
docker compose --env-file .env.dev -f docker-compose.dev.yaml logs -f nginx
docker compose --env-file .env.dev -f docker-compose.dev.yaml logs -f goldfren_mysql
```

Stop the stack:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yaml down
```

Stop the stack and remove named volumes:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yaml down -v
```

Use `down -v` only when you intentionally want to remove database, media,
static, and node module volumes for this stack.

## Run With Docker - Production

Build and start the production stack:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yaml up -d --build
```

Open the production site through Nginx:

- HTTP: `http://localhost`
- HTTPS: `https://catalog.goldfren.cz` when DNS and certificates are configured

View production logs:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yaml logs -f
docker compose --env-file .env.prod -f docker-compose.prod.yaml logs -f backend
docker compose --env-file .env.prod -f docker-compose.prod.yaml logs -f nginx
docker compose --env-file .env.prod -f docker-compose.prod.yaml logs -f certbot
docker compose --env-file .env.prod -f docker-compose.prod.yaml logs -f mysql_backup
```

Stop production containers:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yaml down
```

Rebuild only one service:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yaml build backend
docker compose --env-file .env.prod -f docker-compose.prod.yaml up -d backend
```

## Common Docker Commands

Check running containers:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yaml ps
docker compose --env-file .env.prod -f docker-compose.prod.yaml ps
```

Run Django checks:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yaml exec backend python manage.py check
```

Run migrations manually:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yaml exec backend python manage.py migrate
```

Create a Django superuser:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yaml exec backend python manage.py createsuperuser
```

Collect static files:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yaml exec backend python manage.py collectstatic --noinput
```

Open a MySQL shell:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yaml exec goldfren_mysql mysql -u root -p
```

Rebuild after dependency or Dockerfile changes:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yaml build --no-cache
docker compose --env-file .env.dev -f docker-compose.dev.yaml up -d
```

## Database Initialization

The `SQL/` directory is mounted into MySQL at:

```text
/docker-entrypoint-initdb.d
```

MySQL runs these scripts only when the database volume is created for the first
time. If you change scripts in `SQL/` and need to reinitialize the development
database, remove the compose volumes and start again:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yaml down -v
docker compose --env-file .env.dev -f docker-compose.dev.yaml up -d --build
```

This deletes the local development database volume.

## Local Development Without Docker

Docker is the preferred way to run the project. If you need to run services
directly on the host, use the following rough flow.

Backend:

```bash
cd Backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Frontend:

```bash
cd Frontend
npm install --legacy-peer-deps
npm run dev
```

The host machine must also have a reachable MySQL 8 instance and environment
variables matching `Backend/GoldFren/settings.py`.

## Frontend Commands

Run from `Frontend/`:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Backend Commands

Run from `Backend/` or inside the `backend` container:

```bash
python manage.py check
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
```

## Production Notes

- `docker-compose.prod.yaml` expects `.env.prod`.
- Nginx is configured for `catalog.goldfren.cz`, `catalog.goldfren.com`, and
  `katalog.goldfren.cz`.
- HTTPS certificates are expected under `./nginx/certbot/conf`.
- Certbot uses the webroot at `./nginx/certbot/www`.
- MySQL backups are written to `/home/backup/mysql` on the host by the
  `mysql_backup` service.
- The production frontend container builds static files into the
  `frontend_build` volume, which Nginx serves from `/usr/share/nginx/html`.

## Troubleshooting

If containers are unhealthy:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yaml ps
docker compose --env-file .env.dev -f docker-compose.dev.yaml logs -f backend
docker compose --env-file .env.dev -f docker-compose.dev.yaml logs -f goldfren_mysql
```

If the frontend cannot reach the API, check:

- `VITE_API_URL`
- Nginx routes in `Docker/nginx/default.dev.conf`
- backend health with `python manage.py check`

If SQL scripts do not appear to run, the MySQL volume probably already exists.
Use `down -v` only after backing up any data you need.

If dependencies changed, rebuild the affected image:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yaml build backend
docker compose --env-file .env.dev -f docker-compose.dev.yaml build frontend
```

## Current Status

The catalog, API, Docker stacks, and dashboard structure are in place. Some
administration workflows may still be actively evolving, but the repository now
contains the main development and production paths needed to run the project.
