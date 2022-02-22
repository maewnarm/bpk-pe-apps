import { useState } from "react";
import MachineSelection from "@/components/isv/machineSelection";
import Result from "@/components/isv/result";
import DateTimeSelection from "@/components/common/datetime/datetimeSelection";
import moment from "moment";
// import { ResponsiveBar } from "@nivo/bar";

const Isv = () => {
  const [startDate, setStartDate] = useState<any>(
    moment().format("yyyy-MM-DD HH:mm")
  );
  const [endDate, setEndDate] = useState<any>(
    moment().format("yyyy-MM-DD HH:mm")
  );

  return (
    <div className="isv">
      <div className="isv__selection">
        <MachineSelection />
        <div className="isv__selection__datetime">
          <div className="isv__selection__datetime__component">
            <label className="label">From :</label>
            <DateTimeSelection
              selectedDate={startDate}
              setDateFunction={setStartDate}
            />
          </div>
          <div className="isv__selection__datetime__component">
            <label className="label">To :</label>
            <DateTimeSelection
              selectedDate={endDate}
              setDateFunction={setEndDate}
            />
          </div>
        </div>
      </div>
      <div className="divider is-success">data result</div>
      <Result startDate={startDate} endDate={endDate} />
    </div>
  );
};

export default Isv;
