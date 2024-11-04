import layout from '../layout.js';

export default ({ req }) => {
  return layout({
    content: `
  <div>
    ${req.session.userId}
      <form method="POST">
        <input name="email" placeholder="Email" />
        <input name="password" placeholder="Password" />
        <input name="passwordConfirm" placeholder="Confirm Password" />
        <button>Sign Up</button>
      </form>
  </div>
  `,
  });
};
