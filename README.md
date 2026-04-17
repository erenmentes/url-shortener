# URL Shortener (NestJS + Prisma + Redis)

URL shortening and redirect service. Backend is built with NestJS; PostgreSQL (via Prisma) is used for persistence, and Redis is used as a cache for fast redirect lookups.

## Features

- **Create short URLs**: Random short-code, or (when logged in) custom alias
- **Redirect**: `GET /url/:shortUrl` returns a 302 redirect
- **Cache**: Redis key `url:<shortUrl>` (TTL: 60s)
- **Expiration**: URLs have an `expireDate`
- **Public/Private**: Private URLs can be protected with a password
- **Auth**: Register/Login + JWT for (optional) user-owned URL creation & deletion

## Repository structure

- `backend/`: NestJS API
- `frontend/`: (currently empty)

## Requirements

- Node.js + npm
- PostgreSQL
- Redis (default: `localhost:6379`)

## Setup

### 1) Install backend dependencies

```bash
cd backend
npm install
```

### 2) Environment variables

Backend uses `backend/.env`:

- `DATABASE_URL`: PostgreSQL connection string  
  Example: `postgresql://postgres@localhost:5432/UrlShortener?schema=public`
- `JWT_SECRET`: JWT signing secret

Security note: do not commit secrets like `JWT_SECRET` in production.

### 3) Database migrations (Prisma)

```bash
cd backend
npx prisma migrate deploy
# for local development:
# npx prisma migrate dev
```

### 4) Start Redis

Redis provider is currently configured to connect to `localhost:6379`.

```bash
redis-server
```

### 5) Run the app

```bash
cd backend
npm run start:dev
```

Default base URL: `http://localhost:3000`

## API (quick overview)

### Auth

- `POST /auth/register`
- `POST /auth/login` → `{ access_token }`

### URL

- `POST /url/create` (Authorization optional)
- `GET /url/:shortUrl` → 302 redirect  
  If the URL is private, provide password via query: `GET /url/:shortUrl?password=...`
- `GET /url/details/:shortUrl`
- `DELETE /url/:shortUrl` (Authorization required + must own the URL)

## Example requests (curl)

### Register

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"a@a.com","username":"alice","password":"123456"}'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"123456"}'
```

### Create short URL (anonymous)

```bash
curl -X POST http://localhost:3000/url/create \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://example.com","isPublic":true}'
```

### Create short URL (with JWT, custom alias + expire)

```bash
curl -X POST http://localhost:3000/url/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"originalUrl":"https://example.com","customUrl":"my-alias","isPublic":true,"expireDate":"2030-01-01T00:00:00.000Z"}'
```

### Redirect

```bash
curl -I http://localhost:3000/url/<shortUrl>
```

### Delete (with JWT)

```bash
curl -X DELETE http://localhost:3000/url/<shortUrl> \
  -H "Authorization: Bearer <TOKEN>"
```

---

# URL Shortener (NestJS + Prisma + Redis) — Türkçe

Kısa URL üretme ve yönlendirme servisi. Backend tarafı NestJS ile yazıldı; Postgres (Prisma) kalıcı storage, Redis ise redirect lookup için cache olarak kullanılıyor.

## Özellikler

- **Kısa URL oluşturma**: Rastgele short-code veya (login ile) custom alias
- **Redirect**: `GET /url/:shortUrl` ile 302 yönlendirme
- **Cache**: Redis üzerinde `url:<shortUrl>` anahtarı ile (TTL: 60s) cache
- **Expire**: URL’lerin son kullanma tarihi var
- **Public/Private**: Private URL’ler password ile korunabiliyor
- **Auth**: Register/Login + JWT ile (opsiyonel) kullanıcıya bağlı URL oluşturma & silme

## Repo yapısı

- `backend/`: NestJS API
- `frontend/`: (şu an boş)

## Gereksinimler

- Node.js + npm
- PostgreSQL
- Redis (default: `localhost:6379`)

## Kurulum

### 1) Backend bağımlılıkları

```bash
cd backend
npm install
```

### 2) Ortam değişkenleri

Backend `backend/.env` üzerinden çalışıyor:

- `DATABASE_URL`: Postgres bağlantı string’i  
  Örn: `postgresql://postgres@localhost:5432/UrlShortener?schema=public`
- `JWT_SECRET`: JWT imzalama anahtarı

Güvenlik notu: Prod’da `JWT_SECRET` gibi secret’ları repoya commit’lemeyin.

### 3) Veritabanı migrasyonları (Prisma)

```bash
cd backend
npx prisma migrate deploy
# lokal geliştirme için:
# npx prisma migrate dev
```

### 4) Redis’i çalıştır

Redis provider şu an `localhost:6379`’a bağlanacak şekilde ayarlı.

```bash
redis-server
```

### 5) Uygulamayı çalıştır

```bash
cd backend
npm run start:dev
```

Varsayılan base URL: `http://localhost:3000`

## API (özet)

### Auth

- `POST /auth/register`
- `POST /auth/login` → `{ access_token }`

### URL

- `POST /url/create` (Authorization opsiyonel)
- `GET /url/:shortUrl` → 302 redirect  
  Private URL ise password query param bekler: `GET /url/:shortUrl?password=...`
- `GET /url/details/:shortUrl`
- `DELETE /url/:shortUrl` (Authorization zorunlu + URL sahibi olmalı)

## Örnek istekler (curl)

### Register

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"a@a.com","username":"alice","password":"123456"}'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"123456"}'
```

### Kısa URL oluştur (anonim)

```bash
curl -X POST http://localhost:3000/url/create \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://example.com","isPublic":true}'
```

### Kısa URL oluştur (JWT ile, custom alias + expire)

```bash
curl -X POST http://localhost:3000/url/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"originalUrl":"https://example.com","customUrl":"my-alias","isPublic":true,"expireDate":"2030-01-01T00:00:00.000Z"}'
```

### Redirect

```bash
curl -I http://localhost:3000/url/<shortUrl>
```

### Sil (JWT ile)

```bash
curl -X DELETE http://localhost:3000/url/<shortUrl> \
  -H "Authorization: Bearer <TOKEN>"
```