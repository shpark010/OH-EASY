import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import styled from "styled-components";
import add from "../../images/icon/ico-person-add.png";

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

const StyledTh = styled.th`
  width: ${(props) => props.width || "auto"};
  padding: 0;
`;
const StyledInsertTh = styled.th`
  width: ${(props) => props.width || "auto"};
  padding: 0;
  background-color: var(--color-opacity-blue) !important;

  &:hover {
    /* background-color: none; */
  }
`;

const StyledBtn = styled.button`
  border: none;
  background-color: var(--color-primary-blue);
  color: var(--color-primary-white);
  /* border: 2px solid var(--color-primary-gray); */
  padding: 6px 10px;
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 600;
    &:before {
      display: flex;
      content: "\\e145";
      margin-right: 3px;
      font-size: 14px;
      font-family: Material Icons;
    }
  }
`;

function Table(props) {
  const [inputValues, setInputValues] = useState({});
  //const [showInsertRow, setShowInsertRow] = useState(false);

  const handleChange = (columnId, value) => {
    setInputValues((prev) => ({ ...prev, [columnId]: value }));
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: props.columns, data: props.data });

  const getWidthStyle = (widthValue) => {
    if (typeof widthValue === "number") return `${widthValue}px`;
    if (typeof widthValue === "string" && widthValue.includes("%"))
      return widthValue;
    return undefined;
  };

  return (
    <div className="">
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
                <StyledTh {...column.getHeaderProps()} width={column.width}>
                  {column.render("Header")}
                </StyledTh>
              ))}
            </StyledTr>
          ))}
          {props.insertRow && (
            <StyledTr>
              <StyledInsertTh
                colSpan={props.columns.length}
                onClick={() =>
                  props.setShowInsertRow((prevState) => !prevState)
                }
              >
                <StyledBtn>
                  <span>추가하기</span>
                </StyledBtn>
              </StyledInsertTh>
            </StyledTr>
          )}
        </thead>

        <tbody {...getTableBodyProps()}>
          {props.showInsertRow && (
            <StyledTr>
              {props.columns.map((column) => {
                // 기본 Input 컴포넌트 렌더링 로직.
                if (column.id !== "checkbox") {
                  // Cell 로직 재사용
                  const CellContent = column.Cell;
                  return (
                    <StyledTd
                      key={column.id}
                      style={{ width: getWidthStyle(column.width) }}
                    >
                      <CellContent
                        cell={{ value: null }}
                        row={{ original: null }}
                      />
                    </StyledTd>
                  );
                } else {
                  return (
                    <StyledTd key="check" width={props.checkboxWidth}>
                      <input type="checkbox" />
                    </StyledTd>
                  );
                }
              })}
            </StyledTr>
          )}
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
    </div>
  );
}

export default Table;
