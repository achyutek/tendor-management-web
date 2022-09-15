import React, { Component } from "react";
import "antd/dist/antd.css";
import {
  Steps,
  message,
  Button,
  Row,
  Col,
  PageHeader,
  Select,
  Form,
  Input,
  DatePicker,
  InputNumber,
} from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
const { Option } = Select;
const { TextArea } = Input;
const Step = Steps.Step;
const { RangePicker } = DatePicker;
const steps = [
  {
    title: "RFP Information",
    content: (
      <div>
        <Form.Item
          label={<span> Solicitation</span>}
          name={["user", "solicitation"]}
        >
          <Input placeholder="Enter Solicitation Number" />
        </Form.Item>
        <Form.Item label={<span> Title</span>} name={["user", "title"]}>
          <Input placeholder="Enter Title" />
        </Form.Item>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={8}>
            <Form.Item label={<span> Domain</span>} name={["user", "domain"]}>
              <Select>
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item
              label={<span> Sub Domain</span>}
              name={["user", "subdomain"]}
            >
              <Select>
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item
              label={<span> Complexity Level</span>}
              name={["user", "complexitylevel"]}
            >
              <Select>
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={8}>
            <Form.Item label={<span> Source</span>} name={["user", "domain"]}>
              <Select>
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item label={<span> Type</span>} name={["user", "subdomain"]}>
              <Select>
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item
              label={<span> Owner Name</span>}
              name={["user", "complexitylevel"]}
            >
              <Select>
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>
    ),
  },
  {
    title: "Agency Information",
    content: (
      <div>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={12}>
            <Form.Item
              label={<span> Agency Name</span>}
              name={["user", "solicitation"]}
            >
              <Input placeholder="Enter Agency Name" />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Form.Item
              label={<span> Agency Email</span>}
              name={["user", "title"]}
            >
              <Input placeholder="Enter Agency Email" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={12}>
            <Form.Item
              label={<span> Agency Website</span>}
              name={["user", "solicitation"]}
            >
              <Input placeholder="Enter Agency Website" />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Form.Item
              label={<span> Agency Contact Number</span>}
              name={["user", "title"]}
            >
              <Input placeholder="Enter Agency Contact Number" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label={<span> Address Line 1</span>}
          name={["user", "title"]}
        >
          <Input placeholder="Enter AgAddress Line 1" />
        </Form.Item>
        <Form.Item
          label={<span> Address Line 2</span>}
          name={["user", "title"]}
        >
          <Input placeholder="Enter AgAddress Line 2" />
        </Form.Item>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={12}>
            <Form.Item
              label={<span> Address Line 3</span>}
              name={["user", "solicitation"]}
            >
              <Input placeholder="Enter Address Line 3" />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Form.Item
              label={<span> Address Line 4</span>}
              name={["user", "title"]}
            >
              <Input placeholder="Enter Address Line 4" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={6}>
            <Form.Item label={<span> City</span>} name={["user", "domain"]}>
              <Input placeholder="Enter City" />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item label={<span> State</span>} name={["user", "subdomain"]}>
              <Input placeholder="Enter State" />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item
              label={<span> Country</span>}
              name={["user", "complexitylevel"]}
            >
              <Select>
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item
              label={<span> Zip Code</span>}
              name={["user", "complexitylevel"]}
            >
              <Input placeholder="Enter Zipcode" />
            </Form.Item>
          </Col>
        </Row>
      </div>
    ),
  },
  {
    title: "Contract Information",
    content: (
      <div>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={12}>
            <Form.Item
              label={<span> Contract Type</span>}
              name={["user", "solicitation"]}
            >
              <Select>
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Form.Item
              label={<span>Submission Type</span>}
              name={["user", "title"]}
            >
              <Select>
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={<span> Contract Details Url</span>}
          name={["user", "title"]}
        >
          <Input placeholder="Enter Contract Details Url" />
        </Form.Item>
        <Form.Item label={<span> Due Date</span>} name={["user", "title"]}>
          <DatePicker />
        </Form.Item>
        <Form.Item
          label={<span> Contract Price</span>}
          name={["user", "title"]}
        >
          <InputNumber min={1} max={10} defaultValue={3} />
        </Form.Item>
      </div>
    ),
  },
  {
    title: "Contact Information",
    content: (
      <div>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={12}>
            <Form.Item
              label={<span> Title</span>}
              name={["user", "solicitation"]}
            >
              <Input placeholder="Enter Title" />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Form.Item label={<span>Name</span>} name={["user", "title"]}>
              <Input placeholder="Enter Name" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={12}>
            <Form.Item
              label={<span> Email</span>}
              name={["user", "solicitation"]}
            >
              <Input placeholder="Enter Email" />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Form.Item
              label={<span>Contact No.</span>}
              name={["user", "title"]}
            >
              <Input placeholder="Enter Contact No." />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={<span> Contract Details Url</span>}
          name={["user", "title"]}
        >
          <TextArea maxLength={100} rows={4} />
        </Form.Item>
      </div>
    ),
  },
];

export class Addwonproposal extends Component {
  state = {
    current: 0,
    size: "default",
    keyboard: true,
  };
  next() {
    const current = this.state.current + 1;

    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;

    this.setState({ current });
  }
  toggle = () => {
    this.setState({
      keyboard: !this.state.keyboard,
    });
  };
  render() {
    const { current } = this.state;
    const { size } = this.state;
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
                ghost={false}
                title="Add Proposal"
                className="form-top-heading"
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
            <div className="form-bg">
              <Steps current={current}>
                {steps.map((item) => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
              <Form name="basic" scrollToFirstError>
                {steps.map(({ title, content }, i) => (
                  <div
                    key={title}
                    className={i === this.state.current ? "foo fade-in" : "foo"}
                  >
                    {content}
                  </div>
                ))}

                <div className="steps-action">
                  {this.state.current > 0 && (
                    <Button
                      style={{ marginRight: 8 }}
                      onClick={() => this.prev()}
                    >
                      <LeftOutlined /> Back
                    </Button>
                  )}
                  {this.state.current == 0 && <Button>Cancel </Button>}
                  {this.state.current < steps.length - 1 && (
                    <>
                      <Button
                        style={{ marginLeft: 8 }}
                        type="primary"
                        onClick={() => this.next()}
                      >
                        {" "}
                        Continue <RightOutlined />
                      </Button>
                    </>
                  )}
                  {this.state.current === steps.length - 1 && (
                    <Button
                      type="primary"
                      onClick={() => message.success("Processing complete!")}
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </>
    );
  }
}

export default Addwonproposal;
