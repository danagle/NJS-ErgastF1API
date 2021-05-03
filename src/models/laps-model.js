function createLapsSqlQuery(paramsObj, offset, limit) {
  let sqlQuery = "";
  if (paramsObj) {
    sqlQuery = `SELECT races.year, races.round, races.name, DATE_FORMAT(races.date, '%Y-%m-%d') AS 'date', DATE_FORMAT(races.time, '%H:%i:%S') AS 'raceTime', races.url, 
    circuits.*, drivers.driverRef, lapTimes.lap, lapTimes.position, lapTimes.time 
    FROM lapTimes, races, circuits, drivers
    WHERE races.circuitId=circuits.circuitId AND lapTimes.driverId=drivers.driverId AND lapTimes.raceId=races.raceId AND races.year='${year}' AND races.round='${round}'`;

    if (driver) sqlQuery += ` AND drivers.driverRef='${driver}'`;
    if (laps) sqlQuery += ` AND lapTimes.lap='${laps}'`;
    sqlQuery += ` ORDER BY lapTimes.lap, lapTimes.position LIMIT ${offset}, ${limit}`;
  }
  return sqlQuery;
}

module.exports = { createLapsSqlQuery };
