# Bezpečná změna MySQL hesla

Tento postup mění heslo uživatele `goldfren_user` bez okamžitého odpojení aplikace. MySQL 8.4 dočasně ponechá platné staré i nové heslo. Staré heslo se odstraní až poté, co backend i zálohovací služba prokazatelně fungují s novým.

> Postup spouštějte na serveru v kořenové složce projektu a v jedné nepřerušené shellové relaci, protože jednotlivé kroky sdílejí proměnné. Příkazy předpokládají služby a názvy kontejnerů z `docker-compose.prod.yaml`.

## Zásady

- Heslo nevkládejte přímo do příkazu ani do historie shellu.
- Nezapínejte při práci `set -x`.
- Neprovádějte `DISCARD OLD PASSWORD`, dokud neprojdou všechny kontroly.
- `.env.prod` neposílejte přes Git, e-mail ani chat.
- Před změnou vždy vytvořte ověřený dump obou databází.

## 1. Předběžná kontrola

```bash
set -euo pipefail
set +x
umask 077

docker compose --env-file .env.prod -f docker-compose.prod.yaml ps
docker exec goldfren_mysql mysql --version
docker exec goldfren_backend python manage.py check
```

MySQL musí být ve verzi 8.4 a kontejnery `goldfren_mysql` a `goldfren_backend` musí běžet.

Načtěte aktuálně používané heslo přímo z běžícího backendu a root heslo z MySQL kontejneru. Příkazy je pouze uloží do proměnných a nevypíšou je:

```bash
OLD_PASSWORD="$(docker exec goldfren_backend printenv MYSQL_PASSWORD)"
MYSQL_ROOT_PASSWORD="$(docker exec goldfren_mysql printenv MYSQL_ROOT_PASSWORD)"

test -n "$OLD_PASSWORD"
test -n "$MYSQL_ROOT_PASSWORD"
```

Ověřte, že současné heslo skutečně funguje:

```bash
docker exec \
  -e MYSQL_PWD="$OLD_PASSWORD" \
  goldfren_mysql \
  mysql -ugoldfren_user -N -e "SELECT CURRENT_USER();"
```

Výstup musí obsahovat `goldfren_user@%`.

## 2. Záloha databází a prostředí

```bash
ROTATION_TIMESTAMP="$(date +%Y%m%dT%H%M%S)"
BACKUP_DIR="backups/mysql-password-rotation-${ROTATION_TIMESTAMP}"
ENV_BACKUP="${BACKUP_DIR}/env.prod.before-rotation"
DB_BACKUP="${BACKUP_DIR}/goldfren-before-rotation.sql.gz"

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"
cp .env.prod "$ENV_BACKUP"
chmod 600 "$ENV_BACKUP"

docker exec \
  -e MYSQL_PWD="$MYSQL_ROOT_PASSWORD" \
  goldfren_mysql \
  mysqldump -uroot \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    --databases goldfren goldfren_data \
  | gzip > "$DB_BACKUP"

test -s "$DB_BACKUP"
gzip -t "$DB_BACKUP"
```

Pokud `test` nebo `gzip -t` selže, nepokračujte.

## 3. Připravte nové heslo

Pokud už `.env.prod` obsahuje připravené nové 64znakové heslo, načtěte ho:

```bash
NEW_PASSWORD="$(sed -n 's/^MYSQL_PASSWORD=//p' .env.prod)"
```

Pokud `.env.prod` stále obsahuje aktivní staré heslo, vytvořte nové:

```bash
if [ -z "$NEW_PASSWORD" ] || [ "$NEW_PASSWORD" = "$OLD_PASSWORD" ]; then
  NEW_PASSWORD="$(openssl rand -hex 32)"
fi
```

Před použitím ověřte, že jde o odlišnou 64znakovou hexadecimální hodnotu. Omezená abeceda současně zabraňuje nechtěné interpretaci znaků shellem, Compose nebo SQL:

```bash
test "$NEW_PASSWORD" != "$OLD_PASSWORD"
test "${#NEW_PASSWORD}" -eq 64

case "$NEW_PASSWORD" in
  *[!0-9a-f]*)
    echo "Nové heslo nemá očekávaný hexadecimální formát." >&2
    exit 1
    ;;
esac
```

## 4. Aktivujte nové heslo a dočasně zachovejte staré

Protože nové heslo prošlo kontrolou na čistý hexadecimální formát, lze jej bezpečně předat MySQL přes standardní vstup:

```bash
docker exec \
  -i \
  -e MYSQL_PWD="$MYSQL_ROOT_PASSWORD" \
  goldfren_mysql \
  mysql -uroot <<SQL
ALTER USER 'goldfren_user'@'%'
  IDENTIFIED BY '${NEW_PASSWORD}'
  RETAIN CURRENT PASSWORD;
SQL
```

Nyní musí fungovat obě hesla:

```bash
docker exec -e MYSQL_PWD="$OLD_PASSWORD" goldfren_mysql \
  mysql -ugoldfren_user -N -e "SELECT CURRENT_USER();"

docker exec -e MYSQL_PWD="$NEW_PASSWORD" goldfren_mysql \
  mysql -ugoldfren_user -N -e "SELECT CURRENT_USER();"
```

Pokud nefunguje nové heslo, `.env.prod` neměňte. Staré heslo je stále platné a aplikace pokračuje bez změny.

## 5. Aktualizujte `.env.prod`

Sestavte také konzistentní `DATABASE_URL`:

