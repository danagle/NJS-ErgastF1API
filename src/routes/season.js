const express = require("express");
const router = express.Router();
const path = require("path");

let MySQLConfiguration = require("../connection.js");

const { parseRequestParams } = require("./shared-functions.js");

//Supported Function
function formattedSeasons(row) {
  const status = row.map((row) => {
    return {
      season: row.year.toString(),
      url: row.url,
    };
  });
  return status;
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

  if (
    (driverStandings || constructorStandings) &&
    (circuit || grid || fastest || result || status)
  ) {
    res
      .status(400)
      .send(
        "Bad Request: Cannot combine standings with circuit, grid, result or status qualifiers."
      )
      .end();
    return;
  }

  let sql = "SELECT DISTINCT seasons.year, seasons.url FROM seasons";
  if (driver) sql += ", drivers";
  if (constructor) sql += ", constructors";
  if (driverStandings || constructorStandings) {
    sql += ", races";
    if (driverStandings || driver) sql += ", driverStandings";
    if (constructorStandings || constructor) sql += ", constructorStandings";
  } else {
    if (
      year ||
      circuit ||
      driver ||
      constructor ||
      status ||
      result ||
      grid ||
      fastest
    )
      sql += ", races";
    if (driver || constructor || status || result || grid || fastest)
      sql += ", results";
    if (circuit) sql += ", circuits";
  }
  sql += " WHERE TRUE";

  //Set the join
  if (driverStandings || constructorStandings) {
    sql += " AND seasons.year=races.year";
    if (constructorStandings || constructor)
      sql += " AND constructorStandings.raceId=races.raceId";
    if (constructor)
      sql += ` AND constructorStandings.constructorId=constructors.constructorId AND constructors.constructorRef='${constructor}'`;
    if (constructorStandings)
      sql += ` AND constructorStandings.positionText='${constructorStandings}'`;
    if (driverStandings || driver)
      sql += " AND driverStandings.raceId=races.raceId";
    if (driver)
      sql += ` AND driverStandings.driverId=drivers.driverId AND drivers.driverRef='${driver}'`;
    if (driverStandings)
      sql += ` AND driverStandings.positionText='${driverStandings}'`;
    if (year) sql += ` AND seasons.year='${year}'`;
    if (round) {
      sql += ` AND races.round='${round}'`;
    } else {
      if (year) {
        sql += ` AND races.round=(SELECT MAX(round) FROM races WHERE races.year='${year}')`;
      } else {
        sql +=
          " AND (races.year, races.round) IN (SELECT year, MAX(round) FROM races GROUP BY year)";
      }
    }
  } else {
    if (
      year ||
      circuit ||
      driver ||
      constructor ||
      status ||
      result ||
      grid ||
      fastest
    )
      sql += " AND seasons.year=races.year";
    if (circuit)
      sql += ` AND races.circuitId=circuits.circuitId AND circuits.circuitRef='${circuit}'`;
    if (driver || constructor || status || result || grid || fastest)
      sql += " AND races.raceId=results.raceId";
    if (constructor)
      sql += ` AND results.constructorId=constructors.constructorId AND constructors.constructorRef='${constructor}'`;
    if (driver)
      sql += ` AND results.driverId=drivers.driverId AND drivers.driverRef='${driver}'`;
    if (status) sql += ` AND results.statusId='${status}'`;
    if (grid) sql += ` AND results.grid='${grid}'`;
    if (fastest) sql += ` AND results.rank='${fastest}'`;
    if (result) sql += ` AND results.positionText='${result}'`;
    if (year) sql += ` AND seasons.year='${year}'`;
    if (round) sql += ` AND races.round='${round}'`;
  }
  sql += ` ORDER BY seasons.year LIMIT ${offset}, ${limit}`;

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
        SeasonTable: {},
      },
    };

    if (circuit) json.MRData.SeasonTable.circuitId = circuit;
    if (driver) json.MRData.SeasonTable.driverId = driver;
    if (constructor) json.MRData.SeasonTable.constructorId = constructor;
    if (grid) json.MRData.SeasonTable.grid = grid;
    if (result) json.MRData.SeasonTable.result = result;
    if (fastest) json.MRData.SeasonTable.fastest = fastest;
    if (status) json.MRData.SeasonTable.status = status;
    if (year) json.MRData.SeasonTable.season = year;
    if (round) json.MRData.SeasonTable.round = round;
    if (constructorStandings)
      json.MRData.SeasonTable.constructorStandings = constructorStandings;
    if (driverStandings)
      json.MRData.SeasonTable.driverStandings = driverStandings;

    json.MRData.SeasonTable.Seasons = formattedSeasons(rows);
    res.json(json);
  });
});
module.exports = router;
