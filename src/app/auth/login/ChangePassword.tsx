import React, { Component } from "react";
import { Row, Col, Form, Input, Button, Spin, notification } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { userService } from "../../services/user-service";
import history from "../../_helpers/history";
import { User } from "../../_models";
import { notifications } from "../../_helpers/notifications";
import { userActions } from "../../_redux/_actions";
import Logo from "../../../assets/logo/logo-login.png";
class ChangePassword extends Component<any, any> {
  user: any = {};
  errorMsg = "";
  constructor(props: any) {
    super(props);
    this.state = {
      user: {
        pwd: "",
        cPwd: "",
      },
    };
  }

  componentDidMount() {
    document.title = "Change Password";
    this.user.authToken = new URLSearchParams(this.props.location.search).has(
      "context"
    )
      ? new URLSearchParams(this.props.location.search).get("context")
      : "context";
    userService.verifyTempPwd(this.user).then(
      (response) => {
        this.user = response;
      },
      (error) => {
        this.errorMsg = error.toString();
        notifications.openErrorNotification(this.errorMsg);

        history.push("/login");
      }
    );
  }
  onFinish = (values: any) => {
    if (values.user.pwd != values.user.newPwd) {
      this.errorMsg = "Password do not match. please re-enter password.";
      notifications.openErrorNotification(this.errorMsg);
    } else {
      let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (regex.test(values.user.newPwd)) {
        this.user.pwd = values.user.newPwd;
        this.props.updatePwd(this.user);
      } else {
        this.errorMsg =
          "Please provide password which has atleast 8 characters including 1 special character [@#$%] 1 Upper & lower case letter";
        notifications.openErrorNotification(this.errorMsg);
      }
    }
  };

  render() {
    const layout = {
      labelCol: {
        span: 64,
      },
      wrapperCol: {
        span: 64,
      },
    };
    const tailLayout = {
      wrapperCol: {
        offset: 0,
        span: 16,
      },
    };

    return (
      <>
        <style>
          {
            "\
            body{\
                background: -webkit-linear-gradient(left, #0D3056, #76B9D3);widows: 100%;\
            }\
          "
          }
        </style>
        <section className="login">
          <div className="container">
            <div className="login-color">
              <Row>
                <Col
                  xs={{ span: 32, offset: 0 }}
                  sm={{ span: 32, offset: 0 }}
                  md={{ span: 12, offset: 0 }}
                  lg={{ span: 12, offset: 0 }}
                  className="login-form-1"
                ></Col>
                <Col
                  xs={{ span: 32, offset: 0 }}
                  sm={{ span: 32, offset: 0 }}
                  md={{ span: 12, offset: 0 }}
                  lg={{ span: 12, offset: 0 }}
                  className="login-form-2"
                >
                  <div className="login-logo">
                    <img src={Logo} alt="RFP" />
                  </div>
                  <h1>Change Password</h1>
                  <Form
                    {...layout}
                    name="changePasswordForm"
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                    scrollToFirstError
                  >
                    <Form.Item
                      label="New Password"
                      name={["user", "pwd"]}
                      rules={[
                        {
                          required: true,
                          message: "Please input your new password!",
                        },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (!value || value.length >= 8) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              "New password must be 8 character!"
                            );
                          },
                        }),
                      ]}
                      tooltip={{
                        title: "Please provide password which has atleast 8 characters including 1 special character [@#$%] 1 Upper & lower case letter",
                        icon: <InfoCircleOutlined />,
                      }}
                    >
                      <Input.Password placeholder="Enter your new password" />
                    </Form.Item>
                    <Form.Item
                      label="Confirm Password"
                      name={["user", "newPwd"]}
                      rules={[
                        {
                          required: true,
                          message: "Please input your confirm password!",
                        },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (!value || value.length >= 8) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              "Confirm password must be 8 character!"
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password placeholder="Enter your confirm password" />
                    </Form.Item>
                    <Form.Item className="margin-bottom">
                      <Row>
                        <Col span={24}>
                          <Form.Item>
                            <Button
                              type="primary"
                              htmlType="submit"
                              className="btn-primary"
                            >
                              Submit
                            </Button>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            </div>
          </div>
        </section>
      </>
    );
  }
}
function mapState(state: any) {
  const { authentication } = state;
  const { user } = authentication;
  const updateUserPwd = state.updatePwd;
  const verifyTempPassword = state.verifyTempPwd;
  return { user, updateUserPwd, verifyTempPassword };
}

const actionCreators = {
  updatePwd: userActions.updatePwd,
  verifyTempPwd: userActions.verifyTempPwd,
};

export default connect(mapState, actionCreators)(ChangePassword);
