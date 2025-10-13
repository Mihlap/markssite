'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hasTable = async (name) => {
      try {
        await queryInterface.describeTable(name);
        return true;
      } catch {
        return false;
      }
    };

    const tableName = 'StaffNews';
    const tableExists = await hasTable(tableName);

    if (!tableExists) {
      await queryInterface.createTable(tableName, {
        id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'Users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        name: { type: Sequelize.STRING, allowNull: false },
        img: { type: Sequelize.TEXT, allowNull: true },
        description: { type: Sequelize.TEXT, allowNull: true },
        category: { type: Sequelize.JSONB, allowNull: true, defaultValue: [] },
        position: { type: Sequelize.STRING, allowNull: true },
        isVisible: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },     
        visibilityByCategory: { type: Sequelize.JSONB, allowNull: false, defaultValue: {} },
        sortIndex: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },

        // старые поля
        about: { type: Sequelize.TEXT },
        about1: { type: Sequelize.TEXT },
        about2: { type: Sequelize.TEXT },
        about3: { type: Sequelize.TEXT },
        about4: { type: Sequelize.TEXT },
        about5: { type: Sequelize.TEXT },
        about6: { type: Sequelize.TEXT },
        about7: { type: Sequelize.TEXT },
        about8: { type: Sequelize.TEXT },
        about9: { type: Sequelize.TEXT },
        about10: { type: Sequelize.TEXT },
        about11: { type: Sequelize.TEXT },
        about12: { type: Sequelize.TEXT },
        about13: { type: Sequelize.TEXT },
        about14: { type: Sequelize.TEXT },
        about15: { type: Sequelize.TEXT },
        about16: { type: Sequelize.TEXT },
        about17: { type: Sequelize.TEXT },
        about18: { type: Sequelize.TEXT },
        about19: { type: Sequelize.TEXT },
        about20: { type: Sequelize.TEXT },
        about21: { type: Sequelize.TEXT },
        about22: { type: Sequelize.TEXT },
        about23: { type: Sequelize.TEXT },
        about24: { type: Sequelize.TEXT },
        about25: { type: Sequelize.TEXT },
        about26: { type: Sequelize.TEXT },
        about27: { type: Sequelize.TEXT },
        about28: { type: Sequelize.TEXT },
        about29: { type: Sequelize.TEXT },
        about30: { type: Sequelize.TEXT },
        description1: { type: Sequelize.TEXT },
        description2: { type: Sequelize.TEXT },

        createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
        updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
        deletedAt: { allowNull: true, type: Sequelize.DATE },
      });

      await queryInterface.addIndex(tableName, ['isVisible']);
      await queryInterface.addIndex(tableName, ['sortIndex', 'createdAt']);
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "${tableName}_category_gin"
        ON "${tableName}" USING GIN ("category");
      `);
    } else {
      const table = await queryInterface.describeTable(tableName);
      const addIfMissing = async (name, spec) => {
        if (!table[name]) await queryInterface.addColumn(tableName, name, spec);
      };
  
      await addIfMissing('userId', { type: Sequelize.INTEGER, allowNull: true });
      await addIfMissing('name', { type: Sequelize.STRING, allowNull: false });
      await addIfMissing('img', { type: Sequelize.TEXT, allowNull: true });
      await addIfMissing('description', { type: Sequelize.TEXT, allowNull: true });
      await addIfMissing('category', { type: Sequelize.JSONB, allowNull: true, defaultValue: [] });
      await addIfMissing('position', { type: Sequelize.STRING, allowNull: true });
      await addIfMissing('isVisible', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
      await addIfMissing('sortIndex', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      });
  
      if (!table.visibilityByCategory) {
        await queryInterface.addColumn(tableName, 'visibilityByCategory', {
          type: Sequelize.JSONB,
          allowNull: false,
          defaultValue: {},
        });
      } else {     
        try {
          await queryInterface.changeColumn(tableName, 'visibilityByCategory', {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: {},
          });
        } catch (e) {         
        }
      }
 
      const colType = String(table.category?.type || '').toUpperCase();
      const isJsonLike = colType.includes('JSON');
      if (table.category && !isJsonLike) {
        await queryInterface.addColumn(tableName, 'category_tmp', {
          type: Sequelize.JSONB,
          allowNull: true,
        });
        await queryInterface.sequelize.query(`
          UPDATE "${tableName}"
          SET "category_tmp" = CASE
            WHEN "category" IS NULL OR TRIM("category") = '' THEN '[]'::jsonb
            WHEN "category" LIKE '{%' AND "category" LIKE '%}' THEN
              to_jsonb( string_to_array( regexp_replace("category", '[{}"]', '', 'g'), ',' ) )
            ELSE to_jsonb( ARRAY[ "category" ] )
          END
        `);
        await queryInterface.removeColumn(tableName, 'category');
        await queryInterface.renameColumn(tableName, 'category_tmp', 'category');
      } else {   
        await queryInterface.sequelize
          .query(
            `
          UPDATE "${tableName}" SET "category"='[]'::jsonb WHERE "category" IS NULL;
        `,
          )
          .catch(() => {});
        try {
          await queryInterface.changeColumn(tableName, 'category', {
            type: Sequelize.JSONB,
            allowNull: true,
            defaultValue: [],
          });
        } catch (e) {}
      }
   
      try {
        if (!table.userId) {
          await queryInterface.addColumn(tableName, 'userId', {
            type: Sequelize.INTEGER,
            allowNull: true,
          });
        }
        await queryInterface.addConstraint(tableName, {
          fields: ['userId'],
          type: 'foreign key',
          name: `fk_${tableName.toLowerCase()}_users_userid`,
          references: { table: 'Users', field: 'id' },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        });
      } catch (e) {    
      }

      try {
        await queryInterface.addIndex(tableName, ['isVisible']);
      } catch {}
      try {
        await queryInterface.addIndex(tableName, ['sortIndex', 'createdAt']);
      } catch {}
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "${tableName}_category_gin"
        ON "${tableName}" USING GIN ("category");
      `);
    }
   
    await queryInterface.sequelize
      .query(
        `
      UPDATE "${tableName}"
      SET "visibilityByCategory" = jsonb_build_object(
        'Руководство', false,
        'Научное сопровождение', false,
        'HR', false
      )
      WHERE "isVisible" = false
        AND ( "visibilityByCategory" IS NULL OR "visibilityByCategory" = '{}'::jsonb );
    `,
      )
      .catch(() => {});
  },

  async down(queryInterface, Sequelize) {
    const tableName = 'StaffNews';
    try {
      await queryInterface.removeIndex(tableName, ['isVisible']);
    } catch {}
    try {
      await queryInterface.removeIndex(tableName, ['sortIndex', 'createdAt']);
    } catch {}
    try {
      await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${tableName}_category_gin";`);
    } catch {}  
    try {
      await queryInterface.removeColumn(tableName, 'visibilityByCategory');
    } catch {}
  },
};

// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {  
//   },

//   async down(queryInterface, Sequelize) {
   
//   },
// };

