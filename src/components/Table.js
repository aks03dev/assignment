import React, { useMemo } from "react";
import { useTable, useSortBy, useFilters, useColumnOrder } from "react-table";
import { COLUMNS } from "./columns";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./table.css";

const getItemStyle = ({ isDragging, isDropAnimating }, draggableStyle) => ({
  ...draggableStyle,
  // some basic styles to make the items look a bit nicer
  userSelect: "none",

  // change background colour if dragging
  background: isDragging ? "blue" : "grey",
  color: isDragging ? "white" : "black",

  ...(!isDragging && { transform: "translate(0,0)" }),
  ...(isDropAnimating && { transitionDuration: "0.001s" }),

  // styles we need to apply on draggables
});

function TableHelp({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setColumnOrder,
    visibleColumns,
    allColumns,
  } = useTable(
    {
      columns,
      data,
    },
    useColumnOrder,
    useFilters,
    useSortBy
  );
  // const temp = allColumns;
  const currentColOrder = React.useRef();

  let temp = [];
  for (let i = 0; i < allColumns.length; ++i) {
    if (columns[i].id !== 1 && columns[i].id !== 2) temp.push(allColumns[i]);
  }

  // Render the UI for your table
  return (
    <>
      <div>
        {temp.map((column) => (
          <div key={column.id}>
            <label>
              <input type="checkbox" {...column.getToggleHiddenProps()} />{" "}
              {column.Header}
            </label>
          </div>
        ))}
        <br />
      </div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <DragDropContext
              onDragStart={() => {
                currentColOrder.current = visibleColumns.map((o) => o.id);
                // console.log("order", currentColOrder.current);
              }}
              onDragUpdate={(dragUpdateObj, b) => {
                // console.log("onDragUpdate", dragUpdateObj, b);

                const colOrder = [...currentColOrder.current];
                const sIndex = dragUpdateObj.source.index;

                const dIndex =
                  dragUpdateObj.destination && dragUpdateObj.destination.index;
                if (typeof sIndex === "number" && typeof dIndex === "number") {
                  colOrder.splice(sIndex, 1);

                  colOrder.splice(dIndex, 0, dragUpdateObj.draggableId);
                  // console.log(colOrder);

                  // let newOrder = [];
                  // for (let i = 0; i < columns.length; ++i) {
                  //   newOrder.push(columns[+colOrder[i] - 1].Header);
                  // }
                  // console.log(newOrder);
                  setColumnOrder(colOrder);

                  // console.log(
                  //   "onDragUpdate",
                  //   dragUpdateObj.destination.index,
                  //   dragUpdateObj.source.index
                  // );
                }
              }}
            >
              <Droppable droppableId="droppable" direction="horizontal">
                {(droppableProvided, snapshot) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    ref={droppableProvided.innerRef}
                  >
                    {headerGroup.headers.map((column, index) => (
                      <Draggable
                        key={column.id.toString()}
                        draggableId={column.id.toString()}
                        index={index}
                        isDragDisabled={!column.accessor}
                      >
                        {(provided, snapshot) => {
                          // console.log(column.id);
                          return (
                            <th
                              {...column.getHeaderProps(
                                column.getSortByToggleProps()
                              )}
                            >
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                // {...extraProps}

                                ref={provided.innerRef}
                                style={{
                                  ...getItemStyle(
                                    snapshot,
                                    provided.draggableProps.style
                                  ),
                                  // ...style
                                }}
                              >
                                {column.render("Header")}
                                <div>
                                  {column.canFilter
                                    ? column.render("Filter")
                                    : null}
                                </div>
                                <span>
                                  {column.isSorted
                                    ? column.isSortedDesc
                                      ? "🔽"
                                      : "🔼"
                                    : ""}
                                </span>
                              </div>
                            </th>
                          );
                        }}
                      </Draggable>
                    ))}
                    {droppableProvided.placeholder}
                  </tr>
                )}
              </Droppable>
            </DragDropContext>
          ))}
        </thead>

        <tbody className="rows" {...getTableBodyProps()}>
          {rows.map(
            (row, i) =>
              prepareRow(row) || (
                <tr {...row.getRowProps()} className="row body">
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()} className="cell">
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              )
          )}
        </tbody>
      </table>
    </>
  );
}

function Table(props) {
  const { data } = props;
  const columns = useMemo(() => COLUMNS, []);

  return <TableHelp columns={columns} data={data} />;
}

export default Table;

// let count = 1,
//   temp;
// function Table(props) {
//   const { data } = props;
//   const columns = useMemo(() => COLUMNS, []);
//   const tableInstance = useTable(
//     {
//       columns,
//       data,
//     },
//     useColumnOrder,
//     useFilters,
//     useSortBy
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow,
//     setColumnOrder,
//   } = tableInstance;

//   let columnBeingDragged = null;
//   let currentCols = count === 1 ? columns.map((c) => c.id) : temp;
//   temp = currentCols;
//   count = 2;

//   const onDragStart = (e) => {
//     columnBeingDragged = columns.find(
//       (col) => col.id === e.target.dataset.columnIndex
//     );
//     console.log(columnBeingDragged);
//   };

//   const onDrop = (e) => {
//     e.preventDefault();
//     const newPosition = columns.find(
//       (col) => col.id === e.target.dataset.columnIndex
//     );
//     if (newPosition !== -1) {
//       // const colToBeMoved = currentCols.splice(columnBeingDragged, 1);
//       // currentCols.splice(newPosition, 0, colToBeMoved[0]);
//       console.log("cols before", currentCols);
//       setColumnOrder(currentCols);
//       console.log(columnBeingDragged.id, newPosition.id);
//       const index1 = currentCols.findIndex(
//         (col) => col === columnBeingDragged.id
//       );
//       const index2 = currentCols.findIndex((col) => col === newPosition.id);
//       console.log(index1, index2);
//       let temp = currentCols[index1];
//       currentCols[index1] = currentCols[index2];
//       currentCols[index2] = temp;
//       temp = currentCols;
//       console.log("cols after", currentCols);
//       console.log(setColumnOrder(temp));
//       setColumnOrder(currentCols);
//       console.log("here");
//     }
//   };

//   return (
//     <>
//       <table {...getTableProps}>
//         <thead>
//           {headerGroups.map((headerGroup, i) => (
//             <tr {...headerGroup.getHeaderGroupProps()}>
//               {headerGroup.headers.map((column) => (
//                 <th
//                   {...column.getHeaderProps(column.getSortByToggleProps())}
//                   data-column-index={column.id}
//                   draggable="true"
//                   onDragStart={onDragStart}
//                   onDragOver={(e) => e.preventDefault()}
//                   onDrop={onDrop}
//                 >
//                   {column.render("Header")}
//                   <div>{column.canFilter ? column.render("Filter") : null}</div>
//                   <span>
//                     {column.isSorted ? (column.isSortedDesc ? "🔽" : "🔼") : ""}
//                   </span>
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody {...getTableBodyProps}>
//           {rows.map((row) => {
//             prepareRow(row);
//             return (
//               <tr {...row.getRowProps()}>
//                 {row.cells.map((cell) => {
//                   return (
//                     <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
//                   );
//                 })}
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </>
//   );
// }

// export default Table;
