import Listing from '../models/Listing.js';

export const getListings = async (req, res) => {
  try {
    const { module, status = 'Active', category } = req.query;
    const filter = { status };
    if (module) filter.module = module;
    if (category) filter.category = category;

    const listings = await Listing.find(filter)
      .populate('donor', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('donor', 'name avatar')
      .populate('claimedBy', 'name avatar');
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createListing = async (req, res) => {
  try {
    const listing = new Listing(req.body);
    await listing.save();
    await listing.populate('donor', 'name avatar');
    res.status(201).json(listing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('donor', 'name avatar');
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const claimListing = async (req, res) => {
  try {
    const { userId } = req.body;
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    if (listing.status !== 'Active') {
      return res.status(400).json({ message: 'Listing is not available' });
    }
    listing.status = 'Claimed';
    listing.claimedBy = userId;
    listing.claimedAt = new Date();
    await listing.save();
    await listing.populate('donor', 'name avatar');
    await listing.populate('claimedBy', 'name avatar');
    res.json(listing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json({ message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};