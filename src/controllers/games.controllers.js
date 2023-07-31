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
    const { SQL_PAG = '', PAG_ARGS = [] } = res.locals;
    const SQL_ARGS = [...PAG_ARGS, req.query.name];
    const games =
      'name' in req.query
        ? await db.query(SQL_BASE + `WHERE LOWER(name) LIKE LOWER($${SQL_ARGS.length}) || '%' ` + SQL_PAG + ';', SQL_ARGS)
        : await db.query(SQL_BASE + SQL_PAG + ';', PAG_ARGS);
    console.log(SQL_BASE + SQL_PAG + ';');
    console.log(SQL_BASE + `WHERE name LIKE $${SQL_ARGS.length} || '%' ` + SQL_PAG + ';', SQL_ARGS);
    return res.send(games.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
