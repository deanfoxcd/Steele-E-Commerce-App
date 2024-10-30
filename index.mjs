import express from 'express';

const app = express();

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

app.post('/', (req, res) => {
  req.on('data', (data) => {
    const parsedData = data.toString('utf8').split('&');
    const formData = {};
    parsedData.forEach((field) => {
      const [key, value] = field.split('=');

      formData[key] = value;
    });
    console.log(formData);
    // console.log(parsedData);
  });
  res.send('Account created!');
});

app.listen(3000, () => console.log('Listening'));
