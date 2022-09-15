import React, { Component } from "react";
import {
  Table,
  Input,
  Button,
  Row,
  Col,
  PageHeader,
  Select,
  Form,
  message,
  Collapse,
  Modal,
} from "antd";
import {
  DeleteFilled,
  ClockCircleOutlined,
  PlusCircleOutlined,
  FormOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import History from "../../../../assets/img/history.svg";
import Edit from "../../../../assets/img/edit.svg";
import { Table1 } from "../../../component/table";
import { rfpService } from "../../../services/rfp-service";
import { Link } from "react-router-dom";
import DailogComponent from "../../../component/DailogComponent";
import { ResponseContent } from "../../../_models/proposal-request.model";
import { connect } from "react-redux";
import { proposalsAction } from "../../../_redux/_actions";
import { notifications } from "../../../_helpers/notifications";
import { MessageProp } from "../../../_globals/constants/message.constants";
import GlobalSearchComponent from "../../../component/SearchComponent";
// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

import FroalaEditorComponent from "react-froala-wysiwyg";

// Import all Froala Editor plugins;
import "froala-editor/js/plugins.pkgd.min.js";

// Import a single Froala Editor plugin.
import "froala-editor/js/plugins/align.min.js";

// Import a language file.
import "froala-editor/js/languages/de.js";

// Import a third-party plugin.
import "froala-editor/js/third_party/image_tui.min.js";
import "froala-editor/js/third_party/embedly.min.js";
import "froala-editor/js/third_party/spell_checker.min.js";
import { AttributeType } from "../../../_redux/_constants";

const Option = Select.Option;
const { TextArea, Search } = Input;
const { Panel } = Collapse;
class Responses extends Component<any, any> {
  text = (
    <p style={{ paddingLeft: 24 }}>
      A dog is a type of domesticated animal. Known for its loyalty and
      faithfulness, it can be found as a welcome guest in many households across
      the world.
    </p>
  );
  pageNo = 1;
  totalPage = 0;
  currentPage = 1;
  domainValue: string = "";
  subDomainValue: string = "";
  region: string = "";
  constructor(props: any) {
    super(props);
    this.state = {
      responses: [],
      historyData: [],
      loading: true,
      visible: false,
      title: "",
      subdomainData: [],
      responseContent: new ResponseContent(),
      totalPage: 68,
      expandIconPosition: "right",
      historyDataPages: 1,
      selectedRow: [],
      allowAddDelete: false,
      allowEdit: true,
      allowEditContent: false,
      allowEditContentAndStatus: false,
      region: [],
      domain: [],
      domainName: "",
      subDoaminName: "",
    };
  }
  onPositionChange = (expandIconPosition: any) => {
    this.setState({ expandIconPosition });
  };
  columnsHistory = [
    {
      title: "Question",
      dataIndex: "question",
    },
    {
      title: "Answer",
      dataIndex: "answer",
      render: (text: any, record: any) => {
        return (
          <span
            onClick={() => {
              this.getAnswer(record);
            }}
          >
            <a className="responses-view">view</a>
          </span>
        );
      },
    },
    {
      title: "Version",
      dataIndex: "number",
    },
  ];

  getResponseHistory = async (record: any) => {
    this.setState({
      historyData: await rfpService
        .getResponseContentChildsById(record.id, record.question, this.pageNo)
        .then()
        .catch(notifications.openErrorNotification),
      loading: false,
    });
  };

  handleSelect = (RwoId: any) => {
    this.setState({ selectedRow: RwoId });
  };

  handleDeleteButton = () => {
    if (this.state.selectedRow.length === 0) {
      notifications.openErrorNotification("Please Select Row");
    } else {
      Modal.confirm({
        title: "Delete Response Content",
        content: "Are you sure you want to delete Response Content?",
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
          this.confirmDelete();
        },
      });
    }
  };

  confirmDelete = () => {
    rfpService
      .deleteResponseContent(this.state.selectedRow)
      .then((response) => {
        this.domainValue = "Staffing";
        this.subDomainValue = "Staffing";
        this.getResponseContentBySubDomain("US", "Staffing", "Staffing", -1);
        notifications.openSuccessNotification(
          MessageProp.getDeletedSucessMessage("Response Content")
        );
      })
      .catch(notifications.openErrorNotification);
  };
  setHistoryContent = async (record: any) => {
    await this.getResponseHistory(record);
    let content = (
      <>
        {/* <Collapse bordered={false} defaultActiveKey={["1"]}>
          <Panel
            header="Quastion"
            extra={[
              <Col span={24}>
                <span>3.0</span>
              </Col>,
            ]}
            key="1"
          >
            {this.text}
          </Panel>
         
        </Collapse> */}
        <Table1
          data={this.state.historyData}
          columns={this.columnsHistory}
          loading={this.state.loading}
          currentPage={this.currentPage}
          totalPages={this.state.historyDataPages}
          checkBox={false}
        />
      </>
    );
    this.setState({ visible: true, content, title: "History" });
  };

  handlePageChange = (pageNumber: any) => {
    this.callData(pageNumber);
  };

  callData = async (pageNumber: any) => {
    this.currentPage = pageNumber;
  };

  getAnswer = (record: any) => {
    let content = <span dangerouslySetInnerHTML={{ __html: record.answer }} />;

    this.setState({ visible: true, content, title: "Answer" });
  };

  updateResponseContent = (record: any) => {
    rfpService
      .updateProposalResponseContent(record)
      .then((response) => {})
      .catch(notifications.openErrorNotification);
  };

  editResponse = (record: any) => {
    let content = (
      <>
        {" "}
        <Row>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 24 }}
          >
            <div className="form-bg form-steps">
              <div>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col className="gutter-row" span={12}>
                    <Form.Item label={<span>Domain</span>}>
                      <Input
                        placeholder="Enter Solicitation Number"
                        value={record.domain}
                      />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <Form.Item label={<span>Sub Domain</span>}>
                      <Input
                        placeholder="Enter Solicitation Number"
                        value={record.subDomain}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col className="gutter-row" span={24}>
                    <Form.Item label={<span>Question</span>}>
                      <Input
                        placeholder="Enter Solicitation Number"
                        value={record.question}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col className="gutter-row" span={24}>
                    <Form.Item
                      label={<span> Answer</span>}
                      name={["user", "address"]}
                    >
                      <FroalaEditorComponent
                        tag="textarea"
                        model={record.answer}
                      />
                      {/* <span dangerouslySetInnerHTML={{ __html: record.answer }} /> */}
                    </Form.Item>
                  </Col>
                </Row>
              </div>
              <div className="button-right">
                <Button className="button-cancel">Cancel</Button>{" "}
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    this.updateResponseContent(record);
                  }}
                  className="success-button"
                >
                  Save
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </>
    );
    this.setState({ visible: true, content, title: "Response[Edit]" });
  };

  columns = [
    {
      title: "History",
      dataIndex: "history",
      render: (text: any, record: any) => {
        return record.count > 1 ? (
          <>
            {" "}
            <span
              onClick={() => {
                this.setHistoryContent(record);
              }}
            >
              <h3>
                <b>
                  <img src={History} alt="" />
                </b>
              </h3>
            </span>{" "}
          </>
        ) : (
          <></>
        );
      },
    },
    {
      title: "Question",
      dataIndex: "question",
      textWrap: "word-break",
    },
    {
      title: "Answer",
      dataIndex: "answer",
      render: (text: any, record: any) => {
        return (
          // <span dangerouslySetInnerHTML={{ __html: record.answer }}>
          //   ;
          <span
            onClick={() => {
              this.getAnswer(record);
            }}
          >
            <a className="responses-view">View</a>
          </span>
          // </span>
        );
      },
    },
    {
      title: "Version",
      dataIndex: "number",
    },
    {
      title: "Status",
      render: (text: any, record: any) => {
        // {this.state.allowEdit?():('')}
        return record.status !== "Approved" ? (
          <>
            <Link to={"/contents?id=" + record.id} style={{ color: "#13b4ca" }}>
              {record.status}
            </Link>
          </>
        ) : (
          <>{record.status}</>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: any, record: any) => {
        return record.status === "undefind" || record.status === "Pending" ? (
          ""
        ) : (
          <span>
            <Link
              hidden={this.state.allowEdit}
              to={
                {
                  pathname: "/addResponse",
                  search: "?id=" + record.id,
                  state: { detail: record },
                }
                // "/addResponse?id=" + record.id + "&&question=" + record.question
              }
              style={{ color: "#13b4ca" }}
            >
              <img src={Edit} alt="" />
            </Link>
          </span>
        );
      },
    },
  ];

  columnsValidate = [
    {
      title: "History",
      dataIndex: "history",
      render: (text: any, record: any) => {
        return record.count > 1 ? (
          <>
            {" "}
            <span
              onClick={() => {
                this.setHistoryContent(record);
              }}
            >
              <h3>
                <b>
                  <img src={History} alt="" />
                </b>
              </h3>
            </span>{" "}
          </>
        ) : (
          <></>
        );
      },
    },
    {
      title: "Question",
      dataIndex: "question",
    },
    {
      title: "Answer",
      dataIndex: "answer",
      render: (text: any, record: any) => {
        return (
          // <span dangerouslySetInnerHTML={{ __html: record.answer }}>
          //   ;
          <span
            onClick={() => {
              this.getAnswer(record);
            }}
          >
            <a className="responses-view">View..</a>
          </span>
          // </span>
        );
      },
    },
    {
      title: "Version",
      dataIndex: "number",
    },
  ];

  columnsStatusAction = [
    {
      title: "History",
      dataIndex: "history",
      render: (text: any, record: any) => {
        return record.count > 1 ? (
          <>
            {" "}
            <span
              onClick={() => {
                this.setHistoryContent(record);
              }}
            >
              <h3>
                <b>
                  <img src={History} alt="" />
                </b>
              </h3>
            </span>{" "}
          </>
        ) : (
          <></>
        );
      },
    },
    {
      title: "Question",
      dataIndex: "question",
      textWrap: "word-break",
    },
    {
      title: "Answer",
      dataIndex: "answer",
      render: (text: any, record: any) => {
        return (
          // <span dangerouslySetInnerHTML={{ __html: record.answer }}>
          //   ;
          <span
            onClick={() => {
              this.getAnswer(record);
            }}
          >
            <a className="responses-view">View..</a>
          </span>
          // </span>
        );
      },
    },
    {
      title: "Version",
      dataIndex: "number",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: any, record: any) => {
        return record.status === "undefind" || record.status === "Pending" ? (
          ""
        ) : (
          <span>
            <Link
              hidden={this.state.allowEditContent}
              to={
                {
                  pathname: "/addResponse",
                  search: "?id=" + record.id,
                  state: { detail: record },
                }
                // "/addResponse?id=" + record.id + "&&question=" + record.question
              }
              style={{ color: "#13b4ca" }}
            >
              <img src={Edit} alt="" />
            </Link>
          </span>
        );
      },
    },
  ];
  setAccess() {
    const { user } = this.props;

    if (
      user.role &&
      (user.role === "Admin" ||
        user.role === "Super Admin" ||
        user.role === "Creator" ||
        user.role === "Manager" ||
        user.role === "Owner")
    ) {
      this.setState({
        allowAddDelete: true,
      });
    }
    if (
      user.role === "Super Admin" ||
      user.role === "Admin" ||
      user.role === "Manager"
    ) {
      this.setState({
        allowEdit: false,
      });
    }
    if (
      user.role === "Super Admin" ||
      user.role === "Admin" ||
      user.role === "Manager" ||
      user.role === "Creator" ||
      user.role === "Owner"
    ) {
      this.setState({
        allowEditContent: true,
      });
    }
    if (user.role === "Creator" || user.role === "Owner") {
      this.setState({
        allowEditContentAndStatus: true,
        allowEditContent: false,
        allowEdit: true,
      });
    }
  }
  async componentDidMount() {
    document.title = "Respones";
    this.region = "All";
    this.domainValue = "All";
    this.subDomainValue = "All";
    await this.getRegion();
    await this.setAccess();
    await this.handlRegionChange(this.region);
  }

  handledomainChange = (domain: string) => {
    this.domainValue = domain;
    rfpService
      .getSubDomains(domain)
      .then((responseSub) => {
        this.setState(
          {
            subdomainData: responseSub,
            domainName: domain,
          },
          () => {
            // let subDoaminName = this.state.subdomainData[0].name;
            // this.subDomainValue = subDoaminName;
            // this.setState({
            //   subDoaminName: subDoaminName,
            // });
            this.getResponseContentBySubDomain(this.region, domain, "All", -1);
          }
        );
      })
      .catch(notifications.openErrorNotification);
  };

  handledomainChange1 = async (domain: any) => {
    this.setState({
      subdomainData: await rfpService
        .getSubDomains(domain)
        .then()
        .catch(notifications.openErrorNotification),
    });
  };

  handelSubDominachnge = (subDomain: string) => {
    // this.subDomain = subDomain;
    this.setState(
      {
        subDomain,
      },
      () => {
        this.getResponseContentBySubDomain(
          this.region,
          this.state.domainName,
          subDomain,
          -1
        );
      }
    );
  };

  getResponseContentBySubDomain = async (
    region: string,
    domain: string,
    subDomain: string,
    pageNo: number
  ) => {
    this.setState({ loading: true });
    this.subDomainValue = subDomain;
    this.setState({
      responses: await rfpService
        .getResponseContentBySubDomain(this.region, domain, subDomain, -1)
        .then()
        .catch(notifications.openErrorNotification),
    });
    this.setState({ loading: false });
  };
  getNoOfPageForResponseContentBySubDomain = async () => {
    this.setState({
      totalPage: await rfpService
        .getNoOfPageForResponseContentBySubDomain("Staffing", "Staffing")
        .then()
        .catch(notifications.openErrorNotification),
      loading: false,
    });
  };
  closeModal = () => {
    this.setState({ visible: false });
  };

  responseByRole = () => {
    if (this.state.allowEditContent === true) {
      return (
        <Table1
          data={this.state.responses}
          columns={this.columns}
          loading={this.state.loading}
          handlePageChange={this.handlePageChange}
          // currentPage={this.pageNo}
          handleSelect={this.handleSelect}
          totalPages={this.state.totalPage}
          checkBox={true}
        />
      );
    } else if (this.state.allowEditContentAndStatus === true) {
      return (
        <Table1
          data={this.state.responses}
          columns={this.columnsStatusAction}
          loading={this.state.loading}
          handlePageChange={this.handlePageChange}
          // currentPage={this.pageNo}
          handleSelect={this.handleSelect}
          totalPages={this.state.totalPage}
          checkBox={true}
        />
      );
    } else {
      return (
        <Table1
          data={this.state.responses}
          columns={this.columnsValidate}
          loading={this.state.loading}
          handlePageChange={this.handlePageChange}
          // currentPage={this.pageNo}
          handleSelect={this.handleSelect}
          totalPages={this.state.totalPage}
          checkBox={true}
        />
      );
    }
  };

  searchData = async (event: any) => {
    let val = event.target.value;
    if (val === "") {
      this.getResponseContentBySubDomain(
        this.region,
        this.domainValue,
        this.subDomainValue,
        -1
      );
    } else if (val != undefined && val.trim().length > 3) {
      let response = await rfpService
        .searchResponseContent(
          this.region,
          this.domainValue,
          this.subDomainValue,
          val.trim()
        )
        .then()
        .catch(notifications.openErrorNotification);
      this.setState({
        responses: response,
      });
    }
  };
  getRegion = async () => {
    this.setState({
      region: await rfpService
        .getRfpByAttribute(AttributeType.REGION)
        .then()
        .catch(notifications.openErrorNotification),
    });
  };

  getFields = (input: any, field: any) => {
    var output = [];
    for (var i = 0; i < input.length; ++i) output.push(input[i][field]);
    return output.reduce(function (a, b) {
      if (a.indexOf(b) < 0) a.push(b);
      return a;
    }, []);
  };

  handlRegionChange = async (region: any) => {
    this.region = region;
    let response = await rfpService.getDomain(region).then().catch();
    if (response != "") {
      let domainName = this.domainValue;
      this.domainValue = domainName;
      this.setState({
        domain: this.getFields(response, "name"),
        // doaminName: domainName,
      });
      this.handledomainChange(domainName);
    } else {
      this.clean();
      this.setState({
        domain: [],
        subdomainData: [],
        responses: [],
      });
    }
  };

  clean = () => {
    this.domainValue = "";
    this.subDomainValue = "";
  };

  render() {
    const { subdomainData } = this.state;
    let { rfpByDomainData } = this.state.domain;
    if (rfpByDomainData != undefined) {
      rfpByDomainData = rfpByDomainData.filter((x: any) => x.name != "ALL");
    }

    return (
      <>
        <DailogComponent
          setIsModalVisible={this.state.visible}
          closeModal={this.closeModal}
          content={this.state.content}
          title={this.state.title}
          loading={false}
        ></DailogComponent>

        <Row gutter={24} className="headeing-padding">
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 12 }}
          >
            <Row gutter={24}>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 6 }}
              >
                <Select
                  value={this.region}
                  onChange={this.handlRegionChange}
                  className="select-class"
                  id="rc_select_region"
                >
                  <Option value="All">All</Option>
                  {this.state.region.map((data: any) => {
                    return <Option value={data.name}>{data.name}</Option>;
                  })}
                </Select>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 6 }}
              >
                <Select
                  className="select-class"
                  placeholder="Select Domain"
                  onChange={this.handledomainChange}
                  value={this.domainValue}
                  id="rc_select_domain"
                >
                  <Option value="All">All</Option>
                  {this.state.domain.map((data: any) => {
                    return <Option value={data}>{data}</Option>;
                  })}
                </Select>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 6 }}
              >
                <Select
                  className="select-class"
                  placeholder="select Sub Domain"
                  onChange={this.handelSubDominachnge}
                  value={this.subDomainValue}
                  id="rc_select_subdomain"
                >
                  <Option value="All">All</Option>
                  {subdomainData !== undefined
                    ? subdomainData.map((data: any) => {
                        return <Option value={data.name}>{data.name}</Option>;
                      })
                    : ""}
                </Select>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 6 }}
              >
                <Search
                  placeholder="Search"
                  allowClear
                  className="search"
                  onChange={this.searchData}
                />
              </Col>
            </Row>
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 12 }}
          >
            {!this.state.allowEdit ? (
              <Button
                danger
                className="fr ml1"
                onClick={this.handleDeleteButton}
                icon={<DeleteFilled />}
              >
                Delete
              </Button>
            ) : (
              ""
            )}
            <Link to={"/addResponse"}>
              <Button
                className="fr f1 mr-top"
                type="primary"
                // onClick={this.addResponse}
                icon={<PlusCircleOutlined />}
              >
                Add Responses
              </Button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 24 }}
          >
            <div className="site-page-header-ghost-wrapper">
              {this.responseByRole()}
              {/* {this.state.allowEditContent === true ? ( <Table1
                data={this.state.responses}
                columns={this.columns}
                loading={this.state.loading}
                handlePageChange={this.handlePageChange}
                // currentPage={this.pageNo}
                handleSelect={this.handleSelect}
                totalPages={this.state.totalPage}
                checkBox={true}
              />):( <Table1
                data={this.state.responses}
                columns={this.columnsValidate}
                loading={this.state.loading}
                handlePageChange={this.handlePageChange}
                // currentPage={this.pageNo}
                handleSelect={this.handleSelect}
                totalPages={this.state.totalPage}
                checkBox={true}
              />)} */}
            </div>
          </Col>
        </Row>
      </>
    );
  }
}

function mapState(state: any) {
  const { getRfpByDomain } = state;
  const { authentication } = state;
  const { user } = authentication;
  return {
    user,
  };
}
const actionCreators = {
  getRfpByDomain: proposalsAction.getRfpByDomain,
};
export default connect(mapState, actionCreators)(Responses);
