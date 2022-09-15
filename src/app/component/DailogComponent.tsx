import React, { Component } from "react";
import { Modal, Form } from "antd";
import { message, Button, Spin } from "antd";

import { LeftOutlined } from "@ant-design/icons";
export class DailogComponent extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { loading: false };
  }

  render() {
    return (
      <>

        <Modal
          title={this.props.title}
          visible={this.props.setIsModalVisible}
          onCancel={this.props.closeModal}
          style={{ top: 20 }}
          centered
          destroyOnClose={true}
          maskClosable={false}
          footer={this.props.footer}
        >
          <Spin size="large" spinning={this.props.loading}>
            {this.props.content}
          </Spin>
        </Modal>

      </>
    );
  }
}

export default DailogComponent;
