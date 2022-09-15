import { wait } from "@testing-library/react";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Spin,
  Tabs,
  Tooltip,
} from "antd";
import { Component } from "react";
import { Table1 } from "../../component/table";
import { rfpService } from "../../services/rfp-service";
import { AttributeType } from "../../_redux/_constants";
import addButton from "../../../assets/images/addButton.png";
import { DeleteFilled } from "@ant-design/icons";
import DailogComponent from "../../component/DailogComponent";
import { async } from "q";
import { Attribute } from "../../_models/attribute.model";
import { notifications } from "../../_helpers/notifications";
import { MessageProp } from "../../_globals/constants/message.constants";
import { Link } from "react-router-dom";
import { threadId } from "worker_threads";
const Option = Select.Option;
const { TabPane } = Tabs;
const columns = [
  {
    key: "name",
    title: "Process Name",
    dataIndex: "name",
  },
  {
    title: "BPNM File",
    dataIndex: "bpmnFile",
  },
];
const columnsName = [
  {
    key: "name",
    title: "Process Name",
    dataIndex: "name",
  },
];

export class AdminPage extends Component<any, any> {
  domain: string = "";
  subDomain: string = "";
  region: string = "";
  constructor(props: any) {
    super(props);
    this.state = {
      workflow: "",
      status: "",
      type: "",
      domain: [],
      subdomain: "",
      source: "",
      contarctType: "",
      submission: "",
      region: [],
      visible: false,
      title: "",
      loading: true,
      content: "",
      selectAttribute: "",
      attribute: new Attribute(),
      selectedRow: [],
    };
  }
  componentDidMount = async () => {
    this.region = "US";
    this.domain = "Staffing";
    await this.getRegion();
    this.getProcessDef();
    this.getStatus();
    this.getType();
    this.getSource();
    this.getConteractType();
    this.getSubmission();
    let response = await rfpService.getDomain(this.region).then().catch();
    this.setState({
      domain: response,
    });
    let responseSubDomain = await rfpService
      .getSubDomains(this.domain)
      .then()
      .catch();
    this.setState({
      subdomain: responseSubDomain,
    });
  };

  getProcessDef = () => {
    rfpService.getProcessDefs().then((response: any) => {
      this.setState({
        workflow: response,
      });
    });
  };
  getStatus = async () => {
    await rfpService
      .getRfpByAttribute(AttributeType.STATUS)
      .then((response: any) => {
        this.setState({
          status: response,
          loading: false,
        });
      });
  };
  getType = () => {
    rfpService.getRfpByAttribute(AttributeType.TYPE).then((response: any) => {
      this.setState({
        type: response,
        loading: false,
      });
    });
  };

  getRegion = () => {
    rfpService.getRfpByAttribute(AttributeType.REGION).then((response: any) => {
      this.setState({
        region: response,
        loading: false,
      });
    });
  };

  handledomainChange = async (domain: any) => {
    this.domain = domain;
    let response = await rfpService.getSubDomains(domain).then().catch();
    this.setState({
      subdomain: response,
      loading: false,
    });
  };

  handlRegionChange = async (region: any) => {
    this.region = region;
    let response = await rfpService.getDomain(region).then().catch();
    this.setState({
      domain: response,
      loading: false,
    });
    if (response != "") {
      let domainName = response[0].name;
      this.domain = domainName;
    } else {
      this.domain = "";
      this.setState({
        domain: [],
      });
    }
  };

  handlRegionChangeWithDomain = async (region: any) => {
    this.region = region;
    let response = await rfpService.getDomain(region).then().catch();
    this.setState({
      domain: response,
      loading: false,
    });
    if (response != "") {
      let domainName = response[0].name;
      this.domain = domainName;
      this.handledomainChange(domainName);
    } else {
      this.domain = "";
      this.setState({
        domain: [],
        subdomain: "",
      });
    }
  };

  getSource = () => {
    this.setState({ loading: true });
    rfpService.getRfpByAttribute(AttributeType.SOURCE).then((response: any) => {
      this.setState({
        source: response,
        loading: false,
      });
    });
  };
  getConteractType = () => {
    rfpService
      .getRfpByAttribute(AttributeType.CONTRACT)
      .then((response: any) => {
        this.setState({
          contarctType: response,
          loading: false,
        });
      });
  };
  getSubmission = () => {
    rfpService
      .getRfpByAttribute(AttributeType.SUBMISSION)
      .then((response: any) => {
        this.setState({
          submission: response,
          loading: false,
        });
      });
  };

