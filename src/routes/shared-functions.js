function parseRequestParams(req, defaultLimit) {
  if (req && req.hasOwnProperty("query")) {
    let {
      circuit,
      constructor,
      constructorStandings,
      driver,
      driverStandings,
      fastest,
      grid,
      laps,
      limit,
      offset,
      result,
      round,
      sql,
      status,
      year,
    } = req.query;

    // If the 'constructor' key isn't explicitly defined
    // the request object's constructor will have been selected
    // Need to reset 'constructor' to null in this case
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
      laps,
      offset,
      result,
      round,
      sql,
      status,
      year,
    };
  } else {
    return {};
  }
}

module.exports = { parseRequestParams };
