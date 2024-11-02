const BaseService = require('./BaseService')
const StorageService = require('./StorageService')
const CategoriesProvider = require('../provider/CategoriesProvider')
const ProductsProvider = require('../provider/ProductsProvider')
const {Sequelize, Products, Categories, Authors, Products_Categories, Views} = require('../models')
const {Op} = require("sequelize");
const {getLastWeeksDate, getLastMonthDate, getPreviousDay, paginate} = require("../helpers");

class ProductsService extends BaseService {
    constructor() {
        super();
        this.categoriesProvider = new CategoriesProvider()
        this.storageService = new StorageService()
        this.productsProvider = new ProductsProvider()
        this.categoriesModel = Categories
        this.productsModel = Products
        this.productsCategoriesModel = Products_Categories
    }

    async create(req) {
        try {
            const {
                title,
                title_ru,
                title_am,
                shortDescription,
                shortDescription_ru,
                shortDescription_am,
                description,
                description_ru,
                description_am,
                price,
                categories,
                price_ru,
                price_am,
                video,
                isFavourite
            } = req.body

            const parseCategories = Array.isArray(categories) ? categories : [categories]

            if (!parseCategories?.length)  {
                return this.response({
                    status: false,
                    statusCode: 400,
                    message: "Category is required"
                })
            }


            // edit image
            const images = []

            if (req.files && req.files.length) {
                for (const file of req.files) {
                    const url  = await this.storageService.uploadImage(file)

                    images.push(url)
                }
            }

            const createdProduct = await this.productsModel.create({
                title: title || '',
                title_ru: title_ru || '',
                title_am: title_am || '',
                shortDescription: shortDescription || '',
                shortDescription_ru: shortDescription_ru || '',
                shortDescription_am: shortDescription_am || '',
                description: description || '',
                description_ru: description_ru || '',
                description_am: description_am || '',
                price: price || '',
                price_ru: price_ru || '' ,
                price_am: price_am || '' ,
                video: video || '',
                isFavourite,
                images
            })

            for (let i = 0; i < parseCategories.length; i++) {
                 await this.categoriesProvider.createCategoryWithRel(parseCategories[i], createdProduct.id)
            }

            return this.response({
                message: "Created successfully",
                data: createdProduct
            })
        } catch (error) {
            console.log(error)
            return this.serverErrorResponse();
        }
    }

    async update(req) {
        try {
            const {
                title,
                title_ru,
                title_am,
                shortDescription,
                shortDescription_ru,
                shortDescription_am,
                description,
                description_ru,
                description_am,
                price,
                price_ru,
                price_am,
                video,
                categories,
                isFavourite,
                images
            } = req.body

            const {id} = req.params

            const parseCategories = Array.isArray(categories) ? categories : [categories]
            const product = await this.productsProvider.findById({id})

            if(!product) {
                return this.response({
                    message: 'products not found',
                    statusCode: 404,
                    status: false
                })
            }

            // delete all categories where products id is match
            await this.productsCategoriesModel.destroy({
                where: { productId: id}
            })

            // edit categories
            for (let i = 0; i < parseCategories.length; i++) {
                await this.categoriesProvider.createCategoryWithRel(parseCategories[i], id)
            }

            await this.productsModel.update({
                title: title || '',
                title_ru: title_ru || '',
                title_am: title_am || '',
                shortDescription: shortDescription || '',
                shortDescription_ru: shortDescription_ru || '',
                shortDescription_am: shortDescription_am || '',
                description: description || '',
                description_ru: description_ru || '',
                description_am: description_am || '',
                price: price || '',
                price_ru: price_ru || '' ,
                price_am: price_am || '' ,
                video: video || '',
                isFavourite
            },  {
                where:  { id }
            })

            return this.response({
                message: "Product successfully updated"
            })
        } catch (error) {
            console.log(error)
            return this.serverErrorResponse()
        }
    }

    async get(req) {
        try {
            const { category, sort, page, limit, search } = req.query;
            const params = category ? { search } : { page, limit, search }

            if (search)  {
                params.where = {
                    [Op.or]: [
                        {
                            title: {
                                [Op.like]: '%' + search + '%'
                            }
                        },
                        {
                            title_ru: {
                                [Op.like]: '%' + search + '%'
                            }
                        },
                        {
                            title_am: {
                                [Op.like]: '%' + search + '%'
                            }
                        }
                   ]
                }
            }

            let products = await this.productsProvider.findAll(params)

            if (category) {
                const findCategory = await this.categoriesModel.findOne({ where: { name: category }})


                if (!findCategory) {
                    return this.response({
                        statusCode: 404,
                        status: false,
                        message: 'Category not found'
                    })
                }


                const paginateParams = paginate({
                    currentPage: page,
                    pageSize: limit
                })

                const filteredProducts = products.products.filter(product => product.categories.some(category => category.id === findCategory.id))

                return this.response({
                    data: {
                        products: filteredProducts.slice(paginateParams.offset, paginateParams.offset + paginateParams.limit),
                        count: filteredProducts.length
                    }
                })
            } else {

                return this.response({
                    data: products
                })
            }
        } catch (error) {
            console.log(error)
            return this.serverErrorResponse();
        }
    }

    async getSingle(req) {
        try {
            const {id} = req.params;

            if (!id) {
                return this.response({
                    status: false,
                    statusCode: 400,
                    message: "Products is required"
                })
            }

            const product = await this.productsProvider.findById({id})

            if (!product) {
                return this.response({
                    status: false,
                    statusCode: 404,
                    message: "Products not found"
                })
            }

            return this.response({ data: product })
        } catch (error) {
            return this.serverErrorResponse();
        }
    }

    async productFilterByFavourite() {
        try {
            let products  = await this.productsProvider.findAll({ where: { isFavourite: true }})

            return this.response({
                data: products
            })
        } catch {
            return this.serverErrorResponse();
        }
    }

    async delete(req) {
        try {
            const {id} = req.params

            if (!id) {
                return this.response({
                    status: false,
                    statusCode: 400,
                    message: "Missing products id"
                })
            }

            const products = await this.productsModel.findByPk(id)


            if (products?.images && products?.images) {
                for (const image of products.images) {
                    await this.storageService.deleteImage(image)
                }
            }

            if (!products) {
                return this.response({
                    status: false,
                    statusCode: 404,
                    message: "Product not found"
                })
            }

            await this.productsModel.destroy({
                where: { id }
            })

            return this.response({message: "Product deleted successfully"})
        } catch (error) {
            return this.serverErrorResponse();
        }
    }

}

module.exports = ProductsService
