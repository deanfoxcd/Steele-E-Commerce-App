import fs from 'fs';
import crypto from 'crypto';

export class Repository {
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

  async create(atts) {
    atts.id = this.randomId();

    const records = await this.getAll();
    records.push(atts);
    await this.writeAll(records);

    return atts;
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf-8',
      })
    );
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
