import React, { Dispatch, FC, SetStateAction, useState } from "react";
import DatePicker, { CalendarContainer } from "react-datepicker";
import moment from "moment";

interface DateTimeSelectionProps {
  selectedDate: Date;
  setDateFunction: (d: any) => void | Dispatch<SetStateAction<any>>;
  disabled?: boolean;
}

const DateTimeSelection: FC<DateTimeSelectionProps> = (props) => {
  const { selectedDate, setDateFunction, disabled } = props;
  const [date, setDate] = useState<any>(new Date());

  const MyContainer = ({
    className,
    children,
  }: {
    className: string;
    children: any;
  }) => {
    return (
      <div className="datepicker-container">
        <CalendarContainer className={className}>
          <div className="datepicker-container__header">
            Choose start date & time
          </div>
          <div style={{ position: "relative", color: "red" }}>{children}</div>
        </CalendarContainer>
      </div>
    );
  };

  return (
    <div className="datetime">
      <DatePicker
        calendarContainer={MyContainer}
        selected={date}
        onChange={(date) => {
          setDate(date);
          setDateFunction(moment(date as Date).format("yyyy-MM-DD HH:mm"));
        }}
        timeInputLabel="Time:"
        dateFormat="yyyy/MM/dd , HH:mm"
        showTimeInput
      />
    </div>
  );
};

export default DateTimeSelection;
