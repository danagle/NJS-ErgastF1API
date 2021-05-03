const express = require("express");
const router = express.Router();
const path = require("path");

let MySQLConfiguration = require("../connection.js");

const { createLapsSqlQuery } = require("../models/laps-model");
const { parseRequestParams } = require("./shared-functions.js");

//Supported Function
function formattedRaces(rows) {
  return {
    season: rows[0].year.toString(),
    round: rows[0].round.toString(),
    url: rows[0].url,
    raceName: rows[0].name,
    Circuit: {
      circuitId: rows[0].circuitRef,
      url: rows[0].circuitUrl,
      circuitName: rows[0].circuitName,
      Location: {
        lat: rows[0].lat.toString(),
        long: rows[0].lng.toString(),
        alt: rows[0].alt != null ? rows[0].alt.toString() : "N/D",
        locality: rows[0].location,
        country: rows[0].country,
      },
    },
    date: rows[0].date,
    time: rows[0].raceTime + "Z",
    Laps: formattedLaps(rows),
  };
}

function formattedLaps(rows) {
  let Laps = [];
  let currentLap = 0;
  rows.forEach((element) => {
    if (element.lap != currentLap) {
      let t = {
        number: element.lap.toString(),
        Timings: formattedTiming(rows, element.lap),
      };
      Laps.push(t);
      currentLap = element.lap;
    }
  });

  return Laps;
}

function formattedTiming(rows, lap) {
  let timing = [];

  rows.forEach((element) => {
    if (element.lap == lap) {
      let t = {
        driverId: element.driverRef,
        position: element.position.toString(),
        time: element.time,
      };
      timing.push(t);
    }
  });
  return timing;
}

router.get("", (req, res) => {
  // Parse the request parameters
  let { driver, laps, limit, offset, round, sql, year } = parseRequestParams(
    req,
    MySQLConfiguration.defaultLimit()
  );

  if (driverStandings || constructorStandings) {
    res
      .status(400)
      .send(
        "Bad Request: Lap time queries do not support standings qualifiers."
      )
      .end();
    return;
  }
  if (circuit || grid || fastest || result || status || constructor) {
    res
      .status(400)
      .send(
        "Bad Request: Lap time queries do not support the specified qualifiers."
      )
      .end();
    return;
  }
  if (!year || !round) {
    res
      .status(400)
      .send(
        "Bad Request: Lap time queries require a season and round to be specified."
      )
      .end();
    return;
  }

  // Prepare the SQL query
  const params = {
    driver,
    laps,
    round,
    year,
  };

  const sqlQuery = createLapsSqlQuery(params, offset, limit);

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
        RaceTable: {
          season: year,
          round: round,
        },
      },
    };

    if (driver) json.MRData.RaceTable.driverId = driver;
    if (laps) json.MRData.RaceTable.lap = laps;
    if (rows.length > 0) json.MRData.RaceTable.Races = [formattedRaces(rows)];
    else json.MRData.RaceTable.Races = [];
    res.json(json);
  });
});
module.exports = router;
