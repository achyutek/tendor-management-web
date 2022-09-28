import { Content } from "antd/lib/layout/layout";
import React, { Component } from "react";
import { connect } from "react-redux";
import { proposalsAction } from "../../../_redux/_actions";

import {
  Button,
  Row,
  Col,
  PageHeader,
  Form,
  Input,
  Modal,
  Spin,
} from "antd";
import { ResponseContent } from "../../../_models";
import { rfpService } from "../../../services/rfp-service";
import { notifications } from "../../../_helpers/notifications";
import { MessageProp } from "../../../_globals/constants/message.constants";
import history from "../../../_helpers/history";
import JoditEditor from "jodit-react";
import "react-quill/dist/quill.snow.css";
const qs = require("query-string");

const config = {
  readonly: true
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
        .catch((error)=>{
          if(error !== "Forbidden"){
            notifications.openErrorNotification(error.toString());
          }
        }),
      loading: false,
    });

    let response = await rfpService
      .getResponseContentById(id)
      .then()
      .catch((error)=>{
        if(error !== "Forbidden"){
          notifications.openErrorNotification(error.toString());
        }
      });
    this.setState(
      {
        newContent: response,
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
