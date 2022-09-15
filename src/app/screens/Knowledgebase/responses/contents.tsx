import { Content } from "antd/lib/layout/layout";
import React, { Component } from "react";
import { connect } from "react-redux";
import { proposalsAction } from "../../../_redux/_actions";

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
  Modal,
  DatePicker,
  InputNumber,
  Spin,
} from "antd";
import { ResponseContent } from "../../../_models";
import { rfpService } from "../../../services/rfp-service";
import { notifications } from "../../../_helpers/notifications";
import FroalaEditorComponent from "react-froala-wysiwyg";
import { MessageProp } from "../../../_globals/constants/message.constants";
import history from "../../../_helpers/history";
import JoditEditor from "jodit-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Editor } from "@tinymce/tinymce-react";
const { TextArea } = Input;
const qs = require("query-string");

const modules = {
  toolbar: {
    container: "#toolbar",
    //   handlers: {
    //     insertHeart: insertHeart
    //   }
  },
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
];

const CustomToolbar = () => (
  <div id="toolbar">
    <span className="ql-formats">
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <button className="ql-underline"></button>
      <button className="ql-strike"></button>
    </span>
    <span className="ql-formats">
      <button className="ql-blockquote"></button>
      <button className="ql-code-block"></button>
    </span>
    <span className="ql-formats">
      <button className="ql-header" value="1"></button>
      <button className="ql-header" value="2"></button>
    </span>
    <span className="ql-formats">
      <button className="ql-list" value="ordered"></button>
      <button className="ql-list" value="bullet"></button>
      <select className="ql-align">
        <option selected></option>
        <option value="center"></option>
        <option value="right"></option>
        <option value="justify"></option>
      </select>
    </span>
    <span className="ql-formats">
      <button className="ql-script" value="sub"></button>
      <button className="ql-script" value="super"></button>
    </span>
    <span className="ql-formats">
      <button className="ql-indent" value="-1"></button>
      <button className="ql-indent" value="+1"></button>
    </span>
    <span className="ql-formats">
      <select className="ql-color"></select>
      <select className="ql-background"></select>
    </span>
    <span className="ql-formats">
      <button className="ql-direction" value="rtl"></button>
      <button className="ql-clean"></button>
      <button className="ql-link"></button>
      <button className="ql-image"></button>
    </span>
    <span className="ql-formats">
      <select className="ql-size">
        <option value="small"></option>
        <option selected></option>
        <option value="large"></option>
        <option value="huge"></option>
      </select>
      <select className="ql-font">
        <option selected></option>
        <option value="serif"></option>
        <option value="monospace"></option>
      </select>
    </span>
  </div>
);

const config = {
  readonly: true, // all options from https://xdsoft.net/jodit/doc/
};

class Contents extends Component<any, any> {
  Pars = qs.parse(window.location.search);
  refForm: any = React.createRef();
  constructor(props: any) {
    super(props);
    this.state = {
      oldContent: new ResponseContent(),
      newContent: new ResponseContent(),
      id: "",
      loading: false,
      readOnly: true,
      hedden: true,
      body: "",
      config: { readonly: true },
      approveButton:false,
      rejectButton:false,
    };
    this.handleChange = this.handleChange.bind(this);
  }
  async componentDidMount() {
    let { id } = this.Pars;
    document.title = "Respones";
    await this.loadContent();
  }

  loadContent = async () => {
    let { id } = this.Pars;

    this.setState({
      oldContent: await rfpService
        .getResponseContentByParentId(id)
        .then()
        .catch(notifications.openErrorNotification),
      loading: false,
    });

    let response = await rfpService
      .getResponseContentById(id)
      .then()
      .catch(notifications.openErrorNotification);
    this.setState(
      {
        newContent: response,
        //  await rfpService
        //   .getResponseContentById(id)
        //   .then()
        //   .catch(notifications.openErrorNotification),

        loading: false,
      },
      () => {
        this.editnewContent();
      }
    );
  };

  editnewContent = () => {
    let fieldValues = {
      newContent: {
        question: this.state.newContent.question,
        answer: this.state.newContent.answer,
      },
    };
    this.refForm.current.setFieldsValue(fieldValues);
  };

  addContents = () => {
    rfpService
      .updateProposalResponseContent(this.state.newContent)
      .then((response) => {
        notifications.openSuccessNotification(
          MessageProp.getApprovedMessage("Content")
        );
        this.setState({
          loading: false,
        });
        history.push({
          pathname: "/responses",
        });
      })
      .catch(notifications.openErrorNotification);
    this.setState({
      loading: false,
    });
  };

