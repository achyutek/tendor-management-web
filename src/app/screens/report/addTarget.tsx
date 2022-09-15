import React, { Component } from "react";
import {
  Input,
  message,
  Row,
  Button,
  Col,
  PageHeader,
  Select,
  Form,
} from "antd";
import {
  RightOutlined,
  LeftOutlined,
  MergeCellsOutlined,
} from "@ant-design/icons";

const Option = Select.Option;
const { TextArea } = Input;
class AddTarget extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      current: 0,
      size: "default",
      keyboard: true,
      target: "",
      submissionData: "",
    };
  }
  onFinish() {}
  render() {
    const { target } = this.state;
    return (
      <>
        <Row>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 24 }}
          >
            <div className="site-page-header-ghost-wrapper">
              <PageHeader
                className="top-heading"
                ghost={false}
                title="RFP Target"
              ></PageHeader>
            </div>
          </Col>
        </Row>
        <Row>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 24 }}
          >
            <div className="form-bg form-steps">
              <Form name="basic" onFinish={this.onFinish} scrollToFirstError>
                <div>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={6}>
                      <Form.Item
                        label={<span> Domain</span>}
                        name={["target", "domain"]}
                      >
                        <Select value={target.domain}>
                          {/* {this.props.rfpByDomainData.map((data: any) => {
                            return (
                              <Option value={data.name}>{data.name}</Option>
                            );
                          })} */}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Form.Item
                        label={<span> Source</span>}
                        name={["target", "source"]}
                      >
                        <Select value={target.source}>
                          {/* {this.props.rfpBySourceData.map((data: any) => {
                            return (
                              <Option value={data.name}>{data.name}</Option>
                            );
                          })} */}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Form.Item
                        label={<span> Type</span>}
                        name={["target", "type"]}
                      >
                        <Select value={target.type}>
                          {/* {this.props.rfpByTypeData.map((data: any) => {
                            return (
                              <Option value={data.name}>{data.name}</Option>
                            );
                          })} */}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <Form.Item
                        label={<span> Price</span>}
                        name={["target", "price"]}
                      >
                        <Input placeholder="Enter Price" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={24}>
                      <Form.Item
                        label={<span> Comment</span>}
                        name={["target", "comment"]}
                      >
                        <TextArea maxLength={100} rows={4} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
                <div className="button-step">
                  {" "}
                  <Button style={{ marginRight: 8 }}>
                    <LeftOutlined /> Back
                  </Button>{" "}
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => message.success("Processing complete!")}
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </>
    );
  }
}
export default AddTarget;
