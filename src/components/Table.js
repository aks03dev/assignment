import React, { useMemo } from "react";
import { useTable, useSortBy, useFilters, useColumnOrder } from "react-table";
import { COLUMNS } from "./columns";
import "./table.css";
let count = 1,
  temp;
function Table(props) {
  const { data } = props;
  const columns = useMemo(() => COLUMNS, []);
  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useColumnOrder,
    useFilters,
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setColumnOrder,
  } = tableInstance;

  let columnBeingDragged = null;
  let currentCols = count === 1 ? columns.map((c) => c.id) : temp;
  temp = currentCols;
  count = 2;

  const onDragStart = (e) => {
    columnBeingDragged = columns.find(
      (col) => col.id === e.target.dataset.columnIndex
    );
    console.log(columnBeingDragged);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const newPosition = columns.find(
      (col) => col.id === e.target.dataset.columnIndex
    );
    if (newPosition !== -1) {
      // const colToBeMoved = currentCols.splice(columnBeingDragged, 1);
      // currentCols.splice(newPosition, 0, colToBeMoved[0]);
      console.log("cols before", currentCols);
      console.log(columnBeingDragged.id, newPosition.id);
      const index1 = currentCols.findIndex(
        (col) => col === columnBeingDragged.id
      );
      const index2 = currentCols.findIndex((col) => col === newPosition.id);
      console.log(index1, index2);
      let temp = currentCols[index1];
      currentCols[index1] = currentCols[index2];
      currentCols[index2] = temp;
      temp = currentCols;
      console.log("cols after", currentCols);
      console.log(setColumnOrder(temp));
      setColumnOrder(temp);
      console.log("here");
    }
  };

  return (
    <>
      <table {...getTableProps}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  data-column-index={column.id}
                  draggable="true"
                  onDragStart={onDragStart}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                >
                  {column.render("Header")}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? "🔽" : "🔼") : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default Table;
