# Velora

A premium e-commerce platform built with Laravel (Backend) and React (Frontend).

## Requirements
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+

## Setup
1. **Backend**:
    ```bash
    cd velora_backend
    composer install
    cp .env.example .env
    php artisan key:generate
    php artisan migrate --seed
    // Serve
    php artisan serve
    ```

2. **Frontend**:
    ```bash
    // Root directory
    npm install
    cp .env.example .env
    npm run dev
    ```

## Testing
- **Backend (Unit/Feature)**:
    ```bash
    cd velora_backend
    php artisan test
    ```
- **Frontend (Component)**:
    ```bash
    npm run test
    ```
- **E2E (Playwright)**:
    ```bash
    npx playwright test
    ```
- **Load Testing**:
    ```bash
    npx artillery run load-test.yml
    ```

## Quality
- **Linting**:
    - Backend: `./vendor/bin/pint`
    - Frontend: `npm run lint`
- **Security**:
    - Backend: `composer audit`
    - Frontend: `npm audit`

## Documentation
See `MAINTENANCE.md` for operational details.
