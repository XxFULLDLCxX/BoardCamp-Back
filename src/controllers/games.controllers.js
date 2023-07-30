import { db } from '../database/connection.database.js';

export async function createGames(req, res) {
  try {
    const find_name = await db.query(`SELECT * FROM games WHERE name = $1`, [res.locals.name]);
    if (find_name.rowCount !== 0) return res.sendStatus(409);
    await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`, [
      ...Object.values(res.locals),
    ]);
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function readGames(req, res) {
  try {
    const games = await db.query('SELECT * FROM games;');
    res.send(games.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
