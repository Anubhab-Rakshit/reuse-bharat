import User from '../models/User.js';

export const getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.auth.sub);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    return res.json({ balance: user.walletBalance });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch wallet balance' });
  }
};

export const addFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findById(req.auth.sub);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.walletBalance += Number(amount);
    await user.save();

    return res.json({ message: 'Funds added successfully', balance: user.walletBalance });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add funds' });
  }
};
