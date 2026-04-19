import express from 'express';
import { getSession, requestNonce, verifySignature, googleAuth, generateTotp, verifyTotp } from '../controllers/authController.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/nonce', requestNonce);
router.post('/verify', verifySignature);
router.post('/google', googleAuth);
router.post('/totp/generate', authenticate, generateTotp);
router.post('/totp/verify', authenticate, verifyTotp);
router.get('/me', authenticate, getSession);

export default router;