```bash
MYSQL_USER="$(sed -n 's/^MYSQL_USER=//p' .env.prod)"
MYSQL_HOSTNAME="$(sed -n 's/^MYSQL_HOSTNAME=//p' .env.prod)"
MYSQL_PORT="$(sed -n 's/^MYSQL_PORT=//p' .env.prod)"
MYSQL_NAME="$(sed -n 's/^MYSQL_NAME=//p' .env.prod)"

NEW_DATABASE_URL="mysql://${MYSQL_USER}:${NEW_PASSWORD}@${MYSQL_HOSTNAME}:${MYSQL_PORT}/${MYSQL_NAME}"

NEW_PASSWORD="$NEW_PASSWORD" \
NEW_DATABASE_URL="$NEW_DATABASE_URL" \
perl -i -pe '
  if (/^MYSQL_PASSWORD=/) {
    $_ = "MYSQL_PASSWORD=$ENV{NEW_PASSWORD}\n";
  }
  if (/^DATABASE_URL=/) {
    $_ = "DATABASE_URL=$ENV{NEW_DATABASE_URL}\n";
  }
' .env.prod

chmod 600 .env.prod
docker compose --env-file .env.prod -f docker-compose.prod.yaml config --quiet
```

Používejte `config --quiet`. Příkaz `docker compose config` bez `--quiet` by mohl vypsat citlivé hodnoty.

## 6. Přepněte služby na nové heslo

MySQL kontejner nerecreateujte. Znovu vytvořte pouze služby, které heslo používají:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yaml \
  up -d --no-deps --force-recreate backend mysql_backup
```

Počkejte, až bude backend healthy:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yaml ps
docker inspect --format '{{.State.Health.Status}}' goldfren_backend
```

Poté ověřte připojení Django k databázi:

```bash
docker exec goldfren_backend python manage.py check

docker exec goldfren_backend python manage.py shell -c \
  "from django.db import connection; c=connection.cursor(); c.execute('SELECT CURRENT_USER()'); print(c.fetchone()[0])"
```

Výstup musí být `goldfren_user@%`. Ověřte také web přes Nginx:

```bash
curl --fail --silent --show-error --output /dev/null \
  https://catalog.goldfren.cz/
```

## 7. Zneplatněte staré heslo

Tento krok proveďte až po úspěchu všech kontrol z předchozí části:

```bash
docker exec \
  -i \
  -e MYSQL_PWD="$MYSQL_ROOT_PASSWORD" \
  goldfren_mysql \
  mysql -uroot <<'SQL'
ALTER USER 'goldfren_user'@'%' DISCARD OLD PASSWORD;
SQL
```

Ověřte, že nové heslo stále funguje a staré už ne:

```bash
docker exec -e MYSQL_PWD="$NEW_PASSWORD" goldfren_mysql \
  mysql -ugoldfren_user -N -e "SELECT CURRENT_USER();"

if docker exec -e MYSQL_PWD="$OLD_PASSWORD" goldfren_mysql \
  mysql -ugoldfren_user -N -e "SELECT 1" >/dev/null 2>&1; then
  echo "CHYBA: staré heslo je stále platné." >&2
  exit 1
else
  echo "Staré heslo bylo úspěšně zneplatněno."
fi
```

Nakonec odstraňte hesla z paměti shellu:

```bash
unset OLD_PASSWORD NEW_PASSWORD MYSQL_ROOT_PASSWORD NEW_DATABASE_URL
unset MYSQL_USER MYSQL_HOSTNAME MYSQL_PORT MYSQL_NAME
```

Zálohu databáze ponechte podle retenčních pravidel. Kopie `.env.prod` obsahuje staré heslo, proto ji po skončení rollback okna bezpečně odstraňte nebo uložte v šifrovaném secret manageru.

## Rollback před odstraněním starého hesla

Dokud nebyl proveden `DISCARD OLD PASSWORD`, databáze přijímá obě hesla. Pokud backend s novým heslem nenastartuje, vraťte do `.env.prod` staré heslo a znovu vytvořte backend:

```bash
OLD_DATABASE_URL="mysql://${MYSQL_USER}:${OLD_PASSWORD}@${MYSQL_HOSTNAME}:${MYSQL_PORT}/${MYSQL_NAME}"

OLD_PASSWORD="$OLD_PASSWORD" \
OLD_DATABASE_URL="$OLD_DATABASE_URL" \
perl -i -pe '
  if (/^MYSQL_PASSWORD=/) {
    $_ = "MYSQL_PASSWORD=$ENV{OLD_PASSWORD}\n";
  }
  if (/^DATABASE_URL=/) {
    $_ = "DATABASE_URL=$ENV{OLD_DATABASE_URL}\n";
  }
' .env.prod

docker compose --env-file .env.prod -f docker-compose.prod.yaml config --quiet
docker compose --env-file .env.prod -f docker-compose.prod.yaml \
  up -d --no-deps --force-recreate backend mysql_backup
```

Poté zjistěte příčinu chyby. Staré heslo nezneplatňujte, dokud nebude nový pokus kompletně ověřen.

## Obnova databáze ze zálohy

Obnova není při běžné rotaci potřeba, protože změna hesla nemění aplikační data. Pokud by byla nutná samostatná obnova databází, nejprve zastavte zápisy do aplikace a použijte:

```bash
gzip -dc "$DB_BACKUP" | docker exec \
  -i \
  -e MYSQL_PWD="$MYSQL_ROOT_PASSWORD" \
  goldfren_mysql \
  mysql -uroot
```

Obnovu produkčních dat vždy nejprve nacvičte na izolované MySQL instanci.

## Reference

- [MySQL 8.4 – Password Management](https://dev.mysql.com/doc/refman/8.4/en/password-management.html)
- [MySQL 8.4 – ALTER USER](https://dev.mysql.com/doc/refman/8.4/en/alter-user.html)
- [MySQL 8.4 – Password Security](https://dev.mysql.com/doc/refman/8.4/en/password-security-admin.html)
