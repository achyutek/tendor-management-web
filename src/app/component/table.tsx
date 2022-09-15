import React, { Component } from "react";
import { Pagination, Table, Spin, Button, Row, Col } from "antd";
import { PlusOutlined, DeleteFilled } from "@ant-design/icons";
export class Table1 extends Component<any, any> {
  state = {
    loading: false,
    selectedRow: [],
  };

  onSelectChange = (selectedRow: any) => {
    this.props.handleSelect(selectedRow);
    // this.setState({ selectedRow });
  };

  onPageChange = (pageObject: any) => {
    this.props.handlePageChange(pageObject.current);
  };

  handleDeleteButton = () => {
    this.props.handleDelete(this.state.selectedRow);
  };

  render() {
    const { loading, selectedRow } = this.state;

    let rowSelection = {
      selectedRow,
      onChange: this.onSelectChange,
    };

    let pageProps = {};
    if (
      this.props.totalPages &&
      this.props.handlePageChange &&
      this.props.currentPage
    ) {
      pageProps = {
        pagination: {
          total: this.props.totalPages,
          current: this.props.currentPage,
          showSizeChanger: false,
        },
        onChange: (pageObject: any) => this.onPageChange(pageObject),
      };
    }

    return (
      <>
        {loading ? <div className="loading">Loading&#8230;</div> : ""}

        <Spin size="large" spinning={this.props.loading}>
          {this.props.checkBox ? (
            <>
              <Table
                rowSelection={rowSelection}
                columns={this.props.columns}
                loading={loading}
                bordered={true}
                rowKey={(record) => {
                  return record;
                }}
                dataSource={this.props.data}
                className="desktop1"
                {...pageProps}
              />
              <Table
                rowSelection={rowSelection}
                scroll={{ x: 1500, y: 440 }}
                columns={this.props.columns}
                rowKey={(record) => {
                  return record;
                }}
                loading={loading}
                dataSource={this.props.data}
                className="mobile1"
                {...pageProps}
              />
            </>
          ) : (
            <>
              <Table
                columns={this.props.columns}
                loading={loading}
                bordered={true}
                dataSource={this.props.data}
                className="desktop1"
                // pagination={false}
              />
              <Table
                scroll={{ x: 1500, y: 440 }}
                columns={this.props.columns}
                loading={loading}
                dataSource={this.props.data}
                className="mobile1"
                // pagination={false}
              />
            </>
          )}
        </Spin>
      </>
    );
  }
}
