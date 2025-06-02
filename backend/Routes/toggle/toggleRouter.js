// const {
//   SwitchingFilterProjects,
//   SwitchingFilterArticle,
//   SwitchingFilterRegistration,
//   SwitchingFilterJournal,
// } = require('../../db/models');

// async function switchingFiltersRouter(fastify, options) {

//   fastify.put('/project', async (request, reply) => {
//     try {
//       const { isActiveForButton1 } = request.body;
//       await SwitchingFilterProjects.destroy({ truncate: true });
//       await SwitchingFilterProjects.create({ state: isActiveForButton1 });
//       return reply.send({ success: true, message: 'Status updated successfully' });
//     } catch (error) {
//       return reply.code(500).send({ success: false, message: error.message });
//     }
//   });
 
//   fastify.get('/project', async (request, reply) => {
//     try {
//       const record = await SwitchingFilterProjects.findOne();
//       if (!record) {
//         return reply.code(404).send({ success: false, message: 'No records found' });
//       }
//       return reply.send({ success: true, isActiveForButton1: record.state });
//     } catch (error) {
//       return reply.code(500).send({ success: false, message: error.message });
//     }
//   });

//   fastify.put('/article', async (request, reply) => {
//     try {
//       const { isActiveForButton2 } = request.body;
//       await SwitchingFilterArticle.destroy({ truncate: true });
//       await SwitchingFilterArticle.create({ state: isActiveForButton2 });
//       return reply.send({ success: true, message: 'Status updated successfully' });
//     } catch (error) {
//       return reply.code(500).send({ success: false, message: error.message });
//     }
//   });

//   fastify.get('/article', async (request, reply) => {
//     try {
//       const record = await SwitchingFilterArticle.findOne();
//       if (!record) {
//         return reply.code(404).send({ success: false, message: 'No records found' });
//       }
//       return reply.send({ success: true, isActiveForButton2: record.state });
//     } catch (error) {
//       return reply.code(500).send({ success: false, message: error.message });
//     }
//   });

//   fastify.put('/button3', async (request, reply) => {
//     try {
//       const { isActiveForButton3 } = request.body;
//       await SwitchingFilterRegistration.destroy({ truncate: true });
//       await SwitchingFilterRegistration.create({ state: isActiveForButton3 });
//       return reply.send({ success: true, message: 'Status updated successfully' });
//     } catch (error) {
//       return reply.code(500).send({ success: false, message: error.message });
//     }
//   });

//   fastify.get('/button3', async (request, reply) => {
//     try {
//       const record = await SwitchingFilterRegistration.findOne();
//       if (!record) {
//         return reply.code(404).send({ success: false, message: 'No records found' });
//       }
//       return reply.send({ success: true, isActiveForButton3: record.state });
//     } catch (error) {
//       return reply.code(500).send({ success: false, message: error.message });
//     }
//   });

//   fastify.put('/journal', async (request, reply) => {
//     try {
//       const { isActiveForButton4 } = request.body;
//       await SwitchingFilterJournal.destroy({ truncate: true });
//       await SwitchingFilterJournal.create({ state: isActiveForButton4 });
//       return reply.send({ success: true, message: 'Status updated successfully' });
//     } catch (error) {
//       return reply.code(500).send({ success: false, message: error.message });
//     }
//   });
 
//   fastify.get('/journal', async (request, reply) => {
//     try {
//       const record = await SwitchingFilterJournal.findOne();
//       if (!record) {
//         return reply.code(404).send({ success: false, message: 'No records found' });
//       }
//       return reply.send({ success: true, isActiveForButton4: record.state });
//     } catch (error) {
//       return reply.code(500).send({ success: false, message: error.message });
//     }
//   });
// }

// module.exports = switchingFiltersRouter;

const express = require('express');
const {
  SwitchingFilterProjects,
  SwitchingFilterArticle,
  SwitchingFilterRegistration,
  SwitchingFilterJournal,
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

    // Удалить все записи
    await SwitchingFilterJournal.destroy({ truncate: true });

    // Создать новую запись с заданным значением isActive
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
