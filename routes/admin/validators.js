import { check } from 'express-validator';
import { instance } from '../../repositories/users.mjs';

export default {
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .custom(async (email) => {
      const existingUser = await instance.getOneBy({ email });
      if (existingUser)
        throw new Error('An account with this email already exists');
    }),
  requirePassword: check('password').trim().isLength({ min: 4, max: 20 }),
  requirePasswordConfirm: check('passwordConfirm')
    .trim()
    .isLength({ min: 4, max: 20 })
    .custom((passwordConfirm, { req }) => {
      if (req.body.password !== passwordConfirm)
        throw new Error('Passwords do not match');
    }),
};
