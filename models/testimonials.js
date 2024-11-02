'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Testimonials extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Testimonials.init({
    position: DataTypes.STRING,
    position_ru: DataTypes.STRING,
    position_am: DataTypes.STRING,
    comment: DataTypes.TEXT,
    comment_ru: DataTypes.TEXT,
    comment_am: DataTypes.TEXT,
    avatar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Testimonials',
  });
  return Testimonials;
};