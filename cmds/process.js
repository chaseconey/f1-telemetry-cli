const _ = require("lodash");
const fs = require("fs");

const addDeltas = (processed) => {
  const bestLap = _.chain(processed)
    .filter((r) => r.lap_data.m_bestLapTime > 0)
    .sortBy("lap_data.m_bestLapTime")
    .value()[0]["lap_data"];
  for (let index = 0; index < processed.length; index++) {
    const driver = processed[index];
    const driverLapData = driver.lap_data;

    if (driverLapData.m_bestLapTime === 0) {
      processed[index]["calculated"] = {
        bestLapTimeInSecDelta: null,
        bestLapSector1InMsDelta: null,
        bestLapSector2InMsDelta: null,
        bestLapSector3InMsDelta: null,
        totalRaceTimeInMsDelta: null,
      };
    } else {
      processed[index]["calculated"] = {
        bestLapTimeInSecDelta:
          driverLapData.m_bestLapTime - bestLap.m_bestLapTime,
        bestLapSector1InMsDelta:
          driverLapData.m_bestLapSector1TimeInMS -
          bestLap.m_bestLapSector1TimeInMS,
        bestLapSector2InMsDelta:
          driverLapData.m_bestLapSector2TimeInMS -
          bestLap.m_bestLapSector2TimeInMS,
        bestLapSector3InMsDelta:
          driverLapData.m_bestLapSector3TimeInMS -
          bestLap.m_bestLapSector3TimeInMS,
        totalRaceTimeInMsDelta:
          driver.race_data.m_resultStatus === 3
            ? driver.race_data.m_totalRaceTime -
              processed[0].race_data.m_totalRaceTime
            : null,
      };
    }
  }
};

exports.command = "process <file>";

exports.describe = "Process session data for specific session";

exports.builder = {
  path: {
    default: ".",
    alias: "p",
    desc: "Path to write file to",
  },
  name: {
    default: "processed",
    alias: "n",
    desc: "Name of the processed file",
  },
};

exports.handler = function (argv) {
  const raceData = JSON.parse(fs.readFileSync(argv.file));
  let processed = {};

  // Clear padded data
  processed = _.filter(raceData.data, (r) => r.race_data.m_position > 0);

  // Sort by position
  processed = _.sortBy(processed, "race_data.m_position");

  // Add deltas
  addDeltas(processed);

  // Key by driver id
  processed = _.keyBy(processed, "driver.m_raceNumber");

  console.info(`Writing processed file to ${argv.path}/${argv.name}.json`);

  fs.writeFileSync(`${argv.path}/${argv.name}.json`, JSON.stringify(processed));
};
