import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Input,
  message,
  Row,
  Col,
  PageHeader,
  Select,
  Form,
  Button,
  Modal,
} from "antd";
import {
  PlusCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { notifications } from "../../_helpers/notifications";
import { MessageProp } from "../../_globals/constants/message.constants";
import { Table1 } from "../../component/table";
import { userService } from "../../services/user-service";
import DailogComponent from "../../component/DailogComponent";
import { User } from "../../_models";
import { App } from "../../_models/app-model";
import computer from "../../../assets/images/computer.png";

const Option = Select.Option;
const { Search } = Input;

export class UsersList extends Component<any, any> {
  userss: User[] = [];
  columns = [
    {
      key: "id",
      title: "Account",
      dataIndex: "account",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNo",
    },
    {
      title: "Action",
      dataIndex: "name",
      render: (text: any, record: any) => {
        return (
          <>
            <span
              onClick={() => {
                this.getContact(record);
              }}
            >
              <a className="proposal-contact">
                <EyeOutlined />
              </a>
            </span>

            <Link
              to={"/addUser?id=" + record.email}
              style={{ color: "#13b4ca" }}
            >
              <a className="proposal-contact">
                <EditOutlined />
              </a>
            </Link>
          </>
        );
      },
    },
  ];
  refForm1: any = React.createRef();
  constructor(props: any) {
    super(props);
    this.state = {
      users: [],
      loading: true,
      totalPage: 0,
      visible: false,
      title: "",
      content: "",
      roles: "",
      user: new User(),
      accountName: "",
      record: new User(),
      selectedRow: [],
    };
  }
  async componentDidMount() {
    document.title = "Users";
    // let app = new App();
    // app.name = "RFP";
    // this.state.user.apps.push(app);
    await this.getAccount();
    await this.getUsersList();
    await this.getRole();
    
  }

  closeModal = () => {
    this.setState({ visible: false });
  };

  

  getRole = async () => {
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

  getContact = (record: any) => {
    let content = (
      <>
        <Row>
          <Col
            span={12}
            xs={{ order: 12 }}
            sm={{ order: 12 }}
            md={{ order: 12 }}
            lg={{ order: 12 }}
          >
            <div className="computer-img">
              <img src={computer} alt="computer" className="" />
            </div>
          </Col>
          <Col
            span={12}
            xs={{ order: 12 }}
            sm={{ order: 12 }}
            md={{ order: 12 }}
            lg={{ order: 12 }}
          >
            <div className="person-contact">
              <span className="label">Name : {record.name}</span>
            </div>
            <div className="person-contact">
              <span className="label">Email : {record.email}</span>
            </div>
            <div className="person-contact">
              <span className="label">Contact No. : {record.contactNo}</span>
            </div>
            <div className="person-contact">
              <span className="label">Role : {record.role}</span>
            </div>
          </Col>
        </Row>
      </>
    );
    this.setState({ visible: true, content, title: "User Details" });
  };

  validateText = (token: any) => {
    const ext = new RegExp(
      "^s*([A-Za-z]{1,}([.,]| |[-']| |))+[A-Za-z]*.?s*$",
      "igm"
    );
    if (!ext.exec(token)) {
      return false;
    } else {
      return true;
    }
  };

  onFinish = (value: any) => {
    this.setState({
      user: { ...this.state.user, ...value.user },
    });
    let account = this.state.accountName;

    this.setState(
      {
        user: { ...this.state.user, account },
      },
      () => {
        this.saveUser();
      }
    );
  };

  saveUser = async () => {
    await userService
      .adduser(this.state.user)
      .then((response) => {
        alert("Save Suucessfully");
      })
      .catch(notifications.openErrorNotification);
  };

  roleChange = (event: string) => {
    for (let role of this.state.roles) {
      if (role.name === event) {
        if (
          this.state.user.apps != undefined &&
          this.state.user.apps.length > 0
        ) {
          this.state.user.apps = this.state.user.apps.filter(
            (app: any) => app.name !== "RFP"
          );
          let currentApp = new App();
          currentApp.name = "RFP";
          currentApp.role = role;
          this.state.user.apps.push(currentApp);
          this.setState({
            user: { ...this.state.user, currentApp },
          });
        } else {
          this.state.user.apps[0].role = role;
        }
      }
    }
  };

  editUser = () => {
    let fieldValues = {
      user: {
        email: this.state.record.email,
        firstName: this.state.record.firstName,
        lastName: this.state.record.lastName,
        displayName: this.state.record.displayName,
        contactNo: this.state.record.contactNo,
        role: this.state.record.role,
        address: this.state.record.address,
      },
    };
    this.refForm1.current.setFieldsValue(fieldValues);
  };

  addUser = (record: any) => {
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
                ref={this.refForm1}
                id="userForm"
                scrollToFirstError
              >
                <div>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={24}>
                      <Form.Item
                        label={<span> Email</span>}
                        name={["user", "email"]}
                      >
                        <Input placeholder="Enter Solicitation Number" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={12}>
                      <Form.Item
                        label={<span> First Name</span>}
                        name={["user", "firstName"]}
                      >
                        <Input placeholder="Enter Solicitation Number" />
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
                      <Form.Item
                        label={<span> Last Name</span>}
                        name={["user", "lastName"]}
                      >
                        <Input placeholder="Enter Solicitation Number" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={12}>
                      <Form.Item
                        label={<span> Display Name </span>}
                        name={["user", "displayName"]}
                      >
                        <Input placeholder="Enter Solicitation Number" />
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
                      <Form.Item
                        label={<span> Contact Number</span>}
                        name={["user", "contactNo"]}
                      >
                        <Input placeholder="Enter Solicitation Number" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={24}>
                      <Form.Item
                        label={<span> Role</span>}
                        name={["user", "role"]}
                      >
                        <Select
                          value={this.state.roles}
                          onChange={this.roleChange}
                        >
                          {this.state.roles.map((data: any) => {
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
                        label={<span> Address</span>}
                        name={["user", "address"]}
                      >
                        <Input placeholder="Enter Solicitation Number" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
                <Button style={{ marginRight: 8 }}>Cancel</Button>{" "}
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => message.success("Processing complete!")}
                >
                  Submit
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </>
    );
    this.setState(
      { visible: true, content, title: "Add New User", record },
      () => {
        this.editUser();
      }
    );
  };

  handleSelect = (RwoId: any) => {
    this.setState({ selectedRow: RwoId });
  };

  handleDeleteButton = () => {
    if (this.state.selectedRow.length === 0) {
      // alert("Please Select Row");
      notifications.openWarningNotification("Please Select Row");
    } else {
      Modal.confirm({
        title: "Delete Users",
        content: "Are you sure you want to delete users?",
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
          this.confirmDelete();
        },
      });
    }
  };

  deleteUser = (email: string) => {
    let user = new User();
    user.email = email;
    userService
      .deleteUser(user)
      .then((response) => {
        notifications.openSuccessNotification(
          MessageProp.getDeletedSucessMessage("User")
        );
        this.getUsersList();
      })
      .catch(notifications.openErrorNotification);
  };

  confirmDelete = () => {
    this.state.selectedRow.forEach((us: any) => {
      this.deleteUser(us.email);
      this.userss = this.userss.filter((r: any) => r.id !== us.id);
    });
  };

  searchData = async (event: any) => {
    let val = event.target.value;
    if(val === ""){
      this.getUsersList();
    }else if (val != undefined && val.trim().length > 3) {
      let response = await userService
        .userSerachData(val.trim())
        .then()
        .catch(notifications.openErrorNotification);
      this.setState({
        serachTable: true,
        users: response,
      });
    } 
  };


  getUsersList = async () => {
    this.setState({
      users: await userService
        .getUsersByApp()
        .then()
        .catch(notifications.openErrorNotification),
      loading: false,
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
          loading={false}
        ></DailogComponent>
        <Row>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 24 }}
          >
            <div className="site-page-header-ghost-wrapper">
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
                      lg={{ span: 8 }}
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
                  <Button
                    danger
                    className="fr ml1"
                    onClick={this.handleDeleteButton}
                    icon={<DeleteFilled />}
                  >
                    Delete
                  </Button>

                  <Link to={"/addUser"}>
                    <Button
                      type="primary"
                      className="fr fl"
                      icon={<PlusCircleOutlined />}
                    >
                      Add User
                    </Button>
                  </Link>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <Row>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 24 }}
          >
            <Table1
              data={this.state.users}
              columns={this.columns}
              loading={this.state.loading}
              checkBox={true}
              handleSelect={this.handleSelect}
            />
          </Col>
        </Row>
      </>
    );
  }
}
export default UsersList;
