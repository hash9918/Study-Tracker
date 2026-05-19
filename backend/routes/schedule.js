const express = require('express');
const router = express.Router();
const DailySchedule = require('../models/DailySchedule');
const auth = require('../middleware/auth');

// @route   GET /api/schedule/history/all
// @desc    Get all past schedules for the user
// @access  Private
router.get('/history/all', auth, async (req, res) => {
  try {
    const schedules = await DailySchedule.find({ user: req.user.id }).sort({ date: -1 });
    res.json(schedules);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/schedule/:date
// @desc    Get schedule for a specific date
// @access  Private
router.get('/:date', auth, async (req, res) => {
  try {
    const schedule = await DailySchedule.findOne({
      user: req.user.id,
      date: req.params.date
    });
    
    if (!schedule) {
      return res.json({ date: req.params.date, blocks: [] });
    }
    
    res.json(schedule);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/schedule/:date
// @desc    Create or update schedule blocks for a date
// @access  Private
router.post('/:date', auth, async (req, res) => {
  const { blocks } = req.body; // Array of blocks
  
  try {
    let schedule = await DailySchedule.findOne({
      user: req.user.id,
      date: req.params.date
    });

    if (schedule) {
      // Update existing
      schedule.blocks = blocks;
      await schedule.save();
      return res.json(schedule);
    }

    // Create new
    schedule = new DailySchedule({
      user: req.user.id,
      date: req.params.date,
      blocks
    });

    await schedule.save();
    res.json(schedule);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/schedule/:date/block/:blockId
// @desc    Toggle block completion status
// @access  Private
router.patch('/:date/block/:blockId', auth, async (req, res) => {
  const { isCompleted } = req.body;
  
  try {
    let schedule = await DailySchedule.findOne({
      user: req.user.id,
      date: req.params.date
    });

    if (!schedule) {
      return res.status(404).json({ msg: 'Schedule not found' });
    }

    const block = schedule.blocks.id(req.params.blockId);
    if (!block) {
      return res.status(404).json({ msg: 'Block not found' });
    }

    block.isCompleted = isCompleted;
    await schedule.save();
    
    res.json(schedule);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
