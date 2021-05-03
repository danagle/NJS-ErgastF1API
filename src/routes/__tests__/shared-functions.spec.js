const moduleUnderTest = require("../shared-functions.js");

describe("Routes Shared Functions", () => {
  test("moduleUnderTest is an object.", () => {
    expect(typeof moduleUnderTest).toBe("object");
  });
});

describe("shared-functions.parseRequestParams", () => {
  // Function under test
  const { parseRequestParams } = moduleUnderTest;

  test("'parseRequestParams' is a function.", () => {
    expect(typeof parseRequestParams).toBe("function");
  });

  test("parseRequestParams() returns an empty object.", () => {
    const result = parseRequestParams();
    expect(typeof result).toBe("object");
    expect(JSON.stringify(result)).toBe(JSON.stringify({}));
  });

  test("The returned object should only contain the expected keys.", () => {
    const emptyQueryObj = { query: { dummy: "value" } };
    const expectedKeys = [
      "circuit",
      "constructor",
      "constructorStandings",
      "driver",
      "driverStandings",
      "fastest",
      "grid",
      "laps",
      "limit",
      "offset",
      "result",
      "round",
      "sql",
      "status",
      "year",
    ];
    const result = parseRequestParams(emptyQueryObj);
    // Result object has the expected number of key values
    expect(Object.keys(result)).toHaveLength(expectedKeys.length);
    // The keys should match the expected list
    expect(Object.keys(result)).toEqual(expect.arrayContaining(expectedKeys));
  });

  test("Expect 'constructor' to be null when key not present in request query params.", () => {
    const emptyQueryObj = { query: {} };
    const result = parseRequestParams(emptyQueryObj);
    // Check the key values
    expect(result.constructor).toBeNull();
  });

  test("Expect 'offset' to be 0 by default.", () => {
    const emptyQueryObj = { query: {} };
    const result = parseRequestParams(emptyQueryObj);
    expect(result.offset).toBe(0);
  });

  test("Expect all other key vanlues to be 'undefined' by default.", () => {
    const emptyQueryObj = { query: {} };
    const result = parseRequestParams(emptyQueryObj);
    expect(result.circuit).toBeUndefined();
    expect(result.constructorStandings).toBeUndefined();
    expect(result.driver).toBeUndefined();
    expect(result.driverStandings).toBeUndefined();
    expect(result.fastest).toBeUndefined();
    expect(result.grid).toBeUndefined();
    expect(result.laps).toBeUndefined();
    expect(result.limit).toBeUndefined();
    expect(result.result).toBeUndefined();
    expect(result.round).toBeUndefined();
    expect(result.sql).toBeUndefined();
    expect(result.status).toBeUndefined();
    expect(result.year).toBeUndefined();
  });

  test("Expect 'defaultLimit' value to be used if defined.", () => {
    const emptyQueryObj = { query: {} };
    const testLimitValue = 5;
    const result = parseRequestParams(emptyQueryObj, testLimitValue);
    expect(result.limit).toBe(testLimitValue);
  });

  test("Expect 'year' to be valid when request query param value is set to 'current'.", () => {
    const emptyQueryObj = { query: { year: "current" } };
    const beforeTest = new Date().getFullYear().toString();
    const result = parseRequestParams(emptyQueryObj);
    const afterTest = new Date().getFullYear().toString();
    expect([beforeTest, afterTest]).toContain(result.year);
  });
});
