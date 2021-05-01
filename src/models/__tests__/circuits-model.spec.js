const circuitsModel = require("../circuits-model");

describe("Circuits model", () => {
  test("circuits-model is an object.", () => {
    expect(typeof circuitsModel).toBe("object");
  });

  describe("circuits-model.circuitsSelectQueryBase", () => {
    test("circuitsSelectQueryBase() returns the expected string.", () => {
      const { circuitsSelectQueryBase } = circuitsModel;
      // 'circuitsSelectQueryBase' is a function
      expect(typeof circuitsSelectQueryBase).toBe("function");
      // The function returns a string
      const result = circuitsSelectQueryBase();
      expect(result).toBe(
        "SELECT DISTINCT circuits.circuitRef, circuits.name, circuits.location, circuits.country, circuits.lat, circuits.lng, circuits.alt, circuits.url FROM circuits"
      );
    });
  });

  describe("circuits-model.includeRacesTable", () => {
    // Function under test
    const { includeRacesTable } = circuitsModel;

    test("includeRacesTable is a function.", () => {
      // 'includeRacesTable' is a function
      expect(typeof includeRacesTable).toBe("function");
    });

    test("includeRacesTable() returns an empty string.", () => {
      const result = includeRacesTable();
      expect(result).toBe("");
    });

    test("includeRacesTable([null]) returns an empty string.", () => {
      const test_params = [null];
      const result = includeRacesTable(test_params);
      expect(result).toBe("");
    });

    test("includeRacesTable([1]) returns the ', races' string.", () => {
      const test_params = [1];
      const result = includeRacesTable(test_params);
      expect(result).toBe(", races");
    });
  });

  describe("circuits-model.includeResultsTable", () => {
    // Function under test
    const { includeResultsTable } = circuitsModel;

    test("includeResultsTable is a function.", () => {
      // 'includeResultsTable' is a function
      expect(typeof includeResultsTable).toBe("function");
    });

    test("includeResultsTable() returns an empty string.", () => {
      const result = includeResultsTable();
      expect(result).toBe("");
    });

    test("includeResultsTable([null, null]) returns an empty string.", () => {
      const test_params = [null, null];
      const result = includeResultsTable(test_params);
      expect(result).toBe("");
    });

    test("includeResultsTable([null, 1]) returns the ', results' string.", () => {
      const test_params = [null, 1];
      const result = includeResultsTable(test_params);
      expect(result).toBe(", results");
    });
  });

  describe("circuits-model.includeDriversTable", () => {
    // Function under test
    const { includeDriversTable } = circuitsModel;

    test("includeDriversTable is a function.", () => {
      // 'includeDriversTable' is a function
      expect(typeof includeDriversTable).toBe("function");
    });

    test("includeDriversTable() returns an empty string.", () => {
      const result = includeDriversTable();
      expect(result).toBe("");
    });

    test("includeDriversTable(null) returns an empty string.", () => {
      const test_params = null;
      const result = includeDriversTable(test_params);
      expect(result).toBe("");
    });

    test("includeDriversTable(1) returns the ', drivers' string.", () => {
      const test_params = 1;
      const result = includeDriversTable(test_params);
      expect(result).toBe(", drivers");
    });
  });

  describe("circuits-model.includeConstructorsTable", () => {
    // Function under test
    const { includeConstructorsTable } = circuitsModel;

    test("includeConstructorsTable is a function.", () => {
      // 'includeConstructorsTable' is a function
      expect(typeof includeConstructorsTable).toBe("function");
    });

    test("includeConstructorsTable() returns an empty string.", () => {
      const result = includeConstructorsTable();
      expect(result).toBe("");
    });

    test("includeConstructorsTable(null) returns an empty string.", () => {
      const test_params = null;
      const result = includeConstructorsTable(test_params);
      expect(result).toBe("");
    });

    test("includeConstructorsTable(1) returns the ', constructors' string.", () => {
      const test_params = 1;
      const result = includeConstructorsTable(test_params);
      expect(result).toBe(", constructors");
    });
  });

  describe("circuits-model.includeWhereTrueClause", () => {
    test("includeWhereTrueClause is a function that returns an expected string.", () => {
      // Function under test
      const { includeWhereTrueClause } = circuitsModel;
      expect(typeof includeWhereTrueClause).toBe("function");
      // The function returns an expected string " WHERE TRUE"
      const result = includeWhereTrueClause();
      expect(result).toBe(" WHERE TRUE");
    });
  });

  describe("circuits-model.andRacesCircuitsJoinClause", () => {
    // Function under test
    const { andRacesCircuitsJoinClause } = circuitsModel;

    test("andRacesCircuitsJoinClause is a function.", () => {
      // 'andRacesCircuitsJoinClause' is a function
      expect(typeof andRacesCircuitsJoinClause).toBe("function");
    });

    test("andRacesCircuitsJoinClause() returns an empty string.", () => {
      const result = andRacesCircuitsJoinClause();
      expect(result).toBe("");
    });

    test("andRacesCircuitsJoinClause([null, null]) returns an empty string.", () => {
      const test_params = [null, null];
      const result = andRacesCircuitsJoinClause(test_params);
      expect(result).toBe("");
    });

    test("andRacesCircuitsJoinClause([null, 1]) returns the ' AND races.circuitId=circuits.circuitId' string.", () => {
      const test_params = [null, 1];
      const result = andRacesCircuitsJoinClause(test_params);
      expect(result).toBe(" AND races.circuitId=circuits.circuitId");
    });
  });

  describe("circuits-model.andCircuitsRefClause", () => {
    // Function under test
    const { andCircuitsRefClause } = circuitsModel;

    test("andCircuitsRefClause is a function.", () => {
      // 'andCircuitsRefClause' is a function
      expect(typeof andCircuitsRefClause).toBe("function");
    });

    test("andCircuitsRefClause() returns an empty string.", () => {
      const result = andCircuitsRefClause();
      expect(result).toBe("");
    });

    test("andCircuitsRefClause(null) returns an empty string.", () => {
      const test_params = null;
      const result = andCircuitsRefClause(test_params);
      expect(result).toBe("");
    });

    test("andCircuitsRefClause(123) returns the ` AND circuits.circuitRef='123'` string.", () => {
      const test_params = 123;
      const result = andCircuitsRefClause(test_params);
      expect(result).toBe(" AND circuits.circuitRef='123'");
    });
  });

  describe("circuits-model.andResultsRacesJoinClause", () => {
    // Function under test
    const { andResultsRacesJoinClause } = circuitsModel;

    test("andResultsRacesJoinClause is a function.", () => {
      // 'andResultsRacesJoinClause' is a function
      expect(typeof andResultsRacesJoinClause).toBe("function");
    });

    test("andResultsRacesJoinClause() returns an empty string.", () => {
      const result = andResultsRacesJoinClause();
      expect(result).toBe("");
    });

    test("andResultsRacesJoinClause(null) returns an empty string.", () => {
      const test_params = null;
      const result = andResultsRacesJoinClause(test_params);
      expect(result).toBe("");
    });

    test("andResultsRacesJoinClause([null,1]) returns the ' AND results.raceId=races.raceId' string.", () => {
      const test_params = [null, 1];
      const result = andResultsRacesJoinClause(test_params);
      expect(result).toBe(" AND results.raceId=races.raceId");
    });
  });

  describe("circuits-model.andResultsConstructorsJoinClause", () => {
    // Function under test
    const { andResultsConstructorsJoinClause } = circuitsModel;

    test("andResultsConstructorsJoinClause is a function.", () => {
      // 'andResultsConstructorsJoinClause' is a function
      expect(typeof andResultsConstructorsJoinClause).toBe("function");
    });

    test("andResultsConstructorsJoinClause() returns an empty string.", () => {
      const result = andResultsConstructorsJoinClause();
      expect(result).toBe("");
    });

    test("andResultsConstructorsJoinClause(null) returns an empty string.", () => {
      const test_params = null;
      const result = andResultsConstructorsJoinClause(test_params);
      expect(result).toBe("");
    });

    test("andResultsConstructorsJoinClause(123) returns the ` AND results.constructorId=constructors.constructorId AND constructors.constructorRef='123'` string.", () => {
      const test_params = 123;
      const result = andResultsConstructorsJoinClause(test_params);
      expect(result).toBe(
        ` AND results.constructorId=constructors.constructorId AND constructors.constructorRef='${test_params}'`
      );
    });
  });

  describe("circuits-model.andResultsDriversJoinClause", () => {
    // Function under test
    const { andResultsDriversJoinClause } = circuitsModel;

    test("andResultsDriversJoinClause is a function.", () => {
      // 'andResultsDriversJoinClause' is a function
      expect(typeof andResultsDriversJoinClause).toBe("function");
    });

    test("andResultsDriversJoinClause() returns an empty string.", () => {
      const result = andResultsDriversJoinClause();
      expect(result).toBe("");
    });

    test("andResultsDriversJoinClause(null) returns an empty string.", () => {
      const test_params = null;
      const result = andResultsDriversJoinClause(test_params);
      expect(result).toBe("");
    });

    test("andResultsDriversJoinClause(123) returns the ` AND results.driverId=drivers.driverId AND drivers.driverRef='123'` string.", () => {
      const test_params = 123;
      const result = andResultsDriversJoinClause(test_params);
      expect(result).toBe(
        ` AND results.driverId=drivers.driverId AND drivers.driverRef='${test_params}'`
      );
    });
  });

  describe("circuits-model.andResultsStatusClause", () => {
    // Function under test
    const { andResultsStatusClause } = circuitsModel;

    test("andResultsStatusClause is a function.", () => {
      // 'andResultsStatusClause' is a function
      expect(typeof andResultsStatusClause).toBe("function");
    });

    test("andResultsStatusClause() returns an empty string.", () => {
      const result = andResultsStatusClause();
      expect(result).toBe("");
    });

    test("andResultsStatusClause(null) returns an empty string.", () => {
      const test_params = null;
      const result = andResultsStatusClause(test_params);
      expect(result).toBe("");
    });

    test("andResultsStatusClause(123) returns the ` AND results.statusId='123'` string.", () => {
      const test_params = 123;
      const result = andResultsStatusClause(test_params);
      expect(result).toBe(` AND results.statusId='${test_params}'`);
    });
  });

  describe("circuits-model.andResultsGridClause", () => {
    // Function under test
    const { andResultsGridClause } = circuitsModel;

    test("andResultsGridClause is a function.", () => {
      // 'andResultsGridClause' is a function
      expect(typeof andResultsGridClause).toBe("function");
    });

    test("andResultsGridClause() returns an empty string.", () => {
      const result = andResultsGridClause();
      expect(result).toBe("");
    });

    test("andResultsGridClause(null) returns an empty string.", () => {
      const test_params = null;
      const result = andResultsGridClause(test_params);
      expect(result).toBe("");
    });

    test("andResultsGridClause(123) returns the ` AND results.grid='123'` string.", () => {
      const test_params = 123;
      const result = andResultsGridClause(test_params);
      expect(result).toBe(` AND results.grid='${test_params}'`);
    });
  });

  describe("circuits-model.andResultsRankClause", () => {
    // Function under test
    const { andResultsRankClause } = circuitsModel;

    test("andResultsRankClause is a function.", () => {
      // 'andResultsRankClause' is a function
      expect(typeof andResultsRankClause).toBe("function");
    });

    test("andResultsRankClause() returns an empty string.", () => {
      const result = andResultsRankClause();
      expect(result).toBe("");
    });

    test("andResultsRankClause(null) returns an empty string.", () => {
      const test_params = null;
      const result = andResultsRankClause(test_params);
      expect(result).toBe("");
    });

    test("andResultsRankClause(3) returns the ` AND results.rank='3'` string.", () => {
      const test_params = 3;
      const result = andResultsRankClause(test_params);
      expect(result).toBe(` AND results.rank='${test_params}'`);
    });
  });

  describe("circuits-model.andResultsPositionClause", () => {
    // Function under test
    const { andResultsPositionClause } = circuitsModel;

    test("andResultsPositionClause is a function.", () => {
      // 'andResultsPositionClause' is a function
      expect(typeof andResultsPositionClause).toBe("function");
    });

    test("andResultsPositionClause() returns an empty string.", () => {
      const result = andResultsPositionClause();
      expect(result).toBe("");
    });

    test("andResultsPositionClause(null) returns an empty string.", () => {
      const test_params = null;
      const result = andResultsPositionClause(test_params);
      expect(result).toBe("");
    });

    test("andResultsPositionClause(1) returns the ` AND results.positionText='1'` string.", () => {
      const test_params = 1;
      const result = andResultsPositionClause(test_params);
      expect(result).toBe(` AND results.positionText='${test_params}'`);
    });
  });

  describe("circuits-model.andRacesYearClause", () => {
    // Function under test
    const { andRacesYearClause } = circuitsModel;

    test("andRacesYearClause is a function.", () => {
      // 'andRacesYearClause' is a function
      expect(typeof andRacesYearClause).toBe("function");
    });

    test("andRacesYearClause() returns an empty string.", () => {
      const result = andRacesYearClause();
      expect(result).toBe("");
    });

    test("andRacesYearClause(null) returns an empty string.", () => {
      const test_params = null;
      const result = andRacesYearClause(test_params);
      expect(result).toBe("");
    });

    test("andRacesYearClause(1984) returns the ` AND races.year=='1984'` string.", () => {
      const test_params = 1984;
      const result = andRacesYearClause(test_params);
      expect(result).toBe(` AND races.year='${test_params}'`);
    });
  });

  describe("circuits-model.andRacesRoundClause", () => {
    // Function under test
    const { andRacesRoundClause } = circuitsModel;

    test("andRacesRoundClause is a function.", () => {
      // 'andRacesRoundClause' is a function
      expect(typeof andRacesRoundClause).toBe("function");
    });

    test("andRacesRoundClause() returns an empty string.", () => {
      const result = andRacesRoundClause();
      expect(result).toBe("");
    });

    test("andRacesRoundClause(null) returns an empty string.", () => {
      const test_params = null;
      const result = andRacesRoundClause(test_params);
      expect(result).toBe("");
    });

    test("andRacesRoundClause(10) returns the ` AND races.year=='10'` string.", () => {
      const test_params = 10;
      const result = andRacesRoundClause(test_params);
      expect(result).toBe(` AND races.round='${test_params}'`);
    });
  });

  describe("circuits-model.orderByCircuitsRefLimitClause", () => {
    // Function under test
    const { orderByCircuitsRefLimitClause } = circuitsModel;

    test("orderByCircuitsRefLimitClause is a function.", () => {
      // 'orderByCircuitsRefLimitClause' is a function
      expect(typeof orderByCircuitsRefLimitClause).toBe("function");
    });

    test("orderByCircuitsRefLimitClause() returns an empty string.", () => {
      const result = orderByCircuitsRefLimitClause();
      expect(result).toBe("");
    });

    test("orderByCircuitsRefLimitClause(null, null) returns an empty string.", () => {
      const test_params = null;
      const result = orderByCircuitsRefLimitClause(test_params);
      expect(result).toBe("");
    });

    test("orderByCircuitsRefLimitClause(10, 20) returns the ` ORDER BY circuits.circuitRef LIMIT 10, 20` string.", () => {
      const test_params = [10, 20];
      const result = orderByCircuitsRefLimitClause(
        test_params[0],
        test_params[1]
      );
      expect(result).toBe(
        ` ORDER BY circuits.circuitRef LIMIT ${test_params[0]}, ${test_params[1]}`
      );
    });
  });

  describe("circuits-model.createCircuitsSqlQuery", () => {
    // Function under test
    const { createCircuitsSqlQuery } = circuitsModel;

    test("createCircuitsSqlQuery is a function.", () => {
      // 'createCircuitsSqlQuery' is a function
      expect(typeof createCircuitsSqlQuery).toBe("function");
    });

    test("createCircuitsSqlQuery() returns an empty string.", () => {
      const result = createCircuitsSqlQuery();
      expect(result).toBe("");
    });

    test("createCircuitsSqlQuery(null) returns an empty string.", () => {
      const test_params = null;
      const result = createCircuitsSqlQuery(test_params);
      expect(result).toBe("");
    });

    test("createCircuitsSqlQuery(object, 10, 20) returns an expected SQL string.", () => {
      const dummy = {
        circuit: 1,
        constructor: 2,
        driver: 3,
        fastest: null,
        grid: null,
        position: null,
        rank: 4,
        result: null,
        round: null,
        status: null,
        year: 1984,
      };
      const test_params = [dummy, 10, 20];
      const result = createCircuitsSqlQuery(...test_params);
      expect(result).toBe(
        `SELECT DISTINCT circuits.circuitRef, circuits.name, circuits.location, circuits.country, circuits.lat, circuits.lng, circuits.alt, circuits.url FROM circuits, races, results, drivers, constructors WHERE TRUE AND races.circuitId=circuits.circuitId AND circuits.circuitRef='1' AND results.raceId=races.raceId AND results.constructorId=constructors.constructorId AND constructors.constructorRef='2' AND results.driverId=drivers.driverId AND drivers.driverRef='3' AND races.year='1984' ORDER BY circuits.circuitRef LIMIT 10, 20`
      );
    });
  });
});
