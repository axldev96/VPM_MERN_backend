import express from 'express';
import {
  register,
  profile,
  confirm,
  authenticate,
  forgetPassword,
  checkToken,
  newPassword,
  updateProfile,
  updatePassword,
} from '../controllers/VeterinarianController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// public routes
router.post('/', register);
router.get('/confirm/:token', confirm);
router.post('/login', authenticate);
router.post('/forget-password', forgetPassword);
router.route('/forget-password/:token').get(checkToken).post(newPassword);

// private routes
router.get('/profile', authMiddleware, profile);
router.put('/profile/:id', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, updatePassword);

export default router;
