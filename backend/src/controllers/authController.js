import { randomUUID } from 'crypto';
import { getAddress, verifyMessage } from 'ethers';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import User from '../models/User.js';
import config from '../../config/index.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'placeholder');

const buildLoginMessage = ({ walletAddress, nonce }) => [
  'Reuse Bharat Login',
  `Wallet: ${walletAddress}`,
  `Nonce: ${nonce}`,
].join('\n');

const walletEmail = (address) => `${address.toLowerCase()}@wallet.reusebharat.local`;

export const requestNonce = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ message: 'walletAddress is required' });
    }

    const checksumAddress = getAddress(walletAddress);
    const normalizedWallet = checksumAddress.toLowerCase();
    const nonce = randomUUID();

    const user = await User.findOneAndUpdate(
      { walletAddress: normalizedWallet },
      {
        $set: {
          walletAddress: normalizedWallet,
          authNonce: nonce,
          email: walletEmail(normalizedWallet),
        },
        $setOnInsert: {
          name: `User ${checksumAddress.slice(2, 8)}`,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.json({
      nonce,
      message: buildLoginMessage({ walletAddress: checksumAddress, nonce }),
      userId: user._id,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Failed to create auth nonce' });
  }
};

export const verifySignature = async (req, res) => {
  try {
    const { walletAddress, nonce, signature } = req.body;

    if (!walletAddress || !nonce || !signature) {
      return res.status(400).json({ message: 'walletAddress, nonce, and signature are required' });
    }

    const checksumAddress = getAddress(walletAddress);
    const normalizedWallet = checksumAddress.toLowerCase();

    const user = await User.findOne({ walletAddress: normalizedWallet });
    if (!user || !user.authNonce || user.authNonce !== nonce) {
      return res.status(401).json({ message: 'Invalid login nonce. Please retry.' });
    }

    const expectedMessage = buildLoginMessage({ walletAddress: checksumAddress, nonce });
    const recoveredAddress = verifyMessage(expectedMessage, signature);

    if (getAddress(recoveredAddress).toLowerCase() !== normalizedWallet) {
      return res.status(401).json({ message: 'Signature verification failed' });
    }

    user.authNonce = null;
    await user.save();

    const token = jwt.sign(
      {
        sub: user._id.toString(),
        walletAddress: normalizedWallet,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress,
        walletBalance: user.walletBalance,
        isTotpEnabled: user.isTotpEnabled
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Signature verification failed' });
  }
};

// --- Google Auth ---
export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: 'Google credential required' });

    // In a real app, verify with Google. For now, we trust the token payload or use google-auth-library
    // The credential is a JWT, we can decode it to get user info.
    const decoded = jwt.decode(credential);
    if (!decoded || !decoded.email) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }

    const email = decoded.email.toLowerCase();
    const googleId = decoded.sub;
    const name = decoded.name || 'Google User';
    const avatar = decoded.picture || null;

    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (!user) {
      user = new User({
        email,
        googleId,
        name,
        avatar,
        walletBalance: 0,
        isTotpEnabled: false
      });
      await user.save();
    } else {
      // Update missing fields
      if (!user.googleId) user.googleId = googleId;
      if (!user.avatar && avatar) user.avatar = avatar;
      await user.save();
    }

    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        walletBalance: user.walletBalance,
        isTotpEnabled: user.isTotpEnabled
      }
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    return res.status(500).json({ message: 'Google authentication failed' });
  }
};

// --- TOTP (Google Authenticator) ---
export const generateTotp = async (req, res) => {
  try {
    const user = await User.findById(req.auth.sub);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(user.email, 'Reuse Bharat', secret);
    
    const qrCodeUrl = await qrcode.toDataURL(otpauth);

    // Save secret temporarily (not enabled yet)
    user.totpSecret = secret;
    user.isTotpEnabled = false;
    await user.save();

    return res.json({ secret, qrCodeUrl });
  } catch (error) {
    console.error('TOTP Generation Error:', error);
    return res.status(500).json({ message: 'Failed to generate TOTP' });
  }
};

export const verifyTotp = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.auth.sub);
    
    if (!user || !user.totpSecret) {
      return res.status(400).json({ message: 'TOTP setup not initiated' });
    }

    const isValid = authenticator.verify({ token, secret: user.totpSecret });

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid code' });
    }

    user.isTotpEnabled = true;
    await user.save();

    return res.json({ message: '2FA enabled successfully', isTotpEnabled: true });
  } catch (error) {
    console.error('TOTP Verification Error:', error);
    return res.status(500).json({ message: 'Failed to verify TOTP' });
  }
};

export const getSession = async (req, res) => {
  try {
    const user = await User.findById(req.auth.sub).select('-__v -authNonce -totpSecret');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to load session' });
  }
};
