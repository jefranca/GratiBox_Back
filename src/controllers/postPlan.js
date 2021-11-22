import connection from '../database/database.js';

export default async function postPlan(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  const {
    type, day, tea, incense, organicProduct,
  } = req.body;
  try {
    const getUserId = await connection.query('SELECT * FROM sessions WHERE token=$1', [token]);
    if (getUserId.rowCount === 0) return res.sendStatus(401);

    await connection.query(`
            INSERT INTO plans (type,day,tea,incense,"organicProducts") 
            VALUES ($1,$2,$3,$4,$5)`, [type, day, tea, incense, organicProduct]);

    const getPlanId = await connection.query('SELECT * FROM plans');
    const planId = getPlanId.rows[getPlanId.rows.length - 1].id;
    const { userId } = getUserId.rows[0];
    await connection.query('UPDATE users SET "planId"=$1 WHERE id=$2', [planId, userId]);

    const getUser = await connection.query('SELECT * FROM users WHERE id=$1', [userId]);
    const user = getUser.rows[0];
    delete user.password;

    const userData = {
      token,
      user,
    };

    return res.status(200).send(userData);
  } catch (err) {
    return res.sendStatus(500);
  }
}
