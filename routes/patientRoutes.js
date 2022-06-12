import express from 'express';
import {
  addPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
} from '../controllers/PatientController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(authMiddleware, getPatients)
  .post(authMiddleware, addPatient);

router
  .route('/:id')
  .get(authMiddleware, getPatient)
  .put(authMiddleware, updatePatient)
  .delete(authMiddleware, deletePatient);

export default router;
