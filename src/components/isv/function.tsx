import { useAppDispatch } from "@/app/hooks";
import {
  setChartExtraData,
  setVisibleExtraData,
} from "@/app/features/isv/isvSlice";
import {
  machinesDetailByIdTypes,
  countSignalTypes,
  chartDataTypes,
  extraDataTypes,
} from "./types";
import {
  isvTimelineBarChartSignalConditions,
  isvTimelineBarChartSignalTypeColor,
} from "@/statics/isv";
import { Bar } from "recharts";
import moment from "moment";

export function rearrangeResultData(
  dispatch: any,
  machineIds: number[] | undefined,
  machineDetails: machinesDetailByIdTypes,
  startDate: any,
  result: any
): chartDataTypes {
  // console.log(result);
  let groupMachineDataChart = [];
  let countSignal: { [machine_id: string]: any } = {};
  let arrayBarChart: any[] = [];

  // push initial bar element

  arrayBarChart.push(
    <Bar
      key={"0"}
      name={"dummy"}
      dataKey={"dataIndex-0"}
      stackId="1"
      fill={"#000"}
      isAnimationActive={false}
    />
  );

  if (machineIds && result) {
    let groupMachineWarningData = {}; // data only signal = 5
    let dataIndexCounter = 0;
    let groupMachineData = machineIds.reduce((prevObject, curObject) => {
      let warningData: any = [];
      let normalData = result.filter((data: any) => {
        if (data.machine_id === curObject) {
          if (data.signal == 5) {
            // warning data
            warningData.push(data);
          } else {
            return true;
          }
        }
      });
      groupMachineWarningData = {
        ...groupMachineWarningData,
        [curObject]: warningData,
      };
      return {
        ...prevObject,
        [curObject]: normalData,
      };
    }, {});
    // console.log(groupMachineData);
    // console.log(groupMachineWarningData);
    //machine data key = machine id, value = row data
    groupMachineDataChart = Object.entries(groupMachineData).reduce(
      (chartArray: any[], [key, value]) => {
        let { name, mt, ht } = machineDetails[parseInt(key)];
        countSignal = {
          ...countSignal,
          [key]: Object.create(countSignalTypes),
        };
        let chartDataEachMachine: object = {
          index: key,
          name: name,
        };

        // put startDate value for initial bar
        chartDataEachMachine = {
          ...chartDataEachMachine,
          // [`${signalType}-${countSignal[key][signalType]}`]: diffTime,
          ["dataIndex-0"]: moment(startDate, "YYYY-MM-DD HH:mm").valueOf(),
        };

        if (Array.isArray(value)) {
          value.reduce((prevData, curData, index) => {
            // skip index = 0 (prevData = default ([]))
            // if (index > 10) return;
            if (index === 0) return curData;

            let { datetime_: startTime } = prevData;
            let { datetime_: endTime, detail, result } = curData;
            // signal type conditions
            let [signalType, diffTime, p_sigval, c_sigval] = filterSignalType(
              prevData,
              curData,
              index
            );

            // count each type up and add data with key = 'type-count'
            countSignal[key][signalType] += 1;
            dataIndexCounter++;
            chartDataEachMachine = {
              ...chartDataEachMachine,
              // [`${signalType}-${countSignal[key][signalType]}`]: diffTime,
              [`dataIndex-${dataIndexCounter}`]: diffTime,
            };

            // condition speed loss count and add data
            if (signalType === "Auto running" && diffTime > mt * 1000) {
              // countSignal[key]["Speed loss"] += 1;
              dataIndexCounter++;
              chartDataEachMachine = {
                ...chartDataEachMachine,
                [`dataIndex-${dataIndexCounter}`]: diffTime - mt * 1000,
              };
            } else if (signalType === "Waiting time" && diffTime > ht * 1000) {
              // countSignal[key]["Speed loss"] += 1;
              dataIndexCounter++;
              chartDataEachMachine = {
                ...chartDataEachMachine,
                [`dataIndex-${dataIndexCounter}`]: diffTime - ht * 1000,
              };
            }

            // add <Bar/> dom array
            arrayBarChart.push(
              <Bar
                key={dataIndexCounter}
                name={signalType}
                dataKey={`dataIndex-${dataIndexCounter}`}
                stackId="1"
                fill={isvTimelineBarChartSignalTypeColor[signalType]}
                onMouseEnter={() => setExtraDataVisible(dispatch, true)}
                onMouseLeave={() => setExtraDataVisible(dispatch, false)}
                onMouseMove={(data, index, event) =>
                  setExtraDataChart(event, dispatch, {
                    type: signalType,
                    start_time: startTime,
                    end_time: endTime,
                    diffTime: diffTime,
                    detail: detail,
                    result: result,
                    p_sigval: p_sigval,
                    c_sigval: c_sigval,
                  })
                }
                isAnimationActive={false}
              />
            );

            return curData;
          }, []);
        }

        chartArray.push(chartDataEachMachine);
        return chartArray;
      },
      []
    );
    // console.log(groupMachineDataChart);
    // console.log(countSignal);
  }
  return {
    chartData: groupMachineDataChart,
    chartBarsData: arrayBarChart,
  };
}

