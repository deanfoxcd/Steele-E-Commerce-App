import crypto from 'crypto';
import util from 'util';
import { Repository } from './repository.js';

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
  async create(atts) {
    atts.id = this.randomId();

    const salt = crypto.randomBytes(8).toString('hex');
    const buf = await scrypt(atts.password, salt, 64);

    const records = await this.getAll();
    const record = { ...atts, password: `${buf.toString('hex')}.${salt}` };
    records.push(record);

    await this.writeAll(records);
    return record;
  }

  async comparePasswords(saved, supplied) {
    const [hashed, salt] = saved.split('.');
    const suppliedHashBuf = await scrypt(supplied, salt, 64);

    return hashed === suppliedHashBuf.toString('hex');
  }
}

// const test = async () => {
//   const repo = new UsersRepository('users.json');

//   await repo.getAll();
// };

// const repo = new UsersRepository('users.json');

// // await repo.create({ email: 'test@test.com', password: 'password' });
// // const user = await repo.getOne('103a2fdsfdsf1eb');
// // await repo.delete('80c64a9c');
// // await repo.update('faba4774', { password: 'changed' });
// const user = await repo.getOneBy({ password: 'password' });
// const users = await repo.getAll();

// console.log(user);

const instance = new UsersRepository('users.json');
export { instance };
