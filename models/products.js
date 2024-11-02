'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Categories, {
        as: 'categories',
        through: 'Products_Categories',
        foreignKey: "productId"
      });
    }
  }
  Products.init({
    title: DataTypes.STRING,
    title_ru: DataTypes.STRING,
    title_am: DataTypes.STRING,
    shortDescription: DataTypes.TEXT,
    shortDescription_ru: DataTypes.TEXT,
    shortDescription_am: DataTypes.TEXT,
    description: DataTypes.TEXT,
    description_ru: DataTypes.TEXT,
    description_am: DataTypes.TEXT,
    video: {
      type: DataTypes.STRING,
      get: function() {
        if (!this.getDataValue("video"))
          return '';

        if (!this.getDataValue("video") === 'null') {
          return ''
        }
        return this.getDataValue("video")
      }
    },
    price: DataTypes.STRING,
    price_ru: DataTypes.STRING,
    price_am: DataTypes.STRING,
    images: {
      type: DataTypes.TEXT,
      get: function() {
        if (typeof this.getDataValue("images") === 'string')
          return JSON.parse(this.getDataValue("images"));
        return []
      },
      set: function(value) {
        return this.setDataValue("images", JSON.stringify(value));
      }
    },
    isFavourite: {
      type: DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};
