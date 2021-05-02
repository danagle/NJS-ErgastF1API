const express = require("express");
const router = express.Router();
const path = require("path");

let MySQLConfiguration = require("../connection.js");

const { parseRequestParams } = require("./shared-functions.js");
7;

//Supported Function
function formattedConstructorStandings(row) {
  return {
    position: row.position.toString(),
    positionText: row.positionText,
    points: row.points.toString(),
    wins: row.wins.toString(),
    Constructor: {
      constructorId: row.constructorRef,
      url: row.url,
      name: row.name,
      nationality: row.nationality,
    },
  };
}

function heading(row) {
  return {
    season: row.year.toString(),
    round: row.round.toString(),
    ConstructorStandings: [formattedConstructorStandings(row)],
  };
}

function formattedStandings(rows) {
  let currentYear = 0;
  let ConstructorStandings = [];

  rows.forEach((row) => {
    if (row.year != currentYear) {
      currentYear = row.year;
      ConstructorStandings.push(heading(row));
      //console.log(currentYear);
    } else {
      ConstructorStandings[
        ConstructorStandings.length - 1
      ].ConstructorStandings.push(formattedConstructorStandings(row));
    }
  });
  return ConstructorStandings;
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
    driver ||
    driverStandings ||
    circuit ||
    grid ||
    fastest ||
    result ||
    status
  ) {
    res
      .status(400)
      .send("Bad Request: The qualifiers specified are not supported.")
      .end();
    return;
  }

  let sql = `SELECT constructors.constructorRef, constructors.name, constructors.nationality, constructors.url, constructorStandings.points,
                constructorStandings.position, constructorStandings.positionText, constructorStandings.wins, races.year, races.round
                FROM constructors, constructorStandings, races
                WHERE constructorStandings.raceId=races.raceId AND constructorStandings.constructorId=constructors.constructorId`;

  if (constructorStandings)
    sql += ` AND constructorStandings.positionText='${constructorStandings}'`;
  if (constructor) sql += ` AND constructors.constructorRef='${constructor}'`;
  if (year) sql += ` AND races.year='${year}'`;
  if (round) {
    sql += ` AND races.round='${round}'`;
  } else {
    if (year)
      sql += ` AND races.round=(SELECT MAX(round) FROM driverStandings, races WHERE driverStandings.raceId=races.raceId AND races.year='${year}')`;
    else
      sql +=
        " AND (races.year, races.round) IN (SELECT year, MAX(round) FROM races GROUP BY year)";
  }

  sql += ` ORDER BY races.year, constructorStandings.position LIMIT ${offset}, ${limit}`;

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
        StandingsTable: {},
      },
    };

    if (constructor) json.MRData.StandingsTable.constructorId = constructor;
    if (year) json.MRData.StandingsTable.season = year;
    if (round) json.MRData.StandingsTable.round = round;
    if (constructorStandings)
      json.MRData.StandingsTable.constructorStandings = constructorStandings;

    json.MRData.StandingsTable.StandingsLists = formattedStandings(rows);
    res.json(json);
  });
});
module.exports = router;
