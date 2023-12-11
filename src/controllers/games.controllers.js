import { db } from '../database/connection.database.js';

export async function createGames(req, res) {
  try {
    const find_name = await db.query(`SELECT * FROM games WHERE name = $1`, [res.locals.name]);
    if (find_name.rowCount !== 0) return res.sendStatus(409);
    const { name, image, stockTotal, pricePerDay } = res.locals;
    await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`, [
      name, image, stockTotal, pricePerDay
    ]);
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function readGames(req, res) {
  try {
    const SQL_BASE = `SELECT * FROM games `;
    const { SQL_PAGE = '', SQL_ORDER = '', PAGE_ARGS = [], ORDER_ARGS = [] } = res.locals;
    const SQL_ARGS = [...ORDER_ARGS, ...PAGE_ARGS];
    let SQL_FINAL = SQL_BASE;

    if ('name' in req.query) {
      SQL_ARGS.push(req.query.name);
      SQL_FINAL += `WHERE LOWER(name) LIKE LOWER($${SQL_ARGS.length}) || '%' `;
    }

    const games = await db.query(SQL_FINAL + SQL_ORDER + SQL_PAGE + ';', SQL_ARGS);
    return res.send(games.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
