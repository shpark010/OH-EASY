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
  &:focus {
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
  //const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  // const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [selectedRowIndex, setSelectedRowIndex] = useState(props.index || 0);

  const [prevRowsLength, setPrevRowsLength] = useState(props.data.length); // 초기 rows의 길이 저장
  const [lastAddedRowIndex, setLastAddedRowIndex] = useState(null); // 마지막으로 추가된 행의 인덱스 저장
  useEffect(() => {
    console.log("props.data.length:", props.data.length);
    if (props.bottomFocus) {
      // rows의 길이가 이전 길이보다 크면
      if (props.data.length > prevRowsLength) {
        const lastIndex = props.data.length - 1; // 마지막 행 인덱스
        setPrevRowsLength(props.data.length); // rows의 길이 업데이트
        setSelectedRowIndex(lastIndex); // 선택된 행을 마지막 행으로 설정
      } else {
        const lastIndex = props.data.length - 1; // 마지막 행 인덱스
        setSelectedRowIndex(lastIndex); // 선택된 행을 마지막 행으로 설정
        //setSelectedRowIndex(lastIndex); // 선택된 행을 마지막 행으로 설정
      }
      if (tableContainerRef.current) {
        tableContainerRef.current.scrollTop =
          tableContainerRef.current.scrollHeight -
          tableContainerRef.current.clientHeight;
      }
    } else {
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
          {headerGroups.map((headerGroup, headerIndex) => (
            <StyledTr
              {...headerGroup.getHeaderGroupProps()}
              key={headerIndex} // 추가
              className="hrHeaderStyle"
              data-is-header={true}
            >
              {headerGroup.headers.map((column) => (
                <StyledTh
                  {...column.getHeaderProps()}
                  key={column.id}
                  width={column.width}
                >
                  {column.render("Header")}
                </StyledTh>
              ))}
            </StyledTr>
          ))}
          <StyledTr key="empty-header">
            <StyledTh style={{ width: "15px", padding: "0" }} />
          </StyledTr>
        </thead>

        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              <StyledTr
                tabIndex="1"
                {...row.getRowProps()}
                id={`focusOn_${row.original.code}`}
                className="hrRowStyle"
                onClick={() => {
                  if (props.setShowInsertRow) {
                    props.setShowInsertRow(false);
                  }
                  setSelectedRowIndex(index);
                }}
                style={
                  index === selectedRowIndex && selectedRowIndex !== "insert"
                    ? { backgroundColor: "var(--color-secondary-blue)" }
                    : {}
                }
              >
                {row.cells.map((cell) => (
                  <StyledTd
                    {...cell.getCellProps()}
                    key={cell.column.id} // 추가
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
              key="insert-row"
              style={
                selectedRowIndex === "insert"
                  ? { backgroundColor: "var(--color-secondary-blue)" }
                  : {}
              }
            >
              {props.columns.map((column, index) => {
                const CellContent = column.Cell;
                return (
                  <StyledTd
                    key={index}
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
              <StyledInsertTh key="insert-th" colSpan={props.columns.length}>
                <StyledBtn
                  onClick={() => {
                    props.setShowInsertRow((prevState) => !prevState);
                    setSelectedRowIndex("insert"); // 'insert'로 설정
                    setTimeout(() => {
                      if (tableContainerRef.current) {
                        tableContainerRef.current.scrollTop =
                          tableContainerRef.current.scrollHeight -
                          tableContainerRef.current.clientHeight;
                      }
                    }, 0);

                    if (props.onAddButtonClick) {
                      props.onAddButtonClick();
                    }
                  }}
                >
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
