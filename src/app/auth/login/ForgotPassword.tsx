import React, { Component } from "react";
import { Row, Col, Form, Input, Button, Spin } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { userActions } from "../../_redux/_actions";
import Logo from "../../../assets/logo/logo-login.png";

class ForgotPassword extends Component<any, any> {
  componentDidMount() {
    document.title = "Forgot Password";
  }

  onFinish = (values: any) => {
    let user = { email: values.user.email };
    this.props.resetUserPwd(user);
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
    const { resetUserPwd } = this.props;
    const { loading } = resetUserPwd;

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
                  <h1>Reset Password</h1>
                  <Form
                    {...layout}
                    name="forgotPasswordForm"
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                    scrollToFirstError
                  >
                    <Form.Item
                      label="Email"
                      name={["user", "email"]}
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
                    <Form.Item className="margin-bottom">
                      <Row>
                        <Col span={12}>
                          <Form.Item {...tailLayout}>
                            <Spin
                              className="spinner-login"
                              spinning={loading === undefined ? false : loading}
                            >
                              <Button
                                type="primary"
                                htmlType="submit"
                                className="btn-primary"
                              >
                                Submit
                              </Button>
                            </Spin>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Link
                            to={"/login"}
                            href="javascript:void(0)"
                            className="btn-link forgot-password"
                          >
                            Back to login
                          </Link>
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
  const resetUser = state.resetUserPwd;
  return { resetUser };
}
const actionCreators = {
  resetUserPwd: userActions.resetUserPwd,
};
export default connect(mapState, actionCreators)(ForgotPassword);
