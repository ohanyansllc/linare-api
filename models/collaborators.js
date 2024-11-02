'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Collaborators extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Collaborators.init({
    name: DataTypes.STRING,
    name_ru: DataTypes.STRING,
    name_am: DataTypes.STRING,
    description: DataTypes.STRING,
    description_ru: DataTypes.STRING,
    description_am: DataTypes.STRING,
    logo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Collaborators',
  });
  return Collaborators;
};