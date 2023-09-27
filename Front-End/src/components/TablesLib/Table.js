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
  position: ${(props) => (props["data-is-header"] ? "sticky" : "static")};
  top: ${(props) => (props.stickyTop ? props.stickyTop : "0")}px;
  z-index: 1;
  background-color: white;
  &:hover {
    background-color: var(--color-opacity-blue);
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
  height: ${(props) => (props.height ? props.height : "100%")};

  overflow-y: auto;
  position: relative;
  border-top: 2.5px solid var(--color-primary-black);

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-primary-gray);
  }
  &::-webkit-scrollbar-track {
    background-color: var(--color-opacity-gray);
  }
`;

function Table(props) {
  const tableContainerRef = useRef(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const [prevRowsLength, setPrevRowsLength] = useState(props.data.length); // 초기 rows의 길이 저장
  const [lastAddedRowIndex, setLastAddedRowIndex] = useState(null); // 마지막으로 추가된 행의 인덱스 저장
  useEffect(() => {
    // rows의 길이가 이전 길이보다 크면
    if (props.data.length > prevRowsLength) {
      const lastIndex = props.data.length - 1; // 마지막 행 인덱스
      setLastAddedRowIndex(lastIndex);
      setSelectedRowIndex(lastIndex); // 마지막 행을 선택된 행으로 설정
      setPrevRowsLength(props.data.length); // rows의 길이 업데이트
    } else {
      setLastAddedRowIndex(null); // 추가된 행이 없으면 null로 설정
    }
  }, [props.data.length]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: props.columns, data: props.data });

  const getWidthStyle = (widthValue) => {
    if (typeof widthValue === "number") return `${widthValue}px`;
    if (typeof widthValue === "string" && widthValue.includes("%"))
      return widthValue;
    return undefined;
  };

  return (
    <TableContainer ref={tableContainerRef} height={props.height}>
      <table {...getTableProps()} className="namePickerTable hrGridTable">
        <thead>
          {headerGroups.map((headerGroup) => (
            <StyledTr
              {...headerGroup.getHeaderGroupProps()}
              className="hrHeaderStyle"
              data-is-header={true}
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
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              <StyledTr
                {...row.getRowProps()}
                className="hrRowStyle"
                onClick={() => {
                  if (props.setShowInsertRow) {
                    props.setShowInsertRow(false);
                  }
                  setSelectedRowIndex(index);
                }}
                style={
                  index === selectedRowIndex
                    ? { backgroundColor: "var(--color-secondary-blue)" }
                    : {}
                }
              >
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
          {props.showInsertRow && (
            <StyledTr
              style={
                selectedRowIndex === null && props.showInsertRow
                  ? { backgroundColor: "var(--color-secondary-blue)" }
                  : {}
              }
            >
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
        </tbody>

        {props.insertRow && (
          <StyledInsertFooter>
            <StyledTr>
              <StyledInsertTh
                colSpan={props.columns.length}
                onClick={() => {
                  props.setShowInsertRow((prevState) => !prevState);
                  setSelectedRowIndex(null);
                  setTimeout(() => {
                    if (tableContainerRef.current) {
                      tableContainerRef.current.scrollTop =
                        tableContainerRef.current.scrollHeight -
                        tableContainerRef.current.clientHeight;
                    }
                  }, 0);
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
