import React, { useState, useEffect, useRef } from "react";
import { useTable } from "react-table";
import styled from "styled-components";
import add from "../../images/icon/ico-person-add.png";

const StyledTd = styled.td`
  width: ${(props) => props.width || "auto"};
  padding: 0;
`;

const StyledTr = styled.tr`
  box-sizing: border-box;
  position: ${(props) => (props.isHeader ? "sticky" : "static")};
  top: ${(props) =>
    props.stickyTop ? props.stickyTop : "0"}px; // 동적 top 값 추가
  z-index: 1;
  background-color: white;
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

const StyledInsertFooter = styled.tfoot`
  tr {
    box-sizing: border-box;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 2;
  }
`;
const TableContainer = styled.div`
  height: 400px;
  overflow-y: auto;
  position: relative;
  border-top: 2.5px solid var(--color-primary-black);
`;

function Table(props) {
  const [inputValues, setInputValues] = useState({});
  //const [showInsertRow, setShowInsertRow] = useState(false);
  const tableContainerRef = useRef(null);

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
    <TableContainer ref={tableContainerRef}>
      <table {...getTableProps()} className="namePickerTable hrGridTable">
        <thead>
          {headerGroups.map((headerGroup) => (
            <StyledTr
              {...headerGroup.getHeaderGroupProps()}
              className="hrHeaderStyle"
              isHeader // prop 추가하여 헤더임을 명시
            >
              {headerGroup.headers.map((column) => (
                <StyledTh {...column.getHeaderProps()} width={column.width}>
                  {column.render("Header")}
                </StyledTh>
              ))}
            </StyledTr>
          ))}
          <StyledTr>
            <StyledTh style={{ width: "15px", padding: "0" }} />
          </StyledTr>
        </thead>

        <tbody {...getTableBodyProps()}>
          {props.showInsertRow && (
            <StyledTr>
              {props.columns.map((column) => {
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

        {/* 푸터 추가 */}
        {props.insertRow && (
          <StyledInsertFooter>
            <StyledTr
            //isHeader
            >
              <StyledInsertTh
                colSpan={props.columns.length}
                onClick={() => {
                  if (tableContainerRef.current) {
                    tableContainerRef.current.scrollTop = 0; // 스크롤을 맨 위로 설정
                  }
                  props.setShowInsertRow((prevState) => !prevState);
                }}
              >
                <StyledBtn>
                  <span>추가하기</span>
                </StyledBtn>
              </StyledInsertTh>
            </StyledTr>
          </StyledInsertFooter>
        )}
      </table>
    </TableContainer>
  );
}

export default Table;
