import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import { router } from './routes/admin/auth.js';
import { productsRouter } from './routes/admin/products.js';

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ['fdhjkl3sfghjdshj5gf7b'] }));
app.use(router);
app.use(productsRouter);

app.listen(3000, () => console.log('Listening'));
