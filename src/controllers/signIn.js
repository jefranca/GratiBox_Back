import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import connection from '../database/database.js';

export default async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    const isEmailValid = await connection.query(`SELECT * FROM users WHERE email = $1;
        `, [email]);
    if (isEmailValid.rowCount === 0) return res.status(404).send('E-mail não cadastrado');

    const user = isEmailValid.rows[0];
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid();
      await connection.query(`INSERT INTO sessions ("userId", token) VALUES ($1, $2)
            `, [user.id, token]);
      delete user.password;
      const userData = {
        token,
        user,
      };
      return res.status(200).send(userData);
    } return res.status(401).send('Senha Incorreta');
  } catch (err) {
    // eslint-disable-next-line semi
    console.log(err)
    return res.sendStatus(500);
  }
}
