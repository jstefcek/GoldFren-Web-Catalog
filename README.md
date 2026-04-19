# GoldFren Web Catalog

Together with my client, we decided to completely redesign their company website to better showcase their catalog of products — including brake pads, adapters, and other brake-related accessories.

The project combines a public searchable catalog with an authenticated admin dashboard for catalog management, users, and basic analytics.

---

## What this project does

- Serves a **public catalog website** with:
  - category browsing for multiple product types,
  - vehicle-based search (find compatible parts for a selected vehicle),
  - product detail pages,
  - multilingual interface (Czech, English, German in the frontend),
  - cookie consent and Google Analytics integration.
- Provides a protected **admin dashboard** with:
  - authentication,
  - users/accounts views,
  - manufacturer, vehicle, and sortiment management views,
  - web and search statistics pages.
- Exposes a **REST API** under a single internal prefix for frontend consumption.

---

## Tech stack

### Frontend
- React 19 + Vite 8
- React Router 7
- i18next localization
- Nivo charts for dashboard visualizations

### Backend
- Django 6 + Django REST Framework
- JWT auth via `djangorestframework-simplejwt`
- MySQL database
- File-based caching and request throttling

### Infrastructure
- Docker / Docker Compose (dev + prod compose files)
- Nginx reverse proxy (HTTP in dev, HTTP/HTTPS in prod)
- Optional Certbot renewal container in production

---

## High-level architecture

- **Frontend** (Vite dev server in development, static build in production)
- **Backend** (Django API + admin + media/static handling)
- **MySQL** (schema bootstrapped from `/SQL` scripts)
- **Nginx** (serves static/media and proxies API traffic)

Main API base path:

`/api/goldfren/internal/`

Major API groups:

- `adaptery`, `brzdice`, `desticky`, `kotouce`, `hadicky`, `pumpy`, `prislusenstvi`
- `vozidla`, `sortiment`, `image`, `users`, `auth`, `metrics`

---

## Repository structure

- `Frontend/` – React application (public site + dashboard UI)
- `Backend/` – Django project and REST API
- `SQL/` – MySQL initialization scripts
- `Docker/` – Dockerfiles + Nginx config files
- `docker-compose.dev.yaml` – local development stack
- `docker-compose.prod.yaml` – production-like stack

---

## Current status

The catalog and API structure are in place with core functionality implemented. Some admin areas (e.g., import page workflow) still look like active/in-progress sections.