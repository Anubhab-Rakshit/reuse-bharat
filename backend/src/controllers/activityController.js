import Activity from '../models/Activity.js';

export const getActivities = async (req, res) => {
  try {
    const { userId, limit = 20 } = req.query;
    const filter = {};
    if (userId) filter.user = userId;

    const activities = await Activity.find(filter)
      .populate('user', 'name avatar')
      .populate('listing')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createActivity = async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    await activity.populate('user', 'name avatar');
    await activity.populate('listing');
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};