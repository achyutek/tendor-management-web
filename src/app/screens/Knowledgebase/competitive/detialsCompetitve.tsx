import React, { Component } from "react";
import "antd/dist/antd.css";
import {
  Button,
  Row,
  Col,
  PageHeader,
  Tabs,
  Descriptions,
  Table,
  Form,
  Input,
  Tooltip,
  Select,
  Modal,
} from "antd";
import { Link } from "react-router-dom";
import { Table1 } from "../../../component/table";
import {
  FormOutlined,
  FileProtectOutlined,
  DoubleLeftOutlined,
  PlusCircleOutlined,
  UploadOutlined,
  MinusOutlined,
  PlusOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import PreviewDocument from "../../../component/PreviewDocument";
import DownloadComponent from "../../../component/DownloadComponent";
import { rfpService } from "../../../services/rfp-service";
import phone from "../../../../assets/images/phone.png";
import globe from "../../../../assets/images/globe.png";
import envolope from "../../../../assets/images/envolope.png";
import UploadComponent from "../../../component/UploadComponent";
import { MessageProp } from "../../../_globals/constants/message.constants";
import { notifications } from "../../../_helpers/notifications";
import DailogComponent from "../../../component/DailogComponent";
import { Document } from "../../../_models/document.model";
const Option = Select.Option;
const qs = require("query-string");

const columnsDocument = [
  {
    key: "id",
    title: "Title",
    dataIndex: "title",
  },
  {
    title: "Type",
    dataIndex: "type",
  },
  {
    title: "Action",
    render: (record: any, text: any) => {
      return (
        <Row>
          <PreviewDocument
            fileStoragePath={record.path}
            app="RFP"
            status={record.status}
          ></PreviewDocument>{" "}
          &nbsp;
          <DownloadComponent
            fileStoragePath={record.path}
            app="RFP"
            status={record.status}
          ></DownloadComponent>
        </Row>
      );
    },
  },
];

const data: any = [];
for (let i = 1; i < 7; i++) {
  data.push({
    key: i,
    name: `Title, ID & Name`,
    agency: `Agency ${i}`,
    type: 32,
  });
}

const validateMessages = {
  required: "${label}  is required!",
};
export class DetialsCompetitive extends Component<any, any> {
  documentsFormRef: any = React.createRef();
  Pars = qs.parse(window.location.search);
  currentPage = 1;
  constructor(props: any) {
    super(props);
    this.state = {
      competitiveData: "",
      proposalsResponseData: "",
      competitiveDocumentData: "",
      proposalsDocumenPrivewtData: "",
      proposalsDocumentDownloadData: "",
      document: new Document(),
      visible: false,
      title: "",
      content: "",
      id: "",
      selectedRow: [],
    };
  }

  handlePageChange = (pageNumber: any) => {
    this.callData(pageNumber);
  };

  callData = (pageNumber: any) => {
    this.currentPage = pageNumber;
    this.props.getRfpProposals(-1, pageNumber);
  };

  componentDidMount() {
    let { id } = this.Pars;
    document.title = "Competitive";
    this.setState({
      id: id,
    });
    rfpService
      .getCompetitiveDetails(id)
      .then((response) => {
        this.setState({
          competitiveData: response,
        });
      })
      .catch(notifications.openErrorNotification);

    rfpService
      .getResponseContentByProposal(id)
      .then((response) => {
        this.setState({
          proposalsResponseData: response,
        });
      })
      .catch(notifications.openErrorNotification);

    rfpService
      .getDocumentsByRFP(id)
      .then((response) => {
        this.setState({
          competitiveDocumentData: response,
        });
      })
      .catch(notifications.openErrorNotification);
  }

  handleSelect = (RwoId: any) => {
    this.setState({ selectedRow: RwoId });
  };

  handleDeleteButton = () => {
    if (this.state.selectedRow.length === 0) {
      notifications.openErrorNotification("Please Select Row");
    } else {
      Modal.confirm({
        title: "Delete Document",
        content: "Are you sure you want to delete document?",
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
          this.confirmDelete();
        },
      });
    }
  };

  confirmDelete = () => {
    this.state.selectedRow.map((doc: any) => {
      this.deleteDocument(doc);
    });
  };

  deleteDocument = (doc: any) => {
    let { id } = this.Pars;
    rfpService
      .deleteDocument(doc)
      .then((response) => {
        rfpService
          .getDocumentsByRFP(id)
          .then((response) => {
            this.setState({
              competitiveDocumentData: response,
            });
            this.setState({
              loadingForView: false,
              visible: false,
            });
            notifications.openSuccessNotification(
              MessageProp.getDeletedSucessMessage("Document")
            );
          })
          .catch(notifications.openErrorNotification);
      })
      .catch(notifications.openErrorNotification);
  };

  fileUploadCallback = (response: any) => {
    let { id } = this.Pars;
    this.state.document.path = response.path;
    this.state.document.fileName = response.path.substring(id.length + 1);
  };
  onFinishAddDco = (value: any) => {
    let { id } = this.Pars;

    this.state.document.title = value.document[0].title;
    this.state.document.type = value.document[0].type;
    this.state.document.ownerId = id;
    this.state.document.id = id;
    this.saveDocument();
  };

  saveDocument = () => {
    let { id } = this.Pars;
    this.setState({
      loadingForView: true,
    });
    if (this.state.document.path) {
      rfpService
        .addDocument(this.state.document)
        .then((response) => {
          MessageProp.getUploadedeSucessMessage("Proposal");
          rfpService
            .getDocumentsByRFP(id)
            .then((response) => {
              this.setState({
                competitiveDocumentData: response,
              });
              this.setState({
                loadingForView: false,
                visible: false,
              });
            })
            .catch(notifications.openErrorNotification);
        })
        .catch(notifications.openErrorNotification);
    } else {
      notifications.openErrorNotification("Please upload file to submit");
    }
  };

  getType = (index: number) => {
    const doc = this.documentsFormRef.current.getFieldsValue("document");

    return doc.document.filter((value: any, idx: number) => {
      return index == idx;
    })[0];
  };

  addDocument = () => {
    let content = (
      <>
        <Form
          name="basic"
          ref={this.documentsFormRef}
          onFinish={this.onFinishAddDco}
          validateMessages={validateMessages}
          scrollToFirstError
        >
          <Form.List name="document">
            {(fields, { add, remove }) => (
              <>
                <Button type="primary" onClick={() => add()}>
                  <PlusOutlined />
                </Button>
                {fields.map((field, index) => (
                  <div key={field.key}>
                    <div className="pop-document">
                      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col className="gutter-row" span={7}>
                          <Form.Item
                            {...field}
                            label="Type"
                            name={[field.name, "type"]}
                            // fieldKey={[field.fieldKey, "type"]}
                            rules={[{ required: true }]}
                          >
                            <Select value={field.name}>
                              <Option value="Project Info">Project Info</Option>
                              <Option value="Project Proposal">
                                Project Proposal
                              </Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={7}>
                          <Form.Item
                            {...field}
                            label="Title"
                            name={[field.name, "title"]}
                            // fieldKey={[field.fieldKey, "title"]}
                            rules={[{ required: true }]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={7}>
                          <Form.Item
                            {...field}
                            label="File"
                            name={[field.name, "fileName"]}
                            // fieldKey={[field.fieldKey, "fileName"]}
                          >
                            <span className="upload-file-01">
                              File Choose...
                            </span>
                            <UploadComponent
                              ownerId={this.state.id}
                              getType={() => this.getType(index)}
                              callback={this.fileUploadCallback}
                            ></UploadComponent>
                            <span className="upload-file-02">
                              <UploadOutlined />
                            </span>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={3}>
                          <label>&nbsp;&nbsp;</label>
                          <Button
                            type="primary"
                            onClick={() => remove(field.name)}
                            className="mar-top"
                          >
                            <MinusOutlined />
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </div>
                ))}
              </>
            )}
          </Form.List>
          <Button
            type="primary"
            className="fr padding-bottom"
            htmlType="submit"
          >
            Submit
          </Button>
        </Form>
      </>
    );
    this.setState({ visible: true, content, title: "Add Document" });
  };

  closeModal = () => {
    this.setState({ visible: false });
  };

  render() {
    const { competitiveData } = this.state;
    let { id } = this.Pars;
    return (
      <>
        <DailogComponent
          setIsModalVisible={this.state.visible}
          closeModal={this.closeModal}
          content={this.state.content}
          title={this.state.title}
          loading={false}
        ></DailogComponent>
        <Row>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 24 }}
          >
            <div className="site-page-header-ghost-wrapper view-file-common padding-zero">
              <div className="bottom-border">
                <PageHeader
                  ghost={false}
                  avatar={{
                    src: "https://avatars1.githubusercontent.com/u/8186664?s=460&v=4",
                  }}
                  title={competitiveData.title}
                >
                  <div className="viewstatus">
                    <div className="status-border right-border">
                      <ul>
                        <li>
                          <span>Solicitation :</span>{" "}
                          {competitiveData.requestId}
                        </li>
                        <li>
                          <span>Source :</span> {competitiveData.source}
                        </li>
                      </ul>
                    </div>
                    <div className="status-border left-border">
                      <ul>
                        <li>
                          <span>Domain :</span> {competitiveData.domain}
                        </li>
                        <li>
                          <span>Type :</span> {competitiveData.type}
                        </li>
                      </ul>
                    </div>

                    <div className="status-border right">
                      <Tooltip title="Add New Document">
                        <Button onClick={this.addDocument}>
                          <PlusCircleOutlined />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Edit Proposal">
                        <Link to={"/add-Competitive?id=" + id}>
                          <Button className="button">
                            <FormOutlined />
                          </Button>
                        </Link>
                      </Tooltip>
                      <Tooltip title="Delete Documents">
                        <Button
                          className="button"
                          onClick={this.handleDeleteButton}
                        >
                          <DeleteFilled />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Back">
                        <Link to={"/viewCompetitive"}>
                          <Button className="status-button">
                            <DoubleLeftOutlined />
                          </Button>
                        </Link>
                      </Tooltip>
                    </div>
                  </div>
                </PageHeader>
              </div>
              <div className="site-page-header-ghost-wrapper padding-all">
                <Row gutter={16}>
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 8 }}
                    lg={{ span: 8 }}
                  >
                    <div className="agency-information">
                      <PageHeader
                        ghost={false}
                        title="Agency Information"
                        className="color-black"
                      ></PageHeader>
                      <Descriptions size="small" column={1}>
                        {this.state.competitiveData.agency !== undefined ? (
                          <>
                            <Descriptions.Item label="Name">
                              {this.state.competitiveData.agency.name}
                            </Descriptions.Item>
                          </>
                        ) : (
                          ""
                        )}

                        {this.state.competitiveData.agency !== undefined ? (
                          <>
                            <Descriptions.Item label="Address">
                              {Object.keys(
                                this.state.competitiveData.agency.address
                              ).reduce((addressString: string, k: string) => {
                                return (
                                  addressString +
                                  this.state.competitiveData.agency.address[k] +
                                  " , "
                                );
                              }, "")}
                            </Descriptions.Item>
                          </>
                        ) : (
                          ""
                        )}
                      </Descriptions>
                      <div className="center-icon">
                        {this.state.competitiveData.agency !== undefined ? (
                          <>
                            {" "}
                            <span className="globe">
                              <a
                                href={
                                  "mailto:" +
                                  this.state.competitiveData.agency.email
                                }
                              >
                                <img src={envolope} alt="Envolope" />
                              </a>
                            </span>
                            <span className="globe">
                              <a
                                href={
                                  "https://" +
                                  this.state.competitiveData.agency.webSite
                                }
                                target="_blank"
                              >
                                <img src={globe} alt="globe" />
                              </a>
                            </span>
                            <span className="globe">
                              <a
                                href={
                                  "tel:" +
                                  this.state.competitiveData.agency.contactNo
                                }
                              >
                                <img src={phone} alt="phone" />
                              </a>
                            </span>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 16 }}
                    lg={{ span: 16 }}
                  >
                    <div className="padding-zero-01">
                      <PageHeader
                        ghost={false}
                        title="Document"
                        className="color-black"
                      ></PageHeader>
                    </div>
                    <Table1
                      columns={columnsDocument}
                      data={this.state.competitiveDocumentData}
                      checkBox={true}
                      handleSelect={this.handleSelect}
                      loading={false}
                    />
                  </Col>
                </Row>
              </div>
              {/* <div className="site-page-header-ghost-wrapper">
                    <Row gutter={16}>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 12 }}
                        lg={{ span: 12 }}
                      >
                        <PageHeader ghost={false} title="Agency Information">
                          <Descriptions size="small" column={1}>
                            {this.state.competitiveData.agency !== undefined
                              ? Object.keys(
                                  this.state.competitiveData.agency
                                ).map((key: any) => {
                                  if (
                                    typeof this.state.competitiveData.agency[
                                      key
                                    ] === "object"
                                  ) {
                                    return Object.keys(
                                      this.state.competitiveData.agency[key]
                                    ).map((k) => (
                                      <>
                                        <Descriptions.Item
                                          label={
                                            k.charAt(0).toUpperCase() +
                                            k.slice(1)
                                          }
                                        >
                                          {
                                            this.state.competitiveData.agency[
                                              key
                                            ][k]
                                          }
                                        </Descriptions.Item>

                                        {}
                                      </>
                                    ));
                                  } else {
                                    return (
                                      <Descriptions.Item
                                        label={
                                          key.charAt(0).toUpperCase() +
                                          key.slice(1)
                                        }
                                      >
                                        {this.state.competitiveData.agency[key]}
                                      </Descriptions.Item>
                                    );
                                  }
                                })
                              : ""}
                          </Descriptions>
                        </PageHeader>
                      </Col>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 12 }}
                        lg={{ span: 12 }}
                      >
                        <PageHeader
                          ghost={false}
                          title="Document"
                          className="bordernone"
                        ></PageHeader>
                        <Table
                          columns={columnsDocument}
                          dataSource={this.state.competitiveDocumentData}
                        />
                      </Col>
                    </Row>
                  </div> */}
            </div>
          </Col>
        </Row>
      </>
    );
  }
}
export default DetialsCompetitive;
