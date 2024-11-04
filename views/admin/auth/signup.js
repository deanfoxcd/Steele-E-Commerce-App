import layout from '../layout.js';
import { getError } from '../../helpers.js';

export default ({ req, errors }) => {
  return layout({
    content: `
  <div>
    ${req.session.userId}
      <form method="POST">
        <input name="email" placeholder="Email" />
        ${getError(errors, 'email')}
        <input name="password" placeholder="Password" />
        ${getError(errors, 'password')}
        <input name="passwordConfirm" placeholder="Confirm Password" />
        ${getError(errors, 'passwordConfirm')}
        <button>Sign Up</button>
      </form>
  </div>
  `,
  });
};
