export interface machinesDetailByIdTypes {
  [key: number]: {
    no: string;
    name: string;
    index: number;
    category: string;
    mt: number;
    ht: number;
    selected: boolean;
  };
}

export const countSignalTypes = {
  "Abnormal cycle": 0,
  "Auto running": 0,
  "Loss time": 0,
  "Machine not ready": 0,
  "Power off": 0,
  "Setup / Quality check": 0,
  "Waiting time": 0,
  "Speed loss": 0,
  unknown: 0,
};

export interface extraDataTypes {
  type?: string;
  start_time: string;
  end_time: string;
  diffTime: { [key: string]: string };
  diffTimeSecond: number;
  detail?: string;
  result?: string;
  p_sigval?: string;
  c_sigval?: string;
  x: number;
  y: number;
}

export interface chartDataTypes {
  chartData: any[];
  // chartExtraData: { [machine_name: string]: extraDataTypes };
  chartBarsData: any[];
}

export interface position {
  x: number;
  y: number;
}

export interface size {
  width: number;
  height: number;
}
