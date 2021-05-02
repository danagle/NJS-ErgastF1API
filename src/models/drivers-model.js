function createDriverSqlQuery(paramsObj, offset, limit) {
  let sqlQuery = "";
  if (paramsObj) {
    const {
      circuit,
      constructor,
      constructorStandings,
      driver,
      driverStandings,
      fastest,
      grid,
      position,
      result,
      round,
      status,
      year,
    } = paramsObj;

    sql =
      "SELECT DISTINCT drivers.*,DATE_FORMAT(dob, '%Y-%m-%d') AS 'date' FROM drivers ";
    if (year || constructor || status || grid || result || circuit || fastest)
      sql += ", results";
    if (year || circuit || driverStandings || constructorStandings)
      sql += ", races";
    if (driverStandings || constructorStandings) sql += ", driverStandings";
    if (constructorStandings) sql += ", constructorStandings";
    if (circuit) sql += ", circuits";
    if (constructor) sql += ", constructors";

    sql += " WHERE TRUE";
    //Set the join
    if (driverStandings || constructorStandings) {
      if (year || constructor) sql += " AND drivers.driverId=results.driverId";
      if (year) sql += " AND results.raceId=races.raceId";
      if (constructor)
        sql += ` AND results.constructorId=constructors.constructorId AND constructors.constructorRef='${constructor}'`;
      if (driver) sql += ` AND drivers.driverRef='${driver}'`;

      if (driverStandings)
        sql += ` AND driverStandings.positionText='${driverStandings}'`;
      if (driverStandings || constructorStandings)
        sql += " AND driverStandings.raceId=races.raceId";
      if (driverStandings || constructorStandings)
        sql += " AND drivers.driverId=driverStandings.driverId";
      if (constructorStandings)
        sql += ` AND constructorStandings.raceId=races.raceId AND constructorStandings.positionText='${constructorStandings}'`;
      if (constructor && constructorStandings)
        sql +=
          " AND constructors.constructorId=constructorStandings.constructorId";
    } else {
      if (year || constructor || status || grid || result || circuit || fastest)
        sql += " AND drivers.driverId=results.driverId";
      if (year || circuit) sql += " AND results.raceId=races.raceId";
      if (circuit)
        sql += ` AND races.circuitId=circuits.circuitId AND circuits.circuitRef='${circuit}'`;
      if (constructor)
        sql += ` AND results.constructorId=constructors.constructorId AND constructors.constructorRef='${constructor}'`;
      if (status) sql += ` AND results.statusId='${status}'`;
      if (grid) sql += ` AND results.grid='${grid}'`;
      if (fastest) sql += ` AND results.rank='${fastest}'`;
      if (result) sql += ` AND results.positionText='${result}'`;
      if (driver) sql += ` AND drivers.driverRef='${driver}'`;
    }

    if (year) sql += ` AND races.year='${year}'`;
    if (round) {
      sql += ` AND races.round='${round}'`;
    } else {
      if (driverStandings || constructorStandings) {
        if (year) {
          sql += ` AND races.round=(SELECT MAX(round) FROM races WHERE races.year='${year}')`;
        } else {
          sql +=
            " AND (races.year, races.round) IN (SELECT year, MAX(round) FROM races GROUP BY year)";
        }
      }
    }
    sql += ` ORDER BY drivers.surname LIMIT ${offset}, ${limit}`;
  }
  return sql;
}

module.exports = {
  createDriverSqlQuery,
};
