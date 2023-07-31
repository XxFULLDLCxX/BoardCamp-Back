export function getPage(req, res, next) {
  let { SQL_PAGE = '', PAGE_ARGS = [] } = res.locals;

  if (!isNaN(req.query.limit)) {
    PAGE_ARGS.push(req.query.limit);
    SQL_PAGE += `LIMIT $${PAGE_ARGS.length} `;
  }
  if (!isNaN(req.query.offset)) {
    PAGE_ARGS.push(req.query.offset);
    SQL_PAGE += `OFFSET $${PAGE_ARGS.length} `;
  }
  res.locals = { ...res.locals, SQL_PAGE, PAGE_ARGS };
  next();
}

export function orderBy(req, res, next) {
  const validation = {
    '/rentals': ['customerId', 'gameId', 'rentDate', 'daysRented', 'returnDate', 'originalPrice', 'delayFee'],
    '/customers': ['name', 'phone', 'cpf', 'birthday'],
    '/games': ['name', 'image', 'stockTotal', 'pricePerDay']
  }[req.path];

  let SQL_ORDER = '';

  if ('order' in req.query && ['id', ...validation].includes(req.query.order)) {
    SQL_ORDER += `ORDER BY ${req.path.slice(1)}."${req.query.order}" ` + (req.query.desc === 'true' ? 'DESC ' : '');
  }
  res.locals = { ...res.locals, SQL_ORDER };
  next();
}