function filterSignalType(
  prevData: any,
  curData: any,
  index: number
): [type: string, diff: number, p_sigval: string, c_sigval: string] {
  // if (index === 1) {
  let { datetime_: p_datetime_, signal: p_signal, value: p_value } = prevData;
  let { datetime_: c_datetime_, signal: c_signal, value: c_value } = curData;
  let diffTime = moment(c_datetime_).diff(p_datetime_); // millisec
  let p_sigval: number = p_signal * 10 + p_value;
  let c_sigval: number = c_signal * 10 + c_value;
  let type = signalCondition(p_sigval, c_sigval);
  let p_sigval_return = "";
  let c_sigval_return = "";
  if (type === "unknown") {
    console.log("unknown");
    console.log(prevData);
    console.log(curData);
    p_sigval_return = p_sigval.toString();
    c_sigval_return = c_sigval.toString();
  }
  // }
  return [type, diffTime, p_sigval_return, c_sigval_return];
}

function signalCondition(p_sigval: number, c_sigval: number): string {
  let type = "";
  Object.entries(isvTimelineBarChartSignalConditions).forEach(
    ([signal, conds]) => {
      let input = [p_sigval, c_sigval];
      conds.forEach((cond) => {
        if (cond[0].includes(p_sigval) && cond[1].includes(c_sigval)) {
          type = signal;
        }
      });
    }
  );
  if (type === "") {
    type = "unknown";
  }
  return type;
}

function setExtraDataChart(
  event: React.MouseEvent,
  dispatch: any,
  data: { [key: string]: any }
) {
  // console.log(`x:${event.clientX} y:${event.clientY}`);
  let { start_time, end_time, diffTime } = data;
  let convertedDiffTime = convertDiffTime(diffTime);
  let changeUnitData: extraDataTypes = {
    ...data,
    start_time: moment(start_time).format("yyyy-MM-DD HH:mm:ss"),
    end_time: moment(end_time).format("yyyy-MM-DD HH:mm:ss"),
    diffTime: convertedDiffTime,
    diffTimeSecond: diffTime,
    x: event.clientX,
    y: event.clientY,
  };
  dispatch(setChartExtraData(changeUnitData));
}

function setExtraDataVisible(dispatch: any, visible: boolean) {
  dispatch(setVisibleExtraData(visible));
}

function convertDiffTime(diffTime: number): { [key: string]: string } {
  let diffTimeSecond = diffTime / 1000;
  let converted = {};
  let diffHour = Math.floor(diffTimeSecond / 3600).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
  let diffMinute = Math.floor(
    (diffTimeSecond - 3600 * parseInt(diffHour)) / 60
  ).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
  let diffSecond = (diffTimeSecond % 60).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
  // condition add key value
  if (parseInt(diffHour) > 0) {
    converted = { ...converted, hr: diffHour };
  }
  if (parseInt(diffMinute) > 0) {
    converted = { ...converted, min: diffMinute };
  }
  converted = { ...converted, sec: diffSecond };
  return converted;
}
