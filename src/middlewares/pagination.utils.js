export function pagination(req, res, next) {
  let SQL_PAG = ``;
  const PAG_ARGS = [];
  if (!isNaN(req.query.limit)) {
    PAG_ARGS.push(req.query.limit);
    SQL_PAG += `LIMIT $${PAG_ARGS.length} `;
  }
  if (!isNaN(req.query.offset)) {
    PAG_ARGS.push(req.query.offset);
    SQL_PAG += `OFFSET $${PAG_ARGS.length} `;
  }
  res.locals = { ...res.locals, SQL_PAG, PAG_ARGS };
  next();
}