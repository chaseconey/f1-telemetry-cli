const { getSessionId, mergeData } = require("../lib/utils");

function trackFinalClassification(packet, raceData) {
  const classification = packet.m_classificationData;
  const sessionId = getSessionId(packet);

  raceData.sessionId = sessionId;

  return mergeData(raceData, classification, "race_data");
}

module.exports = {
  trackFinalClassification,
};
