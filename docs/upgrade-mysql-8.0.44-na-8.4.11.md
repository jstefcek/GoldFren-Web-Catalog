# Upgrade MySQL 8.0.44 na 8.4.11

Tento návod používá čistou logickou migraci:

1. export aplikačních databází z MySQL 8.0.44,
2. cold záloha původního Docker volume,
3. vytvoření nového prázdného volume s MySQL 8.4.11,
4. import aplikačních databází,
5. kontrola Django aplikace.

Systémové tabulky schématu `mysql` se mezi verzemi nepřenášejí. Vytvoří je přímo MySQL 8.4.11, což je čistší a lépe opakovatelné než upgrade datového adresáře na místě.

> Návod obsahuje odstranění aktivního databázového volume. Pokračujte pouze po úspěšném vytvoření a ověření obou záloh. Příkaz `docker compose down --volumes` nepoužívejte.

## 1. Nastavení pracovních proměnných

Všechny příkazy spouštějte ve stejném terminálu z kořene repozitáře.

Pro dev prostředí:

```bash
export GOLDFREN_ENV_FILE=.env.dev
export GOLDFREN_COMPOSE_FILE=docker-compose.dev.yaml
export GOLDFREN_UPGRADE_ID=$(date +%Y%m%dT%H%M%S)
export GOLDFREN_BACKUP_DIR="backups/mysql-upgrade-$GOLDFREN_UPGRADE_ID"
mkdir -p "$GOLDFREN_BACKUP_DIR"
```

Pro produkci použijte místo prvních dvou řádků:

```bash
export GOLDFREN_ENV_FILE=.env.prod
export GOLDFREN_COMPOSE_FILE=docker-compose.prod.yaml
```

Ověřte Compose konfiguraci a zdrojovou verzi databáze:

```bash
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" config --quiet
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" exec goldfren_mysql mysql -uroot -p -e "SELECT VERSION();"
```

Očekávaná zdrojová verze je `8.0.44`.

## 2. Kontrola databázových účtů

MySQL 8.4 má ve výchozím nastavení vypnutý `mysql_native_password`. Zkontrolujte pluginy používané jednotlivými účty:

```bash
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" exec goldfren_mysql mysql -uroot -p -e "SELECT user, host, plugin FROM mysql.user;"
```

Pokud aplikační účet používá `mysql_native_password`, převeďte jej ještě na MySQL 8.0:

```sql
ALTER USER 'goldfren_user'@'%' IDENTIFIED WITH caching_sha2_password BY '<NOVÉ_HESLO>';
```

Stejné heslo nastavte jako `MYSQL_PASSWORD` v odpovídajícím `.env` souboru. Pokud hodnota obsahuje `$`, uzavřete ji v `.env` do jednoduchých uvozovek.

## 3. Logický dump aplikačních databází

Dump obsahuje pouze databáze určené pomocí `MYSQL_CORE_DATABASE` a `MYSQL_DATA_DATABASE`. Záměrně neobsahuje systémová schémata `mysql`, `sys`, `performance_schema` ani `information_schema`.

```bash
set -o pipefail
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" exec -T goldfren_mysql sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --databases "$MYSQL_CORE_DATABASE" "$MYSQL_DATA_DATABASE" --add-drop-database --single-transaction --skip-lock-tables --no-tablespaces --hex-blob --routines --events --triggers --set-gtid-purged=OFF' | gzip > "$GOLDFREN_BACKUP_DIR/databases.sql.gz"
```

Ověřte, že dump existuje, není prázdný a komprimovaný soubor není poškozený:

```bash
test -s "$GOLDFREN_BACKUP_DIR/databases.sql.gz"
gzip -t "$GOLDFREN_BACKUP_DIR/databases.sql.gz"
gzip -dc "$GOLDFREN_BACKUP_DIR/databases.sql.gz" | grep -- "-- Current Database:"
shasum -a 256 "$GOLDFREN_BACKUP_DIR/databases.sql.gz"
```

Uložte vypsaný kontrolní součet spolu se zálohou.

Jestliže root heslo uložené ve stávajícím volume neodpovídá současnému `.env`, logický dump selže. V takovém případě postup zastavte a nejprve obnovte administrátorský přístup. Logický dump je pro tuto metodu povinný; cold záloha v dalším kroku slouží jako rollback, nikoli jako jeho náhrada.

## 4. Cold záloha původního volume

Zjistěte a uložte přesný název aktivního databázového volume:

```bash
export GOLDFREN_MYSQL_VOLUME=$(docker inspect goldfren_mysql --format '{{range .Mounts}}{{if eq .Destination "/var/lib/mysql"}}{{.Name}}{{end}}{{end}}')
test -n "$GOLDFREN_MYSQL_VOLUME"
printf 'MySQL volume: %s\n' "$GOLDFREN_MYSQL_VOLUME"
```

Zastavte aplikaci. Kontejner `goldfren_mysql` zatím nemažte, aby bylo možné zkontrolovat jeho stav:

```bash
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" stop
```

Vytvořte komprimovanou kopii celého volume. Archiv zachová strukturu souborů i jejich numerické vlastníky:

```bash
docker run --rm \
  -v "$GOLDFREN_MYSQL_VOLUME:/source:ro" \
  -v "$(pwd)/$GOLDFREN_BACKUP_DIR:/backup" \
  alpine:3.22 \
  tar -C /source -czf /backup/mysql-volume-8.0.44.tar.gz .
```

Ověřte archiv:

