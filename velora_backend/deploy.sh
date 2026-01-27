#!/bin/bash
set -e

echo "Deploying application..."

# Maintenance mode
php artisan down || true

# Update codebase (assumed to be done by CI/CD or git pull)

# Install dependencies (if not dockerized, or run inside container)
# composer install --no-dev --optimize-autoloader

# Run Migrations
echo "Running migrations..."
php artisan migrate --force

# Clear and Cache Configs
echo "Clearing caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Restart Queue workers (if applicable)
# php artisan queue:restart

# Exit maintenance mode
php artisan up

echo "Deployment finished!"
