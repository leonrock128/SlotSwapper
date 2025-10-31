import Swap, { SWAP_STATUS } from '../models/swapModel.js';
import Event, { EVENT_STATUS } from '../models/eventModel.js';
import mongoose from 'mongoose';

export const createSwapRequest = async (req, res) => {
  try {
    const { myEventId, theirEventId } = req.body;
    if (!myEventId || !theirEventId) return res.status(400).json({ message: 'Missing event IDs' });
    if (!mongoose.Types.ObjectId.isValid(myEventId) || !mongoose.Types.ObjectId.isValid(theirEventId)) return res.status(400).json({ message: 'Invalid IDs' });

    const myEvent = await Event.findById(myEventId);
    const theirEvent = await Event.findById(theirEventId);

    if (!myEvent || !theirEvent) return res.status(404).json({ message: 'Event not found' });
    if (!myEvent.owner.equals(req.user._id)) return res.status(403).json({ message: 'You do not own myEvent' });
    if (theirEvent.owner.equals(req.user._id)) return res.status(400).json({ message: 'Cannot request your own event' });
    if (myEvent.status !== EVENT_STATUS.SWAPPABLE || theirEvent.status !== EVENT_STATUS.SWAPPABLE)
      return res.status(400).json({ message: 'Both events must be SWAPPABLE' });

    // create swap
    const swap = await Swap.create({
      requester: req.user._id,
      responder: theirEvent.owner,
      requesterEvent: myEvent._id,
      responderEvent: theirEvent._id,
      status: SWAP_STATUS.PENDING
    });

    // set events to SWAP_PENDING to avoid duplicates
    myEvent.status = EVENT_STATUS.SWAP_PENDING;
    theirEvent.status = EVENT_STATUS.SWAP_PENDING;
    await myEvent.save();
    await theirEvent.save();

    res.status(201).json(swap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const respondToSwap = async (req, res) => {
  try {
    const { id } = req.params;
    const { accept } = req.body;

     console.log(" Incoming respondToSwap:", { id, accept, user: req.user._id });


    if (!mongoose.Types.ObjectId.isValid(id)){
      console.log("Invalid ID",id)
      return res.status(400).json({ message: 'Invalid swap id' });
    }

    const swap = await Swap.findById(id);
    console.log(" Found swap:", swap);

    if (!swap){
      console.log("Swap not found",swap)
      return res.status(404).json({ message: 'Swap request not found' });
    }

    if (!swap.responder.equals(req.user._id)){
      console.log("Not the responder",{swapResponder: swap.responder,reqUser:req.user._id});
      return res.status(403).json({ message: 'Not allowed' });
    } 
    if (swap.status !== SWAP_STATUS.PENDING){
      console.log("Already responded:",swap.status)
      return res.status(400).json({ message: 'Swap already responded' });
    } 

    console.log(" Reached accept/reject logic");

    const requesterEvent = await Event.findById(swap.requesterEvent);
    const responderEvent = await Event.findById(swap.responderEvent);

    if (!requesterEvent || !responderEvent)
      return res.status(404).json({ message: 'Event not found for swap' });

    if (accept) {
      // swap owners
      const tmpOwner = requesterEvent.owner;
      requesterEvent.owner = responderEvent.owner;
      responderEvent.owner = tmpOwner;

      // both become BUSY after swap
      requesterEvent.status = EVENT_STATUS.BUSY;
      responderEvent.status = EVENT_STATUS.BUSY;

      await requesterEvent.save();
      await responderEvent.save();

      swap.status = SWAP_STATUS.ACCEPTED;
      await swap.save();

      return res.json({ message: 'Swap accepted', swap });
    } else {
      // reject => revert events back to SWAPPABLE
      if (requesterEvent) { requesterEvent.status = EVENT_STATUS.SWAPPABLE; await requesterEvent.save(); }
      if (responderEvent) { responderEvent.status = EVENT_STATUS.SWAPPABLE; await responderEvent.save(); }

      swap.status = SWAP_STATUS.REJECTED;
      await swap.save();

      return res.json({ message: 'Swap rejected', swap });
    }
  } catch (err) {
    console.log("error in respondToSwap: ",err)
    res.status(500).json({ message: err.message });
  }
};

export const getMySwaps = async (req, res) => {
  try {
    const incoming = await Swap.find({ responder: req.user._id }).populate('requester requesterEvent responderEvent');
    const outgoing = await Swap.find({ requester: req.user._id }).populate('responder requesterEvent responderEvent');
    res.json({ incoming, outgoing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
