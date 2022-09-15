import React, { Component } from "react";
import { Table, Input, Row, Col, Button } from "antd";
import { helperFunctions } from "./helperFunctions";
const { Search } = Input;
const ColProps = {
  xs: 24,
  sm: 24,
};

export class SerachComponent extends Component<any, any> {
  searchKeys: [] = [];
  // searchKeys= [];
  filteredData: any;
  dataSource = [];
  splittedArray = ([] = []);
  constructor(props: any) {
    super(props);

    this.state = {
      loading: false,
      loadFilteredData: false,
    };
  }

  componentDidMount() {
    let i = 0;
    for (i = 0; i < this.searchKeys.length; i++) {
      this.splittedArray.push(this.searchKeys[i]);
    }
  }

  handleChange = (event: any) => {
    if (this.props.handleSearch) {
      this.props.handleSearch(event.target.value);
    } else {
      let searchInput = event.target.value;

      let i = 0;
      this.filteredData = this.dataSource.filter((value: any) => {
        for (i = 0; i < this.searchKeys.length; i++) {
          let j = 0;
          let obj = value;
          for (j = 0; j < this.splittedArray[i]; j++) {
            if (obj === null || obj === undefined) {
              break;
            }
            obj = obj[this.splittedArray[i][j]];
          }
          if (obj === null || obj === undefined) {
            continue;
          }
          if (
            obj
              .toString()
              .toLowerCase()
              .includes(searchInput.toLowerCase().trim())
          ) {
            return true;
          }
        }
        return false;
      });
      this.setState({ loadFilteredData: true });
    }
  };
  render() {
    return (
      <>
        <Row>
          <Col
            {...ColProps}
            xl={{ span: 16, offset: 0 }}
            md={{ span: 16, offset: 0 }}
          >
            <Search
              style={{ width: "30%", marginTop: "1%" }}
              placeholder="Search text"
              onChange={helperFunctions.debounceEventHandler(
                this.handleChange,
                500
              )}
              enterButton="Search"
            />
          </Col>
        </Row>{" "}
      </>
    );
  }
}
export default SerachComponent;
