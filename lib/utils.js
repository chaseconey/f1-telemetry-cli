const _ = require("lodash");
const fs = require("fs");
const parse = require("csv-parse/lib/sync");

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

/**
 * Loads driver map from csv file with columns of `racing number, header` (no headers)
 *
 * @param {string} driverMapFile File path to driver map csv
 * @returns object
 */
function loadDriverMap(driverMapFile) {
  let csv = fs.readFileSync(driverMapFile);
  const parsed = parse(csv, {
    columns: () => ["number", "name"],
    skip_empty_lines: true,
  });

  console.log(`Loaded driver map from ${driverMapFile}`.green);
  return _.keyBy(parsed, "number");
}

module.exports = {
  getSessionId,
  mergeData,
  loadDriverMap,
};
