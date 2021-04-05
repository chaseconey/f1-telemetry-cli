// 0 = unknown, 1 = P1, 2 = P2, 3 = P3, 4 = Short P
// 5 = Q1, 6 = Q2, 7 = Q3, 8 = Short Q, 9 = OSQ
// 10 = R, 11 = R2, 12 = Time Trial

const SESSION_TYPE = {
  0: "Unknown",
  1: "P1",
  2: "P2",
  3: "P3",
  4: "Short Practice",
  5: "Q1",
  6: "Q2",
  7: "Q3",
  8: "Short Quali",
  9: "One-shot Quali",
  10: "Race",
  11: "Race 2",
  12: "Time Trial",
};

// Formula, 0 = F1 Modern, 1 = F1 Classic, 2 = F2,
// 3 = F1 Generic
const FORMULA_TYPES = {
  0: "F1 Modern",
  1: "F1 Classic",
  2: "F2",
  3: "F1 Generic",
};

// 0 = no safety car, 1 = full safety car
// 2 = virtual safety car
const SAFETY_CAR_STATUS = {
  0: "No Safety Car",
  1: "Full Safety Car",
  2: "Virtual Safety Car",
};

// Weather - 0 = clear, 1 = light cloud, 2 = overcast
// 3 = light rain, 4 = heavy rain, 5 = storm
const WEATHER = {
  0: "Clear",
  1: "Light Clouds",
  2: "Overcast",
  3: "Light Rain",
  4: "Heavy Rain",
  5: "Storm",
};

const PENALTY_TYPES = {
  0: "Drive through",
  1: "Stop Go",
  2: "Grid penalty",
  3: "Penalty reminder",
  4: "Time penalty",
  5: "Warning",
  6: "Disqualified",
  7: "Removed from formation lap",
  8: "Parked too long timer",
  9: "Tyre regulations",
  10: "This lap invalidated",
  11: "This and next lap invalidated",
  12: "This lap invalidated without reason",
  13: "This and next lap invalidated without reason",
  14: "This and previous lap invalidated ",
  15: "This and previous lap invalidated without reason",
  16: "Retired",
  17: "Black flag timer",
};

module.exports = {
  WEATHER,
  SAFETY_CAR_STATUS,
  FORMULA_TYPES,
  SESSION_TYPE,
  PENALTY_TYPES,
};
