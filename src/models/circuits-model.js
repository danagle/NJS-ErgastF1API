// helper function
const isValid = (element) => element !== null && typeof element !== "undefined";

function circuitsSelectQueryBase() {
  const query =
    "SELECT DISTINCT circuits.circuitRef, circuits.name, circuits.location, circuits.country, circuits.lat, circuits.lng, circuits.alt, circuits.url FROM circuits";
  return query;
}

function includeRacesTable(fields) {
  let racesTableString = "";
  if (fields && fields.some(isValid)) {
    racesTableString = ", races";
  }
  return racesTableString;
}

function includeResultsTable(fields) {
  let resultsTableString = "";
  if (fields && fields.some(isValid)) {
    resultsTableString = ", results";
  }
  return resultsTableString;
}

function includeDriversTable(driver) {
  let driversTableString = "";
  if (isValid(driver)) {
    driversTableString = ", drivers";
  }
  return driversTableString;
}

function includeConstructorsTable(constructor) {
  let constructorsTableString = "";
  if (isValid(constructor)) {
    constructorsTableString = ", constructors";
  }
  return constructorsTableString;
}

function includeWhereTrueClause() {
  return " WHERE TRUE";
}

function andRacesCircuitsJoinClause(fields) {
  let racesCircuitsJoinClause = "";
  if (fields && fields.some(isValid)) {
    racesCircuitsJoinClause = " AND races.circuitId=circuits.circuitId";
  }
  return racesCircuitsJoinClause;
}

function andCircuitsRefClause(circuit) {
  console.log("HI!");
  let circuitsRefClause = "";
  if (isValid(circuit)) {
    circuitsRefClause = ` AND circuits.circuitRef='${circuit}'`;
  }
  return circuitsRefClause;
}

function andResultsRacesJoinClause(fields) {
  let resultsRacesJoinClause = "";
  if (fields && fields.some(isValid)) {
    resultsRacesJoinClause = " AND results.raceId=races.raceId";
  }
  return resultsRacesJoinClause;
}

function andResultsConstructorsJoinClause(constructor) {
  let resultsConstructorsJoinClause = "";
  if (isValid(constructor)) {
    resultsConstructorsJoinClause = ` AND results.constructorId=constructors.constructorId AND constructors.constructorRef='${constructor}'`;
  }
  return resultsConstructorsJoinClause;
}

function andResultsDriversJoinClause(driver) {
  let resultsDriversJoinClause = "";
  if (isValid(driver)) {
    resultsDriversJoinClause = ` AND results.driverId=drivers.driverId AND drivers.driverRef='${driver}'`;
  }
  return resultsDriversJoinClause;
}

function andResultsStatusClause(status) {
  let resultsStatusClause = "";
  if (isValid(status)) {
    resultsStatusClause = ` AND results.statusId='${status}'`;
  }
  return resultsStatusClause;
}

function andResultsGridClause(grid) {
  let resultsGridClause = "";
  if (isValid(grid)) {
    resultsGridClause = ` AND results.grid='${grid}'`;
  }
  return resultsGridClause;
}

function andResultsRankClause(rank) {
  let resultsRankClause = "";
  if (isValid(rank)) {
    resultsRankClause = ` AND results.rank='${rank}'`;
  }
  return resultsRankClause;
}

function andResultsPositionClause(position) {
  let resultsPositionClause = "";
  if (isValid(position)) {
    resultsPositionClause = ` AND results.positionText='${position}'`;
  }
  return resultsPositionClause;
}

function andRacesYearClause(year) {
  let racesYearClause = "";
  if (isValid(year)) {
    racesYearClause = ` AND races.year='${year}'`;
  }
  return racesYearClause;
}

function andRacesRoundClause(round) {
  let racesRoundClause = "";
  if (isValid(round)) {
    racesRoundClause = ` AND races.round='${round}'`;
  }
  return racesRoundClause;
}

function orderByCircuitsRefLimitClause(offset, limit) {
  let clause = "";
  if (offset && limit) {
    clause = ` ORDER BY circuits.circuitRef LIMIT ${offset}, ${limit}`;
  }
  return clause;
}

function createCircuitsSqlQuery(paramsObj, offset, limit) {
  let sqlQuery = "";
  if (paramsObj) {
    const {
      circuit,
      constructor,
      driver,
      fastest,
      grid,
      position,
      result,
      round,
      status,
      year,
    } = paramsObj;
    sqlQuery = circuitsSelectQueryBase();
    sqlQuery += includeRacesTable([
      year,
      driver,
      constructor,
      status,
      grid,
      fastest,
      result,
    ]);
    sqlQuery += includeResultsTable([
      driver,
      constructor,
      status,
      grid,
      fastest,
      result,
    ]);
    sqlQuery += includeDriversTable(driver);
    sqlQuery += includeConstructorsTable(constructor);
    sqlQuery += includeWhereTrueClause();
    sqlQuery += andRacesCircuitsJoinClause([
      year,
      driver,
      constructor,
      status,
      grid,
      fastest,
      result,
    ]);
    sqlQuery += andCircuitsRefClause(circuit);
    sqlQuery += andResultsRacesJoinClause([
      driver,
      constructor,
      status,
      grid,
      fastest,
      result,
    ]);
    sqlQuery += andResultsConstructorsJoinClause(constructor);
    sqlQuery += andResultsDriversJoinClause(driver);
    sqlQuery += andResultsStatusClause(status);
    sqlQuery += andResultsGridClause(grid);
    sqlQuery += andResultsRankClause(fastest);
    sqlQuery += andResultsPositionClause(position);
    sqlQuery += andRacesYearClause(year);
    sqlQuery += andRacesRoundClause(round);
    sqlQuery += orderByCircuitsRefLimitClause(offset, limit);
  }
  return sqlQuery;
}

module.exports = {
  andCircuitsRefClause,
  andRacesCircuitsJoinClause,
  andRacesRoundClause,
  andRacesYearClause,
  andResultsConstructorsJoinClause,
  andResultsDriversJoinClause,
  andResultsGridClause,
  andResultsPositionClause,
  andResultsRacesJoinClause,
  andResultsRankClause,
  andResultsStatusClause,
  circuitsSelectQueryBase,
  createCircuitsSqlQuery,
  includeConstructorsTable,
  includeDriversTable,
  includeRacesTable,
  includeResultsTable,
  includeWhereTrueClause,
  orderByCircuitsRefLimitClause,
};
