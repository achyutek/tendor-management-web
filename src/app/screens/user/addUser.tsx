import React, { Component } from "react";
import {
  Input,
  message,
  Row,
  Col,
  Select,
  Form,
  Button,
  Spin,
  PageHeader,
} from "antd";
import { userService } from "../../services/user-service";
import { App, User, Role } from "../../_models/user.models";
import { MessageProp } from "../../_globals/constants/message.constants";
import { notifications } from "../../_helpers/notifications";
import history from "../../_helpers/history";
import InputMask from "react-input-mask";
const Option = Select.Option;
const qs = require("query-string");

const validateMessages = {
  required: "${label}  is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
};

export class AddUser extends Component<any, any> {
  Pars = qs.parse(window.location.search);
  refForm: any = React.createRef();
  constructor(props: any) {
    super(props);
    this.state = {
      users: [],
      loading: true,
      totalPage: 0,
      visible: false,
      title: "",
      content: "",
      roles: [],
      user: new User(),
      accountName: "",
      userEditData: "",
      readOnly: false,
      getAppFalse: false,
    };
  }

  async componentDidMount() {
    document.title = "User";
    let { id } = this.Pars;
    await this.getAccount();
    await this.getRoles();
    this.setState({ app: "RFP" });
    if (id === undefined || id === "") {
      // let app = new App();
      // app.app = "RFP";
      // this.state.user.appAccess.push(app);
    } else {
      await this.getUserById();
      this.setState({
        readOnly: true,
      });
    }
  }

  getUserById = async () => {
    let { id } = this.Pars;
    this.setState(
      {
        userEditData: await userService
          .getUserById(id)
          .then()
          .catch(notifications.openErrorNotification),
        loading: false,
      },
      () => {
        let role = new Role();
        // role.name = this.state.userEditData.role;
        // this.state.user.appAccess.map((data:any)=>{
        //  data.role = role;
        // })
        this.editUser();
      }
    );
  };

  firstMethod = (e: any) => {
    const re = /[a-z A-Z]+/g;
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  };

  editUser() {
    let fieldValues = {
      user: {
        email: this.state.userEditData.email,
        name: this.state.userEditData.name,
        contactNo: this.state.userEditData.contactNo,
        role: this.state.userEditData.role,
      },
    };
    this.state.userEditData.appAccess.filter((data: any) => {
      if (data.app !== "RFP") {
        this.state.user.appAccess.push(data);
      }
    });
    this.refForm.current.setFieldsValue(fieldValues);
  }

  getRoles = async () => {
    this.setState({
      roles: await userService
        .getRoleUser()
        .then()
        .catch(notifications.openErrorNotification),
      loading: false,
    });
  };

  getAccount = async () => {
    this.setState({
      accountName: await userService
        .getLoggedInUserAccount()
        .then()
        .catch(notifications.openErrorNotification),
      loading: false,
    });
  };

  onFinish = (value: any) => {
    let { id } = this.Pars;
    this.setState({
      user: { ...this.state.user, ...value.user },
    });
    let account = this.state.accountName;
    this.setState(
      {
        user: { ...this.state.user, account },
      },
      () => {
        if (id !== undefined) {
          this.upsertUser();
        } else {
          this.saveUser();
        }
      }
    );
  };

  upsertUser = async () => {
    this.state.user.status = this.state.userEditData.status;
    if (this.state.getAppFalse === false) {
      this.state.userEditData.appAccess.filter((data: any) => {
        if (data.app === "RFP") {
          this.state.user.appAccess.push(data);
        }
      });
    }
    await userService
      .upsertUser(this.state.user)
      .then((response) => {
        notifications.openSuccessNotification(
          MessageProp.getUpdatedSuccessMessage("User")
        );
        this.setState({
          loading: false,
        });
        history.push({
          pathname: "/users",
        });
      })
      .catch(notifications.openErrorNotification);
  };

  saveUser = async () => {
    await userService
      .adduser(this.state.user)
      .then((response) => {
        notifications.openSuccessNotification(
          MessageProp.getCreatedSuccessMessage("User")
        );
        this.setState({
          loading: false,
        });
        history.push({
          pathname: "/users",
        });
      })
      .catch(notifications.openErrorNotification);
  };

  cancel = () => {
    history.push({
      pathname: "/users",
    });
  };

  roleChange = (event: string) => {
    this.setState({
      getAppFalse: true,
    });
    for (let role of this.state.roles) {
      if (role.name === event) {
        // if (
        //   this.state.user.appAccess != undefined &&
        //   this.state.user.appAccess.length > 0
        // ) {
        this.state.user.appAccess = this.state.user.appAccess.filter(
          (app: any) => app.name !== "RFP"
        );
        let currentApp = new App();
        currentApp.app = "RFP";
        currentApp.role = role.name;
        this.state.user.appAccess.push(currentApp);
        this.setState({
          user: { ...this.state.user, currentApp },
        });
        // } else {
        //   this.state.user.appAccess[0].role = role;
        // }
      }
    }
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
                  title="Add User"
                  className="form-top-heading"
                ></PageHeader>
              </div>
            </Col>
          </Row>
          <div className="form-bg">
            <Row>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 24 }}
              >
                <Row>
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 24 }}
                  >
                    <div className="user-padding">
                      <Form
                        name="basic"
                        onFinish={this.onFinish}
                        ref={this.refForm}
                        validateMessages={validateMessages}
                        scrollToFirstError
                      >
                        <div>
                          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={12}>
                              <Form.Item
                                label={"Email"}
                                name={["user", "email"]}
                                rules={[{ required: true, type: "email" }]}
                              >
                                <Input
                                  readOnly={this.state.readOnly}
                                  placeholder="Enter Email ID"
                                />
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={12}>
                              <Form.Item
                                label={"Name"}
                                name={["user", "name"]}
                                rules={[{ required: true }]}
                              >
                                <Input
                                  placeholder="Enter First Name"
                                  onKeyPress={(e) => this.firstMethod(e)}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={12}>
                              <Form.Item
                                label={"Contact Number"}
                                name={["user", "contactNo"]}
                              >
                                {/* <Input placeholder="Enter Solicitation Number" /> */}
                                <InputMask mask="(999) 999-9999">
                                  {(inputProps: any) => (
                                    <Input
                                      {...inputProps}
                                      placeholder="(###) ###-####"
                                    />
                                  )}
                                </InputMask>
                              </Form.Item>
                            </Col>

                            <Col className="gutter-row" span={12}>
                              <Form.Item
                                label={"Role"}
                                name={["user", "role"]}
                                rules={[{ required: true }]}
                              >
                                <Select
                                  // value={this.state.roles}
                                  onChange={this.roleChange}
                                  placeholder="Select Role"
                                >
                                  {this.state.roles
                                    ? this.state.roles.map((data: any) => {
                                        return (
                                          <Option value={data.name}>
                                            {data.name}
                                          </Option>
                                        );
                                      })
                                    : ""}
                                </Select>
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>
                        <Button type="primary" htmlType="submit" className="fr">
                          Submit
                        </Button>{" "}
                        <Button onClick={this.cancel} className="fr cancel">
                          Cancel
                        </Button>
                      </Form>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Spin>
      </>
    );
  }
}
export default AddUser;
