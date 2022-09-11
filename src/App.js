import { DateRangePicker } from "rsuite";
import "./App.css";
import { useState, useEffect } from "react";
import Layout from "../src/components/Layout";
import "rsuite/dist/rsuite.min.css";
function App() {
  const { allowedRange } = DateRangePicker;
  const [value, setValue] = useState([
    new Date("2021-06-01"),
    new Date("2021-06-03"),
  ]);
  const [data, setData] = useState();
  const padTo2Digits = (num) => {
    return num.toString().padStart(2, "0");
  };
  const formatDate = (date) => {
    return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join("-");
  };
  let [startDate, endDate] = value;
  startDate = formatDate(startDate);
  endDate = formatDate(endDate);
  useEffect(() => {
    fetch(
      "http://go-dev.greedygame.com/v3/dummy/report?startDate=" +
        startDate +
        "&endDate=" +
        endDate
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [startDate, endDate]);
  console.log(startDate, endDate);
  return (
    <>
      <DateRangePicker
        value={value}
        onChange={setValue}
        disabledDate={allowedRange("2021-06-01", "2021-06-30")}
        showOneCalendar
      />
      {data ? <Layout data={data} /> : ""}
    </>
  );
}

export default App;
