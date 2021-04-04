const { mergeData } = require("./utils");
const _ = require("lodash");

test("merges in new data", () => {
  const toMerge = [
    { first: true, id: 1 },
    { first: false, id: 2 },
  ];
  const raceData = {};

  const tracked = mergeData(raceData, toMerge, "the_key");

  const expected = {
    data: [
      { the_key: { first: true, id: 1 } },
      { the_key: { first: false, id: 2 } },
    ],
  };

  expect(tracked).toStrictEqual(expected);
});

test("merges in new data with existing data", () => {
  const toMerge = [
    { first: true, id: 1 },
    { first: false, id: 2 },
  ];
  const raceData = {
    sessionId: "123",
    data: [
      { the_key: { old: true, id: 1 } },
      { the_key: { old: true, id: 2 } },
      { the_key: { shouldStay: true, id: 3 } },
    ],
  };

  const tracked = mergeData(raceData, toMerge, "the_key");

  const expected = {
    sessionId: "123",
    data: [
      { the_key: { first: true, id: 1 } },
      { the_key: { first: false, id: 2 } },
      { the_key: { shouldStay: true, id: 3 } },
    ],
  };

  expect(tracked).toStrictEqual(expected);
});
