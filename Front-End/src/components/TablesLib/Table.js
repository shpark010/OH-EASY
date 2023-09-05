import React, { useState } from "react";
import { useTable } from "react-table";
import styled from "styled-components";
import Input from "../Contents/Input";

const StyledTd = styled.td`
  width: ${(props) => props.width || "auto"};
  padding: 0;
`;

function Table(props) {
  const [inputValues, setInputValues] = useState({});

  const handleChange = (columnId, value) => {
    setInputValues((prev) => ({ ...prev, [columnId]: value }));
  };

  const defaultTdOnBlur = (e) => {
    console.log("블러 이벤트");
    e.currentTarget.style.border = "none";
    const tdNodes = Array.from(
      e.currentTarget.parentNode.parentNode.childNodes
    );
    console.log(tdNodes);
    tdNodes.forEach((td) => {
      td.style.backgroundColor = "var(--color-primary-white)";
      Array.from(td.childNodes).forEach((child) => {
        child.style.backgroundColor = "var(--color-primary-white)";
      });
    });
  };

  const handleInputChange = (e) => {
    props.setPrice(e.target.value);
  };

  const toggleEditing = () => {
    console.log("더블클릭 이벤트 발생~~ 테이블꺼");
    props.setEditing(!props.editing);
    console.log(props.editing);
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: props.columns, data: props.data });

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
      </thead>
      {props.showInsertRow && (
        <tr>
          {props.columns.map((column) =>
            column.id !== "checkbox" ? (
              <td key={column.id}>
                <Input
                  value={inputValues[column.id] || ""}
                  onChange={(e) => handleChange(column.id, e.target.value)}
                  onBlur={(e) => defaultTdOnBlur(e)}
                />
              </td>
            ) : (
              <td key="check" width={props.checkboxWidth}>
                <input type="checkbox" />
              </td>
            )
          )}
        </tr>
      )}
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} className="hrRowStyle">
              {row.cells.map((cell) => (
                <StyledTd
                  {...cell.getCellProps()}
                  width={cell.column.width}
                  onDoubleClick={() => {
                    if (props.page === "sd") {
                      toggleEditing();
                    }
                  }}
                >
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
