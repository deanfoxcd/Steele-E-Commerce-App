import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="Email" />
            <input name="password" placeholder="Password" />
            <input name="passwordConfirm" placeholder="Confirm Password" />
            <button>Sign Up</button>
        </form>
    </div>
    `);
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

app.post('/', (req, res) => {
  console.log(req.body);
  res.send('Account created!');
});

app.listen(3000, () => console.log('Listening'));
