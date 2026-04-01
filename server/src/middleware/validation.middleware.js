const validate = (schema) => (req, res, next) => {

    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        allowUnknown: false
    });

    if (error) {
        let errorMessages = error.details.map(detail => detail.message.replace(/['"]+/g, ''));

        return res.status(400).json({
            success: false,
            message: 'Dữ liệu đầu vào không hợp lệ (Validation Failed).',
            errors: errorMessages
        });
    }

    req.body = value;

    next();
};

const validateRequest = (schema, target) => (req, res, next) => {
    const { error, value } = schema.validate(req[target], {
        abortEarly: false,
        allowUnknown: false,
    });

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message.replace(/['"]+/g, ''));

        return res.status(400).json({
            success: false,
            message: 'Dữ liệu đầu vào không hợp lệ (Validation Failed).',
            errors: errorMessages,
        });
    }

    if (target === 'query') {
        req.validatedQuery = value;
    } else if (target === 'params') {
        req.validatedParams = value;
    } else if (target === 'body') {
        req[target] = value;
        req.validatedBody = value;
    }

    next();
};

export { validate, validateRequest };
