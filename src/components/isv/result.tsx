import React, { useState, useEffect, FC, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setLoaderIsActive } from "@/app/features/loader/loaderSlice";
import {
  selectedMachines,
  chartExtraData,
  visibleExtraData,
} from "@/app/features/isv/isvSlice";
import {
  machinesDetailByIdTypes,
  extraDataTypes,
  chartDataTypes,
  position,
  size,
} from "@/components/isv/types";
import { rearrangeResultData } from "./function";
import { getOperationRecords } from "@/api/isvAPI";
import { isvTimelineBarChartLegendPayload } from "@/statics/isv";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Range, SliderTooltip, Handle } from "rc-slider";
import moment from "moment";

const ChartElement: FC<any> = React.memo((props) => {
  let {
    data: chartData,
    machinesList: selectedMachinesList,
    range: chartRange,
  } = props;
  console.log("render chart");
  // console.log(chartRange);
  return (
    <div
      className="isv__result__chart"
      style={{ display: chartData?.chartData.length ? "block" : "none" }}
    >
      {/* <ResponsiveContainer width="100%" height="100%" debounce={1}> */}
      <BarChart
        width={1720}
        height={50 + 125 * selectedMachinesList?.length}
        data={chartData?.chartData}
        margin={{
          top: 10,
          right: 30,
          left: 20,
          bottom: 10,
        }}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#555" />
        <XAxis
          type="number"
          stroke="#000"
          tickFormatter={(value) => moment(value).format("HH:mm:ss")}
          domain={chartRange}
          allowDataOverflow
        />
        <YAxis dataKey="name" type="category" stroke="#000" />
        {/* <Tooltip
            /> */}
        <Legend
          payload={isvTimelineBarChartLegendPayload}
          layout="horizontal"
          align="right"
          verticalAlign="top"
          margin={{ top: 20, bottom: 20 }}
        />
        {chartData?.chartBarsData}
      </BarChart>
      {/* </ResponsiveContainer> */}
    </div>
  );
});

const CustomToolTip = () => {
  const extraData: extraDataTypes = useAppSelector(chartExtraData);
  const visibleExtra: boolean = useAppSelector(visibleExtraData);
  const divRef = useRef(null);
  const offset = 10;
  const [translate, setTranslate] = useState<position>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    // console.log("render in custom tooltip");
    // console.log(`x:${extraData.x} y:${extraData.y}`);
    // console.log(extraData.diffTime);
    calculateTranslate();
  }, [extraData]);

  function calculateTranslate() {
    let position: position = { x: 0, y: 0 };
    // screen size
    let { innerWidth: screenWidth, innerHeight: screenHeight } = window;
    // console.log(`width:${screenWidth} height:${screenHeight}`);

    // tooltip size
    let divSize: size = { width: 0, height: 0 };
    if (divRef.current) {
      let ref = divRef.current as HTMLDivElement;
      // console.log(`div width:${ref.offsetWidth} height:${ref.offsetHeight}`);
      divSize = { width: ref.offsetWidth, height: ref.offsetHeight };
    }

    // mouse position
    let mouse: position = { x: extraData.x, y: extraData.y };

    // invert x
    if (mouse.x + offset + divSize.width > screenWidth - offset) {
      position = { ...position, x: mouse.x - offset - divSize.width };
    } else {
      position = { ...position, x: mouse.x + offset };
    }
    //invert y
    if (mouse.y + offset + divSize.height > screenHeight - offset) {
      position = { ...position, y: mouse.y - offset - divSize.height };
    } else {
      position = { ...position, y: mouse.y + offset };
    }

    setTranslate(position);
  }

  return (
    <div
      className="isv__result__extra-data"
      ref={divRef}
      style={{
        visibility: visibleExtra ? "visible" : "hidden",
        position: "absolute",
        top: 0,
        left: 0,
        transform: `translate(${translate.x}px,${translate.y}px)`,
      }}
    >
      <ul>
        <li>{`${extraData.type}`}</li>
        <li>Time range :</li>
        <li>
          {`${extraData.start_time}`}
          {extraData.p_sigval !== "" && ` (${extraData.p_sigval})`}
        </li>
        <li>to</li>
        <li>
          {`${extraData.end_time}`}
          {extraData.c_sigval !== "" && ` (${extraData.c_sigval})`}
        </li>
        <li>{`Duration ${Object.entries(extraData.diffTime).map(
          ([key, value]) => `: ${value} ${key}.`
        )}`}</li>
        {(extraData.diffTime.hr || extraData.diffTime.min) && (
          <li>{`(${extraData.diffTimeSecond / 1000} sec.)`}</li>
        )}
        {extraData.result !== "" && <li>{`Result : ${extraData.result}`}</li>}
        {extraData.detail !== "" && <li>{`Detail : ${extraData.detail}`}</li>}
      </ul>
    </div>
  );
};

