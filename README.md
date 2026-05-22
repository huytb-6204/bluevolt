# Bluevolt — Full-stack Monorepo

<div align="center">

<a href="https://nestjs.com"><img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" /></a>
<a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" /></a>
<a href="https://expo.dev"><img src="https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37" alt="Expo" /></a>
<a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
<a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" /></a>
<a href="https://trpc.io"><img src="https://img.shields.io/badge/tRPC-%232596BE.svg?style=for-the-badge&logo=trpc&logoColor=white" alt="tRPC" /></a>
<a href="https://www.postgresql.org"><img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
<a href="https://redis.io"><img src="https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" /></a>
<a href="https://turbo.build"><img src="https://img.shields.io/badge/Turborepo-000000?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turborepo" /></a>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Modern full-stack monorepo với NestJS · Next.js · Expo · tRPC · JWT Auth · WebSockets

</div>

---

## 📂 Cấu trúc project

```text
bluevolt/
├── apps/
│   ├── backend/     # NestJS API — JWT auth, Prisma, Redis, tRPC, WebSockets
│   ├── web/         # Next.js web app
│   └── mobile/      # Expo React Native app
├── packages/
│   ├── services/    # Shared services (auth, redis)
│   ├── trpc/        # tRPC router definitions
│   ├── ui/          # ShadCN UI components (web)
│   ├── websockets/  # Type-safe Socket.IO
│   ├── analytics/   # PostHog integration
│   ├── eslint-config/
│   └── typescript-config/
├── docker-compose.yml
└── turbo.json
```

---

## 🚀 Setup nhanh

### Yêu cầu

| Tool | Phiên bản |
|---|---|
| Node.js | >= 20 |
| pnpm | >= 9 |
| Docker Desktop | latest |

### 1 — Clone & cài dependencies

```bash
git clone https://github.com/huytb-6204/bluevolt.git
cd bluevolt
pnpm install
```

### 2 — Tạo file `.env`

```bash
cp apps/backend/.env.local.example apps/backend/.env
```

Mở `apps/backend/.env` và điền:

```env
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=bluevolt
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bluevolt?schema=public"

JWT_ACCESS_SECRET=your_access_secret_min_16_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_min_16_chars
JWT_REFRESH_EXPIRES_IN=7d

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

POSTHOG_HOST=https://eu.i.posthog.com
POSTHOG_API_KEY=phc_dev_placeholder

SUPERADMIN_EMAILS=admin@example.com
```

### 3 — Khởi động Docker

```bash
docker compose up -d
```

> Sau khi restart Docker Desktop, chạy `docker compose up -d --force-recreate` để đảm bảo port binding đúng.

### 4 — Chạy Prisma migration

```bash
pnpm --filter backend prisma:migrate
```

### 5 — Start backend

```bash
pnpm --filter backend dev
```

Thành công khi thấy:

```
🚀 Application is running on: http://localhost:3001/
```

---

## 🔐 Auth Endpoints

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/auth/register` | Đăng ký tài khoản |
| POST | `/auth/login` | Đăng nhập, trả về JWT |
| POST | `/auth/refresh` | Làm mới access token |
| GET | `/auth/me` | Lấy thông tin user hiện tại |

```bash
# Register
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"user","password":"Test1234!"}'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Test1234!"}'
```

---

## 🛠️ Scripts thường dùng

```bash
# Dev
pnpm --filter backend dev          # Backend watch mode
pnpm --filter web dev              # Next.js
pnpm --filter mobile dev           # Expo

# Prisma
pnpm --filter backend prisma:migrate   # Tạo migration mới
pnpm --filter backend prisma:studio    # Mở Prisma Studio (GUI)

# Docker
docker compose up -d               # Khởi động Postgres + Redis
docker compose down                # Tắt containers
docker compose up -d --force-recreate  # Recreate nếu port không bind đúng
```

> Chi tiết setup backend xem tại [`apps/backend/SETUP.md`](apps/backend/SETUP.md)

---

## 📜 License

MIT © Bluevolt
