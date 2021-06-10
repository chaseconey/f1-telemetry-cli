const { get, has, set } = require("lodash");
const { getSessionId, mergeData } = require("./utils");

const { PENALTY_TYPES } = require("../lib/session");

const TRACKED_EVENTS = ["SPTP", "FTLP", "RTMT", "PENA"];

function trackEvents(packet, raceData) {
  const sessionId = getSessionId(packet);

  raceData.sessionId = sessionId;

  // Add new event to indexed vehicle (if applicable)
  if (
    has(packet.m_eventDetails, "vehicleIdx") &&
    TRACKED_EVENTS.includes(packet.m_eventStringCode)
  ) {
    const vehicleIndex = packet.m_eventDetails.vehicleIdx;
    const currentLap = get(
      raceData,
      ["data", vehicleIndex, "lap_data", "m_currentLapNum"],
      0
    );

    // If events exists, grab em
    let events = get(raceData, ["data", vehicleIndex, "events"], []);

    const event = {
      code: packet.m_eventStringCode,
      details: { ...packet.m_eventDetails },
      text: parseEvent(packet.m_eventStringCode, packet.m_eventDetails),
      currentLap,
    };

    if (vehicleIndex in events) {
      events.push(event);
    } else {
      events = [event];
    }

    // Build structure to merge into vehicle indexed array
    const keyedEvents = { [vehicleIndex]: events };

    return mergeData(raceData, keyedEvents, "events");
  }

  return raceData;
}

function parseEvent(code, event) {
  switch (true) {
    case code === "SPTP":
      return `Fastest speed of session ${event.speed}`;
    case code === "FTLP":
      return `New fastest lap of session ${event.lapTime}`;
    case code === "RTMT":
      return `Car retired`;
    case code === "PENA":
      return PENALTY_TYPES[event.penaltyType];

    default:
      return "";
  }
}

module.exports = {
  trackEvents,
};
