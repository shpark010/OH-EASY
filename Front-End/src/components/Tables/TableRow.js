import React, { Component } from "react";
import TableCell from "./TableCell";
import styled from "styled-components";

const StyledRow = styled.tr``;

class TableRow extends Component {
  state = {
    isHovered: false,
  };

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  render() {
    const { data, eventHandlers, cells } = this.props;
    const { isHovered } = this.state;

    return (
      <StyledRow
        style={{
          backgroundColor: isHovered
            ? "var(--color-border-gray)"
            : "transparent",
        }}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {data.map((cellData, cellIndex) => (
          <TableCell
            key={cellIndex}
            data={cellData}
            cell={cells[cellIndex]}
            eventHandlers={eventHandlers}
          />
        ))}
      </StyledRow>
    );
  }
}

export default TableRow;
