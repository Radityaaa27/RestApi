# Frontend — Struktur & Setup

Struktur ini mengikuti `design.md`: satu tempat untuk tokens (Tailwind config + CSS
variables), komponen yang dipisah per-tanggung jawab, dan halaman yang hanya
merangkai komponen + logic API.

```
src/
├── api/
│   └── axios.js            # instance Axios + interceptor JWT (attach token, handle 401)
├── contexts/
│   └── AuthContext.jsx     # state login/logout, token, user
├── components/
│   ├── common/
│   │   ├── Button.jsx      # primary/secondary/danger + loading state
│   │   ├── Input.jsx       # input + label + error message (utk 422)
│   │   ├── Toast.jsx       # ToastProvider + toast sukses/error
│   │   └── ProtectedRoute.jsx
│   ├── layout/
│   │   └── Navbar.jsx      # navbar authenticated state
│   └── dashboard/
│       ├── MetricsCard.jsx
│       └── ResourceTable.jsx
├── pages/
│   ├── Login.jsx            # Page 1 — /login
│   ├── Dashboard.jsx         # Page 2 — /dashboard
│   └── ResourceForm.jsx      # Page 3 — /resource/manage
├── App.jsx
└── index.css
```

## Setup

```bash
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
```

Tambahkan file `.env` di root project:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

`tailwind.config.js` sudah berisi semua token warna, tipografi, spacing (base-8),
dan radius sesuai `design.md` §1 — jadi setiap class seperti `bg-interactive`,
`text-danger`, `bg-tint`, `border-border-input` sudah otomatis mengikuti palet
"Corporate Slate & Warm Muted".

## Catatan implementasi

- **JWT handling**: `api/axios.js` melampirkan token dari `localStorage` ke tiap
  request, dan menembakkan event global `auth:expired` saat API balas 401.
  `AuthContext` mendengarkan event ini lalu logout otomatis — jadi toast/redirect
  konsisten di semua halaman tanpa duplikasi try/catch.
- **Login (401/411)**: error ditampilkan sebagai card merah tepat di atas field
  email, memakai warna `alert-error-*` dari `design.md`.
- **Validasi Laravel 422**: `ResourceForm.jsx` membaca `err.response.data.errors`
  (format default Laravel: `{ field: ["pesan"] }`), lalu memetakan ke tiap
  `Input`/field agar border dan pesan error muncul langsung di bawah input yang
  bermasalah.
- Sesuaikan endpoint di `Dashboard.jsx` dan `ResourceForm.jsx`
  (`/resources`, `/resources/:id`) dengan nama resource asli di API Laravel-mu.
