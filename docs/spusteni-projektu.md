# Spuštění projektu

Projekt se spouští pomocí Docker Compose. Příkazy v tomto návodu spouštějte z kořenové složky repozitáře.

## Požadavky

- Git
- Docker s podporou příkazu `docker compose`
- volné porty `80`, `3000` a `3306` pro vývojovou konfiguraci
- volné porty `80` a `443` pro produkční konfiguraci

Aktuální větev lze ověřit příkazem:

```bash
git branch --show-current
```

## Příprava proměnných prostředí

Soubory `.env.dev` a `.env.prod` nejsou uložené v Gitu. Při prvním spuštění je vytvořte ze vzoru a nahraďte hodnoty `XNA` skutečnými hodnotami:

```bash
cp .env.example .env.dev
cp .env.example .env.prod
```

Pro vývojovou konfiguraci nastavte mimo jiné `DEBUG=True` a lokální `VITE_API_URL`. V produkci použijte `DEBUG=False`, silný unikátní `DJANGO_SECRET_KEY`, produkční databázové údaje a veřejnou HTTPS adresu API.

> Pokud Docker Compose vypíše varování `The "..." variable is not set`, obsahuje některá hodnota v `.env` znak `$`. Literální hodnotu uzavřete do jednoduchých uvozovek, např. `MYSQL_PASSWORD='heslo$sDolarem'`.

Konfiguraci lze před spuštěním zkontrolovat bez zobrazení jejího rozbaleného obsahu:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yaml config --quiet
```

## Vývojová verze

Sestavení imageů a spuštění všech služeb:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yaml up --build
```

Aplikace je potom dostupná na:

- web: <http://localhost>
- Django administrace: <http://localhost/admin/>
- Vite server přímo: <http://localhost:3000>

Backend při startu vývojového kontejneru automaticky spustí databázové migrace. Zdrojové kódy backendu i frontendu jsou připojené jako volumes, takže běžné změny není nutné pokaždé znovu sestavovat. Po změně závislostí nebo Dockerfile spusťte příkaz znovu s `--build`.

Spuštění na pozadí:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yaml up -d --build
```

Výpis logů:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yaml logs -f
```

Zastavení projektu:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yaml down
```

Příkaz `down` zachová databázová data v Docker volume. Parametr `--volumes` používejte pouze tehdy, když chcete data záměrně odstranit.

## Produkční verze

Produkční konfigurace je určená pro server obsluhující doménu `catalog.goldfren.cz`. Před spuštěním musí existovat:

- vyplněný soubor `.env.prod`,
- DNS záznamy směřující na server,
- TLS certifikát a privátní klíč v `nginx/certbot/conf/live/catalog.goldfren.cz/`,
- soubor `nginx/ssl-params.conf`.

Nejdříve ověřte konfiguraci a sestavte image:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yaml config --quiet
docker compose --env-file .env.prod -f docker-compose.prod.yaml build
```

Spusťte databázi, proveďte migrace a připravte Django statické soubory:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yaml up -d goldfren_mysql
docker compose --env-file .env.prod -f docker-compose.prod.yaml run --rm backend python manage.py migrate
docker compose --env-file .env.prod -f docker-compose.prod.yaml run --rm backend python manage.py collectstatic --noinput
```

Potom spusťte celou produkční sestavu:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yaml up -d
```

Web je dostupný na <https://catalog.goldfren.cz>. Stav a logy služeb zobrazíte pomocí:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yaml ps
docker compose --env-file .env.prod -f docker-compose.prod.yaml logs -f
```

Po nasazení nové verze je bezpečný opakovatelný postup:

```bash
git pull
docker compose --env-file .env.prod -f docker-compose.prod.yaml build
docker compose --env-file .env.prod -f docker-compose.prod.yaml run --rm backend python manage.py migrate
docker compose --env-file .env.prod -f docker-compose.prod.yaml run --rm backend python manage.py collectstatic --noinput
docker compose --env-file .env.prod -f docker-compose.prod.yaml up -d
```

Zastavení produkční sestavy:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yaml down
```

## Užitečné diagnostické příkazy

```bash
# Stav kontejnerů
docker compose --env-file .env.dev -f docker-compose.dev.yaml ps

# Log pouze jedné služby
docker compose --env-file .env.dev -f docker-compose.dev.yaml logs -f backend

# Django kontrola konfigurace
docker compose --env-file .env.dev -f docker-compose.dev.yaml exec backend python manage.py check
```
