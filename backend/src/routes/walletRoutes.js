import express from 'express';
import { getBalance, addFunds } from '../controllers/walletController.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/balance', authenticate, getBalance);
router.post('/add', authenticate, addFunds);

export default router;
