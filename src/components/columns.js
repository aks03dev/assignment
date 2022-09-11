import { ColumnFilter } from "./ColumnFilter";

const options = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export const COLUMNS = [
  {
    Header: "Date",
    id: "1",
    accessor: (row) =>
      new Date(row["date"]).toLocaleDateString("en-us", options),
    Filter: ColumnFilter,
  },
  {
    Header: "App",
    id: "2",
    accessor: "app_name",
    Filter: ColumnFilter,
  },
  {
    Header: "AD Request",
    id: "3",
    accessor: "requests",
    Filter: ColumnFilter,
  },
  {
    Header: "AD Response",
    id: "4",
    accessor: "responses",
    Filter: ColumnFilter,
  },
  {
    Header: "Impression",
    id: "5",
    accessor: "impressions",
    Filter: ColumnFilter,
  },
  {
    Header: "Clicks",
    id: "6",
    accessor: "clicks",
    Filter: ColumnFilter,
  },
  {
    Header: "Revenue(in $)",
    id: "7",
    accessor: (row) => "$" + row["revenue"].toFixed(2),
    Filter: ColumnFilter,
  },
  {
    Header: "Fill Rate (= Ad Request / AD Response * 100%)",
    id: "8",
    accessor: (row) => {
      let num = ((row["revenue"] * 100) / row["responses"]).toFixed(2);
      return num + " %";
    },
    Filter: ColumnFilter,
  },
  {
    Header: "CTR ( = Clicks / Impression * 100%)",
    id: "9",
    accessor: (row) => {
      let num = ((row["clicks"] / row["impressions"]) * 100).toFixed(2);
      return num + " %";
    },
    Filter: ColumnFilter,
  },
];
