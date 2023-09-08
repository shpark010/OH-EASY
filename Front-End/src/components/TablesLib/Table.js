import React, { useState } from "react";
import { useTable } from "react-table";
import styled from "styled-components";
import Input from "../Contents/Input";

const StyledTd = styled.td`
  width: ${(props) => props.width || "auto"};
  padding: 0;
`;

const StyledTr = styled.tr`
  box-sizing: border-box;
  &:hover {
    background-color: var(--color-secondary-blue);
  }
`;

function Table(props) {
  const [inputValues, setInputValues] = useState({});

  const handleChange = (columnId, value) => {
    setInputValues((prev) => ({ ...prev, [columnId]: value }));
  };

  const handleInputChange = (e) => {
    props.setPrice(e.target.value);
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: props.columns, data: props.data });

  // width px , % 구분 하는 함수
  const getWidthStyle = (widthValue) => {
    if (typeof widthValue === "number") return `${widthValue}px`;
    if (typeof widthValue === "string" && widthValue.includes("%"))
      return widthValue;
    return undefined;
  };

  return (
    <table
      {...getTableProps()}
      className="namePickerTable hrGridTable borderTopBold"
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <StyledTr
            {...headerGroup.getHeaderGroupProps()}
            className="hrHeaderStyle"
          >
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </StyledTr>
        ))}
      </thead>
      {props.showInsertRow && (
        <StyledTr>
          {props.columns.map((column) =>
            column.id !== "checkbox" ? (
              <td
                key={column.id}
                style={{ width: getWidthStyle(column.width) }}
              >
                <Input
                  value={inputValues[column.id] || ""}
                  onChange={(e) => handleChange(column.id, e.target.value)}
                  isDoubleClick={true}
                  className={"doubleLine"}
                />
              </td>
            ) : (
              <td key="check" width={props.checkboxWidth}>
                <input type="checkbox" />
              </td>
            ),
          )}
        </StyledTr>
      )}
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <StyledTr {...row.getRowProps()} className="hrRowStyle">
              {row.cells.map((cell) => (
                <StyledTd
                  {...cell.getCellProps()}
                  width={getWidthStyle(cell.column.width)}
                >
                  {cell.render("Cell")}
                </StyledTd>
              ))}
            </StyledTr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;
