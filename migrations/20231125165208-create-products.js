'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      title_ru: {
        type: Sequelize.STRING
      },
      title_am: {
        type: Sequelize.STRING
      },
      shortDescription: {
        type: Sequelize.TEXT
      },
      shortDescription_ru: {
        type: Sequelize.TEXT
      },
      shortDescription_am: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
      },
      description_ru: {
        type: Sequelize.TEXT
      },
      description_am: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.STRING
      },
      images: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};