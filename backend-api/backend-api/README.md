# Backend API — Laravel 13 + JWT

Skeleton ini melengkapi struktur yang sudah dibahas: Controller, Model,
Migration, Form Request, API Resource, routes, dan Feature Tests, semuanya
sudah disambungkan ke frontend React yang sudah dibuat sebelumnya.

## Cara Pasang ke Project Kamu

Semua file di sini **copy-paste langsung** ke folder project Laravel kamu
(`D:\backend-api`), timpa/tambah sesuai path masing-masing:

```
app/Models/User.php                              → timpa yang default
app/Models/Resource.php                          → baru
app/Http/Controllers/Api/AuthController.php       → baru
app/Http/Controllers/Api/ResourceController.php   → baru
app/Http/Requests/LoginRequest.php                → baru
app/Http/Requests/ResourceRequest.php             → baru
app/Http/Resources/UserResource.php               → baru
app/Http/Resources/ResourceResource.php           → baru
database/migrations/2026_01_01_000000_create_resources_table.php → baru
database/factories/ResourceFactory.php            → baru
routes/api.php                                    → timpa
config/auth.php                                   → timpa
config/cors.php                                   → timpa
tests/Feature/AuthTest.php                         → baru
tests/Feature/ResourceTest.php                      → baru
```

## Instalasi Package yang Dibutuhkan

```powershell
composer require tymon/jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret
```

`jwt:secret` akan otomatis nambahin `JWT_SECRET=...` ke `.env` kamu.

## `.env` Tambahan

```env
FRONTEND_URL=http://localhost:5173
```

## Pastikan `routes/api.php` Ke-load

Laravel 13 (seperti 11/12) tidak pakai `app/Http/Kernel.php` lagi. Cek di
`bootstrap/app.php`, pastikan ada:

```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    api: __DIR__.'/../routes/api.php',
    commands: __DIR__.'/../routes/console.php',
    health: '/up',
)
```

Kalau `api:` belum ada di situ, route di `routes/api.php` gak akan pernah
ke-load meskipun filenya benar.

## Migrasi & Jalankan

```powershell
php artisan migrate
php artisan serve
```

## Jalankan Test

```powershell
php artisan test
```

Test pakai `RefreshDatabase`, jadi otomatis reset schema tiap run — pastikan
`DB_CONNECTION` di `.env.testing` (atau `.env` kalau belum ada file testing
terpisah) mengarah ke database yang aman untuk di-reset (jangan database
production).

## Endpoint yang Tersedia

| Method | Endpoint | Auth? | Keterangan |
|---|---|---|---|
| POST | `/api/auth/login` | tidak | login, balikin `access_token` + `user` |
| GET | `/api/auth/me` | ya | profil user yang sedang login |
| POST | `/api/auth/logout` | ya | invalidate token |
| POST | `/api/auth/refresh` | ya | tukar token lama dengan yang baru |
| GET | `/api/resources` | ya | list semua resource |
| POST | `/api/resources` | ya | create (422 jika validasi gagal) |
| GET | `/api/resources/{id}` | ya | detail satu resource |
| PUT/PATCH | `/api/resources/{id}` | ya | update (422 jika validasi gagal) |
| DELETE | `/api/resources/{id}` | ya | hapus resource |

Semua ini sudah match persis dengan yang dipanggil di `api/axios.js`,
`AuthContext.jsx`, `Login.jsx`, `Dashboard.jsx`, dan `ResourceForm.jsx` di
frontend React sebelumnya — tinggal jalankan dua-duanya bareng dan langsung
nyambung.
