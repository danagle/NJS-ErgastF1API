const express = require("express");
const router = express.Router();
const path = require("path");

let MySQLConfiguration = require("../connection.js");

const { createDriverSqlQuery } = require("../models/drivers-model.js");
const { parseRequestParams } = require("./shared-functions.js");

//Supported Function
function formattedDriver(row) {
  const driver = row.map((row) => {
    return {
      driverId: row.driverRef,
      permanentNumber: row.number != null ? row.number.toString() : "",
      code: row.code != null ? row.code : "",
      url: row.url,
      givenName: row.forename,
      familyName: row.surname,
      dateOfBirth: row.date,
      nationality: row.nationality,
    };
  });
  return driver;
}

// /drivers
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
    (circuit || grid || result || status)
  ) {
    res
      .status(400)
      .send(
        "Bad Request: Cannot combine standings with circuit, grid, result or status qualifiers."
      )
      .end();
    return;
  }

  const params = {
    circuit,
    constructor,
    constructorStandings,
    driver,
    driverStandings,
    fastest,
    grid,
    result,
    round,
    status,
    year,
  };

  sql = createDriverSqlQuery(params, offset, limit);

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
        DriverTable: {},
      },
    };

    if (circuit) json.MRData.DriverTable.circuitId = circuit;
    if (driver) json.MRData.DriverTable.driverId = driver;
    if (constructor) json.MRData.DriverTable.constructorId = constructor;
    if (grid) json.MRData.DriverTable.grid = grid;
    if (result) json.MRData.DriverTable.result = result;
    if (fastest) json.MRData.DriverTable.fastest = fastest;
    if (status) json.MRData.DriverTable.status = status;
    if (year) json.MRData.DriverTable.season = year;
    if (round) json.MRData.DriverTable.round = round;
    if (constructorStandings)
      json.MRData.DriverTable.constructorStandings = constructorStandings;
    if (driverStandings)
      json.MRData.DriverTable.driverStandings = driverStandings;

    json.MRData.DriverTable.Drivers = formattedDriver(rows);
    res.json(json);
  });
});
module.exports = router;
