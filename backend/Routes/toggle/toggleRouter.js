const express = require('express');
const {
  SwitchingFilterProjects,
  SwitchingFilterArticle,
  SwitchingFilterRegistration,
  SwitchingFilterJournal,
  SwitchingStaffCategories,
} = require('../../db/models');

const router = express.Router();

router.get('/staff-categories', async (req, res) => {
  try {
    let row = await SwitchingStaffCategories.findOne();
    if (!row) {
      row = await SwitchingStaffCategories.create({ leadership: false, science: false, hr: false });
    }
    res.json({
      leadership: !!row.leadership,
      science: !!row.science,
      hr: !!row.hr,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
});

router.put('/staff-categories', async (req, res) => {
  try {
    const { key, value } = req.body || {};
    const allowed = ['leadership', 'science', 'hr'];
    if (!allowed.includes(key)) {
      return res.status(400).json({ success: false, message: 'Bad key' });
    }
    let row = await SwitchingStaffCategories.findOne();
    if (!row) {
      row = await SwitchingStaffCategories.create({ leadership: false, science: false, hr: false });
    }
    row[key] = !!value;
    await row.save();
    res.json({ key, value: !!value });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
});

router.put('/project', async (req, res) => {
  try {
    const { isActiveForButton1 } = req.body; 
    await SwitchingFilterProjects.destroy({ truncate: true }); 
      await SwitchingFilterProjects.create({
        state: isActiveForButton1,
      });

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/project', async (req, res) => {
  try {
    const record = await SwitchingFilterProjects.findOne();
    if (record) {
      res.json({ success: true, isActiveForButton1: record.state });
    } else {
      res.status(404).json({ success: false, message: 'No records found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// << ============ SwitchingFilterArticle ============ >>

router.put('/article', async (req, res) => {
  try {
    const { isActiveForButton2 } = req.body;
    await SwitchingFilterArticle.destroy({ truncate: true });
  
    await SwitchingFilterArticle.create({
      state: isActiveForButton2,
    });

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/article', async (req, res) => {
  try {
    const record = await SwitchingFilterArticle.findOne();
    if (record) {
      res.json({ success: true, isActiveForButton2: record.state });
    } else {
      res.status(404).json({ success: false, message: 'No records found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// << ============ SwitchingFilterRegistration ============ >>

router.put('/button3', async (req, res) => {
  try {
    const { isActiveForButton3 } = req.body;
    console.log(isActiveForButton3);

    await SwitchingFilterRegistration.destroy({ truncate: true });

    await SwitchingFilterRegistration.create({
      state: isActiveForButton3,
    });

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/button3', async (req, res) => {
  console.log('GET request to /button3 received');
  try {
    const record = await SwitchingFilterRegistration.findOne();
    if (record) {
      res.json({ success: true, isActiveForButton3: record.state });
    } else {
      res.status(404).json({ success: false, message: 'No records found' });
    }
  } catch (error) {
      console.error('Error while processing /button3:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// << ============ SwitchingFilterJournal ============ >>

router.put('/journal', async (req, res) => {
  try {
    const { isActiveForButton4 } = req.body;
  
    await SwitchingFilterJournal.destroy({ truncate: true });
 
    await SwitchingFilterJournal.create({
      state: isActiveForButton4,
    });

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/journal', async (req, res) => {
  try {
    const record = await SwitchingFilterJournal.findOne();
    if (record) {
      res.json({ success: true, isActiveForButton4: record.state });
    } else {
      res.status(404).json({ success: false, message: 'No records found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
