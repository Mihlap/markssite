const express = require('express');
const {
  SwitchingFilterProjects,
  SwitchingFilterArticle,
  SwitchingFilterRegistration,
} = require('../../db/models');

const router = express.Router();

router.put('/project', async (req, res) => {
  try {
    const { isActiveForButton1 } = req.body;
    // console.log(isActiveForButton1);

    // Удалить все записи
    await SwitchingFilterProjects.destroy({ truncate: true });

    // Создать новую запись с заданным значением isActive
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
    // console.log(isActiveForButton2);

    // Удалить все записи
    await SwitchingFilterArticle.destroy({ truncate: true });

    // Создать новую запись с заданным значением isActive
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

    // Удалить все записи
    await SwitchingFilterRegistration.destroy({ truncate: true });

    // Создать новую запись с заданным значением isActive
    await SwitchingFilterRegistration.create({
      state: isActiveForButton3,
    });

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/button3', async (req, res) => {
  try {
    const record = await SwitchingFilterRegistration.findOne();
    if (record) {
      res.json({ success: true, isActiveForButton3: record.state });
    } else {
      res.status(404).json({ success: false, message: 'No records found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



module.exports = router;
