import { Content } from "antd/lib/layout/layout";
import React, { Component} from "react";
import { connect } from "react-redux";
import { proposalsAction } from "../../../_redux/_actions";
import {
  Button,
  Row,
  Col,
  PageHeader,
  Select,
  Form,
  Input,
  Spin,
} from "antd";
import { ResponseContent } from "../../../_models";
import { rfpService } from "../../../services/rfp-service";
import { notifications } from "../../../_helpers/notifications";
import { MessageProp } from "../../../_globals/constants/message.constants";
import history from "../../../_helpers/history";
import "react-quill/dist/quill.snow.css";
import { AttributeType } from "../../../_redux/_constants";
import JoditEditor from "jodit-react";
import "jodit";
import "jodit/build/jodit.min.css";

const Option = Select.Option;
const qs = require("query-string");
const validateMessages = {
  required: "${label}  is required!",
};

const config = {
  readonly: false
};

class AddResponse extends Component<any, any> {
  Pars = qs.parse(window.location.search);
  refForm: any = React.createRef();
  constructor(props: any) {
    super(props);
    this.state = {
      text: "",
    };
    this.state = {
      content: "content",
    };
    this.state = {
      textValue: "",
    };
    this.state = {
      oldContent: new ResponseContent(),
      newContent: new ResponseContent(),
      responseContent: new ResponseContent(),
      id: "",
      loading: false,
      readOnly: false,
      hedden: true,
      subdomainData: [],
      editresponseChildCompoenent: [],
      body: "",
      loadingAdd: false,
      editMode: false,
      region: [],
      domain: [],
      buttonDisabled:false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    let { id } = this.Pars;
    await this.loadContent();
    document.title = "Respones";
    if (id === undefined || id === "") {
      this.props.getRfpByDomain();
      this.getRegion();
    } else {
      this.editResponse();
      this.setState({
        readOnly: true,
        editMode: true,
      });
    }
  }

  getRegion = async () => {
    this.setState({
      region: await rfpService
        .getRfpByAttribute(AttributeType.REGION)
        .then()
        .catch((error)=>{
          if(error !== "Forbidden"){
            notifications.openErrorNotification(error.toString());
          }
        }),
      loading: false,
    });
  };

  editResponse = () => {
    let fieldValues = {
      responseContent: {
        region: this.props.location.state.detail.region,
        domain: this.props.location.state.detail.domain,
        subDomain: this.props.location.state.detail.subDomain,
        question: this.props.location.state.detail.question,
      },
    };
    this.refForm.current.setFieldsValue(fieldValues);
  };

  onFinish = (value: any) => {
    this.setState({
      loadingAdd: true,
      buttonDisabled:true
    });
    let { id } = this.Pars;
    this.setState({
      responseContent: {
        ...this.state.responseContent,
        ...value.responseContent,
      },
    });
    if (id === undefined || id === "") {
      this.addResponseSubmit();
    } else {
      this.state.responseContent.count = this.props.location.state.detail.count;
      this.state.responseContent.number =
        this.props.location.state.detail.number;
      this.state.responseContent.order = this.props.location.state.detail.order;
      this.state.responseContent.parentId =
        this.props.location.state.detail.parentId;
      this.state.responseContent.id = this.props.location.state.detail.id;
      this.addResponseSubmit();
    }
  };

  addResponseSubmit = () => {
    if (
      this.state.responseContent.answer == "" ||
      this.state.responseContent.answer == null
    ) {
      notifications.openErrorNotification("Answer field can't be blank");
      this.setState({ loadingAdd: false,buttonDisabled:false });

    } else {
      rfpService
        .addProposalResponseContent(this.state.responseContent)
        .then((response) => {
          notifications.openSuccessNotification(
            MessageProp.getCreatedSuccessMessage("Content")
          );
          this.setState({
            loadingAdd: false,
          });
          history.push({
            pathname: "/responses",
          });
        })
        .catch((error) => {
          if ((error = "Question and Answer is already exist.")) {
            history.push({
              pathname: "/responses",
            });
            notifications.openWarningNotification("Question and Answer is already exist.");
          } else {
            notifications.openErrorNotification(error)
          }
        });
      this.setState({ loadingAdd: false });
    }
  };

  updateResponse = () => {
    rfpService
      .updateProposalResponseContent(this.state.responseContent)
      .then((response) => {
        notifications.openSuccessNotification(
          MessageProp.getCreatedSuccessMessage("Update response")
        );
        history.push({
          pathname: "/responses",
        });
      })
      .catch(notifications.openErrorNotification);
  };

  cancel = () => {
    history.push({
      pathname: "/responses",
    });
  };

  loadContent = async () => {
    let { id } = this.Pars;

    if (id) {
      let response = await rfpService.getResponseContentById(id).then();
      this.setState({
        responseContent: response,
        loading: false,
      });
    }
  };

  handledomainChange = async (domain: any) => {
    let response = await rfpService
      .getSubDomains(domain)
      .then()
      .catch(notifications.openErrorNotification);
    if (response != "") {
      let subDomain = response[0].name;
      this.setDomainAndSubDomain(subDomain);
      this.setState({
        subdomainData: response,
        request: { ...this.state.request, subDomain },
      });
    } else {
      this.setDomainAndSubDomain("");
      this.setState({
        subdomainData: [],
      });
    }
  };

  setDomainAndSubDomain = (subDomain: string) => {
    let fieldValues = {
      responseContent: {
        subDomain: subDomain,
      },
    };
    this.refForm.current.setFieldsValue(fieldValues);
  };

  handleChange(value: any) {
    let answer = value;
    this.setState({
      responseContent: { ...this.state.responseContent, answer },
    });
  }

  handlRegionChange = async (region: any) => {
    let response = await rfpService.getDomain(region).then().catch();
    if (response != "") {
      let domain = response[0].name;
      this.setRegionAndDomain(domain);
      this.setState({
        domain: response,
      });
    } else {
      this.setRegionAndDomain("");
      this.setState({
        domain: [],
      });
    }
  };

  setRegionAndDomain = (domain: string) => {
    let fieldValue = {
      responseContent: {
        domain: domain,
      },
    };
    this.refForm.current.setFieldsValue(fieldValue);
    this.handledomainChange(domain);
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
                  title=""
                  className="form-top-heading"
                ></PageHeader>
              </div>
            </Col>
          </Row>
          <Row className="form-bg">
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 24 }}
              lg={{ span: 24 }}
            >
              <div className="user-padding">
                <Spin size="large" spinning={this.state.loadingAdd}>
                  <Form
                    name="basic"
                    onFinish={this.onFinish}
                    ref={this.refForm}
                    scrollToFirstError
                    validateMessages={validateMessages}
                  >
                    <div>
                      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col className="gutter-row" span={8}>
                          <Form.Item
                            label="Region"
                            name={["responseContent", "region"]}
                            rules={[{ required: true }]}
                          >
                            <Select
                              value={this.state.responseContent.region}
                              onChange={this.handlRegionChange}
                              placeholder="Select Region"
                              disabled={this.state.readOnly}
                              id="rc_select_region"
                            >
                              {this.state.region.map((data: any) => {
                                return (
                                  <Option value={data.name}>
                                    {data.name}{" "}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={8}>
                          <Form.Item
                            label="Domain"
                            name={["responseContent", "domain"]}
                            rules={[{ required: true }]}
                          >
                            <Select
                              value={this.state.responseContent.domain}
                              onChange={this.handledomainChange}
                              placeholder="Select Domain"
                              disabled={this.state.readOnly}
                              id="rc_select_domain"
                            >
                              {this.state.domain.map((data: any) => {
                                return (
                                  <Option value={data.name}>
                                    {data.name}{" "}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={8}>
                          <Form.Item
                            label="Sub Domain"
                            name={["responseContent", "subDomain"]}
                            rules={[{ required: true }]}
                          >
                            <Select
                              value={this.state.responseContent.subDomain}
                              placeholder="Select SubDomain"
                              id="rc_select_subdomain"
                              disabled={this.state.readOnly}
                            >
                              {this.state.subdomainData.map((data: any) => {
                                return (
                                  <Option value={data.name}>{data.name}</Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col className="gutter-row" span={24}>
                          <Form.Item
                            label="Question"
                            name={["responseContent", "question"]}
                            rules={[{ required: true }]}
                          >
                            <Input
                              placeholder="Enter Question"
                              disabled={this.state.readOnly}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col className="gutter-row" span={24}>
                          <Form.Item label="Answer">
                            <JoditEditor
                              value={this.state.responseContent.answer}
                              config={config}
                              onChange={this.handleChange}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>

                    <div className="button-right">
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="success-button fr"
                        disabled={this.state.buttonDisabled}
                      >
                        Save
                      </Button>
                      <Button className="cancel fr" onClick={this.cancel}>
                        Cancel
                      </Button>{" "}
                    </div>
                  </Form>
                </Spin>
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
export default connect(mapState, actionCreators)(AddResponse);
