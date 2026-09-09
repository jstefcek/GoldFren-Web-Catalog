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

Databáze používá oficiální Docker image MySQL 8.4.11. Image je dostupný pro `linux/amd64` i `linux/arm64`, takže na Macu s Apple Silicon běží nativně bez emulace.

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

## Upgrade MySQL 8.0.44 na 8.4.11

Preferovaný replikovatelný postup používá logický dump, nové čisté MySQL 8.4.11 volume a následný restore. Je popsaný v samostatném dokumentu [Upgrade MySQL 8.0.44 na 8.4.11](upgrade-mysql-8.0.44-na-8.4.11.md).

Následující postup upgradu datového adresáře na místě ponecháváme pouze jako alternativu. Pro produkci použijte preferovaný postup z odkázaného dokumentu.

MySQL 8.4.11 je LTS verze podporovaná Django 6.1. Oficiální Docker image `mysql:8.4.11` je dostupný pro `linux/amd64` i `linux/arm64`, proto se v Compose nenastavuje `platform`.

> Upgrade nejprve proveďte ve vývojovém nebo testovacím prostředí. Po prvním úspěšném startu MySQL 8.4 už nepouštějte MySQL 8.0 nad upgradovaným volume. Návrat na 8.0 se provádí pouze obnovením zálohy.

### 1. Zvolte konfiguraci

Následující příkazy jsou připravené pro dev. Pro produkci změňte první dva řádky na `.env.prod` a `docker-compose.prod.yaml`:

```bash
GOLDFREN_ENV_FILE=.env.dev
GOLDFREN_COMPOSE_FILE=docker-compose.dev.yaml
GOLDFREN_BACKUP_DIR=backups/mysql-8.0.44-before-8.4.11
mkdir -p "$GOLDFREN_BACKUP_DIR"
```

Ověřte, že běží zdrojová verze 8.0.44:

```bash
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" exec goldfren_mysql mysql -uroot -p -e "SELECT VERSION();"
```

### 2. Zkontrolujte autentizační pluginy

MySQL 8.4 má ve výchozím nastavení vypnutý zastaralý plugin `mysql_native_password`. Před upgradem zkontrolujte databázové účty:

```bash
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" exec goldfren_mysql mysql -uroot -p -e "SELECT user, host, plugin FROM mysql.user;"
```

Pokud aplikační účet používá `mysql_native_password`, převeďte jej ještě na MySQL 8.0. Nové heslo musí odpovídat hodnotě v příslušném `.env` souboru:

```sql
ALTER USER 'goldfren_user'@'%' IDENTIFIED WITH caching_sha2_password BY '<NOVÉ_HESLO>';
```

V MySQL 8.4 nepoužívejte odstraněný parametr:

```yaml
command: --default-authentication-plugin=mysql_native_password
```

### 3. Vytvořte logickou zálohu

Příkaz zazálohuje všechny databáze včetně triggerů, eventů a uložených rutin. Heslo se načte uvnitř kontejneru a nezapíše se do historie terminálu:

```bash
set -o pipefail
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" exec -T goldfren_mysql sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --all-databases --single-transaction --skip-lock-tables --no-tablespaces --hex-blob --routines --events --triggers --set-gtid-purged=OFF' | gzip > "$GOLDFREN_BACKUP_DIR/all-databases.sql.gz"
gzip -t "$GOLDFREN_BACKUP_DIR/all-databases.sql.gz"
```

Jestliže root heslo uložené ve stávajícím volume neodpovídá současnému `.env`, logický dump selže. Neprovádějte upgrade bez následující cold zálohy.

### 4. Vytvořte cold zálohu Docker volume

Nejprve si zobrazte přesný název databázového volume a poznamenejte si ho pro případný rollback:

```bash
docker inspect goldfren_mysql --format '{{range .Mounts}}{{if eq .Destination "/var/lib/mysql"}}{{.Name}}{{end}}{{end}}'
```

Zastavte všechny služby, ale neodstraňujte kontejnery ani volumes:

```bash
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" stop
```

Zkopírujte celý datový adresář ze zastaveného kontejneru a ověřte základní soubor InnoDB:

```bash
mkdir -p "$GOLDFREN_BACKUP_DIR/mysql-data"
docker cp goldfren_mysql:/var/lib/mysql/. "$GOLDFREN_BACKUP_DIR/mysql-data/"
test -f "$GOLDFREN_BACKUP_DIR/mysql-data/ibdata1"
du -sh "$GOLDFREN_BACKUP_DIR/mysql-data"
```

Složka `backups/` je v `.gitignore`; databázové zálohy nikdy necommitujte.

### 5. Změňte Docker image

V `docker-compose.dev.yaml` i `docker-compose.prod.yaml` nastavte:

```yaml
goldfren_mysql:
  image: mysql:8.4.11
```

Odstraňte `platform`, pokud je nastavená, a z produkční konfigurace odstraňte také `--default-authentication-plugin=mysql_native_password`.

Ověřte konfiguraci a stáhněte nový image:

```bash
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" config --quiet
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" pull goldfren_mysql
```

### 6. Spusťte upgrade databáze

Spusťte nejprve pouze MySQL. Compose vytvoří nový kontejner, ale použije stávající `mysql_data` volume:

```bash
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" up -d goldfren_mysql
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" logs -f goldfren_mysql
```

Upgrade je dokončený, když log obsahuje oba následující typy záznamů:

```text
Server upgrade from '80044' to '80411' completed.
ready for connections. Version: '8.4.11'
```

Ukončete sledování logu pomocí `Ctrl+C` a ověřte stav i verzi:

```bash
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" ps goldfren_mysql
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" exec goldfren_mysql mysql -uroot -p -e "SELECT VERSION();"
```

### 7. Ověřte Django a spusťte aplikaci

```bash
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" up -d backend
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" exec backend python manage.py migrate
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" exec backend python manage.py check
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" up -d
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" ps
```

Nakonec zkontrolujte web, administraci a aplikační logy:

```bash
curl --fail --silent --show-error --output /dev/null http://localhost/
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" logs --tail=100 backend goldfren_mysql
```

### Rollback při neúspěchu

Pokud MySQL 8.4.11 upgrade nedokončí, zastavte sestavu a uschovejte chybové logy. Nespouštějte MySQL 8.0 nad volume, které už začala upravovat verze 8.4.

Pro návrat je nutné:

1. odstranit pouze přesně identifikované databázové volume,
2. vytvořit nové prázdné volume se stejným názvem,
3. obnovit do něj obsah `$GOLDFREN_BACKUP_DIR/mysql-data`,
4. nastavit vlastníka obnovených souborů na UID/GID používané image `mysql:8.0` (v oficiálním image obvykle `999:999`),
5. vrátit Compose image na původní verzi a spustit databázi.

Před odstraněním volume vždy znovu ověřte jeho přesný název. Příkaz `docker compose down --volumes` zde nepoužívejte, protože by odstranil i další volumes projektu.

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
