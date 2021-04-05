const Table = require("cli-table");
const _ = require("lodash");

const { PENALTY_TYPES } = require("../lib/session");

function renderEventTable(events, eventsShown = 5) {
  if (eventsShown < 1) return;

  const tableData = events
    .slice(Math.max(events.length - eventsShown, 0))
    .map((w) => [w.code, w.event, w.createdAt]);

  // instantiate
  let table = new Table({
    head: ["Code", "Event", "Created"],
    style: { head: ["green"] },
  });

  // table is an Array, so you can `push`, `unshift`, `splice` and friends
  tableData.forEach((e) => table.unshift(e));
  console.log("Events");
  console.log(table.toString());
}

function parseEvent(code, event, drivers, driverMap) {
  let vehicleId = null;
  if (_.has(event, "vehicleIdx")) {
    let racingNumber = _.get(drivers, [event.vehicleIdx, "m_raceNumber"]);
    vehicleId = _.get(driverMap, [racingNumber, "name"], `#${racingNumber}`);
  }

  switch (true) {
    case code === "SPTP":
      return `New fastest speed of ${event.speed} by ${vehicleId}`;
    case code === "FTLP":
      return `New fastest lap of ${event.lapTime} by ${vehicleId}`;
    case code === "RTMT":
      return `${vehicleId} retired`;
    case code === "DRSE":
      return "DRS Enabled";
    case code === "DRSD":
      return "DRS Disabled";
    case code === "PENA":
      return `Penalty given to ${vehicleId} - ${
        PENALTY_TYPES[event.penaltyType]
      }`;

    default:
      return "";
  }
}

module.exports = {
  renderEventTable,
  parseEvent,
};
