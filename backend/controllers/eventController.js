import Event, { EVENT_STATUS } from '../models/eventModel.js';

export const createEvent = async (req, res) => {
  try {
    const { title, startTime, endTime } = req.body;
    if (!title || !startTime || !endTime) return res.status(400).json({ message: 'Missing fields' });
    const ev = await Event.create({ title, startTime, endTime, owner: req.user._id });
    res.status(201).json(ev);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ owner: req.user._id }).sort({ startTime: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateEventStatus = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.body;
    const ev = await Event.findById(eventId);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    if (!ev.owner.equals(req.user._id)) return res.status(403).json({ message: 'Not owner' });
    if (!Object.values(EVENT_STATUS).includes(status)) return res.status(400).json({ message: 'Invalid status' });
    ev.status = status;
    await ev.save();
    res.json(ev);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSwappableSlots = async (req, res) => {
  try {
    const swappables = await Event.find({ owner: { $ne: req.user._id }, status: EVENT_STATUS.SWAPPABLE }).populate('owner', 'name email');
    res.json(swappables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
