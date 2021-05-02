const express = require("express");
const router = express.Router();
const path = require("path");

let MySQLConfiguration = require("../connection.js");

const { parseRequestParams } = require("./shared-functions.js");

//Supported Function

function formattedDriverStandings(row) {
  return {
    position: row.position.toString(),
    positionText: row.positionText,
    points: row.points.toString(),
    wins: row.wins.toString(),
    Driver: {
      driverId: row.driverRef,
      permanentNumber: row.number != null ? row.number.toString() : "",
      code: row.code != null ? row.code : "",
      url: row.url,
      givenName: row.forename,
      familyName: row.surname,
      dateOfBirth: row.dob,
      nationality: row.nationality,
    },
  };
}

function heading(row) {
  return {
    season: row.year.toString(),
    round: row.round.toString(),
    DriverStandings: [formattedDriverStandings(row)],
  };
}

function formattedStandings(rows) {
  let currentYear = 0;
  let DriverStandings = [];

  rows.forEach((row) => {
    if (row.year != currentYear) {
      currentYear = row.year;
      DriverStandings.push(heading(row));
      //console.log(currentYear);
    } else {
      DriverStandings[DriverStandings.length - 1].DriverStandings.push(
        formattedDriverStandings(row)
      );
    }
  });
  return DriverStandings;
}

function getConstructors(year, round, driverId, callback) {
  let sql = `SELECT DISTINCT c.constructorRef, c.name, c.nationality, c.url 
                FROM constructors c, results re, races ra, drivers d
                WHERE re.raceId=ra.raceId  AND c.constructorId=re.constructorId AND ra.year=${year} AND ra.round<=${round} AND re.driverId=d.driverId AND d.driverRef='${driverId}';`;
  const conn = MySQLConfiguration.getMySQLConnection();
  let constructors = [];
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
    rows.forEach((row) => {
      constructors.push({
        constructorId: row.constructorRef,
        url: row.url,
        name: row.name,
        nationality: row.nationality,
      });
    });
    return callback(constructors);
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

  if (
    constructor ||
    constructorStandings ||
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

  let sql = `SELECT DISTINCT drivers.driverId, drivers.driverRef, drivers.number, drivers.code, drivers.forename, drivers.surname, DATE_FORMAT(drivers.dob, '%Y-%m-%d') AS 'dob', drivers.nationality,
                drivers.url, driverStandings.points, driverStandings.position, driverStandings.positionText, driverStandings.wins, races.year, races.round
                FROM drivers, driverStandings, races
                WHERE driverStandings.raceId=races.raceId AND driverStandings.driverId=drivers.driverId`;

  if (driverStandings)
    sql += ` AND driverStandings.positionText='${driverStandings}'`;
  if (driver) sql += ` AND drivers.driverRef='${driver}'`;
  if (year) sql += ` AND races.year='${year}'`;
  if (round) {
    sql += ` AND races.round='${round}'`;
  } else {
    if (year) {
      sql += ` AND races.round=(SELECT MAX(round) FROM driverStandings, races WHERE driverStandings.raceId=races.raceId AND races.year='${year}')`;
    } else {
      sql +=
        " AND (races.year, races.round) IN (SELECT year, MAX(round) FROM races GROUP BY year)";
    }
  }

  sql += ` ORDER BY races.year, driverStandings.position LIMIT ${offset}, ${limit}`;

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

    if (driver) json.MRData.StandingsTable.driverId = driver;
    if (year) json.MRData.StandingsTable.season = year;
    if (round) json.MRData.StandingsTable.round = round;
    if (driverStandings)
      json.MRData.StandingsTable.driverStandings = driverStandings;

    json.MRData.StandingsTable.StandingsLists = formattedStandings(rows);
    res.json(json);
  });
});
/*json.MRData.StandingsTable.StandingsLists[0].DriverStandings.forEach(driver => {
                let year = json.MRData.StandingsTable.StandingsLists[0].season;
                let round = json.MRData.StandingsTable.StandingsLists[0].round;
                //driver.Constructor = getConstructors(year,round,driver.Driver.driverId);
                getConstructors(year,round,driver.Driver.driverId,function(result){
                    driver.Constructors = result;
                });
                console.log(driver);
            });*/
module.exports = router;
