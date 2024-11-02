const {Sequelize, Categories, Authors, Products_Category, Products} = require('../models')
const {paginate} = require("../helpers");

const attributes = [
    'id',
    'title',
    'title_ru',
    'title_am',
    'description',
    'description_ru',
    'description_am',
    'shortDescription',
    'shortDescription_ru',
    'shortDescription_am',
    'images',
    'price',
    'price_ru',
    'price_am',
    'video',
    'isFavourite',
    'createdAt'
]

class ProductsProvider {

    async findAll({page, limit, search, where = null}) {
        const response = await Products.findAndCountAll({
            ...paginate({
                currentPage: page,
                pageSize: limit
            }),
            where,
            order: [
                ['createdAt', 'DESC']
            ],
            attributes,
            include: [{
                model: Categories,
                as: 'categories',
                attributes: ['id', 'name', 'name_ru', 'name_am', 'description', 'description_ru', 'description_am'],
                through: {
                    attributes: []
                }
            }
            ],
            through: {
                attributes: []
            }
        })
        response.products = response?.rows

        delete response.rows

        return response

    }

    async findById({id}) {
        return await Products.findByPk(id, {
            attributes,
            include: [{
                model: Categories,
                as: 'categories',
                attributes: ['id', 'name', 'name_ru', 'name_am', 'description', 'description_ru', 'description_am'],
                through: {
                    attributes: []
                }
            }
            ],
            through: {
                attributes: []
            }
        })
    }

    async findProductsByCategory({page, limit, category, include = true, attributes = attributes}) {
        const parsedRel = [{
            model: Categories,
            as: 'categories',
            where: { name: category.toLowerCase() },
            attributes: ['id', 'name', 'name_ru', 'name_am', 'description', 'description_ru', 'description_am'],
            through: {
                attributes: []
            }
        }]
        
        const response = await Products.findAndCountAll({
            ...paginate({
                currentPage: page,
                pageSize: limit
            }),
            order: [
                ['createdAt', 'DESC']
            ],
            attributes,
            include: parsedRel,
            through: {
                attributes: []
            }
        })


        return response?.rows.map(el => el.dataValues)
    }
}

module.exports = ProductsProvider