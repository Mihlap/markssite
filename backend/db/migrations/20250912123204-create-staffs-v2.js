'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Staffs');

    const addIfMissing = async (name, spec) => {
      if (!table[name]) {
        await queryInterface.addColumn('Staffs', name, spec);
      }
    };

    await addIfMissing('userId', { type: Sequelize.INTEGER, allowNull: true });
    await addIfMissing('position', { type: Sequelize.STRING, allowNull: true });
    await addIfMissing('img', { type: Sequelize.TEXT, allowNull: true });
    await addIfMissing('description', { type: Sequelize.TEXT, allowNull: true });
    await addIfMissing('profileContent', { type: Sequelize.TEXT, allowNull: true });
    await addIfMissing('contentFormat', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'markdown',
    });
    await addIfMissing('isVisible', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await addIfMissing('sortIndex', { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 });
    await addIfMissing('deletedAt', { type: Sequelize.DATE, allowNull: true });

    if (table.category && !['JSON', 'JSONB'].includes(String(table.category.type).toUpperCase())) {
      await queryInterface.addColumn('Staffs', 'category_tmp', {
        type: Sequelize.JSONB,
        allowNull: true,
      });
      await queryInterface.sequelize.query(`
        UPDATE "Staffs"
        SET "category_tmp" = CASE
          WHEN "category" IS NULL OR TRIM("category"::text) = '' THEN '[]'::jsonb
          WHEN "category"::text LIKE '{%' AND "category"::text LIKE '%}' THEN
            to_jsonb( string_to_array( regexp_replace("category"::text, '[{}"]', '', 'g'), ',' ) )
          ELSE to_jsonb( ARRAY[ "category"::text ] )
        END
      `);
      await queryInterface.removeColumn('Staffs', 'category');
      await queryInterface.renameColumn('Staffs', 'category_tmp', 'category');
    } else {
      await queryInterface.sequelize.query(
        `UPDATE "Staffs" SET "category"='[]'::jsonb WHERE "category" IS NULL;`,
      );
      await queryInterface.changeColumn('Staffs', 'category', {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      });
    }

    try {
      await queryInterface.addConstraint('Staffs', {
        fields: ['userId'],
        type: 'foreign key',
        name: 'fk_staffs_users_userid',
        references: { table: 'Users', field: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    } catch (e) {
      if (!/already exists|уже существует/i.test(String(e.message))) throw e;
    }

    const hasDeletedAt = !!table.deletedAt;
    await queryInterface.sequelize.query(`
      WITH s AS (
        SELECT id,
               ROW_NUMBER() OVER (ORDER BY COALESCE("sortIndex", 0), "createdAt") - 1 AS idx
        FROM "Staffs" ${hasDeletedAt ? 'WHERE "deletedAt" IS NULL' : ''}
      )
      UPDATE "Staffs" t SET "sortIndex" = s.idx FROM s WHERE t.id = s.id;
    `);

    try {
      await queryInterface.addIndex('Staffs', ['isVisible']);
    } catch {}
    try {
      await queryInterface.addIndex('Staffs', ['sortIndex', 'createdAt']);
    } catch {}
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "Staffs_category_gin"
      ON "Staffs" USING GIN ("category");
    `);
  },

  async down(queryInterface, Sequelize) {
 
  },
};
