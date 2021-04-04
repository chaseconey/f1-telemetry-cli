const { trackFinalClassification } = require("./finalClassification");

test("merges in new data", () => {
  const packet = {
    m_header: { m_sessionUID: "123" },
    m_classificationData: [
      { new: true, id: 1 },
      { new: true, id: 2 },
    ],
  };
  const raceData = {
    sessionId: "123",
    data: [
      { race_data: { old: true, id: 1 } },
      { race_data: { old: true, id: 2 } },
      { race_data: { shouldStay: true, id: 3 } },
    ],
  };

  const tracked = trackFinalClassification(packet, raceData);

  const expected = {
    sessionId: "123",
    data: [
      { race_data: { new: true, id: 1 } },
      { race_data: { new: true, id: 2 } },
      { race_data: { shouldStay: true, id: 3 } },
    ],
  };

  expect(tracked).toStrictEqual(expected);
});
