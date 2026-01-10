# PART I: PROJECT FOUNDATION (Prompts 1-8)

## 1. Laravel Project Initialization
Act as a Senior Backend Developer. Initialize a new Laravel 11 project named `velora_backend` configured for API-only development.

- Provide the `composer create-project` command.
- Show how to install `laravel/sanctum` for API authentication.
- Show how to publish the `api.php` route file (since Laravel 11 requires opting in for API routing).
- Configure `config/cors.php` to explicitly allow requests from my Vercel frontend domain (`https://velora-sigma.vercel.app`) to prevent CORS errors.
- Provide the `.env.example` setup specifically for a MySQL connection.

## 2. Database & Environment Configuration
Set up the database environment for Velora.

- Provide the MySQL connection variables for `.env` (`DB_CONNECTION=mysql`, `DB_HOST`, `DB_PORT`, `DB_DATABASE=velora_db`).
- Create a custom `ApiResponse` trait. This trait should standardize all JSON responses sent to the frontend.
    - Success Format: `{ "success": true, "message": "...", "data": ... }`
    - Error Format: `{ "success": false, "message": "...", "errors": ... }`
- Create a `BaseController` that uses this trait.

## 3. User Schema & Migration (Multi-Role)
Design the `users` table migration for a multi-vendor system.

- Create a migration for users with:
    - `id` (BigInt PK)
    - `name`, `email` (unique), `password`
    - `role` (ENUM: 'admin', 'shop_owner', 'customer') - Default 'customer'
    - `avatar_url` (nullable)
    - `is_active` (boolean, default true)
    - `last_login_at` (timestamp)
- Update the `User` model to include:
    - `$fillable` fields.
    - `$casts` for `password` (hashed) and boolean fields.
    - A helper method `hasRole(string $role): bool`.

## 4. Shops Table Migration (Vendor System)
Create the database structure for vendors/shops.

- Create a migration for shops:
    - `id`, `user_id` (FK to users, onDelete cascade)
    - `name` (string, unique), `slug` (string, unique)
    - `description` (text)
    - `logo_url`, `banner_url` (nullable)
    - `status` (ENUM: 'pending', 'active', 'suspended')
    - `is_verified` (boolean)
- Define the OneToOne relationship in the `User` model (`shop()`) and the BelongsTo relationship in the `Shop` model (`owner()`).

## 5. Products Schema Design
Design the `products` table migration.

- Fields:
    - `id`, `shop_id` (FK to shops)
    - `name`, `slug`, `description` (longText)
    - `price` (decimal 10,2), `stock_quantity` (integer)
    - `category_id` (FK to categories)
    - `images` (JSON column to store array of image paths)
    - `status` (ENUM: 'draft', 'published', 'archived')
- Create a migration for `categories` table (`id`, `name`, `slug`, `parent_id` for nesting).

## 6. Orders & Order Items Schema
Design the core e-commerce transaction tables.

- `orders` table:
    - `id`, `user_id` (FK)
    - `total_amount` (decimal), `subtotal`, `tax`
    - `status` (ENUM: 'pending', 'processing', 'shipped', 'delivered', 'cancelled')
    - `payment_status` (ENUM: 'unpaid', 'paid', 'refunded')
    - `payment_method` (string)
    - `shipping_address` (JSON)
- `order_items` table:
    - `id`, `order_id` (FK)
    - `product_id` (FK)
    - `shop_id` (FK) - crucial for multi-vendor payout calculation
    - `quantity`, `unit_price`, `total`

## 7. Exception Handling & JSON Responses
Configure global exception handling in `bootstrap/app.php` (for Laravel 11).

- Ensure that `ModelNotFoundException` returns a generic 404 JSON response using our `ApiResponse` format instead of the default HTML error page.
- Ensure validation errors (`ValidationException`) return a 422 JSON response with field-specific error messages formatted for the React frontend to consume easily.

## 8. API Testing Setup
Set up the testing environment.

- Configure `phpunit.xml` to use an in-memory SQLite database or a separate testing MySQL database.
- Create a basic test `tests/Feature/HealthCheckTest.php` to verify the `/api/health` endpoint returns 200 OK and the DB connection is successful.

