const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');

async function setupAdmin(app) {
  const { default: AdminJS } = await import('adminjs');
  const AdminJSExpress = await import('@adminjs/express');
  const AdminJSSequelize = await import('@adminjs/sequelize');
  const { default: UploadFeature } = await import('@adminjs/upload');

  const { User, Category, Product, BlogPost, Order, Address, Page, sequelize } = require('../models');

  AdminJS.registerAdapter({
    Resource: AdminJSSequelize.Resource,
    Database: AdminJSSequelize.Database,
  });

  const uploadsRoot = path.resolve(process.env.FILE_UPLOAD_PATH || path.join(__dirname, '../uploads'));
  if (!fs.existsSync(uploadsRoot)) {
    fs.mkdirSync(uploadsRoot, { recursive: true });
  }

  const componentLoader = new AdminJS.ComponentLoader();
  const components = {
    richText: componentLoader.add('richText', path.join(__dirname, 'components', 'RichText.jsx')),
    dashboard: componentLoader.add('dashboard', path.join(__dirname, 'components', 'Dashboard.jsx')),
    reorder: componentLoader.add('reorder', path.join(__dirname, 'components', 'Reorder.jsx')),
  };

  const productUploadFeature = UploadFeature({
    provider: { local: { bucket: uploadsRoot } },
    validation: { mimeTypes: ['image/png', 'image/jpeg', 'image/webp'] },
    multiple: true,
    properties: {
      key: 'images',
      file: 'uploadImage',
      filesToDelete: 'imagesToDelete',
      mimeType: 'mimeType',
      bucket: 'bucket',
      size: 'fileSize',
    },
    uploadPath: (record, filename) => `products/${record?.id || 'new'}/${Date.now()}-${filename}`,
  });

  const pageUploadFeature = UploadFeature({
    provider: { local: { bucket: uploadsRoot } },
    validation: { mimeTypes: ['image/png', 'image/jpeg', 'image/webp'] },
    multiple: true,
    properties: {
      key: 'images',
      file: 'uploadImage',
      filesToDelete: 'imagesToDelete',
      mimeType: 'mimeType',
      bucket: 'bucket',
      size: 'fileSize',
    },
    uploadPath: (record, filename) => `pages/${record?.id || 'new'}/${Date.now()}-${filename}`,
  });

  const categoryUploadFeature = UploadFeature({
    provider: { local: { bucket: uploadsRoot } },
    validation: { mimeTypes: ['image/png', 'image/jpeg', 'image/webp'] },
    properties: {
      key: 'image',
      file: 'uploadImage',
      filesToDelete: 'filesToDelete',
      mimeType: 'mimeType',
      bucket: 'bucket',
      size: 'fileSize',
    },
    uploadPath: (record, filename) => `categories/${record?.id || 'new'}/${Date.now()}-${filename}`,
  });

  const reorderAction = (Model, displayFn = (record) => record.title || record.name) => ({
    actionType: 'resource',
    icon: 'ArrowsUpDown',
    label: 'چینش و اولویت',
    component: components.reorder,
    guard: 'با کشیدن و رها کردن ترتیب آیتم‌ها را تنظیم کنید.',
    handler: async (request) => {
      if (request.method === 'post') {
        const { order = [] } = request.payload || {};
        await Promise.all(
          order.map((item) => Model.update({ order: item.order }, { where: { id: item.id } }))
        );
        return {
          notice: {
            message: 'ترتیب با موفقیت ذخیره شد',
            type: 'success',
          },
        };
      }

      const records = await Model.findAll({ order: [['order', 'ASC'], ['createdAt', 'ASC']] });
      return {
        records: records.map((record) => ({
          id: record.id,
          title: displayFn(record),
          order: record.order || 0,
        })),
      };
    },
  });

  const adminJs = new AdminJS({
    componentLoader,
    resources: [
      {
        resource: User,
        options: {
          navigation: { name: 'مدیریت کاربران', icon: 'User' },
          listProperties: ['email', 'fullName', 'phone', 'role', 'isActive', 'createdAt'],
          editProperties: ['email', 'password', 'fullName', 'phone', 'role', 'isActive'],
          showProperties: ['id', 'email', 'fullName', 'phone', 'role', 'isActive', 'createdAt', 'updatedAt'],
          properties: {
            password: {
              type: 'password',
              isVisible: { list: false, filter: false, show: false, edit: true },
            },
          },
          actions: {
            new: {
              before: async (request) => {
                if (request.payload?.password) {
                  request.payload.password = await bcrypt.hash(request.payload.password, 10);
                }
                return request;
              },
            },
            edit: {
              before: async (request) => {
                if (request.payload?.password) {
                  request.payload.password = await bcrypt.hash(request.payload.password, 10);
                }
                return request;
              },
            },
          },
        },
      },
      {
        resource: Category,
        options: {
          navigation: { name: 'محصولات', icon: 'Archive' },
          sort: { sortBy: 'order', direction: 'asc' },
          listProperties: ['name', 'slug', 'order', 'isActive'],
          editProperties: ['name', 'nameEn', 'slug', 'description', 'image', 'order', 'isActive'],
          properties: {
            description: { components: { edit: components.richText } },
            order: { type: 'number' },
            uploadImage: { isVisible: false },
            filesToDelete: { isVisible: false },
          },
          actions: {
            reorder: reorderAction(Category, (record) => `${record.name}`),
            bulkActivate: {
              actionType: 'bulk',
              icon: 'Play',
              label: 'فعال‌سازی دسته',
              handler: async (request, response, context) => {
                const { records } = context;
                await Promise.all(records.map((record) => record.update({ isActive: true })));
                return {
                  records,
                  notice: { message: 'دسته‌بندی‌ها فعال شدند', type: 'success' },
                };
              },
            },
            bulkDeactivate: {
              actionType: 'bulk',
              icon: 'Pause',
              label: 'غیرفعال‌سازی دسته',
              handler: async (request, response, context) => {
                const { records } = context;
                await Promise.all(records.map((record) => record.update({ isActive: false })));
                return {
                  records,
                  notice: { message: 'دسته‌بندی‌ها غیرفعال شدند', type: 'success' },
                };
              },
            },
          },
        },
        features: [categoryUploadFeature],
      },
      {
        resource: Product,
        options: {
          navigation: { name: 'محصولات', icon: 'ShoppingCart' },
          sort: { sortBy: 'order', direction: 'asc' },
          listProperties: ['name', 'price', 'stock', 'stockStatus', 'isActive', 'isFeatured', 'order'],
          editProperties: [
            'name',
            'nameEn',
            'slug',
            'description',
            'shortDescription',
            'price',
            'originalPrice',
            'discountPercent',
            'categoryId',
            'images',
            'variants',
            'sizes',
            'colors',
            'stock',
            'stockStatus',
            'gender',
            'material',
            'weight',
            'isNew',
            'isBestseller',
            'isFeatured',
            'isActive',
            'order',
            'seoTitle',
            'seoDescription',
          ],
          properties: {
            description: { components: { edit: components.richText } },
            shortDescription: { type: 'textarea' },
            images: { type: 'mixed', isArray: true },
            variants: { type: 'mixed', isArray: true },
            sizes: { type: 'mixed', isArray: true },
            colors: { type: 'mixed', isArray: true },
            price: { type: 'number' },
            originalPrice: { type: 'number' },
            discountPercent: { type: 'number' },
            order: { type: 'number' },
            uploadImage: { isVisible: false },
            imagesToDelete: { isVisible: false },
          },
          actions: {
            reorder: reorderAction(Product, (record) => `${record.name}`),
            bulkActivate: {
              actionType: 'bulk',
              icon: 'Play',
              label: 'فعال‌سازی',
              handler: async (request, response, context) => {
                const { records } = context;
                await Promise.all(records.map((record) => record.update({ isActive: true })));
                return {
                  records,
                  notice: { message: 'محصولات فعال شدند', type: 'success' },
                };
              },
            },
            bulkDeactivate: {
              actionType: 'bulk',
              icon: 'Pause',
              label: 'غیرفعال‌سازی',
              handler: async (request, response, context) => {
                const { records } = context;
                await Promise.all(records.map((record) => record.update({ isActive: false })));
                return {
                  records,
                  notice: { message: 'محصولات غیرفعال شدند', type: 'success' },
                };
              },
            },
          },
        },
        features: [productUploadFeature],
      },
      {
        resource: BlogPost,
        options: {
          navigation: { name: 'وبلاگ', icon: 'Edit' },
          listProperties: ['title', 'tag', 'isPublished', 'publishedAt', 'createdAt'],
          editProperties: ['title', 'slug', 'excerpt', 'content', 'image', 'tag', 'readTime', 'authorId', 'isPublished', 'publishedAt'],
          properties: {
            content: { components: { edit: components.richText } },
            excerpt: { components: { edit: components.richText } },
            publishedAt: { type: 'datetime' },
          },
        },
      },
      {
        resource: Order,
        options: {
          navigation: { name: 'سفارشات', icon: 'Package' },
          listProperties: ['orderNumber', 'customerName', 'totalAmount', 'status', 'paymentStatus', 'createdAt'],
          editProperties: ['status', 'paymentStatus', 'trackingCode', 'notes'],
          showProperties: [
            'id',
            'orderNumber',
            'customerName',
            'customerPhone',
            'customerEmail',
            'items',
            'totalAmount',
            'shippingCost',
            'discountAmount',
            'status',
            'paymentStatus',
            'paymentMethod',
            'shippingAddress',
            'trackingCode',
            'notes',
            'createdAt',
            'updatedAt',
          ],
          properties: {
            items: { type: 'mixed' },
            shippingAddress: { type: 'mixed' },
            totalAmount: { type: 'number' },
          },
          actions: {
            new: { isAccessible: false },
            delete: { isAccessible: false },
          },
        },
      },
      {
        resource: Address,
        options: {
          navigation: { name: 'مدیریت کاربران', icon: 'MapPin' },
          listProperties: ['title', 'province', 'city', 'isDefault', 'userId'],
          editProperties: ['title', 'province', 'city', 'address', 'postalCode', 'isDefault', 'userId'],
        },
      },
      {
        resource: Page,
        options: {
          navigation: { name: 'مدیریت محتوا', icon: 'Document' },
          sort: { sortBy: 'publishedAt', direction: 'desc' },
          listProperties: ['title', 'slug', 'status', 'publishedAt', 'createdAt'],
          editProperties: ['title', 'slug', 'content', 'images', 'excerpt', 'status', 'publishedAt', 'metaTitle', 'metaDescription'],
          showProperties: ['id', 'title', 'slug', 'content', 'images', 'excerpt', 'status', 'publishedAt', 'metaTitle', 'metaDescription', 'createdAt', 'updatedAt'],
          filterProperties: ['title', 'slug', 'status', 'createdAt', 'publishedAt'],
          properties: {
            content: { components: { edit: components.richText } },
            excerpt: { components: { edit: components.richText } },
            metaDescription: { type: 'textarea' },
            status: {
              availableValues: [
                { value: 'draft', label: 'پیش‌نویس' },
                { value: 'published', label: 'منتشر شده' },
              ],
            },
            images: { type: 'mixed', isArray: true },
            uploadImage: { isVisible: false },
            imagesToDelete: { isVisible: false },
          },
          actions: {
            new: {
              before: async (request) => {
                if (request.payload?.status === 'published' && !request.payload?.publishedAt) {
                  request.payload.publishedAt = new Date();
                }
                return request;
              },
            },
            edit: {
              before: async (request) => {
                if (request.payload?.status === 'published' && !request.payload?.publishedAt) {
                  request.payload.publishedAt = new Date();
                }
                return request;
              },
            },
          },
        },
        features: [pageUploadFeature],
      },
    ],
    dashboard: {
      component: components.dashboard,
      handler: async () => {
        const [orderCount, revenue, recentUsers, lowStock] = await Promise.all([
          Order.count(),
          Order.sum('totalAmount'),
          User.count({ where: { createdAt: { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
          Product.count({ where: { stockStatus: 'lowStock' } }),
        ]);

        const recentOrders = await Order.findAll({
          limit: 5,
          order: [['createdAt', 'DESC']],
          attributes: ['orderNumber', 'customerName', 'totalAmount', 'status', 'createdAt'],
        });

        return {
          stats: {
            orderCount,
            revenue: revenue || 0,
            recentUsers,
            lowStock,
            recentOrders,
          },
        };
      },
    },
    branding: {
      companyName: 'TM-BRAND Admin',
      logo: false,
      softwareBrothers: false,
      theme: {
        colors: {
          primary100: '#111827',
          primary80: '#1f2937',
          primary60: '#4b5563',
          primary40: '#6b7280',
          primary20: '#9ca3af',
          accent: '#f59e0b',
          love: '#f97316',
          grey100: '#111827',
          grey80: '#1f2937',
          grey60: '#4b5563',
          grey40: '#9ca3af',
          grey20: '#e5e7eb',
          white: '#ffffff',
          bg: '#0b0f19',
          filterBg: '#0b0f19',
          hoverBg: '#111827',
        },
        font: 'IRANSans, Vazirmatn, sans-serif',
      },
    },
    locale: {
      language: 'fa',
      translations: {
        labels: {
          Products: 'محصولات',
          Orders: 'سفارشات',
          Users: 'کاربران',
          Pages: 'صفحات',
          Categories: 'دسته‌بندی‌ها',
        },
        actions: {
          new: 'ایجاد',
          edit: 'ویرایش',
          show: 'نمایش',
          delete: 'حذف',
          search: 'جستجو',
        },
        buttons: {
          save: 'ذخیره',
          filter: 'فیلتر',
          applyChanges: 'ثبت تغییرات',
        },
      },
    },
    rootPath: '/admin',
    loginPath: '/admin/login',
    logoutPath: '/admin/logout',
  });

  const authenticate = async (email, password) => {
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      return { email, role: 'admin' };
    }

    const user = await User.findOne({ where: { email, role: 'admin' } });
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        return { email: user.email, role: user.role, id: user.id };
      }
    }
    return null;
  };

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: process.env.JWT_SECRET || 'super-secret-key',
    },
    null,
    {
      store: new session.MemoryStore(),
      resave: false,
      saveUninitialized: false,
      secret: process.env.JWT_SECRET || 'super-secret-key',
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      },
    }
  );

  app.use(adminJs.options.rootPath, adminRouter);

  console.log('✅ AdminJS panel initialized at /admin');
}

module.exports = setupAdmin;
