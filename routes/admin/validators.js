import { check } from 'express-validator';
import { instance } from '../../repositories/users.mjs';
import { productsRepo } from '../../repositories/products.js';

export default {
  requireTitle: check('title')
    .trim()
    .isLength({ min: 5, max: 40 })
    .withMessage('Must be between 5 and 40 characters long'),
  requirePrice: check('price')
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage('Must be a number greater than 1'),
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email address')
    .custom(async (email) => {
      const existingUser = await instance.getOneBy({ email });
      if (existingUser)
        throw new Error('An account with this email already exists');
      else return true;
    }),
  requirePassword: check('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters long'),
  requirePasswordConfirm: check('passwordConfirm')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters long')
    .custom((passwordConfirm, { req }) => {
      if (req.body.password !== passwordConfirm)
        throw new Error('Passwords do not match');
      else return true;
    }),
  requireEmailExists: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email address')
    .custom(async (email) => {
      const user = await instance.getOneBy({ email });
      if (!user) throw new Error('User not found');
    }),
  requireValidUserPassword: check('password')
    // .withMessage('Invalid password')
    .trim()
    .custom(async (password, { req }) => {
      const user = await instance.getOneBy({ email: req.body.email });
      if (!user) throw new Error('Invalid password');

      const validPassword = await instance.comparePasswords(
        user.password,
        password
      );
      if (!validPassword) throw new Error('Invalid password');
    }),
};
