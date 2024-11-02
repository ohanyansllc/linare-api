'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
          'Products',
          'video',
          {
            type: Sequelize.STRING
          }
      ),
      queryInterface.addColumn(
          'Products',
          'price_ru',
          {
            type: Sequelize.STRING
          }
      ),
      queryInterface.addColumn(
          'Products',
          'price_am',
          {
            type: Sequelize.STRING
          }
      ),
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
