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
    if ('name' in req.query) {
      const games = await db.query(`SELECT * FROM games WHERE LOWER(name) LIKE LOWER($1 || '%');`, [req.query.name]);
      return res.send(games.rows);
    }
    const games = await db.query('SELECT * FROM games;');
    res.send(games.rows);
    return games.rows;
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
