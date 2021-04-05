const colors = require("colors");
const Table = require("cli-table");

const { WEATHER, SESSION_TYPE } = require("../lib/session");

function renderWeatherTable(session) {
  const weather = session.weatherForcast
    .filter((w) => w.m_sessionType > 1)
    .map((w) => [
      SESSION_TYPE[w.m_sessionType],
      `${w.m_timeOffset}min`,
      WEATHER[w.m_weather],
      w.m_trackTemperature,
      w.m_airTemperature,
    ]);

  const currentWeather = [
    SESSION_TYPE[session.currentWeather.m_sessionType],
    "Now",
    WEATHER[session.currentWeather.m_weather],
    session.currentWeather.m_trackTemperature,
    session.currentWeather.m_airTemperature,
  ];

  // instantiate
  let table = new Table({
    head: ["Type", "Weather", "Time", "Track Temp", "Air Temp"],
    style: { head: ["green"] },
  });

  // table is an Array, so you can `push`, `unshift`, `splice` and friends
  table.push(currentWeather);
  weather.forEach((w) => table.push(w));
  console.log("Weather");
  console.log(table.toString());
}

module.exports = {
  renderWeatherTable,
};