# PART II: AUTHENTICATION & USERS (Prompts 9-15)

## 9. Registration Logic (Sanctum)
Implement the Registration API.

- Create `AuthController` and a Form Request `RegisterRequest`.
- Validate: Name, Email (unique), Password (confirmed, min 8).
- Logic:
    - Create User.
    - Hash password automatically.
    - Assign default role 'customer'.
    - Generate Sanctum token: `$user->createToken('auth_token')->plainTextToken`.
    - Return User Data + Token.

## 10. Login Logic
Implement the Login API.

- Create `LoginRequest` (email, password).
- Logic:
    - Check if user exists and `Hash::check` password.
    - Security Check: Ensure `$user->is_active` is true.
    - Update `last_login_at`.
    - Generate Token.
- Endpoint: `POST /api/login`.
- Output JSON: `{ token: "...", user: { ... } }`.

## 11. User Profile & Avatar
Implement User Profile Management.

- Endpoint: `GET /api/me` (Protected route). Return the authenticated user.
- Endpoint: `POST /api/profile/update`. Allow updating name, bio, phone.
- Endpoint: `POST /api/profile/avatar`.
    - Use Laravel Storage to save the file to `public/avatars`.
    - Update the database column.
    - Return the full public URL (`asset('storage/...')`).

## 12. Middleware for Roles
Implement Role-Based Access Control (RBAC).

- Create a middleware alias `role` in `bootstrap/app.php`.
- The middleware should accept parameters like `role:admin,shop_owner`.
- If the user's role is not in the allowed list, abort with 403 Forbidden JSON.
- Apply this to a test route to verify.

## 13. Vendor Registration Flow
Create a specific flow for users to become vendors.

- Endpoint: `POST /api/shops/register`.
- Logic:
    - User must be authenticated.
    - Validate shop name, description.
    - Create `Shop` record linked to user.
    - Crucial: Update user role from 'customer' to 'shop_owner'.
    - Return the created shop details.

## 14. Password Reset Flow
Implement Forgot Password functionality.

- `POST /api/forgot-password`: Validate email, generate token (using `DB::table('password_reset_tokens')`), send email (use Mailable).
- `POST /api/reset-password`: Validate token, email, and new password. Update password, delete token.
- Use Laravel's built-in Password broker if possible, but ensure the response is JSON, not a redirect.

## 15. Logout & Token Revocation
Implement secure logout.

- Endpoint: `POST /api/logout`.
- Logic: `$request->user()->currentAccessToken()->delete();`.
- Return success message.

# PART III: CORE E-COMMERCE FEATURES (Prompts 16-25)

## 16. Category Management (Admin)
Implement Category CRUD.

- `CategoryController` (Admin only for Create/Update/Delete).
- Public Endpoint: `GET /api/categories` (Tree structure for nested categories).
- Use a recursive relationship in the model (`children()`) to load subcategories eagerly.

## 17. Product Creation (Vendor)
Implement Product Creation logic.

- Endpoint: `POST /api/products`.
- Middleware: `auth:sanctum` and `role:shop_owner`.
- Validation: Ensure the logged-in user actually owns a shop.
- Handle Image Uploads: Allow up to 5 images. Store them, get paths, save as JSON array.
- Auto-generate slug from name.

## 18. Product Read APIs (Public)
Implement robust Product listing for the homepage.

- Endpoint: `GET /api/products`.
- Use Laravel Spatie Query Builder or custom logic to support:
    - `?filter[category_id]=...`
    - `?sort=price` or `?sort=-price`
    - `?filter[search]=...` (partial match on name/description)
- Pagination: Return `paginate(12)` meta data (total, per_page, current_page) for the frontend infinite scroll.

## 19. Single Product Details
Implement Single Product View.

- Endpoint: `GET /api/products/{slug}`.
- Eager load relationships: shop, category, reviews.
- Create a `ProductResource` (API Resource) to format the output.
- Include a computed field `image_urls` that transforms stored paths into full URLs.
- Include `shop_name` and `shop_avatar` from the relationship.

