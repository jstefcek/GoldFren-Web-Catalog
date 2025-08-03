-- Creates a goldfren user
CREATE USER IF NOT EXISTS 'goldfren_user'@'%' IDENTIFIED BY 'U5Lko9TY6.FVT_-rKgkQn_pCCh1IYy';
GRANT ALL PRIVILEGES ON goldfren_data.* TO 'goldfren_user'@'%';
FLUSH PRIVILEGES;