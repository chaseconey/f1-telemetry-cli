const { trackParticipants } = require("./participants");

test("merges in new data", () => {
  const packet = {
    m_header: { m_sessionUID: "123" },
    m_participants: [
      { new: true, id: 1 },
      { new: true, id: 2 },
    ],
  };
  const raceData = {
    sessionId: "123",
    data: [
      { driver: { old: true, id: 1 } },
      { driver: { old: true, id: 2 } },
      { driver: { shouldStay: true, id: 3 } },
    ],
  };

  const tracked = trackParticipants(packet, raceData);

  const expected = {
    sessionId: "123",
    data: [
      { driver: { new: true, id: 1 } },
      { driver: { new: true, id: 2 } },
      { driver: { shouldStay: true, id: 3 } },
    ],
  };

  expect(tracked).toStrictEqual(expected);
});