## 20. Wishlist Functionality
Implement Wishlist.

- Create `wishlists` table (id, user_id, product_id). Unique constraint on user+product.
- Endpoints:
    - `GET /api/wishlist` (List products).
    - `POST /api/wishlist/toggle` (Add if not exists, remove if exists).
- Return boolean `in_wishlist` in the `ProductResource` if the user is logged in.

## 21. Shop Profile (Public View)
Create public shop pages.

- Endpoint: `GET /api/shops/{slug}`.
- Return shop details (logo, banner, description) and a paginated list of their products.
- Include aggregate stats: `total_products`, `average_rating`.

## 22. Product Reviews
Implement Rating and Review system.

- Table `reviews`: `id`, `user_id`, `product_id`, `rating` (1-5), `comment`.
- Endpoint: `POST /api/products/{id}/reviews`.
- Validation: User must have purchased the product (check `orders` table) before reviewing.

## 23. Related Products Logic
Implement a recommendation engine endpoint.

- Endpoint: `GET /api/products/{id}/related`.
- Logic: Fetch 4 products from the same `category_id` excluding the current ID.

## 24. Featured & Trending
Create homepage widget endpoints.

- `GET /api/products/featured`: Products marked `is_featured` in DB.
- `GET /api/products/trending`: Products with highest sales count in the last 30 days (requires query on `order_items`).

## 25. Search Suggestions
Implement autocomplete API.

- Endpoint: `GET /api/search/suggestions?q=...`.
- Return 5 product names and 3 category names matching the query.
- Optimize for speed (select only `id`, `name`, `slug`).

# PART IV: CART, ORDERS & PAYMENTS (Prompts 26-35)

## 26. Cart Synchronization
Implement server-side cart validation.

- Frontend uses localStorage. Create `POST /api/cart/sync`.
- Input: Array of `{ product_id, quantity }`.
- Logic:
    - Fetch fresh prices/stock from DB.
    - Check if requested quantity > stock.
    - Calculate totals securely.
- Return: `{ items: [...], subtotal: ..., valid: boolean, messages: [] }`.

## 27. Checkout Initiation
Prepare the order for payment.

- Endpoint: `POST /api/checkout/init`.
- Input: Cart items, Address ID.
- Logic:
    - Validate stock one last time.
    - Create a temporary Order with status `pending_payment`.
- Return `order_id` and total amount.

## 28. Payment Gateway (Stripe/SSLCommerz)
Implement payment processing.

- Service Class: `PaymentService`.
- Method: `createPaymentIntent($order)`.
- If using Stripe: Return `client_secret` to frontend.
- If using SSLCommerz (BD): Return the redirect Gateway URL.

## 29. Order Finalization (Webhook/Callback)
Handle successful payment.

- Endpoint: `POST /api/payment/success` or Webhook.
- Logic (Inside `DB::transaction`):
    - Update Order status to `processing`.
    - Update Payment status to `paid`.
    - Critical: Loop through items and decrement `product.stock_quantity`.
    - Send Order Confirmation Email (Queue).

## 30. User Order History
Customer Dashboard - Orders.

- Endpoint: `GET /api/orders`.
- Return paginated orders sorted by date desc.
- Endpoint: `GET /api/orders/{id}`. Show full details including items and shipping status.
- Ensure user can only see their own orders.

## 31. Vendor Order Management
Shop Owner Dashboard - Orders.

- Endpoint: `GET /api/vendor/orders`.
- Logic: Since an order might contain items from multiple shops, query `OrderItem` where `shop_id` matches the vendor.
- Return list of items to be fulfilled by this specific vendor.

## 32. Order Status Updates
Manage Order Lifecycle.

- Endpoint: `PATCH /api/orders/{id}/status`.
- Role: Admin or Shop Owner (for their specific items).
- Update status (e.g., 'shipped'). Trigger notification to user.

## 33. Sales Analytics (Vendor)
Create a stats endpoint for the Vendor Dashboard.

- `GET /api/vendor/stats`.
- Return:
    - Total Earnings (Sum of order_items total).
    - Total Orders.
    - Products Sold.
    - Chart Data: Sales per day for the last 7 days.

