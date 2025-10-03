const express = require('express');
const { Staff } = require('../db/models');

const router = express.Router();

router.get('/stuffs', async (req, res) => {
  try {
    const rows = await Staff.findAll({   
      paranoid: false,
      attributes: [
        'id',
        'userId',
        'name',
        'position',
        'img',
        'description',
        'category',
        'about',
        'about1',
        'about2',
        'about3',
        'about4',
        'about5',
        'about6',
        'about7',
        'about8',
        'about9',
        'about10',
        'about11',
        'about12',
        'about13',
        'about14',
        'about15',
        'about16',
        'about17',
        'about18',
        'about19',
        'about20',
        'about21',
        'about22',
        'about23',
        'description1',
        'about24',
        'description2',
        'about25',
        'about26',
        'about27',
        'about28',
        'about29',
        'about30',
        'createdAt',
        'updatedAt',
      ],
      order: [['id', 'ASC']],
      raw: true,
    });
  
    const data = rows.map((r) => {
      let category = r.category;
    
      if (Array.isArray(category)) {   
      } else if (category == null) {
        category = '';
      } else if (typeof category === 'object') {     
        try {
          category = JSON.stringify(category);
        } catch {
          category = String(category);
        }
      } else {     
        category = String(category);
      }

      return {
        ...r,
        category,
        img: r.img || 'no_photo.png',
      };
    });

    res.json(data);
  } catch (error) {
    console.error('Ошибка получения данных сотрудников:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router;
