# 🚀 راهنمای کامل دیپلوی TM-BRAND

**دامنه:** `tm-brand.com`

---

## 📦 دیپلوی روی VPS با اکسپرس و AdminJS

- **IP فعلی سرور:** `45.149.78.122`
- **دامنه آینده:** `tm-brand.com`
- **پورت API/AdminJS:** `3001`
- **فولدر فرانت‌اند:** `/var/www/tm-brand/frontend`
- **فولدر آپلودها:** `/var/www/tm-brand/backend/uploads`

### پیکربندی Nginx (نمونه)

```nginx
server {
    listen 80;
    server_name tm-brand.com www.tm-brand.com;

    root /var/www/tm-brand/frontend;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /admin {
        proxy_pass http://localhost:3001/admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        alias /var/www/tm-brand/backend/uploads/;
        access_log off;
        expires max;
    }
}
```

### اجرای بک‌اند با PM2

```bash
# داخل پوشه backend و پس از ساخت فایل .env
pm2 start src/index.js --name tm-brand-api
pm2 save
pm2 startup
```

> فرانت‌اند Vite را Build کنید و خروجی `dist/` را در مسیر `/var/www/tm-brand/frontend` کپی کنید.

---

## 📋 معماری پروژه

```
┌─────────────────────────────────────────────────────────────┐
│                      tm-brand.com                           │
│                    (React Frontend)                         │
│                   Vercel / Netlify                          │
└─────────────────────┬───────────────────────────────────────┘
                      │ API Calls
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  api.tm-brand.com                           │
│                   (Strapi CMS)                              │
│              Railway / DigitalOcean / VPS                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL                               │
│                    Database                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔹 مرحله ۱: دانلود و آماده‌سازی کد

```bash
# Clone کردن پروژه
git clone https://github.com/YOUR_USERNAME/tm-brand.git
cd tm-brand

# نصب dependencies
npm install

# کپی فایل environment
cp .env.example .env

# تست لوکال
npm run dev
```

---

## 🔹 مرحله ۲: نصب Strapi روی سرور

### گزینه A: Railway.app (پیشنهادی برای شروع)

1. به [railway.app](https://railway.app) برو و لاگین کن
2. New Project → Deploy Template → Strapi
3. یک PostgreSQL database هم اضافه کن
4. Environment variables رو ست کن
5. دامنه `api.tm-brand.com` رو وصل کن

### گزینه B: VPS (سرور شخصی)

```bash
# روی سرور لینوکس (Ubuntu 22.04)

# نصب Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# نصب PostgreSQL
sudo apt install postgresql postgresql-contrib
sudo -u postgres createuser --interactive
sudo -u postgres createdb tm_brand_db

# ساخت پروژه Strapi
npx create-strapi-app@latest tm-brand-cms \
  --dbclient=postgres \
  --dbhost=localhost \
  --dbport=5432 \
  --dbname=tm_brand_db \
  --dbusername=postgres \
  --dbpassword=YOUR_SECURE_PASSWORD

cd tm-brand-cms

# Build برای production
NODE_ENV=production npm run build

# اجرا با PM2
npm install -g pm2
pm2 start npm --name "strapi" -- run start
pm2 save
pm2 startup
```

### تنظیم Nginx برای Strapi

```nginx
# /etc/nginx/sites-available/api.tm-brand.com

