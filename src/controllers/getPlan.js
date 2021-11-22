import connection from '../database/database.js';

export default async function postPlan(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  try {
    const validateUser = await connection.query('SELECT * FROM sessions WHERE token=$1', [token]);
    if (validateUser.rowCount === 0) return res.sendStatus(401);
    const { userId } = validateUser.rows[0];

    const getPlanId = await connection.query('SELECT * FROM users WHERE id=$1', [userId]);
    const { planId } = getPlanId.rows[0];

    const getPlan = await connection.query('SELECT * FROM plans WHERE id=$1', [planId]);
    const plan = getPlan.rows[0];

    return res.status(200).send(plan);
  } catch (err) {
    return res.sendStatus(500);
  }
}
