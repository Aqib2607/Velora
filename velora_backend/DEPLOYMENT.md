# Deployment Guide for Velora Backend

This guide details the steps to deploy the Velora API on a Ubuntu 22.04/24.04 LTS server.

## 1. Server Prerequisites

Provision a fresh Ubuntu VPS and SSH into it. Update system packages:

```bash
sudo apt update && sudo apt upgrade -y
```

Install required dependencies (Nginx, MySQL, PHP 8.2, Composer, Supervisor, Certbot):

```bash
sudo apt install -y nginx mysql-server php8.2-fpm php8.2-mysql php8.2-curl php8.2-xml php8.2-mbstring php8.2-zip php8.2-bcmath composer unzip supervisor certbot python3-certbot-nginx
```

## 2. Database Setup

Secure MySQL installation:
```bash
sudo mysql_secure_installation
```

Create database and user:
```bash
sudo mysql -u root -p
```
```sql
CREATE DATABASE velora_db;
CREATE USER 'velora'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON velora_db.* TO 'velora'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 3. Application Setup

Clone the repository to `/var/www/velora-api`:
```bash
cd /var/www
sudo git clone https://github.com/your-username/velora-backend.git velora-api
cd velora-api
```

Install PHP dependencies (Production):
```bash
sudo composer install --optimize-autoloader --no-dev
```

Configure Environment:
```bash
sudo cp .env.example .env
sudo nano .env
```
*Update `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=https://api.velora.com`, and Database credentials.*

Generate Key and Run Migrations:
```bash
sudo php artisan key:generate
sudo php artisan migrate --force
sudo php artisan storage:link
```

Set Permissions:
```bash
sudo chown -R www-data:www-data /var/www/velora-api
sudo chmod -R 775 storage bootstrap/cache
```

## 4. Nginx Configuration

Create a new server block:
```bash
sudo nano /etc/nginx/sites-available/velora-api
```

Paste the following configuration:
```nginx
server {
    listen 80;
    server_name api.velora.com;
    root /var/www/velora-api/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml;
    gzip_disable "MSIE [1-6]\.";
}
```

Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/velora-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 5. SSL Certificate

Secure with Let's Encrypt:
```bash
sudo certbot --nginx -d api.velora.com
```

## 6. Optimization

Run Laravel optimization commands:
```bash
sudo php artisan config:cache
sudo php artisan route:cache
sudo php artisan view:cache
```

## 7. Queue Worker (Supervisor)

Create a Supervisor configuration file:
```bash
sudo nano /etc/supervisor/conf.d/velora-worker.conf
```

Content:
```ini
[program:velora-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/velora-api/artisan queue:work sqs --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/var/www/velora-api/storage/logs/worker.log
stopwaitsecs=3600
```
*(Note: Change `sqs` to `database` or `redis` depending on your QUEUE_CONNECTION in .env)*

Start Supervisor:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start velora-worker:*
```

## 8. Verification

Visit `https://api.velora.com/api/health` to confirm the application is up and running.
