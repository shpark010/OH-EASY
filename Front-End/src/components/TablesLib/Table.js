import React, { useState } from "react";
import { useTable } from "react-table";
import styled from "styled-components";
import Input from "../Contents/Input";

const StyledTd = styled.td`
  width: ${(props) => props.width || "auto"};
  padding: 0;
`;

function Table({ columns, data, showInsertRow, checkboxWidth }) {
  const [inputValues, setInputValues] = useState({});

  const handleBlur = (columnId, e) => {
    e.currentTarget.style.border = "none";
    e.currentTarget.style.backgroundColor = "var(--color-opacity-white)";

    const value = inputValues[columnId];
    if (value && value.trim()) {
      // 데이터 추가 로직
      console.log(`New data for column ${columnId}:`, value);
    }
  };

  const handleChange = (columnId, value) => {
    setInputValues((prev) => ({ ...prev, [columnId]: value }));
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <table
      {...getTableProps()}
      className="namePickerTable hrGridTable borderTopBold"
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} className="hrHeaderStyle">
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
        {showInsertRow && (
          <tr>
            {columns.map((column) =>
              column.id !== "checkbox" ? (
                <td key={column.id}>
                  <Input
                    value={inputValues[column.id] || ""}
                    onChange={(e) => handleChange(column.id, e.target.value)}
                    onBlur={(e) => handleBlur(column.id, e)}
                  />
                </td>
              ) : (
                <td key="check" width={checkboxWidth}>
                  <input type="checkbox" />
                </td>
              )
            )}
          </tr>
        )}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} className="hrRowStyle">
              {row.cells.map((cell) => (
                <StyledTd {...cell.getCellProps()} width={cell.column.width}>
                  {cell.render("Cell")}
                </StyledTd>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;
