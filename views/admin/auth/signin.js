import layout from '../layout.js';

export default () => {
  return layout({
    content: ` 
  <div>
    <form method="POST">
      <input name="email" placeholder="Email" />
      <input name="password" placeholder="Password" />
      <button>Sign In</button>
    </form>
  </div>
`,
  });
};
