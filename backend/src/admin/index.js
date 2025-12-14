const bcrypt = require('bcryptjs');
const session = require('express-session');

async function setupAdmin(app) {
  // Dynamic imports for ESM-only packages (AdminJS v7+)
  const { default: AdminJS } = await import('adminjs');
  const AdminJSExpress = await import('@adminjs/express');
  const AdminJSSequelize = await import('@adminjs/sequelize');
  
  // Import models
  const { User, Category, Product, BlogPost, Order, Address, Page, sequelize } = require('../models');

  // Register Sequelize adapter
  AdminJS.registerAdapter({
    Resource: AdminJSSequelize.Resource,
    Database: AdminJSSequelize.Database
  });

  // AdminJS configuration
  const adminJs = new AdminJS({
    resources: [
      // Users Resource
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
              isVisible: { list: false, filter: false, show: false, edit: true }
            }
          },
          actions: {
            new: {
              before: async (request) => {
                if (request.payload?.password) {
                  request.payload.password = await bcrypt.hash(request.payload.password, 10);
                }
                return request;
              }
            },
            edit: {
              before: async (request) => {
                if (request.payload?.password) {
                  request.payload.password = await bcrypt.hash(request.payload.password, 10);
                }
                return request;
              }
            }
          }
        }
      },
      // Categories Resource
      {
        resource: Category,
        options: {
          navigation: { name: 'محصولات', icon: 'Archive' },
          listProperties: ['name', 'nameEn', 'slug', 'isActive', 'order'],
          editProperties: ['name', 'nameEn', 'slug', 'description', 'image', 'isActive', 'order'],
          properties: {
            description: { type: 'richtext' }
          }
        }
      },
      // Products Resource
      {
        resource: Product,
        options: {
          navigation: { name: 'محصولات', icon: 'ShoppingCart' },
          listProperties: ['name', 'price', 'stock', 'stockStatus', 'isActive', 'isFeatured'],
          editProperties: [
            'name', 'nameEn', 'slug', 'description', 'shortDescription',
            'price', 'originalPrice', 'discountPercent',
            'categoryId', 'images', 'sizes', 'colors',
            'stock', 'stockStatus', 'gender', 'material', 'weight',
            'isNew', 'isBestseller', 'isFeatured', 'isActive',
            'seoTitle', 'seoDescription'
          ],
          properties: {
            description: { type: 'richtext' },
            images: { type: 'mixed', isArray: true },
            sizes: { type: 'mixed', isArray: true },
            colors: { type: 'mixed', isArray: true },
            price: { type: 'number' },
            originalPrice: { type: 'number' }
          }
        }
      },
      // Blog Posts Resource
      {
        resource: BlogPost,
        options: {
          navigation: { name: 'وبلاگ', icon: 'Edit' },
          listProperties: ['title', 'tag', 'isPublished', 'publishedAt', 'createdAt'],
          editProperties: ['title', 'slug', 'excerpt', 'content', 'image', 'tag', 'readTime', 'authorId', 'isPublished', 'publishedAt'],
          properties: {
            content: { type: 'richtext' },
            excerpt: { type: 'textarea' }
          }
        }
      },
      // Orders Resource
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
            'trackingCode', 'notes', 'createdAt', 'updatedAt'
          ],
          properties: {
            items: { type: 'mixed' },
            shippingAddress: { type: 'mixed' },
            totalAmount: { type: 'number' }
          },
          actions: {
            new: { isAccessible: false },
            delete: { isAccessible: false }
          }
        }
      },
      // Addresses Resource
      {
        resource: Address,
        options: {
          navigation: { name: 'مدیریت کاربران', icon: 'MapPin' },
          listProperties: ['title', 'province', 'city', 'isDefault', 'userId'],
          editProperties: ['title', 'province', 'city', 'address', 'postalCode', 'isDefault', 'userId']
        }
      },
      // Pages Resource (CMS)
      {
        resource: Page,
        options: {
          navigation: { name: 'مدیریت محتوا', icon: 'Document' },
          listProperties: ['title', 'slug', 'status', 'publishedAt', 'createdAt'],
          editProperties: ['title', 'slug', 'content', 'excerpt', 'status', 'publishedAt', 'metaTitle', 'metaDescription'],
          showProperties: ['id', 'title', 'slug', 'content', 'excerpt', 'status', 'publishedAt', 'metaTitle', 'metaDescription', 'createdAt', 'updatedAt'],
          filterProperties: ['title', 'slug', 'status', 'createdAt', 'publishedAt'],
          properties: {
            content: { 
              type: 'richtext',
              props: {
                rows: 20
              }
            },
            excerpt: { 
              type: 'textarea',
              props: {
                rows: 3
              }
            },
            metaDescription: {
              type: 'textarea',
              props: {
                rows: 2
              }
            },
            status: {
              availableValues: [
                { value: 'draft', label: 'پیش‌نویس' },
                { value: 'published', label: 'منتشر شده' }
              ]
            }
          },
          actions: {
            new: {
              before: async (request) => {
                if (request.payload?.status === 'published' && !request.payload?.publishedAt) {
                  request.payload.publishedAt = new Date();
                }
                return request;
              }
            },
            edit: {
              before: async (request) => {
                if (request.payload?.status === 'published' && !request.payload?.publishedAt) {
                  request.payload.publishedAt = new Date();
                }
                return request;
              }
            }
          }
        }
      }
    ],
    branding: {
      companyName: 'TM-BRAND Admin',
      logo: false,
      softwareBrothers: false,
      theme: {
        colors: {
          primary100: '#1a1a1a',
          primary80: '#333333',
          primary60: '#4d4d4d',
          primary40: '#666666',
          primary20: '#808080',
          accent: '#f59e0b',
          love: '#f59e0b',
          grey100: '#1a1a1a',
          grey80: '#333333',
          grey60: '#666666',
          grey40: '#999999',
          grey20: '#cccccc',
          white: '#ffffff',
          bg: '#f5f5f5',
          filterBg: '#ffffff',
          hoverBg: '#f0f0f0'
        }
      }
    },
    rootPath: '/admin',
    loginPath: '/admin/login',
    logoutPath: '/admin/logout'
  });

  // Authentication function
  const authenticate = async (email, password) => {
    // Check for default admin from env
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return { email, role: 'admin' };
    }

    // Check database for admin users
    const user = await User.findOne({ where: { email, role: 'admin' } });
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        return { email: user.email, role: user.role, id: user.id };
      }
    }
    return null;
  };

  // Build authenticated router
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: process.env.JWT_SECRET || 'super-secret-key'
    },
    null,
    {
      store: new session.MemoryStore(),
      resave: false,
      saveUninitialized: false,
      secret: process.env.JWT_SECRET || 'super-secret-key',
      cookie: {
        httpOnly: true,
        secure: false, // HTTP-friendly for server IP
        maxAge: 24 * 60 * 60 * 1000
      }
    }
  );

  app.use(adminJs.options.rootPath, adminRouter);

  console.log('✅ AdminJS panel initialized at /admin');
}

module.exports = setupAdmin;
