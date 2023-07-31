import { db } from '../database/connection.database.js';

export async function createCustomers(req, res) {
  try {
    const find_name = await db.query(`SELECT * FROM customers WHERE cpf = $1;`, [res.locals.cpf]);
    if (find_name.rowCount !== 0) return res.sendStatus(409);
    const { name, phone, cpf, birthday } = res.locals;
    await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`, [
      name, phone, cpf, birthday,
    ]);
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function readCustomers(req, res) {
  try {
    const SQL_BASE = `SELECT *, TO_CHAR(birthday, 'YYYY-MM-DD') birthday FROM customers `;
    const { SQL_PAG = '', PAG_ARGS = [] } = res.locals;
    const SQL_ARGS = [...PAG_ARGS, req.query.cpf];
    const customers =
      'cpf' in req.query
        ? await db.query(SQL_BASE + `WHERE cpf LIKE $${SQL_ARGS.length} || '%' ` + SQL_PAG + ';', SQL_ARGS)
        : await db.query(SQL_BASE + SQL_PAG + ';', PAG_ARGS);
    console.log(SQL_BASE + SQL_PAG + ';');
    console.log(SQL_BASE + `WHERE cpf LIKE $${SQL_ARGS.length} || '%' ` + SQL_PAG + ';', SQL_ARGS);
    return res.send(customers.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function readCustomersById(req, res) {
  try {
    const customers = await db.query(
      `SELECT *, TO_CHAR(birthday, 'YYYY-MM-DD') birthday FROM customers WHERE id = $1;`,
      [req.params.id]
    );
    if (customers.rowCount === 0) return res.sendStatus(404);
    res.send(customers.rows[0]);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function updateCustomersById(req, res) {
  try {
    const { name, phone, cpf, birthday } = res.locals;
    const find_cpf = await db.query(`SELECT * FROM customers WHERE id != $1 AND cpf = $2`, [req.params.id, cpf]);
    if (find_cpf.rowCount !== 0) return res.sendStatus(409);
    await db.query(`UPDATE customers SET name = $2, phone = $3, cpf = $4, birthday = $5 WHERE id = $1;`, [
      req.params.id, name, phone, cpf, birthday,
    ]);
    res.send([]);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
