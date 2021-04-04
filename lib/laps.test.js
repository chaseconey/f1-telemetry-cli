const { trackLapData } = require("./laps");
const _ = require("lodash");

test("merges in new data", () => {
  const packet = {
    m_header: { m_sessionUID: "123" },
    m_lapData: [
      { first: true, id: 1 },
      { first: false, id: 2 },
    ],
  };
  const raceData = {
    sessionId: "123",
    data: [
      { lap_data: { old: true, id: 1 } },
      { lap_data: { old: true, id: 2 } },
      { lap_data: { shouldStay: true, id: 3 } },
    ],
  };

  const tracked = trackLapData(packet, raceData);

  const expected = {
    sessionId: "123",
    data: [
      { lap_data: { first: true, id: 1 } },
      { lap_data: { first: false, id: 2 } },
      { lap_data: { shouldStay: true, id: 3 } },
    ],
  };

  expect(tracked).toStrictEqual(expected);
});

test("doesn't track tire on no change in fastest lap", () => {
  let carStatus = {};
  const packet = {
    m_header: { m_sessionUID: "123" },
    m_lapData: [{ m_bestLapTime: 0 }],
  };
  const raceData = {
    sessionId: "123",
    data: [{ lap_data: { m_bestLapTime: 0 } }],
  };
  _.set(carStatus, ["m_carStatusData", 0, "m_tyreVisualCompound"], 16);

  const tracked = trackLapData(packet, raceData, carStatus);

  const expected = {
    sessionId: "123",
    data: [{ lap_data: { m_bestLapTime: 0 } }],
  };

  expect(tracked).toStrictEqual(expected);
});

test("tracks fastest lap", () => {
  let carStatus = {};
  const packet = {
    m_header: { m_sessionUID: "123" },
    m_lapData: [{ m_bestLapTime: 100 }],
  };
  const raceData = {
    sessionId: "123",
    data: [{ lap_data: { m_bestLapTime: 0 } }],
  };
  _.set(carStatus, ["m_carStatusData", 0, "m_tyreVisualCompound"], 16);

  const tracked = trackLapData(packet, raceData, carStatus);

  const expected = {
    sessionId: "123",
    data: [{ lap_data: { m_bestLapTime: 100 }, custom: { bestLapTyre: 16 } }],
  };

  expect(tracked).toStrictEqual(expected);
});
