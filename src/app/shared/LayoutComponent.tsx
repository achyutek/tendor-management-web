import React, { Component, useState } from "react";
import { NavLink, Switch, withRouter, Redirect } from "react-router-dom";
import { PrivateRoute } from "../_globals/components/PrivateRoute";
import logo from "../../assets/logo/logo.png";
import Smalllogo from "../../assets/logo/small-logo.png";
import { Layout, Menu, Drawer, Col, Button, Upload } from "antd";
import { connect } from "react-redux";
import ImgCrop from "antd-img-crop";

import {
  RightOutlined,
  CopyrightOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  LeftOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Dashboard from "../screens/dashboard/dashboard";
import Proposals from "../screens/proposals/proposals";
import AddProposal from "../screens/proposals/addproposal";
import Viewproposal from "../screens/proposals/viewproposal";
import Tasks from "../screens/tasks/tasks";
import AddTask from "../screens/tasks/addtask";
import Wonproposal from "../screens/wonproposals/wonproposals";
import AddWonproposal from "../screens/wonproposals/addwonproposal";
import Profile from "../../assets/img/profile1.svg";
import Proposals1 from "../../assets/img/Proposals1.svg";
import Report1 from "../../assets/img/report1.svg";
import Users from "../../assets/img/user1.svg";
import Admin from "../../assets/img/admin1.svg";
import Dashboard1 from "../../assets/img/dashboard1.svg";
import Knowledgebase from "../../assets/img/knowledgebase1.svg";
import Task from "../../assets/img/tasks1.svg";
import Wonproposals from "../../assets/img/wonproposals1.svg";
import Wonproposalstag from "../../assets/img/wonproposals-tag.svg";
import Addprofile from "../../assets/img/addprofile.svg";
import Idea from "../../assets/img/idea.svg";
import Send from "../../assets/img/send.svg";
import Online from "../../assets/img/online.svg";
import Proposal from "../../assets/img/proposal.svg";
import WonImage from "../../assets/img/wonimage.png";
import Comments from "../screens/Knowledgebase/comments/comments";
import Responses from "../screens/Knowledgebase/responses/responses";
import ViewCompetitive from "../screens/Knowledgebase/competitive/viewCompetitive";
import addCompetitve from "../screens/Knowledgebase/competitive/addCompetitve";
import DetialsCompetitive from "../screens/Knowledgebase/competitive/detialsCompetitve";
import Report from "../screens/report/report";
import AddTarget from "../screens/report/addTarget";
import UsersList from "../screens/user/users";
import history from "../_helpers/history";
import { User } from "../_globals/components";
import { userActions } from "../_redux/_actions/user.action";
import AddUser from "../screens/user/addUser";
import contents from "../screens/Knowledgebase/responses/contents";
import addResponse from "../screens/Knowledgebase/responses/addResponse";
import AdminPage from "../screens/admin/admin";
import AddWorkflow from "../screens/admin/addWorkflow";
const { Header, Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;

export class LayoutComponent extends Component<any, any> {
  date = new Date();
  state = {
    collapsed: true,
    visible: false,
    placement: "left",
    current: "mail",
    visible1: false,
    previewVisible: false,
    previewImage: "",
    fileList: [
      {
        uid: -1,
        name: "xxx.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
    ],
  };

  showDrawer1 = () => {
    this.setState({
      visible1: true,
    });
  };

  logout = async () => {
    await this.props.logout();
    history.push({
      pathname: "/login",
      search: "?",
      state: {
        from: this.props.location.pathname,
        search: this.props.location.search,
      },
    });
  };

  onClose1 = () => {
    this.setState({
      visible1: false,
    });
  };

  //Header Menu
  handleClick = (e: any) => {
    this.setState({ current: e.key });
  };

  //Desktop Sidebar
  toggle = () => {
    this.setState({
      collapsed: false,
    });
  };
  leaveMenu = () => {
    this.setState({ collapsed: true });
  };
  //Mobile Sidebar
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onChange = (e: any) => {
    this.setState({
      placement: e.target.value,
    });
  };
  get selectedKey() {
    let selected = ["dashboard"];
    if (
      this.props.location.pathname == "/proposals" ||
      this.props.location.pathname == "/add-proposal" ||
      this.props.location.pathname == "/viewproposal"
    ) {
      selected = ["proposals"];
    }
    if (this.props.location.pathname == "/tasks") {
      selected = ["tasks"];
    }
    if (this.props.location.pathname == "/wonproposals") {
      selected = ["wonproposals"];
    }
    if (this.props.location.pathname == "/responses") {
      selected = ["knowledge-base", "responses"];
    }
    if (this.props.location.pathname == "/comments") {
      selected = ["knowledge-base", "comments"];
    }
    if (this.props.location.pathname == "/viewCompetitive") {
      selected = ["knowledge-base", "viewCompetitive"];
    }
    if(this.props.location.pathname == "/admin"){
      selected = ["admin"];
    }
    if (this.props.location.pathname == "/users") {
      selected = ["users"];
    }
    if (this.props.location.pathname == "/report") {
      selected = ["reports"];
    }

    return selected;
  }
  render() {
    const { placement, visible, visible1 } = this.state;
    const { user } = this.props;

    let isAdmin = User.isAdmin();
    let isManager = User.isManager();
    return (
      <>
        <Layout>
          <Drawer
            className="sidebar"
            closable={false}
            placement="left"
            onClose={this.onClose}
            visible={visible}
            key={placement}
          >
            <div className="logo">
              {this.state.collapsed ? (
                <img src={logo} className="App-logo" alt="logo" />
              ) : (
                <img src={Smalllogo} className="small-logo" alt="logo" />
              )}
            </div>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={["dashboard"]}
              selectedKeys={this.selectedKey}
            >
              <Menu.Item
                key="dashboard"
                icon={<img src={Dashboard1} alt="Dashboard1"></img>}
              >
                <NavLink to={"/dashboard"} className="side-links">
                  Dashboard
                </NavLink>
              </Menu.Item>
              <Menu.Item
                key="proposals"
                icon={<img src={Proposals1} alt="Proposals1"></img>}
              >
                <NavLink
                  to={{
                    pathname: "/proposals",
                    search: "?past=-1",
                  }}
                  className="side-links"
                >
                  Proposals
                </NavLink>
              </Menu.Item>
              <Menu.Item key="tasks" icon={<img src={Task} alt="Task"></img>}>
                <NavLink to={"/tasks"} className="side-links">
                  Tasks
                </NavLink>
              </Menu.Item>
              <Menu.Item
                key="wonproposals"
                icon={<img src={Wonproposals} alt="Won Proposals"></img>}
              >
                <NavLink to={"/wonproposals"} className="side-links">
                  Won Proposals
                </NavLink>
              </Menu.Item>

              <SubMenu
                key="knowledge-base"
                icon={<img src={Idea} className="knowledge" />}
                title={this.state.collapsed ? "Knowledge Base" : ""}
                className="knowledge"
              >
                <Menu.Item
                  key="responses"
                  icon={<img src={Send} alt="Won Proposals"></img>}
                >
                  <NavLink to={"/responses"} className="side-links">
                    Responses
                  </NavLink>
                </Menu.Item>
                <Menu.Item
                  key="comments"
                  icon={<img src={Online} alt="Won Proposals"></img>}
                >
                  <NavLink to={"/comments"} className="side-links">
                    Learning
                  </NavLink>
                </Menu.Item>
                <Menu.Item
                  key="viewCompetitive"
                  icon={<img src={Proposal} alt="Won Proposals"></img>}
                >
                  <NavLink to={"/viewCompetitive"} className="side-links">
                    Competitive
                  </NavLink>
                </Menu.Item>
              </SubMenu>
              <Menu.Item key="admin" icon={<img src={Admin} alt="Admin"></img>}>
                <NavLink to={"/admin"} className="side-links">
                  Admin
                </NavLink>
              </Menu.Item>
              <Menu.Item key="users" icon={<img src={Users} alt="Users"></img>}>
                <NavLink to={"/users"} className="side-links">
                  User
                </NavLink>
              </Menu.Item>
              <Menu.Item
                key="reports"
                icon={<img src={Report1} alt="Report"></img>}
              >
                <NavLink to={"/report"} className="side-links">
                  Report
                </NavLink>
              </Menu.Item>
            </Menu>
          </Drawer>

          <div className="desktop">
            <Sider
              className="sidebar"
              trigger={null}
              collapsible
              collapsed={this.state.collapsed}
              onMouseEnter={this.toggle}
              onMouseLeave={this.leaveMenu}
            >
              <div className="logo">
                {this.state.collapsed ? (
                  <img src={Smalllogo} className="small-logo" alt="logo" />
                ) : (
                  <img src={logo} className="App-logo" alt="logo" />
                )}
              </div>
              <Menu
                theme="dark"
                mode="inline"
                expandIcon={<RightOutlined />}
                defaultSelectedKeys={["dashboard"]}
                selectedKeys={this.selectedKey}
              >
                <Menu.Item
                  key="dashboard"
                  icon={<img src={Dashboard1} alt="Dashboard1"></img>}
                >
                  <NavLink to={"/dashboard"} className="side-links">
                    Dashboard
                  </NavLink>
                </Menu.Item>
                <Menu.Item
                  key="proposals"
                  icon={<img src={Proposals1} alt="Proposals1"></img>}
                >
                  <NavLink
                    to={{
                      pathname: "/proposals",
                      search: "?past=-1",
                    }}
                    className="side-links"
                  >
                    Proposals
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="tasks" icon={<img src={Task} alt="Task"></img>}>
                  <NavLink to={"/tasks"} className="side-links">
                    Tasks
                  </NavLink>
                </Menu.Item>
                <Menu.Item
                  key="wonproposals"
                  icon={<img src={Wonproposals} alt="Won Proposals"></img>}
                >
                  <NavLink to={"/wonproposals"} className="side-links">
                    Won Proposals
                  </NavLink>
                </Menu.Item>
                <SubMenu
                  key="knowledge-base"
                  icon={<img src={Idea} className="knowledge" />}
                  title={this.state.collapsed ? "" : "Knowledge Base"}
                  className="knowledge"
                >
                  <Menu.Item
                    key="responses"
                    icon={<img src={Send} alt="Won Proposals"></img>}
                  >
                    <NavLink to={"/responses"} className="side-links">
                      Responses
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item
                    key="comments"
                    icon={<img src={Online} alt="Won Proposals"></img>}
                  >
                    <NavLink to={"/comments"} className="side-links">
                      Learning
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item
                    key="viewCompetitive"
                    icon={<img src={Proposal} alt="Won Proposals"></img>}
                  >
                    <NavLink to={"/viewCompetitive"} className="side-links">
                      Competitive
                    </NavLink>
                  </Menu.Item>
                </SubMenu>
                
                {isAdmin ? (
                  <Menu.Item
                  key="admin"
                  icon={<img src={Admin} alt="Admin"></img>}
                  >
                  <NavLink to={"/admin"} className="side-links">
                    Admin
                  </NavLink>
                  </Menu.Item>
                ) : (
                  ""
                )}
                {isManager || isAdmin ? (
                  <Menu.Item
                    key="users"
                    icon={<img src={Users} alt="Users"></img>}
                  >
                    <NavLink to={"/users"} className="side-links">
                      Users
                    </NavLink>
                  </Menu.Item>
                ) : (
                  ""
                )}
                <Menu.Item
                  key="reports"
                  icon={<img src={Report1} alt="Report"></img>}
                >
                  <NavLink to={"/report"} className="side-links">
                    Reports
                  </NavLink>
                </Menu.Item>
              </Menu>
            </Sider>
          </div>
          <Layout
            className={
              this.state.collapsed ? "site-layout small-layout" : "site-layout"
            }
          >
            <Header
              className={
                this.state.collapsed
                  ? "header-small site-layout-background"
                  : "header-bg site-layout-background"
              }
            >
              <div className="sidebar-icon">
                <span className="mobile">
                  {React.createElement(
                    this.state.collapsed
                      ? MenuUnfoldOutlined
                      : MenuUnfoldOutlined,
                    { className: "trigger", onClick: this.showDrawer }
                  )}
                </span>
                <span className="desktop">
                  {React.createElement(
                    this.state.collapsed ? RightOutlined : LeftOutlined,
                    { className: "trigger", onClick: this.toggle }
                  )}
                </span>
              </div>
              <div className="">
                <div className="logout" onClick={this.logout}>
                  {React.createElement(LogoutOutlined)}
                </div>
                {/* <div className="logout logout-01" onClick={this.showDrawer1}> */}
                <UserOutlined />
                {/* </div> */}
              </div>
            </Header>
            <Content className="content content-main">
              <div className="main-height">
                <Col
                  className="site-layout-background main-content"
                  id="main-content"
                >
                  <Switch>
                    <PrivateRoute
                      exact
                      path={"/dashboard"}
                      component={Dashboard}
                      loggedIn={true}
                      isAccess={true}
                    />
                    <PrivateRoute
                      exact
                      path={"/proposals"}
                      component={Proposals}
                      loggedIn={true}
                      isAccess={true}
                    />
                    <PrivateRoute
                      exact
                      path={"/add-proposal"}
                      component={AddProposal}
                      loggedIn={true}
                      isAccess={true}
                    />
                    <PrivateRoute
                      exact
                      path={"/tasks"}
                      component={Tasks}
                      loggedIn={true}
                      isAccess={true}
                    />
                    <PrivateRoute
                      exact
                      path={"/addtask"}
                      component={AddTask}
                      loggedIn={true}
                      isAccess={true}
                    />
                    <PrivateRoute
                      exact
                      path={"/wonproposals"}
                      component={Wonproposal}
                      loggedIn={true}
                      isAccess={true}
                    />
                    <PrivateRoute
                      exact
                      path={"/addwonproposal"}
                      component={AddWonproposal}
                      loggedIn={true}
                      isAccess={true}
                    />
                    <PrivateRoute
                      exact
                      path={"/viewproposal"}
                      component={Viewproposal}
                      loggedIn={true}
                      isAccess={true}
                    />
                    <PrivateRoute
                      exact
                      path={"/comments"}
                      component={Comments}
                      loggedIn={true}
                      isAccess={true}
                    />
                    <PrivateRoute
                      exact
                      path={"/responses"}
                      component={Responses}
                      loggedIn={true}
                      isAccess={true}
                    />
                    <PrivateRoute
                      exact
                      path={"/contents"}
                      component={contents}
                      loggedIn={true}
                      isAccess={true}
                    />
                    <PrivateRoute
                      exact
                      path={"/addResponse"}
                      component={addResponse}
                      loggedIn={true}
                      isAccess={true}
                    />
                    <PrivateRoute
                      exact
                      path={"/viewCompetitive"}
                      component={ViewCompetitive}
                      loggedIn={true}
                      isAccess={true}
                    />
                    <PrivateRoute
                      exact
                      path={"/add-Competitive"}
                      component={addCompetitve}
                      loggedIn={true}
                      isAccess={true}
                    />
                    <PrivateRoute
                      exact
                      path={"/detialsCompetitve"}
                      component={DetialsCompetitive}
                      loggedIn={true}
                      isAccess={true}
                    />
                    <PrivateRoute
                      exact
                      path={"/report"}
                      component={Report}
                      loggedIn={true}
                      isAccess={true}
                    />
                    <PrivateRoute
                      exact
                      path={"/addTarget"}
                      component={AddTarget}
                      loggedIn={true}
                      isAccess={isManager}
                    />
                    <PrivateRoute
                      exact
                      path={"/users"}
                      component={UsersList}
                      loggedIn={true}
                      isAccess={isManager}
                    />
                    <PrivateRoute
                      exact
                      path={"/addUser"}
                      component={AddUser}
                      loggedIn={true}
                      isAccess={isManager}
                    />
                    <PrivateRoute
                      exact
                      path={"/admin"}
                      component={AdminPage}
                      loggedIn={true}
                      isAccess={isAdmin}
                    />
                    <PrivateRoute
                      exact
                      path={"/addWorkflow"}
                      component={AddWorkflow}
                      loggedIn={true}
                      isAccess={isAdmin}
                    />
                  </Switch>
                </Col>
              </div>
            </Content>
            <div className="desktop">
              <Sider className="right-sidebar">
                <div className="right-sidebar-profile-img">
                  <img src={Profile} alt="Profile" />
                  {/* <div className="addprofile-icon">
                    <ImgCrop>
                      <Upload>
                        {" "}
                        <img src={Addprofile} alt=""></img>
                      </Upload>
                    </ImgCrop>
                  </div> */}
                </div>

                <div className="right-sidebar-profile-name">
                  <h3>{user.name}</h3>
                  <p>{user.role}</p>
                </div>

                <div className="won-image">
                  <img src={WonImage} alt="Won Image" />
                </div>

                <div className="right-sidebar-proposal">
                  <img src={Wonproposalstag} alt="Wonproposals Tag" />
                  <div className="top-padding">
                    <h2>ID : MCS20-S04</h2>
                    <h2>Title : Staffing Services</h2>
                    <NavLink to="/wonproposals" className="">
                      {" "}
                      <Button block>
                        More <RightOutlined />
                      </Button>
                    </NavLink>
                  </div>
                </div>
              </Sider>
            </div>
            <Footer
              className={this.state.collapsed ? "footer-small" : "footer-bg"}
            >
              <CopyrightOutlined /> {this.date.getFullYear()}{" "}
              SoftSages Technology. All Rights Reserved.
            </Footer>
          </Layout>
        </Layout>
        <Drawer
          title="Template Setting"
          placement="right"
          closable={false}
          onClose={this.onClose1}
          visible={this.state.visible1}
          getContainer={false}
        >
          <p>Some contents...</p>
        </Drawer>
      </>
    );
  }
}

function mapState(state: any) {
  const { authentication } = state;
  const { user } = authentication;
  return { alert, user };
}
const actionCreators = {
  logout: userActions.logout,
};
export default withRouter(connect(mapState, actionCreators)(LayoutComponent));
