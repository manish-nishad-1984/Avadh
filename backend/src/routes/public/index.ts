import { Router } from 'express';
import { CategoryController } from '../../controllers/categoryController';
import { ProductController } from '../../controllers/productController';
import { BannerController } from '../../controllers/bannerController';
import { InquiryController } from '../../controllers/inquiryController';
import { SettingsController } from '../../controllers/settingsController';
import { validate } from '../../middleware/validate';
import { inquirySchema } from '../../validators/schemas';

const router = Router();

// Categories
router.get('/categories', CategoryController.getAll);
router.get('/categories/:slug', CategoryController.getBySlug);

// Products
router.get('/products', ProductController.getAll);
router.get('/products/featured', ProductController.getFeatured);
router.get('/products/latest', ProductController.getLatest);
router.get('/products/:slug', ProductController.getBySlug);

// Banners
router.get('/banners', BannerController.getActive);

// Inquiries
router.post('/inquiries', validate(inquirySchema), InquiryController.create);

// Settings
router.get('/settings', SettingsController.getAll);

export default router;
