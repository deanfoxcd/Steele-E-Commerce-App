import express from 'express';
import multer from 'multer';

import newProduct from '../../views/admin/products/newProduct.js';
import validators from './validators.js';
import { productsRepo } from '../../repositories/products.js';
import { handleErrors } from './middleware.js';

export const productsRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

productsRouter.get('/admin/products', (req, res) => {});

productsRouter.get('/admin/products/new', (req, res) => {
  res.send(newProduct({}));
});

productsRouter.post(
  '/admin/products/new',
  upload.single('image'),
  [validators.requireTitle, validators.requirePrice],
  handleErrors(newProduct),
  async (req, res) => {
    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });

    res.send('Product created');
  }
);