const TimeSlider = (props: any) => {
  const { startDate, endDate, setChartRangeFunction, chartRange } = props;
  let startDateValue = moment(startDate, "YYYY-MM-DD HH:mm").valueOf();
  let endDateValue = moment(endDate, "YYYY-MM-DD HH:mm").valueOf();
  const [dateValue, setDateValue] = useState<number[]>([
    startDateValue,
    endDateValue,
  ]);
  const [tooltipShow, setTooltipShow] = useState(false);

  useEffect(() => {
    // console.log(
    //   moment(startDateValue).format("YYYY-MM-DD HH:mm"),
    //   moment(endDateValue).format("YYYY-MM-DD HH:mm")
    // );
    setDateValue([startDateValue, endDateValue]);
  }, [startDate, endDate]);

  function RefreshDateValue() {
    setChartRangeFunction(dateValue);
  }

  function sliderChange(value: number[]) {
    // console.log(value);
    // console.log(startDate);
    // console.log(endDate);
    setDateValue(value);
  }

  function ShowTooltipMouseToggle(enter: boolean) {
    // console.log(enter);
    setTooltipShow(enter);
  }

  return (
    <div className="isv__result__time-slider">
      <div
        onMouseEnter={() => ShowTooltipMouseToggle(true)}
        onMouseLeave={() => ShowTooltipMouseToggle(false)}
        style={{ width: "100%" }}
      >
        <Range
          min={startDateValue}
          max={endDateValue}
          step={60000}
          allowCross={false}
          value={dateValue}
          onChange={sliderChange}
          handle={(props) => TooltipTimeSlider(props, tooltipShow)}
        />
      </div>
      <button
        className={`button is-primary ${
          chartRange === dateValue && "is-outlined"
        }`}
        onClick={() => RefreshDateValue()}
      >
        refresh
      </button>
    </div>
  );
};

const TooltipTimeSlider = (props: any, tooltipShow: boolean) => {
  const { value, dragging, index, ...restProps } = props;

  return (
    <SliderTooltip
      prefixCls="rc-slider-tooltip"
      overlay={`${moment(value).format("YYYY-MM-DD HH:mm")}`}
      visible={dragging || tooltipShow}
      placement="bottom"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </SliderTooltip>
  );
};

const Result: FC<{ startDate: any; endDate: any }> = (props) => {
  const dispatch = useAppDispatch();
  const { startDate, endDate } = props;
  const selectedMachinesValue: machinesDetailByIdTypes =
    useAppSelector(selectedMachines); // machine details, keys = id
  const [selectedMachinesList, setSelectedMachinesList] = useState<number[]>(
    []
  ); // selected machines id
  const [chartData, setChartData] = useState<{
    data?: chartDataTypes;
    machinesList?: number[];
    range: number[];
  }>();
  // const [chartRange, setChartRange] = useState<number[]>([startDate, endDate]);

  // useEffect(() => console.log("render result"));

  // useEffect(() => {
  //   console.log(chartRange);
  // },[chartRange])

  useEffect(() => {
    let machinesValue: object = selectedMachinesValue;
    let machines = Object.entries(machinesValue).reduce(
      (mcArray: number[], [key, details]) => {
        if (details.selected) {
          mcArray.push(parseInt(key));
        }
        return mcArray;
      },
      []
    );
    setSelectedMachinesList(machines);
  }, [selectedMachinesValue]);

  async function getData(e: React.MouseEvent) {
    dispatch(setLoaderIsActive(true));
    let target = e.currentTarget;
    let machineIds = selectedMachinesList?.toString();
    if (machineIds === "") {
      machineIds = "-1";
    }
    let result = await getOperationRecords({
      machine_id: machineIds,
      datetime_start: startDate,
      datetime_end: endDate,
    });
    // rearrange data and bar chart
    let { chartData: arrangedData, chartBarsData: arrayBarChart } =
      rearrangeResultData(
        dispatch,
        selectedMachinesList,
        selectedMachinesValue,
        startDate,
        result
      );

    // setChartData(isvTimelineBarChartDemoData);
    setChartData({
      data: { chartData: arrangedData, chartBarsData: arrayBarChart },
      machinesList: selectedMachinesList,
      range: [
        moment(startDate, "YYYY-MM-DD HH:mm").valueOf(),
        moment(endDate, "YYYY-MM-DD HH:mm").valueOf(),
      ],
    });
    // console.log(arrangedData);
    // console.log(extraChartData);
    // console.log(arrayBarChart);

    target.classList.toggle("is-outlined", true);
    dispatch(setLoaderIsActive(false));
  }

  function setChartRange(datevalue: number[]) {
    setChartData({
      ...chartData,
      range: datevalue,
    });
  }

  useEffect(() => {
    let button = document.querySelector(".isv__result__header > button");
    button?.classList.toggle("is-outlined", false);
  }, [selectedMachinesList, startDate, endDate]);

  return (
    <div className="isv__result">
      <div className="isv__result__header">
        <button
          className="button is-rounded is-primary"
          onClick={(e) => getData(e)}
          disabled={selectedMachinesList?.length === 0}
        >
          Load data
        </button>
      </div>
      {/* ChartData */}
      <ChartElement
        data={chartData?.data}
        machinesList={chartData?.machinesList}
        range={chartData?.range}
      />
      <div
        className="isv__result__chart__time-range"
        style={{
          display: chartData?.data?.chartData.length ? "flex" : "none",
        }}
      >
        <p>Time range :</p>
        <TimeSlider
          startDate={startDate}
          endDate={endDate}
          setChartRangeFunction={setChartRange}
          chartRange={chartData?.range}
        />
      </div>
      <CustomToolTip />
    </div>
  );
};

export default Result;
