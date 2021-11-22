import bcrypt from 'bcrypt';
import supertest from 'supertest';
import faker from 'faker';
import connection from '../src/database/database';
import app from '../src/app';

beforeEach(async () => {
  await connection.query('DELETE FROM sessions;');
  await connection.query('DELETE FROM users;');
});

afterAll(() => {
  connection.end();
});

describe('POST /sign-in', () => {
  it('returns 404 for invalid email', async () => {
    const user = {
      email: faker.internet.email(),
      password: 'teste123',
    };

    const result = await supertest(app).post('/sign-in').send(user);

    expect(result.status).toEqual(404);
  });
  it('returns 401 for invalid password', async () => {
    const fakerName = faker.name.findName();
    const fakerEmail = faker.internet.email();
    const fakerPassword = faker.internet.password(10);
    const fakerHashedPassword = bcrypt.hashSync(fakerPassword, 10);

    await connection.query(`
            INSERT INTO users (name, email, password) VALUES ($1, $2, $3);
        `, [fakerName, fakerEmail, fakerHashedPassword]);

    const user = {
      email: fakerEmail,
      password: faker.internet.password(9),
    };

    const result = await supertest(app).post('/sign-in').send(user);

    expect(result.status).toEqual(401);
  });
  it('returns 200 for valid params', async () => {
    const fakerName = faker.name.findName();
    const fakerEmail = faker.internet.email();
    const fakerPassword = faker.internet.password(6);
    const fakerHashedPassword = bcrypt.hashSync(fakerPassword, 10);

    await connection.query(`
            INSERT INTO users (name, email, password) VALUES ($1, $2, $3);
        `, [fakerName, fakerEmail, fakerHashedPassword]);

    const user = {
      email: fakerEmail,
      password: fakerPassword,
    };

    const result = await supertest(app).post('/sign-in').send(user);

    expect(result.status).toEqual(200);
  });
});
