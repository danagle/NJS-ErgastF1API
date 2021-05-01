const express = require("express");
const router = express.Router();
const path = require("path");

let MySQLConfiguration = require("../connection.js");

const { createCircuitsSqlQuery } = require("../models/circuits-model");

//Supported Function
function formattedCircuits(row) {
  const circuits = row.map((row) => {
    return {
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
    };
  });
  return circuits;
}

// /drivers
router.get("", (req, res) => {
  let offset =
    typeof req.query.offset != "undefined" ? parseInt(req.query.offset) : 0;
  let limit =
    typeof req.query.limit != "undefined"
      ? parseInt(req.query.limit)
      : MySQLConfiguration.defaultLimit();

  //START
  let {
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
  } = req.query;

  // If the 'constructor' key isn't defined then the request object's constructor will be returned instead
  if (typeof constructor == "function") {
    constructor = null;
  }

  if (year == "current") {
    year = new Date().getFullYear().toString();
  }

  if (driverStandings || constructorStandings) {
    res
      .status(400)
      .send("Bad Request: Circuit queries do not support standings qualifiers.")
      .end();
    return;
  }

  const params = {
    circuit,
    constructor,
    driver,
    fastest,
    grid,
    result,
    round,
    status,
    year,
  };

  sql = createCircuitsSqlQuery(params, offset, limit);

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
        CircuitTable: {},
      },
    };

    if (circuit) json.MRData.CircuitTable.circuitId = circuit;
    if (driver) json.MRData.CircuitTable.driverId = driver;
    if (constructor) json.MRData.CircuitTable.constructorId = constructor;
    if (grid) json.MRData.CircuitTable.grid = grid;
    if (result) json.MRData.CircuitTable.result = result;
    if (fastest) json.MRData.CircuitTable.fastest = fastest;
    if (status) json.MRData.CircuitTable.status = status;
    if (year) json.MRData.CircuitTable.season = year;
    if (round) json.MRData.CircuitTable.round = round;

    json.MRData.CircuitTable.Circuits = formattedCircuits(rows);
    res.json(json);
  });
});
module.exports = router;
