import express from 'express';
import { productsRepo } from '../../repositories/products.js';
import _new from '../../views/admin/products/new.js';
import validators from './validators.js';
import { check, validationResult } from 'express-validator';

export const productsRouter = express.Router();

productsRouter.get('/admin/products', (req, res) => {});

productsRouter.get('/admin/products/new', (req, res) => {
  res.send(_new({}));
});

productsRouter.post(
  '/admin/products/new',
  [validators.requireTitle, validators.requirePrice],
  (req, res) => {
    const errors = validationResult(req);
    console.log(errors);

    res.send('Product created');
  }
);
