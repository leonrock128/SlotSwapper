import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createSwapRequest, respondToSwap, getMySwaps } from '../controllers/swapController.js';
const router = express.Router();

router.post('/request', protect, createSwapRequest);
router.post('/:id/respond', protect, respondToSwap);
router.get('/me', protect, getMySwaps);

// sample testing 
router.get('/test', (req, res) => res.send(' swap route working'));


export default router;
