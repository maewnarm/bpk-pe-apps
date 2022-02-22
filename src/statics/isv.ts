import { Payload } from "recharts/types/component/DefaultLegendContent";

export const isvTimelineBarChartElements = [
  "Power on",
  "Setup",
  "Auto condtiion",
  "Cycle running",
  "Warning",
  "Quality check",
  "Work NG",
  "Cycle stop",
  "Fault stop",
];

export const isvTimelineBarChartDemoData = [
  {
    index: 1,
    name: "machine no. 1",
    "Power on": 20,
    Setup: 50,
    "Cycle running": 80,
    "Power on-1": 30,
  },
  {
    index: 2,
    name: "machine no. 2",
    "Power on": 50,
    // Setup: 20,
    "Cycle running": 40,
  },
];

export const isvTimelineBarChartSignalConditions = {
  "Abnormal cycle": [
    [
      [0, 41],
      [51, 71],
    ],
  ],
  "Auto running": [[[0, 41], [40]]],
  "Loss time": [
    [
      [0, 41, 71, 81, 91],
      [81, 91],
    ],
    [[71], [10, 30]],
    [
      [81, 91],
      [10, 21, 31, 61],
    ],
  ],
  "Machine not ready": [
    [[0], [10, 20, 30, 31]],
    [[11], [10, 21, 31, 51, 61, 71, 81, 91]],
    [[20], [31, 51, 61, 71, 81, 91]],
    [[21], [51, 71, 81, 91]],
    [[30], [21, 31, 51, 71, 81, 91]],
    [[60], [10, 21, 31, 51, 71, 81, 91]],
    [[61], [41, 71, 81, 91]],
  ],
  "Power off": [[[0, 10], [11]]],
  "Setup / Quality check": [
    [[0], [21, 61]],
    [[21], [20]],
    [[61], [60]],
  ],
  "Waiting time": [
    [[0], [41, 60]],
    [[31], [30, 41, 51, 71, 81, 91]],
    [[40], [10, 21, 30, 41, 51, 61, 71, 81, 91]],
  ],
};

export const isvTimelineBarChartSignalTypeColor: { [type: string]: string } = {
  "Abnormal cycle": "#FF9B48",
  "Auto running": "#A9FF61",
  "Loss time": "#499BCA",
  "Machine not ready": "#717171",
  "Power off": "#F7F54A",
  "Setup / Quality check": "#B260FF",
  "Waiting time": "#4CBA46",
  "Speed loss": "#FF58FA",
};

export const isvTimelineBarChartLegendPayload: Payload[] = [
  { value: "Abnormal cycle", type: "square", color: "#FF9B48" },
  { value: "Auto running", type: "square", color: "#A9FF61" },
  { value: "Loss time", type: "square", color: "#499BCA" },
  { value: "Machine not ready", type: "square", color: "#717171" },
  { value: "Power off", type: "square", color: "#F7F54A" },
  { value: "Setup / Quality check", type: "square", color: "#B260FF" },
  { value: "Waiting time", type: "square", color: "#4CBA46" },
  { value: "Speed loss", type: "square", color: "#FF58FA" },
];
