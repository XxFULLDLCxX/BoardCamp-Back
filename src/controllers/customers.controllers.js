import { db } from '../database/connection.database.js';

export async function createCustomers(req, res) {
  try {
    const find_name = await db.query(`SELECT * FROM customers WHERE cpf = $1;`, [res.locals.cpf]);
    if (find_name.rowCount !== 0) return res.sendStatus(409);
    await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`, [
      ...Object.values(res.locals),
    ]);
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function readCustomers(req, res) {
  try {
    const customers = await db.query('SELECT * FROM customers;');
    res.send(customers.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function readCustomersById(req, res) {
  try {
    const customers = await db.query('SELECT * FROM customers WHERE id = $1;', [req.params.id]);
    if (customers.rowCount === 0) return res.sendStatus(404);
    res.send(customers.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function updateCustomersById(req, res) {
  try {
    const { id, cpf } = res.locals;
    const find_cpf = await db.query(`SELECT * FROM customers WHERE id != $1 AND cpf = $2`, [id, cpf]);
    if (find_cpf.rowCount !== 0) return res.sendStatus(409);

    const customers = await db.query(
      `UPDATE customers SET name = $2, phone = $3, cpf = $4, birthday = $5 WHERE id = $1;`,
      [id, ...Object.values(res.locals)]
    );
    res.send(customers.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
