import express from 'express';
import { instance } from '../../repositories/users.mjs';
import signup from '../../views/admin/auth/signup.js';
import signin from '../../views/admin/auth/signin.js';

export const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signup({ req }));
});

// Used before we decided to import the bodyParser library
/*
const bodyParser = function (req, res, next) {
  if (req.method === 'POST') {
    req.on('data', (data) => {
      const parsedData = data.toString('utf8').split('&');
      const formData = {};
      parsedData.forEach((field) => {
        const [key, value] = field.split('=');
        formData[key] = value;
      });
      req.body = formData;
      next();
    });
  } else {
    next();
  }
};
*/

router.post('/signup', async (req, res) => {
  const { email, password, passwordConfirm } = req.body;

  const existingUser = await instance.getOneBy({ email });
  if (existingUser) return res.send('Account already exists for this email');
  if (password !== passwordConfirm) return res.send('Passwords do not match');

  const user = await instance.create({ email, password });

  req.session.userId = user.id; // Added by cookie session

  res.send('Account created!');
});

router.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out');
});

router.get('/signin', (req, res) => {
  res.send(signin());
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await instance.getOneBy({ email });

  if (!user) return res.send('User not found');

  const validPassword = await instance.comparePasswords(
    user.password,
    password
  );
  if (!validPassword) return res.send('Invalid password');

  req.session.userId = user.id;

  res.send('You are signed in');
});