```bash
test -s "$GOLDFREN_BACKUP_DIR/mysql-volume-8.0.44.tar.gz"
gzip -t "$GOLDFREN_BACKUP_DIR/mysql-volume-8.0.44.tar.gz"
tar -tzf "$GOLDFREN_BACKUP_DIR/mysql-volume-8.0.44.tar.gz" | grep './ibdata1$'
shasum -a 256 "$GOLDFREN_BACKUP_DIR/mysql-volume-8.0.44.tar.gz"
```

V tuto chvíli musí existovat dva nezávislé a ověřené soubory:

```text
databases.sql.gz
mysql-volume-8.0.44.tar.gz
```

## 5. Příprava MySQL 8.4.11

V `docker-compose.dev.yaml` a `docker-compose.prod.yaml` nastavte:

```yaml
goldfren_mysql:
  image: mysql:8.4.11
```

Nenastavujte `platform`; tento image podporuje `linux/amd64` i `linux/arm64`.

Odstraňte také starý parametr, který MySQL 8.4 nepodporuje:

```yaml
command: --default-authentication-plugin=mysql_native_password
```

Zkontrolujte konfiguraci a stáhněte image:

```bash
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" config --quiet
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" pull goldfren_mysql
```

## 6. Vytvoření čisté databáze MySQL 8.4.11

Odstraňte kontejnery, ale zatím zachovejte volumes:

```bash
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" down
```

Znovu ověřte název uložený v `$GOLDFREN_MYSQL_VOLUME`. Následující příkaz nevratně odstraní pouze toto jedno aktivní volume:

```bash
printf 'Bude odstraněno pouze volume: %s\n' "$GOLDFREN_MYSQL_VOLUME"
docker volume rm "$GOLDFREN_MYSQL_VOLUME"
```

Spusťte pouze MySQL. Compose vytvoří nové prázdné volume a oficiální entrypoint inicializuje systémové tabulky MySQL 8.4.11 i SQL soubory z adresáře `SQL/`:

```bash
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" up -d goldfren_mysql
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" logs -f goldfren_mysql
```

Pokračujte až po zobrazení:

```text
ready for connections. Version: '8.4.11'
```

Sledování logu ukončete pomocí `Ctrl+C`.

## 7. Restore aplikačních databází

Import smaže prázdné aplikační databáze vytvořené inicializačními skripty a nahradí je obsahem dumpu:

```bash
set -o pipefail
gzip -dc "$GOLDFREN_BACKUP_DIR/databases.sql.gz" | docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" exec -T goldfren_mysql sh -c 'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD"'
```

Ověřte verzi serveru a seznam obnovených databází:

```bash
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" exec goldfren_mysql mysql -uroot -p -e "SELECT VERSION(); SHOW DATABASES;"
```

## 8. Django migrace a kontrola aplikace

```bash
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" up -d backend
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" exec backend python manage.py migrate
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" exec backend python manage.py check
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" up -d
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" ps
```

Pro dev prostředí proveďte HTTP smoke test a zkontrolujte poslední logy:

```bash
curl --fail --silent --show-error --output /dev/null http://localhost/
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" logs --tail=100 backend goldfren_mysql
```

Migrace je úspěšná, pokud:

- `goldfren_mysql` a `backend` jsou `healthy`,
- `SELECT VERSION()` vrátí `8.4.11`,
- `python manage.py migrate` a `python manage.py check` skončí bez chyby,
- web odpoví HTTP 200,
- logy neobsahují chyby přihlášení nebo poškození tabulek.

## Rollback

Pokud import nebo kontrola aplikace selže, neobnovujte systémové tabulky 8.0 do běžící MySQL 8.4. Místo toho obnovte celý původní volume:

1. zastavte sestavu pomocí `docker compose ... down`,
2. odstraňte pouze volume uložené v `$GOLDFREN_MYSQL_VOLUME`,
3. vytvořte nové volume se stejným názvem,
4. rozbalte do něj `mysql-volume-8.0.44.tar.gz`,
5. vraťte Compose image na `mysql:8.0.44`,
6. spusťte nejprve pouze MySQL a zkontrolujte jeho log.

Příkazy pro obnovu volume:

```bash
docker compose --env-file "$GOLDFREN_ENV_FILE" -f "$GOLDFREN_COMPOSE_FILE" down
docker volume rm "$GOLDFREN_MYSQL_VOLUME"
docker volume create "$GOLDFREN_MYSQL_VOLUME"
docker run --rm \
  -v "$GOLDFREN_MYSQL_VOLUME:/target" \
  -v "$(pwd)/$GOLDFREN_BACKUP_DIR:/backup:ro" \
  alpine:3.22 \
  tar -C /target -xzf /backup/mysql-volume-8.0.44.tar.gz
```

Před spuštěním databáze ověřte vlastnictví souborů. Oficiální image `mysql:8.0.44` a `mysql:8.4.11` používají pro MySQL v aktuálních imagech UID/GID `999:999`; archiv vytvořený v tomto návodu je zachová.

## Produkční doporučení

- Naplánujte odstávku od začátku cold zálohy do dokončení smoke testu.
- Zálohy zkopírujte mimo server a ověřte jejich SHA-256.
- Před produkcí proveďte celý postup na kopii produkčních dat.
- Po úspěšné migraci nemažte zálohu 8.0, dokud neproběhne domluvená retenční doba.
- Produkční image ponechte připnutý na konkrétní verzi `mysql:8.4.11`, ne na pohyblivém tagu `mysql:8.4` nebo `latest`.
