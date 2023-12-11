import { db } from '../database/connection.database.js';

export async function createRentals(req, res) {
  try {
    const { customerId, gameId, daysRented } = res.locals;
    const game = await db.query(`SELECT * FROM games WHERE id = $1;`, [gameId]);
    const customer = await db.query(`SELECT * FROM customers WHERE id = $1;`, [customerId]);

    if (customer.rowCount === 0 && game.rowCount === 0)
      return res.status(400).send('os Ids de Cliente ou Jogo não existe.');

    const rentals = await db.query(`SELECT * FROM rentals WHERE "gameId" = $1`, [gameId]);
    if (rentals.rowCount >= game.rows[0].stockTotal)
      return res.status(400).send(`Acabou o Stock do Jogo ${game.rows[0].name}`);

    await db.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
       VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [customerId, gameId, new Date(), daysRented, null, game.rows[0].pricePerDay * Number(daysRented), null]
    );
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function readRentals(req, res) {
  try {
    const SQL_BASE = `
    SELECT rentals.*, 
      TO_CHAR("rentDate", 'YYYY-MM-DD') "rentDate", 
      TO_CHAR("returnDate", 'YYYY-MM-DD') "returnDate",
      json_build_object('id', customers.id, 'name', customers.name) customer, 
      json_build_object('id', games.id, 'name', games.name) game FROM rentals
    JOIN customers ON rentals."customerId" = customers.id
    JOIN games ON rentals."gameId" = games.id `;

    const { SQL_PAGE = '', SQL_ORDER = '', PAGE_ARGS = [], ORDER_ARGS = [] } = res.locals;
    const SQL_ARGS = [...ORDER_ARGS, ...PAGE_ARGS];

    let SQL_FINAL = SQL_BASE;

    if (!isNaN(req.query.customerId)) {
      SQL_ARGS.push(req.query.customerId);
      SQL_FINAL += `WHERE rentals."customerId" = $${SQL_ARGS.length} `;
    }
    if (!isNaN(req.query.gameId)) {
      SQL_ARGS.push(req.query.gameId);
      SQL_FINAL += (SQL_FINAL.includes('WHERE') ? 'AND ' : 'WHERE ') + `rentals."gameId" = $${SQL_ARGS.length} `;
    }
    if (req.query.status === 'open') {
      SQL_FINAL += (SQL_FINAL.includes('WHERE') ? 'AND ' : 'WHERE ') + `rentals."returnDate" IS NULL `;
    }
    if (req.query.status === 'closed') {
      SQL_FINAL += (SQL_FINAL.includes('WHERE') ? 'AND ' : 'WHERE ') + `rentals."returnDate" IS NOT NULL `;
    }
    if ('startDate' in req.query) {
      SQL_ARGS.push(req.query.startDate);
      SQL_FINAL += (SQL_FINAL.includes('WHERE') ? 'AND ' : 'WHERE ') + `rentals."rentDate" >= $${SQL_ARGS.length}`;
    }

    const rentals = await db.query(SQL_FINAL + SQL_ORDER + SQL_PAGE + ';', SQL_ARGS);
    res.send(rentals.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function returnRentalsById(req, res) {
  try {
    const rentals = await db.query(
      `SELECT "rentDate", "daysRented", "returnDate" , "pricePerDay"
           FROM rentals, games
           WHERE rentals.id = $1 AND rentals."gameId" = games.id;`,
      [req.params.id]
    );

    if (rentals.rowCount === 0) return res.status(404).send('Id de aluguel não existe.');
    if (rentals.rows[0].returnDate !== null) return res.status(400).send('O Aluguel já está finalizado.');

    const [{ rentDate, daysRented, pricePerDay }] = rentals.rows;
    const returnDate = new Date();
    const expectedDate = new Date(rentDate);
    expectedDate.setDate(expectedDate.getDate() + daysRented);

    const timeDiff = Math.floor((returnDate - expectedDate) / (1000 * 60 * 60 * 24));
    const delayFee = timeDiff > 0 ? timeDiff * pricePerDay : null;

    await db.query('UPDATE rentals SET "returnDate" = $2, "delayFee" = $3 WHERE id = $1;', [
      req.params.id,
      returnDate,
      delayFee,
    ]);
    res.send([]);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function deleteRentalsById(req, res) {
  try {
    const rentals = await db.query(`SELECT "returnDate" FROM rentals WHERE id = $1;`, [req.params.id]);

    if (rentals.rowCount === 0) return res.status(404).send('Id de aluguel não existe.');
    if (rentals.rows[0].returnDate === null) return res.status(400).send('O Aluguel não está finalizado.');

    await db.query(`DELETE FROM rentals WHERE id = $1`, [req.params.id]);

    res.send([]);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
