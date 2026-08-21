import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { categorySchema, productSchema, productStatusSchema, bannerSchema, inquiryStatusSchema, inquiryNotesSchema, settingsSchema } from '../../validators/schemas';
import { CategoryController } from '../../controllers/categoryController';
import { ProductController } from '../../controllers/productController';
import { BannerController } from '../../controllers/bannerController';
import { InquiryController } from '../../controllers/inquiryController';
import { SettingsController } from '../../controllers/settingsController';
import { DashboardController } from '../../controllers/dashboardController';
import { uploadCategoryImage, uploadProductImage, uploadBannerImage, uploadLogoImage } from '../../middleware/upload';

const router = Router();

// All admin routes require authentication
router.use(authenticate);
router.use(authorize('admin', 'superadmin'));

// Dashboard
router.get('/dashboard', DashboardController.getStats);

// Categories
router.get('/categories', CategoryController.getAllAdmin);
router.get('/categories/:id', CategoryController.getById);
router.post('/categories', validate(categorySchema), CategoryController.create);
router.put('/categories/:id', validate(categorySchema), CategoryController.update);
router.delete('/categories/:id', CategoryController.delete);
router.post('/categories/:id/image', uploadCategoryImage.single('image'), CategoryController.uploadImage);

// Products
router.get('/products', ProductController.getAllAdmin);
router.get('/products/:id', ProductController.getById);
router.post('/products', validate(productSchema), ProductController.create);
router.put('/products/:id', validate(productSchema), ProductController.update);
router.patch('/products/:id/status', validate(productStatusSchema), ProductController.updateStatus);
router.delete('/products/:id', ProductController.delete);
router.post('/products/:id/images', uploadProductImage.array('images', 10), ProductController.uploadImages);
router.delete('/products/:id/images/:imageId', ProductController.deleteImage);
router.patch('/products/:id/images/:imageId/primary', ProductController.setPrimaryImage);

// Banners
router.get('/banners', BannerController.getAll);
router.get('/banners/:id', BannerController.getById);
router.post('/banners', uploadBannerImage.single('image'), BannerController.create);
router.put('/banners/:id', uploadBannerImage.single('image'), BannerController.update);
router.delete('/banners/:id', BannerController.delete);

// Inquiries
router.get('/inquiries', InquiryController.getAll);
router.get('/inquiries/:id', InquiryController.getById);
router.patch('/inquiries/:id/status', validate(inquiryStatusSchema), InquiryController.updateStatus);
router.patch('/inquiries/:id/notes', validate(inquiryNotesSchema), InquiryController.updateNotes);

// Settings
router.get('/settings', SettingsController.getAll);
router.put('/settings', validate(settingsSchema), SettingsController.update);
router.post('/settings/logo', uploadLogoImage.single('logo'), SettingsController.uploadLogo);

export default router;
