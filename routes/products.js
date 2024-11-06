import express from 'express';
import { productsRepo } from '../repositories/products.js';
import publicProductsIndex from '../views/products/publicProductsIndex.js';

export const publicProductsRouter = express.Router();

publicProductsRouter.get('/', async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(publicProductsIndex({ products }));
});
