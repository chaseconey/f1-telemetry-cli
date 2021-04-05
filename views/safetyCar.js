const colors = require("colors");

const { SAFETY_CAR_STATUS } = require("../lib/session");

function renderSafetyCarStatus(status) {
  if (status === 0) {
    console.log(`Race Status: Green`.bgGreen);
  } else {
    console.log(`Race Status: ${SAFETY_CAR_STATUS[status]}`.bgYellow);
  }
}

module.exports = {
  renderSafetyCarStatus,
};
