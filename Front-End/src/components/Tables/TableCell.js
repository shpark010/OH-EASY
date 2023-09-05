import React, { Component } from "react";

class TableCell extends Component {
  render() {
    const { data, cell, eventHandlers } = this.props;

    if (React.isValidElement(cell)) {
      // 컴포넌트를 직접 렌더링
      return <td>{React.cloneElement(cell, { ...this.props })}</td>;
    } else if (typeof data === "object") {
      // data가 객체인 경우 (이 부분을 추가합니다.)
      console.log("Invalid data for rendering:", data);
      return <td>Error</td>;
    } else {
      // 기본 텍스트 셀 렌더링
      return <td onClick={eventHandlers.onClick}>{data}</td>;
    }
  }
}

export default TableCell;
