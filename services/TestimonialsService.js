const BaseService = require("./BaseService");
const {Sequelize, Testimonials, Authors, Categories} = require('../models')
const StorageService = require("./StorageService");

module.exports = class extends BaseService {
  constructor() {
    super();
    this.testimonialsModel = Testimonials
    this.storageService = new StorageService()
  }

  async create(req) {
    try {
      const { position, position_ru, position_am, comment, comment_ru, comment_am } = req.body;

      const  params =  {
        position,
        position_ru,
        position_am,
        comment,
        comment_ru,
        comment_am
      }

      const avatar = req.file ? await this.storageService.uploadImage(req.file) : null

      const testimonial = await this.testimonialsModel.create({
        ...params,
        avatar
      });

      return this.response({
        statusCode: 201,
        data: {
          testimonial
        }
      });

    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }

  async show(req) {
    try {
      const { id } = req.params;

      if (id) {
        const testimonial = await this.testimonialsModel.findOne({ where: { id: id } } );

        if(!testimonial) {
          return this.response({
            status: false,
            statusCode: 400,
            message: 'Testimonial does not found'
          });
        }

        return this.response({
          data: {
            testimonial
          }
        });
      }

      return this.response({
        status: false,
        statusCode: 400,
        message: 'Testimonial ID is required'
      });
    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }

  async showAll(req) {
    try {

      const testimonials = await this.testimonialsModel.findAll();

      return this.response({
        data: {
          testimonials
        }
      });
    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }

  async update(req) {
    try {

      const { id,  position, position_ru, position_am, comment, comment_ru, comment_am } = req.body;


      if (!id) {
        return this.response({
          status: false,
          statusCode: 400,
          message: 'Testimonial ID is required'
        });
      }

      const testimonial = await this.testimonialsModel.findOne({ where: { id } } );

      const avatar = req.file ? await this.storageService.uploadImage(req.file) : (testimonial?.avatar || null)

      await this.testimonialsModel.update({
        ...testimonial,
        position,
        position_ru,
        position_am,
        comment,
        comment_ru,
        comment_am,
        avatar
      },  {
        where: {id}
      })

      return this.response({
        message: 'Testimonial updated successfully'
      });

    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }

  async delete(req) {
    try {
      const {id} = req.params

      if (!id) {
        return this.response({
          status: false,
          statusCode: 400,
          message: "Testimonial ID is required"
        })
      }

      const testimonial = await this.testimonialsModel.findByPk(id)

      if (testimonial?.avatar) {
        await this.storageService.deleteImage(testimonial.avatar)
      }

      await this.testimonialsModel.destroy({
        where: {id}
      })

      return this.response({message: "Testimonial deleted successfully"})
    } catch (error) {
      return this.serverErrorResponse();
    }
  }

};
