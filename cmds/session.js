const { F1TelemetryClient, constants } = require("f1-telemetry-client");
const { PACKETS } = constants;
const _ = require("lodash");
const colors = require("colors");

const { loadDriverMap } = require("../lib/utils");
const { renderSafetyCarStatus } = require("../views/safetyCar");
const { renderWeatherTable } = require("../views/weather");
const { renderEventTable, parseEvent } = require("../views/events");

exports.command = "session";

exports.describe = "Get live session data";

exports.builder = {
  port: {
    default: 20777,
    desc: "UDP port to listen on",
  },
  "events-shown": {
    default: 5,
    desc: "Number of events to show in events table",
  },
  "map-file": {
    default: null,
    alias: "m",
    desc: "Path to csv driver map (racing number, driver name)",
  },
};

exports.handler = function (argv) {
  let port = argv.port;
  let eventsShown = argv.eventsShown;
  let driverMapFile = argv.mapFile;
  let driverMap = {};
  let data = {
    session: {},
    drivers: {},
    events: [],
  };

  if (driverMapFile) {
    driverMap = loadDriverMap(driverMapFile);
  }

  const client = new F1TelemetryClient({ port });
  client.on(PACKETS.event, (e) => {
    let parsed = {
      code: e.m_eventStringCode,
      event: parseEvent(
        e.m_eventStringCode,
        e.m_eventDetails,
        data.drivers,
        driverMap
      ),
      createdAt: new Date().toISOString(),
    };

    data.events.push(parsed);
  });
  client.on(PACKETS.participants, (p) => {
    data.drivers = p.m_participants;
  });
  client.on(PACKETS.session, (s) => {
    // Parse incoming packet
    let parsed = {
      currentWeather: {
        m_trackTemperature: s.m_trackTemperature,
        m_airTemperature: s.m_airTemperature,
        m_weather: s.m_weather,
        m_sessionType: s.m_sessionType,
      },
      weatherForcast: s.m_weatherForecastSamples,
      safetyCarStatus: s.m_safetyCarStatus,
      pitSpeed: s.m_pitSpeedLimit,
    };

    data.session = parsed;
  });

  client.start();

  setInterval(() => {
    console.clear();

    if (_.isEmpty(data.session)) {
      console.log("Awaiting session...");
      return;
    }

    renderSafetyCarStatus(data.session.safetyCarStatus);
    console.log();
    renderWeatherTable(data.session);
    console.log();
    renderEventTable(data.events, eventsShown);
    console.log();
    console.log(`Last Updated: ${new Date().toISOString()}`);
  }, 5000);
};
