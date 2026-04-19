import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  saveListing,
  unsaveListing
} from '../controllers/userController.js';

const router = express.Router();

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUserById)
  .put(updateUser);

router.post('/:id/save', saveListing);
router.post('/:id/unsave', unsaveListing);

export default router;