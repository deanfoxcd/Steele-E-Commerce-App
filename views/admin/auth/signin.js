import layout from '../layout.js';
import { getError } from '../../helpers.js';

export default ({ errors }) => {
  return layout({
    content: ` 
  <div>
    <form method="POST">
      <input name="email" placeholder="Email" />
      ${getError(errors, 'email')}
      <input name="password" placeholder="Password" />
      ${getError(errors, 'password')}
      <button>Sign In</button>
    </form>
  </div>
`,
  });
};
