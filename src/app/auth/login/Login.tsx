import React, { Component } from "react";
import { Row, Col, Form, Input, Button, Spin, Checkbox } from "antd";
import {
  KeyOutlined,
  MailOutlined,
  CopyrightOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import history from "../../_helpers/history";
import { userActions } from "../../_redux/_actions";
import Logo from "../../../assets/logo/logo-login.png";
import { notifications } from "../../_helpers/notifications";

class Login extends Component<any, any> {
  date = new Date();
  constructor(props: any) {
    super(props);
    this.state = {
      passwordMatched: true,
      isChecked: false,
    };
    this.onFinish = this.onFinish.bind(this);
    history.listen(() => {
      // this.props.clearAlerts();
    });
  }

  componentDidMount() {
    document.title = "RFP Login";
  }

  checkboxChanged = (event: any) => {
    if (event.target.checked) {
      this.setState({ isChecked: true });
    } else {
      this.setState({ isChecked: false });
    }
  };

  onFinish(values: any) {
    if (this.state.isChecked) {
      localStorage.setItem("email", values.user.email);
      localStorage.setItem("password", values.user.pwd);
    } else {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
    }
    // if(!validatePass)
    // {
    //     this.setState({passwordMatched:false})
    // }
    // else{
    //     this.props.loginAction(values.user);
    // }
    let state = this.props.history.location.state;
    if (state === undefined || state === null) {
      state = {};
    }
    this.props.loginAction(values.user, state);
  }

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
    const { authentication } = this.props;
    const { loading } = authentication;

    return (
      <>
        <section className="login">
          <div className="container">
            <div className="login-color">
              <Row>
                <Col
                  xs={{ span: 24, offset: 0 }}
                  sm={{ span: 24, offset: 0 }}
                  md={{ span: 12, offset: 0 }}
                  lg={{ span: 12, offset: 0 }}
                  className="login-form-1"
                ></Col>
                <Col
                  xs={{ span: 24, offset: 0 }}
                  sm={{ span: 24, offset: 0 }}
                  md={{ span: 12, offset: 0 }}
                  lg={{ span: 12, offset: 0 }}
                  className="login-form-2"
                >
                  <div className="login-logo">
                    <img src={Logo} alt="RFP" />
                  </div>
                  <h1>login Into RFP</h1>
                  <Form
                    {...layout}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                    scrollToFirstError
                  >
                    <Form.Item
                      label={
                        <span>
                          <MailOutlined /> Email
                        </span>
                      }
                      name={["user", "email"]}
                      initialValue={
                        localStorage.getItem("email")
                          ? localStorage.getItem("email")
                          : null
                      }
                      rules={[
                        {
                          type: "email",
                          message: "The input is not valid E-mail!",
                        },
                        {
                          required: true,
                          message: "Please input your E-mail!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter your email" />
                    </Form.Item>
                    <Form.Item
                      label={
                        <span>
                          <KeyOutlined className="keys" /> Password
                        </span>
                      }
                      name={["user", "pwd"]}
                      initialValue={
                        localStorage.getItem("password")
                          ? localStorage.getItem("password")
                          : null
                      }
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (!value || value.length >= 8) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              "Password must be 8 character!"
                            );
                          },
                        }),
                      ]}
                      tooltip={{
                        title: "Please provide password which has atleast 8 characters including 1 special character [@#$%] 1 Upper & lower case letter",
                        icon: <InfoCircleOutlined />,
                      }}
                    >
                      <Input.Password placeholder="Enter your password" />
                    </Form.Item>
                    {!this.state.passwordMatched ? (
                      <span style={{ color: "red" }}>
                        please enter password that contains one special
                        character, one uppercase and one lowercase
                      </span>
                    ) : null}
                    <Form.Item className="margin-bottom">
                      <Row>
                        {/* <Col span={12}>
                          <Form.Item {...tailLayout} name="remember">
                            <Checkbox onChange={this.checkboxChanged}>
                              Remember me
                            </Checkbox>
                          </Form.Item>
                        </Col> */}
                        <Col span={24}>
                          <Link to={"/forgotPassword"} className="btn-link">
                            Forgot Password ?
                          </Link>
                        </Col>
                      </Row>
                    </Form.Item>
                    {/* <Form.Item {...tailLayout}> */}
                    <Spin
                      className="spinner-login"
                      spinning={loading === undefined ? false : loading}
                    >
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="btn-primary"
                      >
                        Login
                      </Button>
                    </Spin>
                    {/* </Form.Item> */}
                  </Form>
                  <p className="text-center">
                    <CopyrightOutlined /> {this.date.getFullYear()}{" "}
                    SoftSages Technology. All Rights Reserved.
                  </p>
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
  const { authentication, alert } = state;
  return { authentication, alert };
}
const actionCreators = {
  loginAction: userActions.login,
};
export default connect(mapState, actionCreators)(Login);
