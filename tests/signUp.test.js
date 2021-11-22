import bcrypt from 'bcrypt';
import supertest from 'supertest';
import app from '../src/app';
import connection from '../src/database/database';

beforeAll(async () => {
  await connection.query('DELETE FROM users;');
  const user = {
    email: 'teste@gmail.com',
    name: 'teste',
    password: 'teste',
  };
  const passwordHash = bcrypt.hashSync(user.password, 10);
  await connection.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3);
        `, [user.name, user.email, passwordHash]);
});

afterAll(async () => {
  await connection.query('DELETE FROM users;');
});

describe('POST /sign-up', () => {
  it('returns 201 for valid params', async () => {
    const user = {
      email: 'email@gmail.com',
      name: 'teste13',
      password: 'senha',
    };

    const result = await supertest(app).post('/sign-up').send(user);

    expect(result.status).toEqual(201);
  });
  it('returns 401 for repeated email', async () => {
    const user = {
      email: 'teste@gmail.com',
      name: 'teste22',
      password: 'senhasegura',
    };

    const result = await supertest(app).post('/sign-up').send(user);

    expect(result.status).toEqual(401);
  });
});
