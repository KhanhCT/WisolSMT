import React, { PureComponent } from "react";
import { Table } from "reactstrap";
import PropTypes from "prop-types";

export class TableComponent extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    striped: PropTypes.bool,
    hover: PropTypes.bool,
    responsive: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
  };

  render() {
    return (
      <Table
        id={this.props.id}
        className={this.props.className}
        striped={this.props.striped}
        hover={this.props.hover}
        responsive={this.props.responsive}
        style={this.props.style}
      >
        {this.props.children}
      </Table>
    );
  }
}
