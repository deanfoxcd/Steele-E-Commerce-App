import express from 'express';
import multer from 'multer';

import validators from './validators.js';
import newProduct from '../../views/admin/products/newProduct.js';
import editProduct from '../../views/admin/products/editProduct.js';
import { productsRepo } from '../../repositories/products.js';
import { handleErrors, handleSignedIn } from './middleware.js';
import productsIndex from '../../views/admin/products/productsIndex.js';

export const productsRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

productsRouter.get('/admin/products', handleSignedIn, async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productsIndex({ products }));
});

productsRouter.get('/admin/products/new', handleSignedIn, (req, res) => {
  res.send(newProduct({}));
});

productsRouter.post(
  '/admin/products/new',
  handleSignedIn,
  upload.single('image'),
  [validators.requireTitle, validators.requirePrice],
  handleErrors(newProduct),
  async (req, res) => {
    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });

    res.redirect('/admin/products');
  }
);

productsRouter.get(
  '/admin/products/:id/edit',
  handleSignedIn,
  async (req, res) => {
    const productId = req.params.id;
    const product = await productsRepo.getOne(productId);

    if (!product) {
      return res.send('Product not found');
    }

    res.send(editProduct({ product }));
  }
);

productsRouter.post(
  '/admin/products/:id/edit',
  handleSignedIn,
  upload.single('image'),
  [validators.requireTitle, validators.requirePrice],
  handleErrors(editProduct, async (req) => {
    const product = await productsRepo.getOne(req.params.id);
    return { product };
  }),
  async (req, res) => {
    const changes = req.body;

    if (req.file) {
      changes.image = req.file.buffer.toString('base64');
    }
    try {
      await productsRepo.update(req.params.id, changes);
    } catch (err) {
      return res.send('Could not find item');
    }

    res.redirect('/admin/products');
  }
);

productsRouter.post(
  '/admin/products/:id/delete',
  handleSignedIn,
  async (req, res) => {
    await productsRepo.delete(req.params.id);

    res.redirect('/admin/products');
  }
);