  closeModal = () => {
    this.setState({ visible: false });
  };

  addAttributes = (e: any) => {
    this.setState({
      selectAttribute: e,
    });
    let content = (
      <>
        <Row>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 24 }}
          >
            <div className="form-bg form-steps">
              <Form
                name="basic"
                onFinish={this.onFinish}
                className="task-form"
                scrollToFirstError
              >
                <div>
                  {e === "Domain" ? (
                    <>
                      <Col className="gutter-row" span={24}>
                        <Form.Item
                          label="Region"
                          name={["attribute", "context"]}
                          rules={[{ required: true }]}
                        >
                          <Select id="rc_select_region">
                            {this.state.region.map((data: any) => {
                              return (
                                <Option value={data.name}>{data.name}</Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </>
                  ) : (
                    ""
                  )}
                  {e === "SubDomain" ? (
                    <>
                      <Col className="gutter-row" span={24}>
                        <Form.Item
                          label="domain"
                          name={["attribute", "type"]}
                          rules={[{ required: true }]}
                        >
                          <Select id="rc_select_domain">
                            {this.state.domain.map((data: any) => {
                              return (
                                <Option value={data.name}>{data.name}</Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </>
                  ) : (
                    ""
                  )}
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={24}>
                      <Form.Item
                        label="Name"
                        name={["attribute", "name"]}
                        rules={[{ required: true }]}
                      >
                        <Input placeholder={e} maxLength={100} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </>
    );
    this.setState({ visible: true, content, title: e });
  };

  onFinish = (value: any) => {
    this.setState({ loading: true });
    this.setState({
      attribute: {
        ...this.state.attribute,
        ...value.attribute,
      },
    });
    if (this.state.selectAttribute === "Status") {
      this.addAttribute(AttributeType.STATUS);
    } else if (this.state.selectAttribute === "Type") {
      this.addAttribute(AttributeType.TYPE);
    } else if (this.state.selectAttribute === "Region") {
      this.addAttribute(AttributeType.REGION);
    } else if (this.state.selectAttribute === "Domain") {
      this.addAttribute(AttributeType.DOMAIN);
    } else if (this.state.selectAttribute === "SubDomain") {
      this.addAttribute(AttributeType.SUBDOMAIN);
    } else if (this.state.selectAttribute === "Source") {
      this.addAttribute(AttributeType.SOURCE);
    } else if (this.state.selectAttribute === "ContractType") {
      this.addAttribute(AttributeType.CONTRACT);
    } else if (this.state.selectAttribute === "SubmissionType") {
      this.addAttribute(AttributeType.SUBMISSION);
    }
  };
  addAttribute = async (type: string) => {
    if (type === "subDomain") {
      this.state.attribute.context = "SubDomain";
    } else {
      this.state.attribute.type = type;
    }
    await rfpService
      .addAttribute(this.state.attribute, type)
      .then((response: any) => {
        notifications.openSuccessNotification(
          MessageProp.getAddedSuccessMessage(type)
        );

        if (type === "status") {
          this.getStatus();
        } else if (type === "type") {
          this.getType();
        } else if (type === "region") {
          this.getRegion();
        } else if (type === "domain") {
          this.handlRegionChange(this.state.attribute.context);
        } else if (type === "source") {
          this.getSource();
        } else if (type === "contract") {
          this.getConteractType();
        } else if (type === "submission") {
          this.getSubmission();
        } else if (this.state.attribute.context === "SubDomain") {
          this.handledomainChange(this.state.attribute.type);
        }
        this.setState({ loading: false });
        this.closeModal();
      })
      .catch(notifications.openErrorNotification);
  };

  handleSelect = (RwoId: any) => {
    this.setState({ selectedRow: RwoId });
  };

  handleDeleteButton = async () => {
    if (this.state.selectedRow.length === 0) {
      notifications.openErrorNotification("Please Select Row");
    } else {
      Modal.confirm({
        title: "Delete Attributes",
        content: "Are you sure you want to delete Attributes?",
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
          this.confirmDelete();
        },
      });
    }
  };

  confirmDelete = () => {
    this.setState({ loading: true });
    this.state.selectedRow.map((data: any) => {
      return rfpService
        .deleteAttributes(data)
        .then(async (response: any) => {
          notifications.openSuccessNotification(
            MessageProp.getDeletedSucessMessage("Attributes")
          );
          if (data.type === "status") {
            this.getStatus();
          } else if (data.type === "type") {
            this.getType();
          } else if (data.type === "region") {
            this.getRegion();
          } else if (data.type === "domain") {
            this.handlRegionChange("US");
          } else if (data.type === "source") {
            this.getSource();
          } else if (data.type === "ContractType") {
            this.getConteractType();
          } else if (data.type === "submission") {
            this.getSubmission();
          } else if (data.context === "subDomain") {
            this.handledomainChange(data.type);
          }
          this.setState({ loading: false });
        })
        .catch(notifications.openErrorNotification);
    });
  };

  render() {
    return (
      <>
        <DailogComponent
          setIsModalVisible={this.state.visible}
          closeModal={this.closeModal}
          content={this.state.content}
          title={this.state.title}
          loading={this.state.loading}
        ></DailogComponent>
        <div className="site-page-header-ghost-wrapper view-file-common">
          <Tabs defaultActiveKey="1" centered>
            <TabPane tab="Attributes" key="1">
              <Tabs defaultActiveKey="1" centered>
                <TabPane tab="Status" key="1">
                  <Tooltip title="Delete Attributes">
                    <Button
                      type="primary"
                      value="Status"
                      onClick={this.handleDeleteButton}
                      className="add-button fr ml1 button-doc buttonSelect marginBottom"
                    >
                      <DeleteFilled />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Add New Attributes">
                    <Button
                      type="primary"
                      onClick={() => this.addAttributes("Status")}
                      className="add-button buttonSelect"
                    >
                      <img src={addButton} />
                    </Button>
                  </Tooltip>
                  <Table1
                    data={this.state.status}
                    columns={columnsName}
                    rowIdentifier="id"
                    loading={this.state.loading}
                    checkBox={true}
                    handleSelect={this.handleSelect}
                  />
                </TabPane>
                <TabPane tab="Type" key="2">
                  <Tooltip title="Delete Attributes">
                    <Button
                      type="primary"
                      onClick={this.handleDeleteButton}
                      className="add-button fr ml1 button-doc buttonSelect marginBottom"
                    >
                      <DeleteFilled />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Add New Attributes">
                    <Button
                      type="primary"
                      onClick={() => this.addAttributes("Type")}
                      className="add-button buttonSelect"
                    >
                      <img src={addButton} />
                    </Button>
                  </Tooltip>
                  <Table1
                    data={this.state.type}
                    columns={columnsName}
                    rowIdentifier="id"
                    loading={this.state.loading}
                    checkBox={true}
                    handleSelect={this.handleSelect}
                  />
                </TabPane>
                <TabPane tab="Region" key="3">
                  <Tooltip title="Delete Attributes">
                    <Button
                      type="primary"
                      onClick={this.handleDeleteButton}
                      className="add-button fr ml1 button-doc buttonSelect marginBottom"
                    >
                      <DeleteFilled />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Add New Attributes">
                    <Button
                      type="primary"
                      onClick={() => this.addAttributes("Region")}
                      className="add-button buttonSelect"
                    >
                      <img src={addButton} />
                    </Button>
                  </Tooltip>
                  <Table1
                    data={this.state.region}
                    columns={columnsName}
                    rowIdentifier="id"
                    loading={this.state.loading}
                    checkBox={true}
                    handleSelect={this.handleSelect}
                  />
                </TabPane>
                <TabPane tab="Domain" key="4">
                  <Tooltip title="Delete Attributes">
                    <Button
                      type="primary"
                      onClick={this.handleDeleteButton}
                      className="add-button fr ml1 button-doc buttonSelect marginBottom"
                    >
                      <DeleteFilled />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Add New Attributes">
                    <Button
                      type="primary"
                      value="Domain"
                      onClick={() => this.addAttributes("Domain")}
                      className="add-button buttonSelect"
                    >
                      <img src={addButton} />
                    </Button>
                  </Tooltip>
                  <Select
                    className="admin-dropdawn"
                    onChange={this.handlRegionChange}
                    value={this.region}
                    id="rc_select_region"
                  >
                    {this.state.region.map((data: any) => {
                      return <Option value={data.name}>{data.name}</Option>;
                    })}
                  </Select>
                  <Table1
                    className="select-class"
                    data={this.state.domain}
                    columns={columnsName}
                    rowIdentifier="id"
                    loading={this.state.loading}
                    checkBox={true}
                    handleSelect={this.handleSelect}
                  />
                </TabPane>
                <TabPane tab="Sub-Domain" key="5">
                  <Tooltip title="Delete Attributes">
                    <Button
                      type="primary"
                      onClick={this.handleDeleteButton}
                      className="add-button fr ml1 button-doc buttonSelect marginBottom"
                    >
                      <DeleteFilled />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Add New Attributes">
                    <Button
                      type="primary"
                      onClick={() => this.addAttributes("SubDomain")}
                      className="add-button buttonSelect"
                    >
                      <img src={addButton} />
                    </Button>
                  </Tooltip>
                  <Select
                    className="admin-dropdawn"
                    onChange={this.handlRegionChangeWithDomain}
                    value={this.region}
                    id="rc_select_region"
                  >
                    {this.state.region.map((data: any) => {
                      return <Option value={data.name}>{data.name}</Option>;
                    })}
                  </Select>
                  <Select
                    className="admin-dropdawn"
                    onChange={this.handledomainChange}
                    id="rc_select_domain"
                    value={this.domain}
                  >
                    {this.state.domain.map((data: any) => {
                      return <Option value={data.name}>{data.name}</Option>;
                    })}
                  </Select>
                  <Table1
                    className="select-class"
                    data={this.state.subdomain}
                    columns={columnsName}
                    rowIdentifier="id"
                    loading={this.state.loading}
                    checkBox={true}
                    handleSelect={this.handleSelect}
                  />
                </TabPane>
                <TabPane tab="Source" key="6">
                  <Tooltip title="Delete Attributes">
                    <Button
                      type="primary"
                      onClick={this.handleDeleteButton}
                      className="add-button fr ml1 button-doc buttonSelect marginBottom"
                    >
                      <DeleteFilled />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Add New Attributes">
                    <Button
                      type="primary"
                      onClick={() => this.addAttributes("Source")}
                      className="add-button buttonSelect"
                    >
                      <img src={addButton} />
                    </Button>
                  </Tooltip>
                  <Table1
                    data={this.state.source}
                    columns={columnsName}
                    rowIdentifier="id"
                    loading={this.state.loading}
                    checkBox={true}
                    handleSelect={this.handleSelect}
                  />
                </TabPane>
                <TabPane tab="Contract Type" key="7">
                  <Tooltip title="Delete Attributes">
                    <Button
                      type="primary"
                      onClick={this.handleDeleteButton}
                      className="add-button fr ml1 button-doc buttonSelect marginBottom"
                    >
                      <DeleteFilled />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Add New Attributes">
                    <Button
                      type="primary"
                      onClick={() => this.addAttributes("ContractType")}
                      className="add-button buttonSelect"
                    >
                      <img src={addButton} />
                    </Button>
                  </Tooltip>
                  <Table1
                    data={this.state.contarctType}
                    columns={columnsName}
                    rowIdentifier="id"
                    loading={this.state.loading}
                    checkBox={true}
                    handleSelect={this.handleSelect}
                  />
                </TabPane>
                <TabPane tab="Submission Type" key="8">
                  <Tooltip title="Delete Attributes">
                    <Button
                      type="primary"
                      onClick={this.handleDeleteButton}
                      className="add-button fr ml1 button-doc buttonSelect marginBottom"
                    >
                      <DeleteFilled />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Add New Attributes">
                    <Button
                      type="primary"
                      onClick={() => this.addAttributes("SubmissionType")}
                      className="add-button buttonSelect"
                    >
                      <img src={addButton} />
                    </Button>
                  </Tooltip>
                  <Table1
                    data={this.state.submission}
                    columns={columnsName}
                    rowIdentifier="id"
                    loading={this.state.loading}
                    checkBox={true}
                    handleSelect={this.handleSelect}
                  />
                </TabPane>
              </Tabs>
            </TabPane>
            <TabPane tab="Workflow" key="2">
              {/* <Tooltip title="Add New Workflow">
                <Link hidden={this.state.allowEdit} to={"/addWorkflow"}>
                  <Button className="add-button buttonSelect">
                    <img src={addButton} />
                  </Button>
                </Link>
              </Tooltip> */}
              <Table1
                data={this.state.workflow}
                columns={columns}
                rowIdentifier="id"
                loading={this.state.loading}
                checkBox={true}
                handleSelect={this.handleSelect}
              />
            </TabPane>
          </Tabs>
        </div>{" "}
      </>
    );
  }
}
export default AdminPage;
