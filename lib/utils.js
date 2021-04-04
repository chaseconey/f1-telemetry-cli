const _ = require("lodash");

/**
 *
 * @param {*} packet
 */
function getSessionId(packet) {
  return packet.m_header.m_sessionUID.toString();
}

/**
 * Helper function to merge packet data into existing data storage
 *
 * @param {object} data Existing object storing race data
 * @param {array} entries New data to merge in
 * @param {string} dataKey Key to merge data into
 * @returns object
 */
function mergeData(data, entries, dataKey) {
  for (const [key, value] of Object.entries(entries)) {
    _.set(data, ["data", key, dataKey], value);
  }

  return data;
}

module.exports = {
  getSessionId,
  mergeData,
};
