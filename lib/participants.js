const { getSessionId, mergeData } = require("../lib/utils");

/**
 * Merge in participants into raceData data
 * @param {*} packet
 */
function trackParticipants(packet, raceData) {
  const updatedParticipants = packet.m_participants;
  const sessionId = getSessionId(packet);

  raceData.sessionId = sessionId;

  return mergeData(raceData, updatedParticipants, "driver");
}

module.exports = {
  trackParticipants,
};
