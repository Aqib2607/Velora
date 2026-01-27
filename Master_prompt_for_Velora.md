# PART I: PROJECT FOUNDATION

## Step 1: Project Bootstrap & Structure

Initialize a full-stack project for [Project Name].

Backend (Laravel):
- Run: `composer create-project laravel/laravel backend`
- Setup API scaffolding: `php artisan install:api`
- Install dependencies: `laravel/sanctum` (Auth), `laravel/pint` (Linting).
- Structure: Standard Laravel (app/Models, app/Http/Controllers, routes/api.php).
- Create README.md with setup instructions.

Frontend (React):
- Run: `npm create vite@latest frontend -- --template react-ts`
- Install: Tailwind CSS, Axios, React Router DOM.
- Structure: src/ (components, pages, hooks, services, contexts).

Include:
- .gitignore for both.
- Basic health check endpoint: `GET /api/health` returning JSON.

## Step 2: Environment Configuration

Set up environment configuration.

Backend (.env):
- APP_URL, FRONTEND_URL (for CORS/Sanctum).
- DB_CONNECTION=mysql (STRICTLY MYSQL ONLY - DO NOT USE SQLITE)
- DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD.

Frontend (.env):
- VITE_API_URL (e.g., http://localhost:8000/api/v1).
- VITE_APP_NAME.

Action:
- Create `.env.example` files.
- Configure `config/cors.php` to allow requests from VITE_API_URL.

## Step 3: Database Connection & Setup

Set up MySQL connection.

Laravel:
- Configure `.env` with MySQL credentials.
- Verify connection with `php artisan migrate:status`.
- Update `GET /api/health` to include a DB connection check using `DB::connection()->getPdo()`.
- Implement graceful error handling if DB is down.

## Step 4: Base API Architecture

Implement RESTful API architecture.

Structure:
- Routes in `routes/api.php` prefixed with `/v1`.
- Use **API Resources** (`php artisan make:resource`) for consistent JSON responses.
- Create a `BaseController` or Trait for standardized responses: `{ success: boolean, data: any, message: string }`.

## Step 5: User Schema Design

Design User schema.

Migration (users table):
- `id`, `name`, `email` (unique, indexed), `password`.
- `role` (enum: user, admin).
- `is_active` (boolean).
- `email_verified_at`, `created_at`, `updated_at`.

Model:
- Update `User.php`: Add `$fillable`, `$hidden` (password, remember_token), and `$casts` (password => hashed).

## Step 6: Authentication System - Backend

Implement Sanctum Authentication.

Setup:
- Configure `config/sanctum.php`.
- Ensure `User` model uses `HasApiTokens`.

Endpoints:
- `POST /auth/register`: Validate, Create User, Return Token.
- `POST /auth/login`: Validate, `Auth::attempt`, Generate Token (`createToken`), Return Token.
- `POST /auth/logout`: `auth()->user()->currentAccessToken()->delete()`.

## Step 7: Password Security & Hashing

Implement password security.

Laravel:
- Use `Hash::make()` for storage.
- Use `Password::min(8)->mixedCase()->numbers()->symbols()` validation rule.
- Ensure passwords are never returned in API responses (add to `$hidden` array in Model).

## Step 8: Auth Middleware & Route Protection

Configure Middleware.

Actions:
- Protect routes using `middleware('auth:sanctum')`.
- Create custom middleware `EnsureUserHasRole` for RBAC.
- Apply middleware to `/api/v1/user` and other protected groups.

## Step 9: Global Error Handling

Implement centralized error handling.

Laravel:
- Customize `bootstrap/app.php` (Laravel 11) or `Handler.php`.
- Catch `ModelNotFoundException` -> 404 JSON.
- Catch `ValidationException` -> 422 JSON.
- Ensure fallback returns JSON, not HTML, for API routes.

## Step 10: API Testing & Documentation

Set up testing and docs.

Tools:
- Install `dedoc/scramble` for auto-generated OpenAPI docs.
- Create a Postman Collection for Auth endpoints.
- Verify `POST /register` and `POST /login` work correctly.

# PART II: USER MANAGEMENT

## Step 11: User Registration Flow

Complete registration flow.

Backend:
- Implement `MustVerifyEmail` on User model.
- Dispatch `Registered` event upon sign up.

Frontend:
- Create Signup Form (React Hook Form + Zod).
- Connect to `/auth/register`.
- Handle validation errors from Laravel (422 response).

## Step 12: Login System & Frontend

Implement Login UI.

Frontend:
- Login Form.
- On success, store token in `localStorage` (or cookie).
- Redirect to Dashboard.
- Setup Axios Interceptor to attach `Authorization: Bearer <token>` to requests.

## Step 13: Password Reset Flow

Implement Password Reset.

Backend:
- Use Laravel's built-in Password Broker.
- `POST /forgot-password` -> `Password::sendResetLink`.
- `POST /reset-password` -> `Password::reset`.

Frontend:
- Request Link Page.
- Reset Page (captures token from URL).

## Step 14: User Profile Management

Build Profile Management.

Backend:
- `GET /user`: Return current user resource.
- `PUT /user/profile`: Update name, bio, etc.
- `POST /user/avatar`: Handle file upload to `public` disk.

Frontend:
- Profile Page with Edit Mode.

## Step 15: Role-Based Access Control (RBAC)

Implement RBAC.

Backend:
- Create `UserPolicy`.
- Add `role` check in Policies or Middleware.
- Admin Routes: `GET /admin/users`.

Frontend:
- Create `RequireAuth` and `RequireRole` wrapper components for routes.

## Step 16: User Dashboard

Create Dashboard.

Backend:
- `GET /dashboard/stats`: Return counts (e.g., orders, items).

Frontend:
- Dashboard Layout (Sidebar + Header).
- Display stats cards.
- Handle loading states.

## Step 17: Account Settings Page

Build Settings Page.

Backend:
- `PUT /user/password`: Verify old password, update new.
- `DELETE /user`: Soft delete account.

Frontend:
- Tabbed Settings UI (General, Security, Danger Zone).

## Step 18: Email Verification System

Enforce Email Verification.

Backend:
- Add `verified` middleware to critical routes.
- `POST /email/verification-notification`: Resend link.

Frontend:
- Check `user.email_verified_at`.
- Show global banner if unverified.

## Step 19: Two-Factor Authentication (2FA)

Implement 2FA (Optional).

Backend:
- Use `pragmarx/google2fa-laravel`.
- Endpoints to generate QR code and verify OTP.

Frontend:
- 2FA Setup Screen (Scan QR).
- OTP Input Screen during login.

## Step 20: Session Management

Manage Sessions.

Backend:
- `GET /sessions`: List active tokens.
- `DELETE /sessions`: Revoke other tokens.

Frontend:
- Display active sessions list.
- "Log out other devices" button.

# PART III: CORE APPLICATION FEATURES

## Step 21: Core App Data Schema

Design Core Schema (e.g., Products/Posts).

Migration:
- `user_id` (FK), `title`, `slug`, `content`, `status`, `metadata` (JSON).
- Soft deletes and Timestamps.

Model:
- Define Relationships (`belongsTo User`).

## Step 22: Create Operation (C in CRUD)

Implement Create.

Backend:
- Create `StoreEntityRequest` (Form Request validation).
- `POST /entities`: Store logic.

Frontend:
- Create Form with validation feedback.
- Use `react-query` mutations.

## Step 23: Read Operations (R in CRUD)

Implement Read.

Backend:
- `GET /entities`: Paginated list (`paginate(20)`).
- `GET /entities/{id}`: Single item resource.

Frontend:
- List Component.
- Detail View Component.

## Step 24: Update Operation (U in CRUD)

Implement Update.

Backend:
- `PUT /entities/{id}`.
- Create `UpdateEntityRequest`.
- Policy: `authorize('update', $entity)`.

Frontend:
- Edit Form (pre-filled data).
- Optimistic UI update.

## Step 25: Delete Operation (D in CRUD)

Implement Delete.

Backend:
- `DELETE /entities/{id}`.
- Soft delete logic.

Frontend:
- Confirmation Modal.
- Remove from list on success.

## Step 26: Pagination Implementation

Implement Pagination.

Backend:
- Return standard Laravel pagination meta (current_page, last_page).

Frontend:
- Pagination Component (Prev, Next, Page Numbers).
- Sync with URL params (`?page=2`).

## Step 27: Search Functionality

Implement Search.

Backend:
- `GET /entities?search=xyz`.
- Use local scope: `scopeSearch($query, $term)`.

Frontend:
- Search Bar with debounce.

## Step 28: Filtering System

Implement Filtering.

Backend:
- Use `spatie/laravel-query-builder` or manual `when()` clauses for status/category.

Frontend:
- Filter Sidebar/Dropdowns.
- URL serialization.

## Step 29: Sorting Mechanism

Implement Sorting.

Backend:
- `?sort=created_at&direction=desc`.
- Whitelist sortable columns.

Frontend:
- Sortable Table Headers.

## Step 30: Data Validation

Refine Validation.

Backend:
- Use strict Form Requests.
- Custom Validation Rules.

Frontend:
- Match backend rules with client-side validation schema (Zod).

# PART IV: ADVANCED FEATURES

## Step 31: File Upload System

Implement File Uploads.

Backend:
- `POST /upload`.
- Use `Storage` facade (S3 or Local).
- Return public URL.

Frontend:
- Dropzone component.
- Upload progress bar.

## Step 32: Image Processing

Implement Image Optimization.

Backend:
- Use `intervention/image` or `spatie/laravel-medialibrary`.
- Generate thumbnails on upload.

Frontend:
- Display thumbnails in lists, full size in details.

## Step 33: Real-Time Notifications

Implement Notifications.

Backend:
- Use Laravel Database Notifications.
- Endpoint: `GET /notifications`.

Frontend:
- Notification Bell.
- Mark as read functionality.

## Step 34: WebSocket for Real-Time Updates

Implement WebSockets.

Backend:
- Install Laravel Reverb or configure Pusher.
- Broadcast events (`ShouldBroadcast`).

Frontend:
- Laravel Echo + Pusher JS.
- Listen for real-time updates.

## Step 35: Email Service Integration

Configure Emails.

Backend:
- Create Mailables (`php artisan make:mail`).
- Use Blade templates.
- Configure SMTP/Mailtrap.
- Queue email sending.

## Step 36: Third-Party API Integration

Integrate External APIs.

Backend:
- Use `Http` Client.
- Create dedicated Services (e.g., WeatherService).
- Cache responses.

## Step 37: Payment Integration (Stripe)

Implement Payments.

Backend:
- Install Laravel Cashier.
- Setup Billable trait.
- Create Checkout Session.

Frontend:
- React Stripe.js.
- Handle success/cancel redirects.

## Step 38: Background Jobs (Queues)

Configure Queues.

Backend:
- `php artisan make:job`.
- Use `database` or `redis` driver.
- Dispatch long-running tasks.

## Step 39: Analytics & Tracking

Implement Analytics.

Backend:
- Middleware to log API usage.
- Or `spatie/laravel-activitylog` for model audit trails.

Frontend:
- Track custom events.

## Step 40: Export & Reporting

Implement Data Export.

Backend:
- Use `maatwebsite/excel`.
- Endpoint to download CSV/XLSX.

Frontend:
- Export Button.

# PART V: POLISH & OPTIMIZATION

## Step 41: Frontend Component Library

Setup Component Library.

Frontend:
- Install shadcn/ui or Create custom reusable components (Button, Input, Card).
- Ensure consistency.

## Step 42: Loading & Skeleton States

Implement Skeletons.

Frontend:
- Create Skeleton loaders.
- Show while fetching data.
- Disable buttons during submission.

## Step 43: Empty States & Fallbacks

Design Empty States.

Frontend:
- "No items found" components with illustrations and actions.

## Step 44: Error Handling & User Feedback

Enhance Feedback.

Frontend:
- Use Toasts (Sonner/Hot Toast) for success/error.
- Field-level validation messages.

## Step 45: Responsive Design & Mobile

Mobile Optimization.

Frontend:
- Check layouts on mobile breakpoints.
- Implement Hamburger menu.

## Step 46: Dark Mode Implementation

Implement Dark Mode.

Frontend:
- Tailwind `dark` class strategy.
- Theme toggle context.

## Step 47: Performance Optimization

Optimize Performance.

Backend:
- Eager load relationships (`with()`).
- Index DB columns.

Frontend:
- React.lazy for route splitting.

## Step 48: SEO & Meta Tags

Implement SEO.

Frontend:
- Use `react-helmet-async`.
- Dynamic titles and meta descriptions.

## Step 49: Security Hardening

Harden Security.

Backend:
- Secure Headers.
- Rate Limiting.
- Sanitize Inputs.

## Step 50: Testing Setup

Configure Testing.

Backend:
- Setup Pest PHP.
- Configure `phpunit.xml` to use MySQL (e.g., `DB_CONNECTION=mysql`). Do not use SQLite memory database.
Frontend:
- Setup Vitest.

# PART VI: DEPLOYMENT & PRODUCTION

## Step 51: Environment Separation

Separate Environments.

Action:
- Define Production vs Local variables.
- Disable Debug mode in Prod.

## Step 52: Docker Setup

Dockerize.

Action:
- Create Dockerfile for Laravel (Nginx/PHP-FPM).
- Create Dockerfile for React.

## Step 53: Backend Deployment

Deploy Backend.

Action:
- Deploy to VPS/Cloud (Forge/Vapor).
- Configure Nginx.

## Step 54: Frontend Deployment

Deploy Frontend.

Action:
- Deploy to Vercel/Netlify.
- Connect env variables.

## Step 55: Database Migration

Prod Database.

Action:
- Run migrations on production.
- Seed essential data.

## Step 56: CI/CD Pipeline

Setup CI/CD.

Action:
- GitHub Actions workflow for Tests and Deployment.

## Step 57: Monitoring & Logging

Setup Monitoring.

Action:
- Integrate Sentry.
- Configure log channels.

## Step 58: Backup Strategy

Configure Backups.

Action:
- Schedule `spatie/laravel-backup`.

## Step 59: SSL/HTTPS Configuration

Setup SSL.

Action:
- Install Let's Encrypt certificates.
- Force HTTPS.

## Step 60: Production Checklist

Final Review.

Action:
- Verify all systems go.

# PART VII: ADVANCED UI/UX

## Step 61: Advanced Data Visualization

Add Charts.

Frontend:
- Install Recharts.
- Visualize Dashboard data.

## Step 62: Keyboard Shortcuts

Add Hotkeys.

Frontend:
- `react-hotkeys-hook`.
- Shortcuts for common actions.

## Step 63: Infinite Scroll

Add Infinite Scroll.

Frontend:
- Replace pagination with Infinite Scroll component.

## Step 64: Drag and Drop

Add Drag & Drop.

Frontend:
- `dnd-kit` for reordering items.

## Step 65: Advanced Search with Filters

Enhance Search.

Frontend:
- Complex filter UI (Facets).

## Step 66: Real-Time Collaboration

Add Collaboration.

Frontend:
- Show 'Who is viewing' using Echo.

## Step 67: Activity Feed & Timeline

Add Timeline.

Frontend:
- Visual history of changes.

## Step 68: Theming System

Advanced Theming.

Frontend:
- User customizable color schemes.

## Step 69: Accessibility (A11y)

Improve A11y.

Frontend:
- Audit ARIA labels and focus states.

## Step 70: Internationalization (i18n)

Add i18n.

Frontend:
- `react-i18next` implementation.

# PART VIII: TESTING & QUALITY

## Step 71: Unit Testing - Backend

Write Unit Tests.

Backend:
- Test Services and Helpers with Pest.

## Step 72: Integration Testing - API

Write Feature Tests.

Backend:
- Test API endpoints (Happy/Sad paths) with Pest.

## Step 73: Frontend Component Testing

Write Component Tests.

Frontend:
- Test critical UI components.

## Step 74: E2E Testing

Write E2E Tests.

General:
- Playwright flows.

## Step 75: Performance Testing

Load Testing.

General:
- Artillery load tests.

## Step 76: Security Testing

Security Audit.

General:
- Check Permissions and Vulnerabilities.

## Step 77: Code Quality & Linting

Enforce Style.

General:
- Run Pint and ESLint.

## Step 78: Documentation

Final Docs.

General:
- Update all documentation.

## Step 79: Continuous Improvement

Feedback Loop.

General:
- Plan future updates.

## Step 80: Maintenance Plan

Maintenance.

General:
- Create update schedule.
