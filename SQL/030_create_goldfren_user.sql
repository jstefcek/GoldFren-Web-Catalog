-- MYSQL_USER is created by the official MySQL entrypoint before init scripts run.
-- Grant that application user access to the separately initialized catalog database.
GRANT ALL PRIVILEGES ON goldfren_data.* TO 'goldfren_user'@'%';
FLUSH PRIVILEGES;