server {
    listen 80;
    server_name api.tm-brand.com;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# فعال‌سازی سایت
sudo ln -s /etc/nginx/sites-available/api.tm-brand.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# نصب SSL با Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.tm-brand.com
```

---

## 🔹 مرحله ۳: ساخت Content Types در Strapi

بعد از نصب Strapi، وارد پنل ادمین شو (`https://api.tm-brand.com/admin`)

### 3.1 ساخت Category Collection

1. Content-Type Builder → Create new collection type
2. نام: `Category`
3. فیلدها:

| فیلد | نوع | تنظیمات |
|------|-----|---------|
| name | Text | Required |
| nameEn | Text | - |
| slug | UID | از name |
| description | Text | Long text |
| image | Media | Single |

### 3.2 ساخت Product Collection

| فیلد | نوع | تنظیمات |
|------|-----|---------|
| name | Text | Required |
| nameEn | Text | - |
| slug | UID | از name |
| description | Rich Text | - |
| longDescription | Rich Text | - |
| price | Number | Integer, Required |
| compareAtPrice | Number | Integer |
| gender | Enumeration | men, women, unisex |
| sizes | JSON | ["S", "M", "L", "XL", "XXL"] |
| colors | JSON | [{"name": "مشکی", "hex": "#000000"}] |
| images | Media | Multiple |
| isNew | Boolean | Default: false |
| isBestSeller | Boolean | Default: false |
| isFeatured | Boolean | Default: false |
| features | JSON | ["ویژگی ۱", "ویژگی ۲"] |
| specifications | JSON | [{"label": "جنس", "value": "نخ"}] |
| materials | Text | - |
| sizeGuide | Rich Text | - |
| seoTitle | Text | - |
| seoDescription | Text | Long text |
| seoKeywords | JSON | ["کلمه۱", "کلمه۲"] |
| category | Relation | Many-to-One → Category |

### 3.3 ساخت BlogPost Collection

| فیلد | نوع | تنظیمات |
|------|-----|---------|
| title | Text | Required |
| slug | UID | از title |
| excerpt | Text | Long text |
| content | Rich Text | - |
| tags | JSON | ["تگ۱", "تگ۲"] |
| publishedAt | Text | تاریخ فارسی |
| readTimeMinutes | Number | Integer |
| featuredImage | Media | Single |

---

## 🔹 مرحله ۴: تنظیمات امنیتی Strapi

### 4.1 CORS Configuration

فایل `config/middlewares.ts` در پروژه Strapi:

```typescript
export default [
  'strapi::errors',
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://tm-brand.com',
        'https://www.tm-brand.com',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::security',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

### 4.2 Public Permissions

در پنل ادمین Strapi:

1. Settings → Users & Permissions → Roles → Public
2. تیک بزن:
   - ✅ Category: `find`, `findOne`
   - ✅ Product: `find`, `findOne`
   - ✅ Blog-post: `find`, `findOne`
3. Save

---

## 🔹 مرحله ۵: وارد کردن داده‌های اولیه

داده‌های نمونه که الان در `src/data/products.ts` هست رو می‌تونی دستی وارد Strapi کنی یا یک اسکریپت migration بنویسی.

### اسکریپت Import (اختیاری)

فایل `scripts/import-data.js` بساز:

```javascript
const fetch = require('node-fetch');

const STRAPI_URL = 'https://api.tm-brand.com';
const API_TOKEN = 'YOUR_STRAPI_API_TOKEN';

const products = require('../src/data/products').products;

async function importProducts() {
  for (const product of products) {
    const response = await fetch(`${STRAPI_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          name: product.name,
          nameEn: product.nameEn,
          slug: product.slug,
          description: product.description,
          price: product.price,
          // ... بقیه فیلدها
        }
      }),
    });
    
    const result = await response.json();
    console.log(`Imported: ${product.name}`, result);
  }
}

importProducts();
```

---

## 🔹 مرحله ۶: دیپلوی فرانت‌اند React

### گزینه A: Vercel (پیشنهادی)

1. به [vercel.com](https://vercel.com) برو
2. Import Git Repository
3. Environment Variables:
   ```
   VITE_STRAPI_URL=https://api.tm-brand.com
   VITE_USE_STRAPI=true
   ```
4. Deploy
5. در Settings → Domains، دامنه `tm-brand.com` رو اضافه کن

### گزینه B: Netlify

1. به [netlify.com](https://netlify.com) برو
2. Import from Git
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Environment variables همون موارد بالا
5. Domain settings → Add custom domain

### گزینه C: سرور شخصی با Nginx

```bash
# Build پروژه
npm run build

# کپی فایل‌ها به سرور
scp -r dist/* user@server:/var/www/tm-brand.com/

# تنظیم Nginx
```

```nginx
# /etc/nginx/sites-available/tm-brand.com

server {
    listen 80;
    server_name tm-brand.com www.tm-brand.com;

    root /var/www/tm-brand.com;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

```bash
# SSL
sudo certbot --nginx -d tm-brand.com -d www.tm-brand.com
```

---

## 🔹 مرحله ۷: تنظیمات DNS (در پنل دامنه)

در پنل مدیریت دامنه `tm-brand.com`:

### برای فرانت‌اند (Vercel):

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.19.19 |
| CNAME | www | cname.vercel-dns.com |

### برای بکند (سرور شخصی):

| Type | Name | Value |
|------|------|-------|
| A | api | IP_سرور_شما |

---

## 🔹 مرحله ۸: تنظیم دامنه در Lovable

اگر از Lovable استفاده می‌کنی:

1. Project Settings → Domains
2. Connect Domain: `tm-brand.com`
3. DNS Records:
   - A Record: `@` → `185.158.133.1`
   - A Record: `www` → `185.158.133.1`
   - TXT Record: `_lovable` → مقداری که Lovable میده
4. صبر کن تا SSL فعال بشه

---

## ✅ چک‌لیست نهایی

- [ ] کد از GitHub clone شده
- [ ] Strapi روی سرور نصب شده
- [ ] PostgreSQL database ساخته شده
- [ ] Content Types در Strapi ساخته شده
- [ ] داده‌های اولیه وارد شده
- [ ] CORS تنظیم شده
- [ ] Public permissions فعال شده
- [ ] Environment variables ست شده
- [ ] فرانت‌اند دیپلوی شده
- [ ] DNS records تنظیم شده
- [ ] SSL certificates فعال شده
- [ ] تست نهایی انجام شده ✅

---

## 🆘 مشکلات رایج

### CORS Error
- مطمئن شو آدرس فرانت‌اند در `middlewares.ts` اضافه شده

### 404 on API
- Public permissions رو چک کن
- مسیر API رو چک کن (`/api/products` نه `/products`)

### Images not loading
- `getImageUrl` تابع رو چک کن
- Media permissions در Strapi رو چک کن

---

## 📞 پشتیبانی

- مستندات Strapi: [docs.strapi.io](https://docs.strapi.io)
- مستندات Vercel: [vercel.com/docs](https://vercel.com/docs)
- مستندات Lovable: [docs.lovable.dev](https://docs.lovable.dev)
