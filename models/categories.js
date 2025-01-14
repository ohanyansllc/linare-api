'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Products, {
        as: 'products',
        through: 'Products_Categories',
        foreignKey: "categoryId"
      });
    }
  }
  Categories.init({
    name: DataTypes.STRING,
    name_ru: DataTypes.STRING,
    name_am: DataTypes.STRING,
    description: DataTypes.TEXT,
    description_ru: DataTypes.TEXT,
    description_am: DataTypes.TEXT,
    parentId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Categories',
  });
  return Categories;
};