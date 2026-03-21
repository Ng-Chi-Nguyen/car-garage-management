import express from 'express';
import userSchema from '../../validator/management/user.validator.js';
import userController from '../../controllers/management/user.controller.js';
import { validate, validateRequest } from '../../middleware/validation.middleware.js';

const userRoute = express.Router();

userRoute
    .post('/', validate(userSchema.createUser.body), userController.createUser)
    .get('/', validateRequest(userSchema.getUsersAll.query, 'query'), userController.getUsersAll)
    .get('/:id', validateRequest(userSchema.getUserById.params, 'params'), userController.getUserById)
    .put(
        '/:id',
        validateRequest(userSchema.updateUser.params, 'params'),
        validate(userSchema.updateUser.body),
        userController.updateUser,
    )
    .delete('/:id', validateRequest(userSchema.deleteUser.params, 'params'), userController.deleteUser);

export default userRoute;
