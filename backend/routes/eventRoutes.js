import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createEvent, getMyEvents, updateEventStatus, getSwappableSlots } from '../controllers/eventController.js';
const router = express.Router();

router.post('/', protect, createEvent);
router.get('/me', protect, getMyEvents);
router.put('/:eventId/status', protect, updateEventStatus);
router.get('/swappable', protect, getSwappableSlots);

export default router;
