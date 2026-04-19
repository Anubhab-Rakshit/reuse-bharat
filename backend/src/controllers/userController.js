import User from '../models/User.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-__v')
      .populate('savedItems');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const saveListing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { listingId } = req.body;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.savedItems.includes(listingId)) {
      user.savedItems.push(listingId);
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const unsaveListing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { listingId } = req.body;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.savedItems = user.savedItems.filter(
      item => item.toString() !== listingId
    );
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};