## 34. Admin Dashboard Stats
Global Analytics.

- `GET /api/admin/stats`.
- Total Users, Total Active Shops, Total Revenue (Platform wide).

## 35. Invoice Generation
PDF Invoice generation.

- Install `barryvdh/laravel-dompdf`.
- Endpoint: `GET /api/orders/{id}/invoice`.
- Generate PDF stream using a Blade view template.

# PART V: POLISH & OPTIMIZATION (Prompts 36-42)

## 36. API Resources (Transformers)
Standardize all outputs.

- Create `UserResource`, `ProductResource`, `OrderResource`.
- Ensure no raw DB columns (like `created_at`) are exposed unless formatted (d M Y).
- Ensure sensitive fields like `cost_price` are hidden from public resources and only shown in `VendorProductResource`.

## 37. Caching
Implement caching for high-traffic read endpoints.

- Cache the Homepage Products (`/api/products/featured`) for 30 minutes using `Cache::remember`.
- Cache Categories tree for 24 hours.
- Implement Cache Busting: When a product is updated, clear the relevant cache keys.

## 38. Rate Limiting
Protect the API.

- Configure `RateLimiter` in `AppServiceProvider`.
- Apply `throttle:60,1` (60 req/min) to general API routes.
- Apply strict `throttle:5,1` to Auth routes (Login/Register) to prevent brute force.

## 39. Image Optimization (Server Side)
Optimize images on upload.

- Install `intervention/image`.
- Middleware/Service: When an image is uploaded, resize it to max 1000x1000px and convert to WebP with 80% quality before saving to storage.
- Generate a thumbnail (200x200) for grid views.

## 40. Security Headers & CORS
Final Security Check.

- Ensure Sanctum stateful domains are configured if using cookies.
- Set `X-Content-Type-Options`, `X-Frame-Options`, and `X-XSS-Protection` headers.
- Force HTTPS in `AppServiceProvider` if `app()->isProduction()`.

## 41. Queue System
Offload heavy tasks.

- Set up database queue driver (`QUEUE_CONNECTION=database`).
- Create Jobs: `SendWelcomeEmail`, `ProcessOrderEmails`.
- Show how to run the queue worker: `php artisan queue:work`.

## 42. Search Indexing (Scout - Optional)
Prepare for better search.

- Install `laravel/scout`.
- Configure the database driver (for simple text search) or `algolia/meilisearch` driver.
- Add `Searchable` trait to `Product` model.

# PART VI: DEPLOYMENT (Prompts 43-50)

## 43. Deployment Preparation
Prepare the app for production.

- Command to optimize: `php artisan config:cache`, `php artisan route:cache`, `php artisan view:cache`.
- Ensure `.env.production` has `APP_DEBUG=false`.

## 44. Linux Server Setup (Ubuntu)
Instructions for VPS setup.

- Install dependencies: `apt install nginx mysql-server php8.2-fpm php8.2-mysql composer unzip`.
- Secure MySQL installation.

## 45. Nginx Configuration
Configure the Web Server.

- Provide the nginx server block configuration file for a Laravel API.
- Ensure it points to `/var/www/velora-api/public`.
- Configure gzip compression.

## 46. SSL Certificate (Certbot)
Secure the API.

- Install Certbot: `apt install certbot python3-certbot-nginx`.
- Command to generate SSL: `certbot --nginx -d api.velora.com`.

## 47. Database Migration on Prod
Database rollout.

- Clone repo.
- `composer install --no-dev`.
- `php artisan migrate --force`.
- `php artisan storage:link`.

## 48. Folder Permissions
Fix Linux permissions.

- `chown -R www-data:www-data /var/www/velora-api`.
- `chmod -R 775 storage bootstrap/cache`.

## 49. Supervisor (Queue Worker)
Keep the queue running.

- Install supervisor.
- Create configuration file `/etc/supervisor/conf.d/velora-worker.conf`.
- Command: `php artisan queue:work --tries=3`.

## 50. Final Smoke Test
Verification.

- Endpoint: `GET https://api.velora.com/api/health`.
- Check if React frontend can login.
- Check if images load correctly.