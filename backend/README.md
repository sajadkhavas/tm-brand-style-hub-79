# TM-BRAND Backend API

بکند Node.js برای فروشگاه TM-BRAND با پنل ادمین AdminJS

## 🛠️ تکنولوژی‌ها

- **Express.js** - فریمورک وب
- **PostgreSQL** - دیتابیس
- **Sequelize** - ORM
- **AdminJS** - پنل ادمین
- **JWT** - احراز هویت
- **Sharp** - پردازش تصاویر

## 📦 نصب و راه‌اندازی لوکال

### پیش‌نیازها
- Node.js 18+
- PostgreSQL 14+

### مراحل

```bash
# 1. ورود به پوشه بکند
cd backend

# 2. نصب پکیج‌ها
npm install

# 3. ساخت فایل .env
cp .env.example .env

# 4. ویرایش .env و تنظیم اطلاعات دیتابیس

# 5. ساخت دیتابیس در PostgreSQL
psql -U postgres -c "CREATE DATABASE tm_brand;"

# 6. اجرای seed برای داده‌های اولیه
npm run seed

# 7. اجرای سرور
npm run dev
```

## 🔗 دسترسی‌ها

- **API**: http://localhost:3001/api
- **پنل ادمین**: http://localhost:3001/admin
- **Health Check**: http://localhost:3001/api/health

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | ثبت‌نام کاربر |
| POST | `/api/auth/login` | ورود کاربر |
| GET | `/api/auth/me` | اطلاعات کاربر جاری |
| PUT | `/api/auth/profile` | بروزرسانی پروفایل |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | لیست محصولات |
| GET | `/api/products/featured` | محصولات ویژه |
| GET | `/api/products/:slug` | جزئیات محصول |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | لیست دسته‌بندی‌ها |
| GET | `/api/categories/:slug` | دسته‌بندی با محصولات |

### Blog
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blog` | لیست مقالات |
| GET | `/api/blog/:slug` | جزئیات مقاله |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | ثبت سفارش |
| GET | `/api/orders/my-orders` | سفارشات کاربر |
| GET | `/api/orders/:orderNumber` | جزئیات سفارش |

## 🔒 پنل ادمین

پس از اجرای seed، با اطلاعات زیر وارد شوید:
- **Email**: admin@tm-brand.com
- **Password**: admin123456

### امکانات پنل:
- مدیریت محصولات
- مدیریت دسته‌بندی‌ها
- مدیریت سفارشات
- مدیریت کاربران
- مدیریت وبلاگ
- آپلود تصاویر

## 🖼️ آپلود تصاویر

تصاویر در پوشه `uploads/` ذخیره می‌شوند:
- `uploads/products/` - تصاویر محصولات
- `uploads/blog/` - تصاویر بلاگ

## 📝 متغیرهای محیطی

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | پورت سرور | 3001 |
| DB_HOST | هاست دیتابیس | localhost |
| DB_PORT | پورت دیتابیس | 5432 |
| DB_NAME | نام دیتابیس | tm_brand |
| DB_USER | یوزر دیتابیس | postgres |
| DB_PASSWORD | پسورد دیتابیس | - |
| JWT_SECRET | کلید JWT | - |
| ADMIN_EMAIL | ایمیل ادمین | admin@tm-brand.com |
| ADMIN_PASSWORD | پسورد ادمین | admin123456 |
| FRONTEND_URL | آدرس فرانت | http://localhost:5173 |
