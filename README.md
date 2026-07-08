# AppPortal — Laravel REST API + React Frontend

Aplikasi full-stack dengan **Laravel 13** (REST API + JWT Auth) sebagai
backend dan **Vite + React** sebagai frontend. Desain mengikuti sistem
warna "Corporate Slate & Warm Muted" — clean, profesional, minim warna
neon.

---

## Struktur Proyek

```
project-root/
├── backend-api/        → Laravel REST API (JWT Auth)
└── frontend-api/       → Vite + React
```

Dua project ini terpisah dan dijalankan sebagai dua server berbeda saat
development.

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Backend | Laravel 13, PHP 8.2+, PostgreSQL |
| Auth | JWT (`tymon/jwt-auth`) |
| Frontend | React 18 (Vite), React Router, Axios |
| Styling | Tailwind CSS v3 |
| Testing | PHPUnit (Feature Tests) |

---

## Prasyarat

- PHP 8.2+ dengan extension: `mbstring`, `pdo_pgsql`, `pgsql`
- Composer
- Node.js 18+ & npm
- PostgreSQL (database terpisah untuk dev & testing)

---

## 1. Setup Backend (`backend-api/`)

### Install dependencies

```powershell
cd backend-api
composer install
composer require tymon/jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret
```

### Konfigurasi `.env`

```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=backend_api
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

Buat database-nya dulu di PostgreSQL:

```sql
CREATE DATABASE backend_api;
```

### Pastikan `config/auth.php` guard `api` pakai JWT

```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
    'api' => [
        'driver' => 'jwt',
        'provider' => 'users',
    ],
],
```

### Pastikan `bootstrap/app.php` me-load `routes/api.php`

```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    api: __DIR__.'/../routes/api.php',
    commands: __DIR__.'/../routes/console.php',
    health: '/up',
)
```

### Migrate database

```powershell
php artisan migrate
```

### (Opsional) Bikin user buat testing login manual

```powershell
php artisan tinker
```
```php
User::create([
    'name' => 'Test User',
    'email' => 'test@example.com',
    'password' => bcrypt('password123'),
]);
```

### Jalankan server

```powershell
php artisan serve
```

Backend siap di `http://localhost:8000`.

---

## 2. Setup Frontend (`frontend-api/`)

### Install dependencies

```powershell
cd frontend-api
npm install
npm install react-router-dom axios
npm install -D tailwindcss@3 postcss autoprefixer
```

> Catatan: pin ke `tailwindcss@3` — konfigurasi di project ini pakai
> format Tailwind v3 (`tailwind.config.js` + `@tailwind base/components/utilities`).

### Konfigurasi `.env`

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Jalankan dev server

```powershell
npm run dev
```

Frontend siap di `http://localhost:5173`.

---

## 3. Testing (Backend)

Testing pakai database **terpisah** dari development, biar data dev kamu
gak ke-reset tiap run.

Buat database testing:

```sql
CREATE DATABASE backend_api_testing;
```

Buat `.env.testing`:

```env
APP_ENV=testing
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=backend_api_testing
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

Jalankan test:

```powershell
php artisan test
```

---

## Endpoint API

| Method | Endpoint | Auth? | Keterangan |
|---|---|---|---|
| POST | `/api/auth/login` | tidak | Login, balikin `access_token` + `user` |
| GET | `/api/auth/me` | ya | Profil user yang sedang login |
| POST | `/api/auth/logout` | ya | Invalidate token |
| POST | `/api/auth/refresh` | ya | Tukar token lama dengan yang baru |
| GET | `/api/resources` | ya | List semua resource |
| POST | `/api/resources` | ya | Create (422 jika validasi gagal) |
| GET | `/api/resources/{id}` | ya | Detail satu resource |
| PUT/PATCH | `/api/resources/{id}` | ya | Update (422 jika validasi gagal) |
| DELETE | `/api/resources/{id}` | ya | Hapus resource |

---

## Struktur Folder Backend

```
backend-api/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/    → AuthController, ResourceController
│   │   ├── Requests/           → LoginRequest, ResourceRequest (sumber 422)
│   │   └── Resources/          → UserResource, ResourceResource
│   └── Models/                 → User, Resource
├── config/
│   ├── auth.php                → guard 'api' → driver 'jwt'
│   └── cors.php                → allow origin dari FRONTEND_URL
├── database/
│   ├── migrations/
│   └── factories/
├── routes/
│   └── api.php
└── tests/
    └── Feature/                → AuthTest, ResourceTest
```

## Struktur Folder Frontend

```
frontend-api/
├── src/
│   ├── api/
│   │   └── axios.js            → instance Axios + interceptor JWT (401 handling)
│   ├── contexts/
│   │   └── AuthContext.jsx     → state login/logout/user
│   ├── components/
│   │   ├── common/             → Button, Input, Toast, ProtectedRoute
│   │   ├── layout/              → Navbar
│   │   └── dashboard/           → MetricsCard, ResourceTable
│   ├── pages/
│   │   ├── Login.jsx            → /login
│   │   ├── Dashboard.jsx        → /dashboard
│   │   └── ResourceForm.jsx     → /resource/manage
│   ├── App.jsx
│   └── index.css
└── tailwind.config.js
```

---

## Troubleshooting Cepat

| Gejala | Penyebab Umum | Fix |
|---|---|---|
| `array_merge(): Argument #2 must be of type array` | `config/cors.php` atau `config/jwt.php` rusak/kosong | Generate ulang via `vendor:publish` atau timpa manual |
| `PHPUnit requires ... mbstring` | Extension PHP belum aktif | Uncomment `extension=mbstring` di `php.ini` |
| `could not find driver` (SQLite) | `pdo_pgsql`/`pdo_sqlite` belum aktif | Uncomment extension terkait di `php.ini` |
| `Auth guard [api] is not defined` | `config/auth.php` belum di-set ke driver `jwt` | Set `'api' => ['driver' => 'jwt', ...]` |
| `Class ... does not exist` (Reflection) | Nama file tidak match nama class (PSR-4) | Rename file persis sama dengan nama class |
| Halaman login tampil tanpa styling | Tailwind belum ke-load / versi v4 terpasang | Pin `tailwindcss@3`, pastikan `index.css` di-import di `main.jsx` |
| `react-router-dom` not resolved | Package belum di-install | `npm install react-router-dom axios` |
| CORS error di browser | `FRONTEND_URL` di `.env` backend tidak match origin Vite | Set `FRONTEND_URL=http://localhost:5173` |

---

## Design System Reference

Warna, tipografi, dan spacing mengikuti spesifikasi `design.md`:

- **Primary**: `#1E293B` (Slate Dark)
- **Secondary**: `#475569` (Muted Slate)
- **Background**: `#F8FAFC`
- **Interactive/Success**: `#0F766E` (Teal Muted)
- **Error**: `#991B1B` (Deep Crimson)
- **Font**: Inter, base-8 spacing system

Semua token ini sudah dipetakan ke `tailwind.config.js` di frontend.
