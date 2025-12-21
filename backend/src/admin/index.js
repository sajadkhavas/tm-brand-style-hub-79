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

  const { User, Category, Product, BlogPost, Order, Address, Page, Menu, File, Setting, sequelize } = require('../models');

  AdminJS.registerAdapter({
    Resource: AdminJSSequelize.Resource,
    Database: AdminJSSequelize.Database,
  });

  const uploadsRoot = path.resolve(process.env.FILE_UPLOAD_PATH || path.join(__dirname, '../../uploads'));
  if (!fs.existsSync(uploadsRoot)) {
    fs.mkdirSync(uploadsRoot, { recursive: true });
  }

  // Create subfolders
  ['products', 'pages', 'categories', 'blog', 'files'].forEach(folder => {
    const folderPath = path.join(uploadsRoot, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  });

  const componentLoader = new AdminJS.ComponentLoader();
  const components = {
    richText: componentLoader.add('richText', path.join(__dirname, 'components', 'RichText.jsx')),
    dashboard: componentLoader.add('dashboard', path.join(__dirname, 'components', 'Dashboard.jsx')),
    reorder: componentLoader.add('reorder', path.join(__dirname, 'components', 'Reorder.jsx')),
  };

  // ========== UPLOAD FEATURES ==========
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

  const blogUploadFeature = UploadFeature({
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
    uploadPath: (record, filename) => `blog/${record?.id || 'new'}/${Date.now()}-${filename}`,
  });

  const fileUploadFeature = UploadFeature({
    provider: { local: { bucket: uploadsRoot } },
    validation: { 
      mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'application/pdf'] 
    },
    properties: {
      key: 'path',
      file: 'uploadFile',
      filesToDelete: 'filesToDelete',
      mimeType: 'mimeType',
      bucket: 'bucket',
      size: 'size',
    },
    uploadPath: (record, filename) => {
      const folder = record?.params?.folder || 'general';
      return `files/${folder}/${Date.now()}-${filename}`;
    },
  });

  // ========== REORDER ACTION ==========
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

  // ========== ADMINJS CONFIGURATION ==========
  const adminJs = new AdminJS({
    componentLoader,
    resources: [
      // ========== USERS ==========
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
            role: {
              availableValues: [
                { value: 'admin', label: 'مدیر' },
                { value: 'customer', label: 'مشتری' },
              ],
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

      // ========== MENU (NEW) ==========
      {
        resource: Menu,
        options: {
          navigation: { name: 'مدیریت محتوا', icon: 'Menu' },
          sort: { sortBy: 'order', direction: 'asc' },
          listProperties: ['title', 'url', 'type', 'location', 'order', 'isActive'],
          editProperties: ['title', 'titleEn', 'url', 'type', 'target', 'icon', 'parentId', 'location', 'order', 'isActive'],
          showProperties: ['id', 'title', 'titleEn', 'url', 'type', 'target', 'icon', 'parentId', 'location', 'order', 'isActive', 'createdAt'],
          properties: {
            type: {
              availableValues: [
                { value: 'link', label: 'لینک مستقیم' },
                { value: 'page', label: 'صفحه CMS' },
                { value: 'category', label: 'دسته‌بندی محصول' },
                { value: 'product', label: 'محصول' },
              ],
            },
            target: {
              availableValues: [
                { value: '_self', label: 'همین صفحه' },
                { value: '_blank', label: 'صفحه جدید' },
              ],
            },
            location: {
              availableValues: [
                { value: 'header', label: 'هدر سایت' },
                { value: 'footer', label: 'فوتر سایت' },
                { value: 'both', label: 'هر دو' },
              ],
            },
            parentId: {
              type: 'reference',
              reference: 'Menu',
              isVisible: { list: false, filter: true, show: true, edit: true },
            },
            order: { type: 'number' },
          },
          actions: {
            reorder: reorderAction(Menu, (record) => `${record.title}`),
            bulkActivate: {
              actionType: 'bulk',
              icon: 'Play',
              label: 'فعال‌سازی',
              handler: async (request, response, context) => {
                const { records } = context;
                await Promise.all(records.map((record) => record.update({ isActive: true })));
                return {
                  records,
                  notice: { message: 'منوها فعال شدند', type: 'success' },
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
                  notice: { message: 'منوها غیرفعال شدند', type: 'success' },
                };
              },
            },
          },
        },
      },

      // ========== CATEGORIES ==========
      {
        resource: Category,
        options: {
          navigation: { name: 'محصولات', icon: 'Archive' },
          sort: { sortBy: 'order', direction: 'asc' },
          listProperties: ['name', 'slug', 'image', 'order', 'isActive'],
          editProperties: ['name', 'nameEn', 'slug', 'description', 'icon', 'image', 'order', 'isActive'],
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

      // ========== PRODUCTS ==========
      {
        resource: Product,
        options: {
          navigation: { name: 'محصولات', icon: 'ShoppingCart' },
          sort: { sortBy: 'order', direction: 'asc' },
          listProperties: ['name', 'price', 'stock', 'stockStatus', 'isActive', 'isFeatured', 'order'],
          editProperties: [
            'name', 'nameEn', 'slug', 'description', 'shortDescription',
            'price', 'originalPrice', 'discountPercent', 'categoryId',
            'images', 'variants', 'sizes', 'colors',
            'stock', 'stockStatus', 'gender', 'material', 'weight',
            'isNew', 'isBestseller', 'isFeatured', 'isActive', 'order',
            'seoTitle', 'seoDescription',
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
            stockStatus: {
              availableValues: [
                { value: 'inStock', label: 'موجود' },
                { value: 'lowStock', label: 'تعداد کم' },
                { value: 'outOfStock', label: 'ناموجود' },
              ],
            },
            gender: {
              availableValues: [
                { value: 'men', label: 'مردانه' },
                { value: 'women', label: 'زنانه' },
                { value: 'unisex', label: 'یونیسکس' },
              ],
            },
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
            bulkFeature: {
              actionType: 'bulk',
              icon: 'Star',
              label: 'ویژه کردن',
              handler: async (request, response, context) => {
                const { records } = context;
                await Promise.all(records.map((record) => record.update({ isFeatured: true })));
                return {
                  records,
                  notice: { message: 'محصولات ویژه شدند', type: 'success' },
                };
              },
            },
          },
        },
        features: [productUploadFeature],
      },

      // ========== BLOG POSTS ==========
      {
        resource: BlogPost,
        options: {
          navigation: { name: 'وبلاگ', icon: 'Edit' },
          listProperties: ['title', 'tag', 'image', 'isPublished', 'publishedAt', 'createdAt'],
          editProperties: ['title', 'slug', 'excerpt', 'content', 'image', 'tag', 'readTime', 'authorId', 'isPublished', 'publishedAt'],
          properties: {
            content: { components: { edit: components.richText } },
            excerpt: { type: 'textarea' },
            publishedAt: { type: 'datetime' },
            uploadImage: { isVisible: false },
            filesToDelete: { isVisible: false },
          },
          actions: {
            bulkPublish: {
              actionType: 'bulk',
              icon: 'Eye',
              label: 'انتشار',
              handler: async (request, response, context) => {
                const { records } = context;
                await Promise.all(records.map((record) => 
                  record.update({ isPublished: true, publishedAt: new Date() })
                ));
                return {
                  records,
                  notice: { message: 'مطالب منتشر شدند', type: 'success' },
                };
              },
            },
          },
        },
        features: [blogUploadFeature],
      },

      // ========== ORDERS ==========
      {
        resource: Order,
        options: {
          navigation: { name: 'سفارشات', icon: 'Package' },
          listProperties: ['orderNumber', 'customerName', 'totalAmount', 'status', 'paymentStatus', 'createdAt'],
          editProperties: ['status', 'paymentStatus', 'trackingCode', 'notes'],
          showProperties: [
            'id', 'orderNumber', 'customerName', 'customerPhone', 'customerEmail',
            'items', 'totalAmount', 'shippingCost', 'discountAmount',
            'status', 'paymentStatus', 'paymentMethod', 'shippingAddress',
            'trackingCode', 'notes', 'createdAt', 'updatedAt',
          ],
          properties: {
            items: { type: 'mixed' },
            shippingAddress: { type: 'mixed' },
            totalAmount: { type: 'number' },
            status: {
              availableValues: [
                { value: 'pending', label: 'در انتظار' },
                { value: 'confirmed', label: 'تایید شده' },
                { value: 'processing', label: 'در حال پردازش' },
                { value: 'shipped', label: 'ارسال شده' },
                { value: 'delivered', label: 'تحویل شده' },
                { value: 'cancelled', label: 'لغو شده' },
              ],
            },
            paymentStatus: {
              availableValues: [
                { value: 'pending', label: 'در انتظار' },
                { value: 'paid', label: 'پرداخت شده' },
                { value: 'failed', label: 'ناموفق' },
                { value: 'refunded', label: 'بازگشت داده شده' },
              ],
            },
          },
          actions: {
            new: { isAccessible: false },
            delete: { isAccessible: false },
          },
        },
      },

      // ========== ADDRESSES ==========
      {
        resource: Address,
        options: {
          navigation: { name: 'مدیریت کاربران', icon: 'MapPin' },
          listProperties: ['title', 'province', 'city', 'isDefault', 'userId'],
          editProperties: ['title', 'province', 'city', 'address', 'postalCode', 'isDefault', 'userId'],
        },
      },

      // ========== PAGES (CMS) ==========
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
            excerpt: { type: 'textarea' },
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
            bulkPublish: {
              actionType: 'bulk',
              icon: 'Eye',
              label: 'انتشار',
              handler: async (request, response, context) => {
                const { records } = context;
                await Promise.all(records.map((record) => 
                  record.update({ status: 'published', publishedAt: new Date() })
                ));
                return {
                  records,
                  notice: { message: 'صفحات منتشر شدند', type: 'success' },
                };
              },
            },
          },
        },
        features: [pageUploadFeature],
      },

      // ========== FILE MANAGER (NEW) ==========
      {
        resource: File,
        options: {
          navigation: { name: 'مدیریت فایل‌ها', icon: 'Image' },
          listProperties: ['originalName', 'mimeType', 'folder', 'size', 'createdAt'],
          editProperties: ['name', 'alt', 'description', 'folder'],
          showProperties: ['id', 'name', 'originalName', 'path', 'url', 'mimeType', 'size', 'folder', 'alt', 'description', 'createdAt'],
          properties: {
            url: { isVisible: { list: false, filter: false, show: true, edit: false } },
            path: { isVisible: { list: false, filter: false, show: true, edit: false } },
            size: { type: 'number' },
            folder: {
              availableValues: [
                { value: 'general', label: 'عمومی' },
                { value: 'products', label: 'محصولات' },
                { value: 'categories', label: 'دسته‌بندی‌ها' },
                { value: 'pages', label: 'صفحات' },
                { value: 'blog', label: 'وبلاگ' },
              ],
            },
            uploadFile: { isVisible: false },
            filesToDelete: { isVisible: false },
          },
        },
        features: [fileUploadFeature],
      },

      // ========== SETTINGS (NEW) ==========
      {
        resource: Setting,
        options: {
          navigation: { name: 'تنظیمات', icon: 'Settings' },
          listProperties: ['key', 'label', 'type', 'group'],
          editProperties: ['key', 'value', 'type', 'group', 'label', 'description'],
          showProperties: ['id', 'key', 'value', 'type', 'group', 'label', 'description', 'createdAt', 'updatedAt'],
          properties: {
            type: {
              availableValues: [
                { value: 'text', label: 'متن' },
                { value: 'textarea', label: 'متن بلند' },
                { value: 'number', label: 'عدد' },
                { value: 'boolean', label: 'بله/خیر' },
                { value: 'image', label: 'تصویر' },
                { value: 'json', label: 'JSON' },
              ],
            },
            group: {
              availableValues: [
                { value: 'general', label: 'عمومی' },
                { value: 'contact', label: 'اطلاعات تماس' },
                { value: 'social', label: 'شبکه‌های اجتماعی' },
                { value: 'seo', label: 'سئو' },
                { value: 'appearance', label: 'ظاهر سایت' },
              ],
            },
            value: { type: 'textarea' },
          },
        },
      },
    ],

    // ========== DASHBOARD ==========
    dashboard: {
      component: components.dashboard,
      handler: async () => {
        const [orderCount, revenue, recentUsers, lowStock, totalProducts, totalCategories] = await Promise.all([
          Order.count(),
          Order.sum('totalAmount'),
          User.count({ where: { createdAt: { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
          Product.count({ where: { stockStatus: 'lowStock' } }),
          Product.count({ where: { isActive: true } }),
          Category.count({ where: { isActive: true } }),
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
            totalProducts,
            totalCategories,
            recentOrders,
          },
        };
      },
    },

    // ========== BRANDING - shine-web.co ==========
    branding: {
      companyName: 'shine-web.co Admin',
      logo: false,
      softwareBrothers: false,
      theme: {
        colors: {
          primary100: '#0f172a',
          primary80: '#1e293b',
          primary60: '#334155',
          primary40: '#64748b',
          primary20: '#94a3b8',
          accent: '#3b82f6',
          love: '#06b6d4',
          grey100: '#0f172a',
          grey80: '#1e293b',
          grey60: '#475569',
          grey40: '#94a3b8',
          grey20: '#e2e8f0',
          white: '#ffffff',
          bg: '#0f172a',
          filterBg: '#1e293b',
          hoverBg: '#334155',
        },
        font: 'IRANSans, Vazirmatn, Tahoma, sans-serif',
      },
    },

    // ========== PERSIAN LOCALIZATION ==========
    locale: {
      language: 'fa',
      translations: {
        labels: {
          Products: 'محصولات',
          Product: 'محصول',
          Orders: 'سفارشات',
          Order: 'سفارش',
          Users: 'کاربران',
          User: 'کاربر',
          Pages: 'صفحات',
          Page: 'صفحه',
          Categories: 'دسته‌بندی‌ها',
          Category: 'دسته‌بندی',
          BlogPosts: 'مطالب وبلاگ',
          BlogPost: 'مطلب وبلاگ',
          Addresses: 'آدرس‌ها',
          Address: 'آدرس',
          Menus: 'منوها',
          Menu: 'منو',
          Files: 'فایل‌ها',
          File: 'فایل',
          Settings: 'تنظیمات',
          Setting: 'تنظیم',
          navigation: 'ناوبری',
          dashboard: 'داشبورد',
          loginWelcome: 'به پنل مدیریت shine-web.co خوش آمدید',
        },
        actions: {
          new: 'ایجاد',
          edit: 'ویرایش',
          show: 'نمایش',
          delete: 'حذف',
          list: 'لیست',
          search: 'جستجو',
          bulkDelete: 'حذف گروهی',
          reorder: 'چینش',
          bulkActivate: 'فعال‌سازی گروهی',
          bulkDeactivate: 'غیرفعال‌سازی گروهی',
          bulkFeature: 'ویژه کردن گروهی',
          bulkPublish: 'انتشار گروهی',
        },
        buttons: {
          save: 'ذخیره',
          filter: 'فیلتر',
          applyChanges: 'ثبت تغییرات',
          resetFilter: 'پاک کردن فیلتر',
          confirmRemovalMany: 'حذف {{count}} آیتم',
          confirmRemovalMany_plural: 'حذف {{count}} آیتم',
          logout: 'خروج',
          login: 'ورود',
          createFirstRecord: 'اولین مورد را ایجاد کنید',
        },
        messages: {
          successfullyBulkDeleted: '{{count}} رکورد با موفقیت حذف شد',
          successfullyBulkDeleted_plural: '{{count}} رکورد با موفقیت حذف شدند',
          successfullyDeleted: 'رکورد با موفقیت حذف شد',
          successfullyUpdated: 'رکورد با موفقیت بروزرسانی شد',
          successfullyCreated: 'رکورد جدید با موفقیت ایجاد شد',
          thereWereValidationErrors: 'خطاهای اعتبارسنجی وجود دارد',
          noRecordsSelected: 'هیچ رکوردی انتخاب نشده است',
          confirmDelete: 'آیا مطمئن هستید که می‌خواهید این رکورد را حذف کنید؟',
          invalidCredentials: 'ایمیل یا رمز عبور اشتباه است',
          loginRequired: 'برای دسترسی به این صفحه وارد شوید',
        },
        properties: {
          email: 'ایمیل',
          password: 'رمز عبور',
          fullName: 'نام کامل',
          phone: 'تلفن',
          role: 'نقش',
          isActive: 'فعال',
          createdAt: 'تاریخ ایجاد',
          updatedAt: 'تاریخ بروزرسانی',
          name: 'نام',
          nameEn: 'نام انگلیسی',
          title: 'عنوان',
          titleEn: 'عنوان انگلیسی',
          slug: 'نامک (URL)',
          description: 'توضیحات',
          content: 'محتوا',
          excerpt: 'خلاصه',
          image: 'تصویر',
          images: 'تصاویر',
          icon: 'آیکون',
          order: 'ترتیب',
          price: 'قیمت',
          originalPrice: 'قیمت اصلی',
          discountPercent: 'درصد تخفیف',
          stock: 'موجودی',
          stockStatus: 'وضعیت موجودی',
          isNew: 'محصول جدید',
          isBestseller: 'پرفروش',
          isFeatured: 'ویژه',
          gender: 'جنسیت',
          material: 'جنس',
          weight: 'وزن',
          status: 'وضعیت',
          publishedAt: 'تاریخ انتشار',
          metaTitle: 'عنوان سئو',
          metaDescription: 'توضیحات سئو',
          seoTitle: 'عنوان سئو',
          seoDescription: 'توضیحات سئو',
          orderNumber: 'شماره سفارش',
          customerName: 'نام مشتری',
          customerPhone: 'تلفن مشتری',
          customerEmail: 'ایمیل مشتری',
          totalAmount: 'مبلغ کل',
          shippingCost: 'هزینه ارسال',
          paymentStatus: 'وضعیت پرداخت',
          paymentMethod: 'روش پرداخت',
          trackingCode: 'کد رهگیری',
          notes: 'یادداشت',
          url: 'آدرس URL',
          type: 'نوع',
          target: 'نحوه باز شدن',
          location: 'موقعیت',
          parentId: 'منوی والد',
          folder: 'پوشه',
          mimeType: 'نوع فایل',
          size: 'حجم',
          alt: 'متن جایگزین',
          originalName: 'نام اصلی فایل',
          path: 'مسیر',
          key: 'کلید',
          value: 'مقدار',
          group: 'گروه',
          label: 'برچسب',
          tag: 'تگ',
          readTime: 'زمان مطالعه',
          isPublished: 'منتشر شده',
          authorId: 'نویسنده',
          categoryId: 'دسته‌بندی',
          variants: 'واریانت‌ها',
          sizes: 'سایزها',
          colors: 'رنگ‌ها',
          shortDescription: 'توضیح کوتاه',
          province: 'استان',
          city: 'شهر',
          address: 'آدرس',
          postalCode: 'کد پستی',
          isDefault: 'پیش‌فرض',
          items: 'آیتم‌ها',
          shippingAddress: 'آدرس ارسال',
        },
        resources: {
          User: { name: 'کاربر', plural: 'کاربران' },
          Category: { name: 'دسته‌بندی', plural: 'دسته‌بندی‌ها' },
          Product: { name: 'محصول', plural: 'محصولات' },
          BlogPost: { name: 'مطلب وبلاگ', plural: 'مطالب وبلاگ' },
          Order: { name: 'سفارش', plural: 'سفارشات' },
          Address: { name: 'آدرس', plural: 'آدرس‌ها' },
          Page: { name: 'صفحه', plural: 'صفحات' },
          Menu: { name: 'منو', plural: 'منوها' },
          File: { name: 'فایل', plural: 'فایل‌ها' },
          Setting: { name: 'تنظیم', plural: 'تنظیمات' },
        },
      },
    },

    rootPath: '/admin',
    loginPath: '/admin/login',
    logoutPath: '/admin/logout',
  });

  // ========== AUTHENTICATION ==========
  const authenticate = async (email, password) => {
    // Check environment credentials first
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      return { email, role: 'admin' };
    }

    // Check database users
    const user = await User.findOne({ where: { email, role: 'admin', isActive: true } });
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
      cookiePassword: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
    },
    null,
    {
      store: new session.MemoryStore(),
      resave: false,
      saveUninitialized: false,
      secret: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
      cookie: {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }
  );

  app.use(adminJs.options.rootPath, adminRouter);

  console.log('✅ AdminJS panel initialized at /admin (shine-web.co)');
}

module.exports = setupAdmin;
