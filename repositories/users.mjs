import fs from 'fs';
import crypto from 'crypto';
import util from 'util';

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error('Creating a repository requires a filename');
    }
    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, '[]');
    }
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf-8',
      })
    );
  }

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

  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2) // null and 2 are for formatting
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString('hex');
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => id === record.id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update(id, atts) {
    const records = await this.getAll();
    const record = records.find((record) => id === record.id);
    // We have to do the above. We can't use getOne(), we need to save all the records to the JSON file and not just one

    if (!record) throw new Error(`Record with id: ${id} does not exist.`);

    Object.assign(record, atts);
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;

      for (let key in filters) {
        if (record[key] !== filters[key]) found = false;
      }

      if (found) return record;
    }
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
