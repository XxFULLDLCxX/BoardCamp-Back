import { db } from "../database/connection.database.js";

export async function getGames(req, res) {
  try {
    const games = await db.query('SELECT * FROM games;');
    res.send(games.rows);
  } catch (err) {
    console.log(err);
    res.send(500);
  }
}

export async function postGames(req, res) {
  try {
    /*
    {
      id: 1,
      name: 'Banco Imobiliário',
      image: 'http://',
      stockTotal: 3,
      pricePerDay: 1500,
    }  
    */
    // await db.query(`
    // INSERT INTO games (name, image, stockTotal, pricePerDay) 
    // VALUES ($1, $2, $3, $4);
    // `, [res.locals])
    console.log(res.locals);
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.send(500);
  }
}
