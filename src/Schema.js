import Joi from "joi";

const productSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        "string.empty": "Name is required.",
    }),

    description: Joi.string().trim().required().messages({
        "string.empty": "Description is required.",
    }),

    category: Joi.string().required().messages({
        "string.empty": "Category is required.",
    }),

    brand: Joi.string().trim().allow(null, ""),

    sku: Joi.string().trim().required().messages({
        "string.empty": "SKU is required.",
    }),

    price: Joi.number().required().messages({
        "number.base": "Price must be a number.",
        "any.required": "Price is required.",
    }),

    discountPrice: Joi.number().default(0),

    attributes: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().required(),
                value: Joi.string().required(),
            })
        )
        .messages({
            "array.base": "Attributes should be an array of objects.",
        }),

    stock: Joi.number().min(0).required().messages({
        "number.base": "Stock must be a number.",
        "number.min": "Stock cannot be negative.",
        "any.required": "Stock is required.",
    }),

    isFeatured: Joi.boolean().default(false),

    status: Joi.string()
        .valid("active", "inactive", "out-of-stock")
        .default("active"),

    tags: Joi.array().items(Joi.string()).default([]),

    ratings: Joi.number().default(0).min(0).max(5),

    reviews: Joi.array()
        .items(
            Joi.object({
                user: Joi.string().required(),
                rating: Joi.number().required().min(1).max(5),
                comment: Joi.string().required(),
                createdAt: Joi.date().default(Date.now),
            })
        )
        .messages({
            "array.base": "Reviews should be an array of objects.",
        }),

    weight: Joi.number().required().messages({
        "number.base": "Weight must be a number.",
        "any.required": "Weight is required.",
    }),

    dimensions: Joi.object({
        length: Joi.number().allow(null),
        width: Joi.number().allow(null),
        height: Joi.number().allow(null),
    }).default(),

    shipping: Joi.object({
        freeShipping: Joi.boolean().default(false),
        shippingCost: Joi.number().default(0),
    }).default(),

    createdAt: Joi.date().default(Date.now),
    updatedAt: Joi.date().default(Date.now),
});

export { productSchema };
