const { F1TelemetryClient, constants } = require("f1-telemetry-client");
const { PACKETS } = constants;
const fs = require("fs");
const { trackParticipants } = require("../lib/participants");
const { trackLapData } = require("../lib/laps");
const { trackFinalClassification } = require("../lib/finalClassification");

let raceData = {
  sessionId: null,
  data: {},
};
let lastWrite = null;
let port = 20777;
let writeFrequency = 2500;
let prefix = "";
let path = ".";

function persistData(data, force = false) {
  if (data && (force || Date.now() - lastWrite > writeFrequency)) {
    console.info(`Persisting data to ${prefix}race-${data.sessionId}.json`);
    fs.writeFileSync(
      `${path}/${prefix}race-${data.sessionId}.json`,
      JSON.stringify(data),
      function (err) {
        if (err) return console.log(err);
      }
    );

    lastWrite = Date.now();
  }
}

function resetData() {
  raceData = {
    sessionId: null,
    data: {},
  };
  lastWrite = null;
}

exports.command = "record";

exports.describe = "Start recording F1 2020 sessions";

exports.builder = {
  path: {
    default: ".",
    alias: "p",
    desc: "Path to write file to",
  },
  writeFrequency: {
    default: 2500,
    desc: "Time in ms to wait between flushes to file",
  },
  prefix: {
    default: "",
    desc: "Name to prefix written file with",
  },
  port: {
    default: 20777,
    desc: "UDP port to listen on",
  },
};

exports.handler = function (argv) {
  writeFrequency = argv.writeFrequency;
  port = argv.port;
  prefix = argv.prefix;
  path = argv.path;

  let carStatus = {};

  const client = new F1TelemetryClient({ port });
  // client.on(PACKETS.event, trackEvents);
  // client.on(PACKETS.motion, console.log);
  // client.on(PACKETS.carSetups, console.log);
  // client.on(PACKETS.session, (s) => console.dir(s, { depth: null }));
  // client.on(PACKETS.carTelemetry, console.log);
  // client.on(PACKETS.carTelemetry, console.log);
  // client.on(PACKETS.lobbyInfo, console.log);

  client.on(PACKETS.lapData, (packet) => {
    raceData = trackLapData(packet, raceData, carStatus);
    persistData(raceData);
  });

  client.on(PACKETS.participants, (packet) => {
    raceData = trackParticipants(packet, raceData);
    persistData(raceData);
  });

  client.on(PACKETS.carStatus, (packet) => {
    carStatus = packet;
  });
  client.on(PACKETS.finalClassification, (packet) => {
    raceData = trackFinalClassification(packet, raceData);
    persistData(raceData, true);
    console.info(`Session ${raceData.sessionId} complete`);
    resetData();
  });

  // to start listening:
  client.start();

  console.info(`Streaming data to ${path}`);

  // TODO: On start, load file if it exists for this session?

  // and when you want to stop:
  // client.stop();
};
