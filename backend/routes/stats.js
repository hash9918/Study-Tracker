const express = require('express');
const router = express.Router();
const DailySchedule = require('../models/DailySchedule');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/stats/heatmap
// @desc    Get data for heatmap (all days with stats)
// @access  Private
router.get('/heatmap', auth, async (req, res) => {
  try {
    // Get all schedules for the user
    const schedules = await DailySchedule.find({ user: req.user.id }).sort({ date: 1 });
    
    // Format for heatmap: { "YYYY-MM-DD": { total: N, completed: M } }
    const heatmapData = {};
    
    schedules.forEach(schedule => {
      const total = schedule.blocks.length;
      const completed = schedule.blocks.filter(b => b.isCompleted).length;
      
      // If there are blocks, record the day's stats
      if (total > 0) {
        heatmapData[schedule.date] = {
          total,
          completed,
          ratio: completed / total,
          isFullyCompleted: total === completed
        };
      }
    });
    
    // Get user start date
    const user = await User.findById(req.user.id);

    res.json({
      startDate: user.createdAt,
      data: heatmapData
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/stats/streak
// @desc    Calculate current streak (days with ALL blocks completed consecutively)
// @access  Private
router.get('/streak', auth, async (req, res) => {
  try {
    const schedules = await DailySchedule.find({ user: req.user.id }).sort({ date: -1 });
    
    let currentStreak = 0;
    
    // A quick way to get 'today' in YYYY-MM-DD local time
    const todayStr = new Date().toLocaleDateString('en-CA'); // e.g. "2026-05-19"
    let dateToVerify = todayStr;
    
    for (let i = 0; i < schedules.length; i++) {
      const schedule = schedules[i];
      const total = schedule.blocks.length;
      const completed = schedule.blocks.filter(b => b.isCompleted).length;
      
      // Only count days where they actually scheduled blocks
      if (total > 0) {
        if (completed === total) {
           // Fully completed
           currentStreak++;
        } else {
           // Streak broken (not all completed)
           // If they failed on a past date, the streak is broken
           // (We might want to ignore 'today' if it's not over, but let's strictly count successful days)
           if (schedule.date !== todayStr) {
               break;
           }
        }
      }
    }
    
    res.json({ streak: currentStreak });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
