import express from 'express';
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  claimListing,
  deleteListing
} from '../controllers/listingController.js';

const router = express.Router();

router.route('/')
  .get(getListings)
  .post(createListing);

router.route('/:id')
  .get(getListingById)
  .put(updateListing)
  .delete(deleteListing);

router.post('/:id/claim', claimListing);

export default router;