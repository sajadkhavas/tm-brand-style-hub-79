# راهنمای کامل دیپلوی TM-BRAND روی VPS

## 📋 مشخصات VPS مورد نیاز

### حداقل:
- **RAM**: 2GB
- **CPU**: 1 Core
- **Storage**: 20GB SSD
- **OS**: Ubuntu 22.04 LTS

### پیشنهادی:
- **RAM**: 4GB
- **CPU**: 2 Core
- **Storage**: 40GB SSD
- **OS**: Ubuntu 22.04 LTS

### هزینه تقریبی:
- ایرانی (پارس‌گرین، ابرآروان): ماهی ۱۵۰-۳۰۰ هزار تومان
- خارجی (DigitalOcean, Hetzner): ماهی ۵-۱۵ دلار

---

## 🚀 مرحله ۱: آماده‌سازی سرور

### اتصال به سرور
```bash
ssh root@YOUR_SERVER_IP
```

### آپدیت سیستم
```bash
apt update && apt upgrade -y
```

### نصب پکیج‌های پایه
```bash
apt install -y curl wget git nginx certbot python3-certbot-nginx ufw
```

### تنظیم فایروال
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## 🐘 مرحله ۲: نصب PostgreSQL

```bash
# نصب PostgreSQL
apt install -y postgresql postgresql-contrib

# ورود به PostgreSQL
sudo -u postgres psql

# ساخت دیتابیس و یوزر
CREATE DATABASE tm_brand;
CREATE USER tm_user WITH ENCRYPTED PASSWORD 'YOUR_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE tm_brand TO tm_user;
\q
```

---

## 📦 مرحله ۳: نصب Node.js

```bash
# نصب Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# بررسی نسخه
node --version
npm --version
```

---

## 📂 مرحله ۴: آپلود و راه‌اندازی بکند

### ساخت پوشه پروژه
```bash
mkdir -p /var/www/tm-brand
cd /var/www/tm-brand
```

### آپلود فایل‌ها (از کامپیوتر خود)
```bash
# از کامپیوتر محلی:
scp -r ./backend root@YOUR_SERVER_IP:/var/www/tm-brand/
```

### یا استفاده از Git
```bash
git clone YOUR_REPO_URL .
```

### نصب پکیج‌ها
```bash
cd /var/www/tm-brand/backend
npm install
```

### ساخت فایل .env
```bash
cat > .env << 'EOF'
PORT=3001
NODE_ENV=production

DB_HOST=localhost
DB_PORT=5432
DB_NAME=tm_brand
DB_USER=tm_user
DB_PASSWORD=YOUR_STRONG_PASSWORD

JWT_SECRET=YOUR_SUPER_SECRET_JWT_KEY_GENERATE_A_RANDOM_STRING

ADMIN_EMAIL=admin@tm-brand.com
ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD

FRONTEND_URL=https://tm-brand.com
PRODUCTION_FRONTEND_URL=https://tm-brand.com
EOF
```

### اجرای seed
```bash
npm run seed
```

---

## 🔄 مرحله ۵: تنظیم PM2 (Process Manager)

```bash
# نصب PM2
npm install -g pm2

# اجرای اپ
pm2 start src/index.js --name tm-brand-api

# ذخیره تنظیمات
pm2 save
pm2 startup

# دستورات مفید:
# pm2 logs tm-brand-api    # مشاهده لاگ‌ها
# pm2 restart tm-brand-api # ریستارت
# pm2 stop tm-brand-api    # توقف
```

---

## 🌐 مرحله ۶: تنظیم Nginx

### ساخت کانفیگ برای API
```bash
cat > /etc/nginx/sites-available/api.tm-brand.com << 'EOF'
server {
    listen 80;
    server_name api.tm-brand.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 10M;
    }

    location /uploads {
        alias /var/www/tm-brand/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF
```

### فعال‌سازی سایت
```bash
ln -s /etc/nginx/sites-available/api.tm-brand.com /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## 🔐 مرحله ۷: نصب SSL

```bash
certbot --nginx -d api.tm-brand.com
```

---

## 🖥️ مرحله ۸: دیپلوی فرانت‌اند

### گزینه ۱: Vercel (پیشنهادی - رایگان)

1. به [vercel.com](https://vercel.com) بروید
2. ریپازیتوری را کانکت کنید
3. متغیرهای محیطی را اضافه کنید:
   - `VITE_API_URL` = `https://api.tm-brand.com`
4. دامنه `tm-brand.com` را اضافه کنید

### گزینه ۲: همین VPS

```bash
# ساخت پوشه فرانت
mkdir -p /var/www/tm-brand/frontend

# بیلد لوکال و آپلود (از کامپیوتر خود):
npm run build
scp -r ./dist/* root@YOUR_SERVER_IP:/var/www/tm-brand/frontend/

# کانفیگ Nginx برای فرانت
cat > /etc/nginx/sites-available/tm-brand.com << 'EOF'
server {
    listen 80;
    server_name tm-brand.com www.tm-brand.com;
    root /var/www/tm-brand/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

ln -s /etc/nginx/sites-available/tm-brand.com /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# SSL
certbot --nginx -d tm-brand.com -d www.tm-brand.com
```

---

## 📡 مرحله ۹: تنظیم DNS

در پنل دامنه خود:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | YOUR_SERVER_IP | 3600 |
| A | www | YOUR_SERVER_IP | 3600 |
| A | api | YOUR_SERVER_IP | 3600 |

---

## ✅ چک‌لیست نهایی

- [ ] PostgreSQL نصب و دیتابیس ساخته شده
- [ ] Node.js نصب شده
- [ ] بکند آپلود و اجرا شده
- [ ] PM2 تنظیم شده
- [ ] Nginx کانفیگ شده
- [ ] SSL نصب شده
- [ ] DNS تنظیم شده
- [ ] فرانت‌اند دیپلوی شده

---

## 🔧 دستورات مفید

```bash
# لاگ‌های API
pm2 logs tm-brand-api

# ریستارت API
pm2 restart tm-brand-api

# وضعیت Nginx
systemctl status nginx

# لاگ‌های Nginx
tail -f /var/log/nginx/error.log

# اتصال به دیتابیس
psql -U tm_user -d tm_brand -h localhost

# فضای دیسک
df -h

# مصرف RAM
free -h
```

---

## ❓ مشکلات رایج

### خطای CORS
بررسی کنید که `FRONTEND_URL` در `.env` درست تنظیم شده باشد.

### خطای اتصال دیتابیس
```bash
# بررسی وضعیت PostgreSQL
systemctl status postgresql

# ریستارت
systemctl restart postgresql
```

### سایت لود نمی‌شود
```bash
# بررسی PM2
pm2 status

# بررسی Nginx
nginx -t
systemctl status nginx
```

---

## 🆘 پشتیبانی

اگر مشکلی داشتید، این اطلاعات را آماده کنید:
- لاگ‌های PM2: `pm2 logs`
- لاگ‌های Nginx: `tail -100 /var/log/nginx/error.log`
- وضعیت سرویس‌ها: `systemctl status postgresql nginx`
