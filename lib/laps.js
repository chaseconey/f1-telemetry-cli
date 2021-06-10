const { getSessionId, mergeData } = require("../lib/utils");
const { has, set } = require("lodash");

function trackLapData(packet, raceData, carStatus) {
  const lapData = packet.m_lapData;
  const sessionId = getSessionId(packet);

  raceData.sessionId = sessionId;

  // Track tire for changes in fastest lap
  if (carStatus && has(raceData, ["data", 0, "lap_data"])) {
    for (let index = 0; index < lapData.length; index++) {
      const newBest = lapData[index]["m_bestLapTime"];
      const oldBest = raceData.data[index]["lap_data"]["m_bestLapTime"];

      // There was a change
      if (oldBest !== newBest) {
        console.log(`New fastest lap for car ${index}`);
        set(
          raceData,
          ["data", index, "custom", "bestLapTyre"],
          carStatus["m_carStatusData"][index]["m_tyreVisualCompound"]
        );
      }
    }
  }

  return mergeData(raceData, lapData, "lap_data");
}

module.exports = {
  trackLapData,
};