  onFinish = (value: any) => {
    this.setState({ rejectButton: true });
    this.setState({
      loading: true,
    });
    let proposals = ([] = []);
    let audit = {};
    this.setState({
      newContent: {
        ...this.state.newContent,
        ...value.newContent,
        proposals,
        audit,
      },
    });
    // if (this.state.body == undefined || this.state.body == "")
    //   notifications.openErrorNotification("Answer is required!");
    // else {
    //   this.state.newContent.answer = this.state.body;
    // }

    this.addContents();
  };
  onReject = () => {
    this.setState({ approveButton: true,rejectButton:true });
    Modal.confirm({
      title: "Reject New Content",
      content: "Are you sure you want to reject Content?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        this.confirmReject();
      },
      onCancel: () => {
        this.setState({ approveButton: false ,rejectButton:false});
      },
    });
  };
  confirmReject = () => {
    rfpService
      .RejectContents(this.state.newContent)
      .then((response) => {
        notifications.openSuccessNotification(
          MessageProp.getRejectedMessage("Content")
        );
        history.push({
          pathname: "/responses",
        });
      })
      .catch(notifications.openErrorNotification);
  };

  onEdit = () => {
    let readonly = false;
    this.setState({
      config: { ...this.state.config, readonly },
      hedden: false,
    });
  };

  // handleContentChange = (event: any) => {
  //   this.state.newContent.question = event.html;
  // };
  handleChange = (value: any) => {
    let answer = value;
    this.setState({ newContent: { ...this.state.newContent, answer } });
  };

  cancel = () => {
    history.push({
      pathname: "/responses",
    });
  };

  render() {
    return (
      <>
        <Spin spinning={this.state.loading} size="large">
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
                  title="Contents Details"
                  className="form-top-heading"
                ></PageHeader>
              </div>
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            {this.state.oldContent.id > 0 ? (
              <>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 12 }}
                  lg={{ span: 12 }}
                >
                  <div className="site-page-header-ghost-wrapper">
                    <PageHeader
                      ghost={false}
                      title="Old Content"
                      className="form-top-heading"
                    ></PageHeader>
                  </div>
                  <div className="form-bg">
                    <Form
                      name="basic"
                      scrollToFirstError
                      //   validateMessages={validateMessages}
                    >
                      <div className="steps-action">
                        <>
                          <div>
                            <Form.Item label="Question">
                              <Input
                                placeholder="Enter Solicitation Number"
                                value={this.state.oldContent.question}
                                disabled
                              />
                            </Form.Item>
                            <Form.Item label="Answer">
                              <JoditEditor
                                value={this.state.oldContent.answer}
                                config={config}
                              />
                            </Form.Item>
                          </div>
                          <div className="old-content-btm"></div>
                        </>
                      </div>
                    </Form>
                  </div>
                </Col>
              </>
            ) : (
              ""
            )}

            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
            >
              <div className="site-page-header-ghost-wrapper">
                <PageHeader
                  ghost={false}
                  title="New Content"
                  className="form-top-heading"
                ></PageHeader>
              </div>
              <div className="form-bg">
                <Form
                  name="basic"
                  onFinish={this.onFinish}
                  ref={this.refForm}
                  scrollToFirstError
                  //   validateMessages={validateMessages}
                >
                  <div className="steps-action">
                    <>
                      <div>
                        <Form.Item
                          label="Question"
                          name={["newContent", "question"]}
                          rules={[{ required: true }]}
                        >
                          <Input placeholder="Enter question" disabled />
                        </Form.Item>
                        <Form.Item
                          label="Answer"
                          // name={["newContent", "answer"]}
                          // rules={[{ required: true }]}
                        >
                          <JoditEditor
                            value={this.state.newContent.answer}
                            config={this.state.config}
                            onBlur={this.handleChange}
                          />
                        </Form.Item>
                      </div>
                      <div>
                        <Button
                          disabled={
                            !this.state.hedden || this.state.approveButton
                          }
                          type="primary"
                          htmlType="submit"
                        >
                          Approve
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                          disabled={
                            !this.state.hedden || this.state.rejectButton
                          }
                          danger
                          onClick={this.onReject}
                        >
                          Reject
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                          disabled={
                            !this.state.hedden || this.state.rejectButton
                          }
                          type="primary"
                          onClick={this.onEdit}
                        >
                          Edit
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                          hidden={this.state.hedden}
                          type="primary"
                          htmlType="submit"
                        >
                          Save & Approve
                        </Button>
                        &nbsp;&nbsp;
                        <Button type="primary" onClick={this.cancel}>
                          Back
                        </Button>
                      </div>
                    </>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Spin>
      </>
    );
  }
}
function mapState(state: any) {
  const { getRfpByDomain } = state;
  const { rfpByDomainData } = getRfpByDomain;
  return {
    rfpByDomainData,
  };
}
const actionCreators = {
  getRfpByDomain: proposalsAction.getRfpByDomain,
};
export default connect(mapState, actionCreators)(Contents);
