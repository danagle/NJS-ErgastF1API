function parseRequestParams(req, defaultLimit) {
  let {
    circuit,
    constructor,
    constructorStandings,
    driver,
    driverStandings,
    fastest,
    grid,
    limit,
    offset,
    result,
    round,
    sql,
    status,
    year,
  } = req.query;

  // If the 'constructor' key isn't defined then the request object's constructor will be returned instead
  if (typeof constructor == "function") {
    constructor = null;
  }

  offset = typeof offset != "undefined" ? parseInt(offset) : 0;

  limit =
    typeof limit != "undefined" ? parseInt(req.query.limit) : defaultLimit;

  if (year == "current") {
    year = new Date().getFullYear().toString();
  }

  return {
    circuit,
    constructor,
    constructorStandings,
    driver,
    driverStandings,
    fastest,
    grid,
    limit,
    offset,
    result,
    round,
    sql,
    status,
    year,
  };
}

module.exports = { parseRequestParams };
