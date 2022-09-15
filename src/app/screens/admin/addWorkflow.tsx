import { Col, Form, Input, Row, Select } from "antd";
import { Component } from "react";
const Option = Select.Option;
export class AddWorkflow extends Component<any,any>{
    constructor(props:any){
        super(props)
    }
    render(){
        return(<>
        <Form  name="basic">
            <div>
                 <Form.Item
                    label="Process Name"
                    name={["request", "requestId"]}
                    rules={[{ required: true }]}
                >
                <Input
                    placeholder="Enter Solicitation Number"
                    maxLength={50}
                />
        </Form.Item>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={8}>
                              <Form.Item
                                label="Task Number"
                                name={["request", "domain"]}
                                rules={[{ required: true }]}
                              >
                               <Input
                                  placeholder="Enter Solicitation Number"
                                  maxLength={50}
                                 />
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={8}>
                              <Form.Item
                                label="Name"
                                name={["request", "subDomain"]}
                                rules={[{ required: true }]}
                              >
                                <Input
                                    placeholder="Enter Solicitation Number"
                                    maxLength={50}
                                />
                              </Form.Item>
                            </Col>
                         </Row>
                         <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={12}>
                              <Form.Item
                                label="Descripation"
                                name={["request", "domain"]}
                                rules={[{ required: true }]}
                              >
                               <Input
                                  placeholder="Enter Solicitation Number"
                                  maxLength={50}
                                 />
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={12}>
                              <Form.Item
                                label="Due Days"
                                name={["request", "subDomain"]}
                                rules={[{ required: true }]}
                              >
                                <Input
                                    placeholder="Enter Solicitation Number"
                                    maxLength={50}
                                />
                              </Form.Item>
                            </Col>
                         </Row>
                         <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                         <Col className="gutter-row" span={6}>
                              <Form.Item
                                label="Assignee"
                                name={["request", "complexity"]}
                              >
                                <Select>
                                  <Option value="High">High</Option>
                                  <Option value="Medium">Medium</Option>
                                  <Option value="Low">Low</Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item
                                label="Reminder Enabled"
                                name={["request", "complexity"]}
                              >
                                <Select>
                                  <Option value="High">High</Option>
                                  <Option value="Medium">Medium</Option>
                                  <Option value="Low">Low</Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item
                                label="No. of Reminders"
                                name={["request", "domain"]}
                                rules={[{ required: true }]}
                              >
                               <Input
                                  placeholder="Enter Solicitation Number"
                                  maxLength={50}
                                 />
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item
                                label="Reminder Frequency(Every Hour)"
                                name={["request", "subDomain"]}
                                rules={[{ required: true }]}
                              >
                                <Input
                                    placeholder="Enter Solicitation Number"
                                    maxLength={50}
                                />
                              </Form.Item>
                            </Col>
                            
                         </Row>
            </div>
        </Form>
        </>)
    }
}
export default AddWorkflow;