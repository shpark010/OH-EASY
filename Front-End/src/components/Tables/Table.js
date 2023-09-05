import React, { Component } from "react";
import TableRow from "./TableRow";

class Table extends Component {
  render() {
    const {
      data = [],
      headers = [],
      colWidths = [],
      eventHandlers = {},
      cells = [],
    } = this.props;

    return (
      <table className="namePickerTable hrGridTable borderTopBold">
        <colgroup>
          {colWidths.map((width, index) => (
            <col key={index} width={width} />
          ))}
        </colgroup>
        <thead>
          <tr className="hrHeaderStyle">
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                data={row}
                eventHandlers={eventHandlers}
                cells={cells}
              />
            ))
          ) : (
            <tr>
              <td colSpan={headers.length || 1}>데이터가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}

export default Table;
