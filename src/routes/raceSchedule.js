const express = require("express");
const router = express.Router();
const path = require("path");

let MySQLConfiguration = require("../connection.js");

const { parseRequestParams } = require("./shared-functions.js");

//Supported Function
function formattedRaces(rows) {
  return rows.map((row) => {
    return {
      season: row.year.toString(),
      round: row.round.toString(),
      url: row.url,
      raceName: row.raceName,
      Circuit: {
        circuitId: row.circuitRef,
        url: row.url,
        circuitName: row.name,
        Location: {
          lat: row.lat.toString(),
          long: row.lng.toString(),
          alt: row.alt != null ? row.alt.toString() : "N/D",
          locality: row.location,
          country: row.country,
        },
      },
      date: row.date,
      time: row.time + "Z",
    };
  });
}
router.get("", (req, res) => {
  // Parse the request parameters
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
  } = parseRequestParams(req, MySQLConfiguration.defaultLimit());

  if (driverStandings || constructorStandings) {
    res
      .status(400)
      .send("Bad Request: Race queries do not support standings qualifiers.")
      .end();
    return;
  }

  let sql =
    "SELECT races.year, races.round, races.name AS 'raceName', DATE_FORMAT(races.date, '%Y-%m-%d') AS 'date', DATE_FORMAT(races.time, '%H:%i:%S') AS 'time', races.url AS 'raceURL', circuits.* FROM races, circuits";

  if (driver || constructor || grid || result || status || fastest)
    sql += ", results re";
  if (driver) sql += ", drivers";
  if (constructor) sql += ", constructors";

  sql += " WHERE races.circuitId=circuits.circuitId";
  //Set the join
  if (year) sql += ` AND races.year='${year}'`;
  if (round) sql += ` AND races.round='${round}'`;
  if (circuit) sql += ` AND circuits.circuitRef='${circuit}'`;
  if (driver || constructor || grid || result || status || fastest)
    sql += " AND races.raceId=results.raceId";
  if (constructor)
    sql += ` AND results.constructorId=constructors.constructorId AND constructors.constructorRef='${constructor}'`;
  if (driver)
    sql += ` AND results.driverId=drivers.driverId AND drivers.driverRef='${driver}'`;
  if (status) sql += ` AND results.statusId='${status}'`;
  if (grid) sql += ` AND results.grid='${grid}'`;
  if (fastest) sql += ` AND results.rank='${fastest}'`;
  if (result) sql += ` AND results.positionText='${result}'`;
  sql += ` ORDER BY races.year, races.round LIMIT ${offset}, ${limit}`;

  const conn = MySQLConfiguration.getMySQLConnection();
  conn.query(sql, (err, rows, fields) => {
    if (err) {
      console.log(
        "Failed to query for " +
          __filename.slice(__filename.lastIndexOf(path.sep) + 1) +
          ": " +
          err
      );
      res.status(400).send({ error: err.sqlMessage, sql: err.sql }).end();
      return;
    }
    if (req.query.sql == "true") {
      res.status(200).send(sql).end();
      return;
    }

    let json = {
      MRData: {
        limit: limit.toString(),
        offset: offset.toString(),
        RaceTable: {},
      },
    };

    if (circuit) json.MRData.RaceTable.circuitId = circuit;
    if (driver) json.MRData.RaceTable.driverId = driver;
    if (constructor) json.MRData.RaceTable.constructorId = constructor;
    if (grid) json.MRData.RaceTable.grid = grid;
    if (result) json.MRData.RaceTable.result = result;
    if (fastest) json.MRData.RaceTable.fastest = fastest;
    if (status) json.MRData.RaceTable.status = status;
    if (year) json.MRData.RaceTable.season = year;
    if (round) json.MRData.RaceTable.round = round;
    json.MRData.RaceTable.Races = formattedRaces(rows);
    res.json(json);
  });
});
module.exports = router;
