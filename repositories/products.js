import { Repository } from './repository.js';

class productsRepository extends Repository {}

export const productsRepo = new productsRepository('products.json');
