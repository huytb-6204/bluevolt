# Backend Setup Guide

Hướng dẫn setup backend từ đầu sau khi clone dự án.

## Yêu cầu

| Tool | Phiên bản |
|---|---|
| Node.js | >= 20 |
| pnpm | >= 9 |
| Docker Desktop | latest |

---

## Bước 1 — Cài dependencies

Chạy từ **root** của monorepo:

```bash
pnpm install
```

---

## Bước 2 — Tạo file `.env`

```bash
cp apps/backend/.env.local.example apps/backend/.env
```

Mở `apps/backend/.env` và điền các giá trị sau:

```env
# Application
PORT=3001

# Database (khớp với docker-compose)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=bluevolt
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bluevolt?schema=public"

# JWT — thay bằng secret ngẫu nhiên đủ mạnh
JWT_ACCESS_SECRET=dev_access_secret_bluevolt_2024
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=dev_refresh_secret_bluevolt_2024
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# PostHog — để placeholder khi dev local
POSTHOG_HOST=https://eu.i.posthog.com
POSTHOG_API_KEY=phc_dev_placeholder

# Superadmin
SUPERADMIN_EMAILS=superadmin@example.com
```

---

## Bước 3 — Khởi động Docker

```bash
docker compose up -d
```

Kiểm tra containers đã chạy:

```bash
docker compose ps
```

Kết quả mong đợi:

```
NAME                  IMAGE         PORTS
bluevolt-postgres-1   postgres:16   0.0.0.0:5432->5432/tcp
bluevolt-redis-1      redis:7       0.0.0.0:6379->6379/tcp
```

> **Lưu ý:** Nếu cột PORTS không hiển thị `0.0.0.0:xxxx->` (thường xảy ra sau khi restart Docker Desktop), chạy:
> ```bash
> docker compose up -d --force-recreate
> ```

---

## Bước 4 — Chạy Prisma migration

```bash
pnpm --filter backend prisma:migrate
```

Lần đầu sẽ tạo migration `init` và sync schema vào database.

---

## Bước 5 — Chạy backend

```bash
pnpm --filter backend dev
```

Backend khởi động thành công khi thấy:

```
🚀 Application is running on: http://localhost:3001/
```

---

## Kiểm tra hoạt động

```bash
# Health check
curl http://localhost:3001/health

# Register
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"Test1234!"}'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}'
```

---

## Các lệnh thường dùng

```bash
# Dev (watch mode)
pnpm --filter backend dev

# Debug mode
pnpm --filter backend dev:debug

# Build production
pnpm --filter backend build

# Prisma Studio (GUI quản lý DB)
pnpm --filter backend prisma:studio

# Tạo migration mới sau khi thay đổi schema
pnpm --filter backend prisma:migrate

# Xem logs Docker
docker compose logs -f postgres
docker compose logs -f redis
```

---

## Troubleshooting

### Backend treo sau khi compile, không thấy log Nest

Nguyên nhân thường gặp:

1. **Port 3001 bị chiếm** — kiểm tra và kill:
   ```bash
   lsof -ti:3001 | xargs kill -9
   ```

2. **Postgres/Redis không bind ra host** — recreate containers:
   ```bash
   docker compose up -d --force-recreate
   ```

3. **Nhiều nest process cũ còn sống** — kill hết:
   ```bash
   pkill -f "nest.js start"
   pkill -f "dist/main"
   ```

### Lỗi `Config validation error`

File `.env` thiếu biến bắt buộc. Đối chiếu lại với Bước 2.

### Lỗi `Can't reach database server`

Docker chưa chạy hoặc port 5432 không bind. Kiểm tra:
```bash
docker port bluevolt-postgres-1
# Phải thấy: 5432/tcp -> 0.0.0.0:5432
```
