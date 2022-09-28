import React, { Component } from "react";
import {Card, Col, Row, Avatar, Select } from "antd";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import BITS from "../../../assets/img/bids.svg";
import Due from "../../../assets/img/due.svg";
import Nobids from "../../../assets/img/nobids.svg";
import Pending from "../../../assets/img/pending.svg";
import Tasks from "../../../assets/img/mytask.svg";
import Opentask from "../../../assets/img/opentask.svg";
import { rfpService } from "../../services/rfp-service";
import { AttributeType } from "../../_redux/_constants";
import history from "../../_helpers/history";
import { NavLink } from "react-router-dom";
import { notifications } from "../../_helpers/notifications";
import Moment from "moment";
import { connect } from "react-redux";
import {
  resetFilterAction,
} from "../../_redux/_actions/filter.action";
const { Meta } = Card;
const { Option } = Select;

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#13b4ca",
  "#a5b0cd",
  "#1d4c62",
  "#0d7938",
  "#AD947D",
  "#e26764",
  "#BC6BBE",
];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const style = {
  top: 0,
  right: -10,
  lineHeight: "24px",
};
const d: Date = new Date();
export class Dashboard extends Component<any, any> {
  regionValue: string = "";
  domainValue: string = "";
  month: any;
  year: any;
  weekly: any;
  weeksObj: any[] = [];
  state = {
    visible: true,
    RfpStatus: [],
    RfpType: [],
    RfpDomain: [],
    RfpAction: [],
    RfpDue: [],
    RfpTask: [],
    RfpTaskOpen: [],
    RfpDomainList: [],
    timeInterval: -1,
    RfpTotal: "",
    RfpDomainCount: "",
    domain: "",
    analytical: [],
    analyticalweekly: [],
    endweekly: "",
    wonProposal: "",
    region: [],
    taskeData: [],
  };
  loaded = false;

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

  getRfpDomainCount = async () => {
    await rfpService
      .getRfpDomainCount(
        this.regionValue,
        this.state.domain,
        this.state.timeInterval
      )
      .then((response) => {
        this.setState({
          RfpAction: response,
        });
      })
      .catch(notifications.openErrorNotification);
  };
  getRfpDueCountwithDomain = async () => {
    await rfpService
      .getRfpDueCountwithDomain(
        this.regionValue,
        this.state.domain,
        this.state.timeInterval
      )
      .then((response) => {
        this.setState({
          RfpDue: response,
        });
      })
      .catch(notifications.openErrorNotification);
  };
  getRfpTotalWithDomain = async () => {
    await rfpService
      .getRfpTotalWithDomain(
        this.regionValue,
        this.state.domain,
        this.state.timeInterval
      )
      .then((response) => {
        this.setState({
          RfpTotal: response[0].count,
        });
      })
      .catch(notifications.openErrorNotification);
  };
  getRfpByStatusWithDomain = async () => {
    await rfpService
      .getRfpByStatusWithDomain(
        this.regionValue,
        this.state.domain,
        this.state.timeInterval
      )
      .then((response) => {
        this.setState({
          RfpStatus: response,
        });
      })
      .catch(notifications.openErrorNotification);
  };
  getRfpByTypeWithDomain = async () => {
    await rfpService
      .getRfpByTypeWithDomain(
        this.regionValue,
        this.state.domain,
        this.state.timeInterval
      )
      .then((response) => {
        this.setState({
          RfpType: response,
        });
      })
      .catch(notifications.openErrorNotification);
  };
  getRfpByDomainWithDomain = async () => {
    await rfpService
      .getRfpByDomainWithDomain(
        this.regionValue,
        this.state.domain,
        this.state.timeInterval
      )
      .then((response) => {
        this.setState({
          RfpDomain: response,
        });
      })
      .catch(notifications.openErrorNotification);
  };

  handleDueChange = async (event: any) => {
    await this.setState({ domain: this.domainValue, timeInterval: event });
    this.getRfpDomainCount();
    this.getRfpDueCountwithDomain();
    this.getRfpTotalWithDomain();
    this.getRfpByStatusWithDomain();
    this.getRfpByTypeWithDomain();
    this.getRfpByDomainWithDomain();
  };

  handledomainChange = async (event: string) => {
    await this.setState({ domain: event });
    this.domainValue = event;
    this.getRfpDomainCount();
    this.getRfpDueCountwithDomain();
    this.getRfpTotalWithDomain();
    this.getRfpByStatusWithDomain();
    this.getRfpByTypeWithDomain();
    this.getRfpByDomainWithDomain();
  };

  getFields = (input: any, field: any) => {
    var output = [];
    for (var i = 0; i < input.length; ++i) output.push(input[i][field]);
    return output.reduce(function (a, b) {
      if (a.indexOf(b) < 0) a.push(b);
      return a;
    }, []);
  };

  getLaoding = () => {
    rfpService
      .getDomain(this.regionValue)
      .then((response) => {
        this.setState({
          RfpDomainList: this.getFields(response, "name"),
        });
      }, (error) => {
        if(error !== "Forbidden"){
          notifications.openErrorNotification(error.toString());
        }
      })
    rfpService
      .getRfpMetricsByAttribute(AttributeType.ACTION, this.state.timeInterval)
      .then((response) => {
        this.setState({
          RfpAction: response,
        });
      })
      .catch((error)=>{
        if(error !== "Forbidden"){
          notifications.openErrorNotification(error.toString());
        }
      });

    rfpService
      .getRfpMetricsByAttribute(AttributeType.DUE, this.state.timeInterval)
      .then((response) => {
        this.setState({
          RfpDue: response,
        });
      })
      .catch((error)=>{
        if(error !== "Forbidden"){
          notifications.openErrorNotification(error.toString());
        }
      });
    rfpService
      .getRfpMetricsByAttribute(AttributeType.STATUS, this.state.timeInterval)
      .then((response) => {
        this.setState({
          RfpStatus: response,
        });
      })
      .catch((error)=>{
        if(error !== "Forbidden"){
          notifications.openErrorNotification(error.toString());
        }
      });

    rfpService
      .getRfpMetricsByAttribute(AttributeType.TYPE, this.state.timeInterval)
      .then((response) => {
        this.setState({
          RfpType: response,
        });
      })
      .catch((error)=>{
        if(error !== "Forbidden"){
          notifications.openErrorNotification(error.toString());
        }
      });

    rfpService
      .getRfpMetricsByAttribute(AttributeType.DOMAIN, this.state.timeInterval)
      .then((response) => {
        this.setState({
          RfpDomain: response,
        });
      })
      .catch((error)=>{
        if(error !== "Forbidden"){
          notifications.openErrorNotification(error.toString());
        }
      });

    rfpService
      .getRfpTotal(this.state.timeInterval)
      .then((response) => {
        this.setState({
          RfpTotal: response[0].count,
        });
      })
      .catch((error)=>{
        if(error !== "Forbidden"){
          notifications.openErrorNotification(error.toString());
        }
      });
  };

  componentDidMount = async () => {
    this.props.filterAction();
    document.title = "RFP Dashboard";
    this.regionValue = "All";
    this.domainValue = "All";
    this.getLaoding();
    this.month = d.getMonth();
    this.year = d.getFullYear();
    this.weekPopulate();
    this.getloadAnalytical();
    this.loadWeeklyReport();
    this.getRegion();

    rfpService
      .getRfpTask()
      .then((response) => {
        this.setState({
          RfpTask: response,
        });
      })
      .catch((error)=>{
        if(error !== "Forbidden"){
          notifications.openErrorNotification(error.toString());
        }
      });

    await rfpService
      .getRfpTaskOpen()
      .then((response) => {
        this.setState({
          RfpTaskOpen: response,
        });
      })
      .catch((error)=>{
        if(error !== "Forbidden"){
          notifications.openErrorNotification(error.toString());
        }
      });
  };

  getRegion = async () => {
    this.setState({
      region: await rfpService
        .getRfpByAttribute(AttributeType.REGION)
        .then((response) =>{

        },(error)=> {
          if(error !== "Forbidden"){
            notifications.openErrorNotification(error.toString());
          }
        }),
      loading: false,
    });
  };

  weekPopulate = () => {
    for (var i = 0; i < 1; i++) {
      if (i === 0) {
        this.getlastFourWeek(new Date());
      } else {
        this.getlastFourWeek(this.weeksObj[i - 1]["lastMonday"]);
      }
    }
  };

  getlastFourWeek = (date: Date) => {
    var beforeOneWeek = new Date(date.getTime() - 60 * 60 * 24 * 7 * 1000),
      day = beforeOneWeek.getDay(),
      diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -5 : 1),
      lastMonday = new Date(beforeOneWeek.setDate(diffToMonday)),
      lastSaturday = new Date(beforeOneWeek.setDate(diffToMonday + 5));
    this.weeksObj.push({
      lastMonday: lastMonday,
      lastSaturday: lastSaturday,
      text: "Week ending-" + Moment(lastSaturday).format("MM/DD/YYYY"),
      value: this.getStringDate(lastMonday, lastSaturday, "YYYY-MM-DD", "|"),
    });
    this.weeksObj.map((data: any) => {
      return (this.state.endweekly = data.value);
    });
  };

  getStringDate = (start: any, end: any, str: any, separator: any) => {
    return Moment(start).format(str) + separator + Moment(end).format(str);
  };

  getloadAnalytical = async () => {
    if (this.month === 0) {
      this.month = this.month + 12;
      this.year = this.year - 1;
    }
    this.setState({
      analytical: await rfpService
        .getAnalytical(this.month, this.year)
        .then()
        .catch((error)=>{
          if(error !== "Forbidden"){
            notifications.openErrorNotification(error.toString());
          }
        }),
      loading: false,
    });
  };

  loadWeeklyReport = async () => {
    this.setState({
      analyticalweekly: await rfpService
        .getWeekReport(this.state.endweekly)
        .then()
        .catch((error)=>{
          if(error !== "Forbidden"){
            notifications.openErrorNotification(error.toString());
          }
        }),
      loading: false,
    });
  };
  selectLeblePie = (e: any) => {
    history.push({
      pathname: "/proposals",
      search:
        "?subContext=status&status=" +
        e.value +
        "&past=" +
        this.state.timeInterval,
    });
  };
  getlastWonProposal = () => {
    rfpService
      .getLastWonProposal()
      .then((response) => {
        this.setState({
          wonProposal: response,
        });
      })
      .catch((error)=>{
        if(error !== "Forbidden"){
          notifications.openErrorNotification(error.toString());
        }
      });
  };

  handlRegionChange = async (region: any) => {
    this.regionValue = region;
    let response = await rfpService.getDomain(region).then().catch();

    if (response != "") {
      let domainName = this.domainValue;
      this.setState({
        RfpDomainList: this.getFields(response, "name"),
      });
      this.handledomainChange(domainName);
    } else {
      this.clean();
      this.setState({
        domain: [],
        RfpTaskOpen: [],
        RfpTask: [],
        analyticalweekly: [],
        analytical: [],
        RfpAction: [],
        RfpDue: [],
        RfpStatus: [],
        RfpType: [],
        RfpTotal: [],
        RfpDomainList: [],
        RfpDomain: [],
      });
    }
  };

  clean = () => {
    this.domainValue = "";
  };

  render() {
    const {
      RfpStatus,
      RfpType,
      RfpDomain,
      RfpAction,
      RfpDue,
      RfpTask,
      RfpTaskOpen,
      RfpTotal,
    } = this.state;
    return (
      <>
        <div className="site-page-header-ghost-wrapper">
          <Row gutter={24} className="headeing-padding">
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 8 }}
              lg={{ span: 14 }}
            >
              <Row gutter={24}>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 12 }}
                >
                  <h1 className="DashbaordHeding">
                    <b>Submissions</b>
                  </h1>
                </Col>
              </Row>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 8 }}
              lg={{ span: 3 }}
            >
              {" "}
              <Select
                className="select-class"
                onChange={this.handlRegionChange}
                value={this.regionValue}
                placeholder="Domain Name"
                id="rc_select_region"
              >
                <Option value="All">All</Option>
                {this.state.region
                  ? this.state.region.map((data: any) => {
                      return <Option value={data.name}>{data.name}</Option>;
                    })
                  : ""}
              </Select>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 8 }}
              lg={{ span: 3 }}
            >
              {" "}
              <Select
                id="rc_select_domain"
                className="select-class"
                onChange={this.handledomainChange}
                // value={this.state.domain}
                placeholder="Domain Name"
              >
                <Option value="All">All</Option>
                {this.state.RfpDomainList.map((data: any) => {
                  return <Option value={data}>{data}</Option>;
                })}
              </Select>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 8 }}
              lg={{ span: 3 }}
            >
              <Select
                className="select-class"
                placeholder="Created / Due In"
                optionFilterProp="children"
                onChange={this.handleDueChange}
              >
                <Option value="7">1 Week</Option>
                <Option value="14">2 Weeks</Option>
                <Option value="21">3 Weeks</Option>
                <Option value="30">1 Month</Option>
                <Option value="-1">All</Option>
              </Select>
            </Col>
          </Row>
        </div>

        <div className="site-card-wrapper">
          <Row gutter={16}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 12 }}
              lg={{ span: 19 }}
            >
              <Row gutter={16}>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 12 }}
                  lg={{ span: 6 }}
                >
                  <Card className="box-05" hoverable>
                    <NavLink
                      to={{
                        pathname: "/proposals",
                        search: "?past=-1",
                      }}
                      className="side-links"
                    >
                      <Meta
                        avatar={<Avatar src={BITS} />}
                        title="Total"
                        description={RfpTotal}
                      />
                    </NavLink>
                  </Card>
                </Col>

                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 12 }}
                  lg={{ span: 6 }}
                >
                  <Card className="box-01" hoverable>
                    <NavLink
                      to={{
                        pathname: "/proposals",
                        search:
                          "?subContext=action&action=Yes&past=" +
                          this.state.timeInterval,
                      }}
                      className="side-links"
                    >
                      <Meta
                        avatar={<Avatar src={BITS} />}
                        title="Yes"
                        description={
                          RfpAction.filter((value: any) => {
                            return value.name === "Yes";
                          }).map((data: any) => {
                            return data.count;
                          })[0]
                        }
                      />
                    </NavLink>
                  </Card>
                </Col>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 12 }}
                  lg={{ span: 6 }}
                >
                  <Card className="box-02" hoverable>
                    <NavLink
                      to={{
                        pathname: "/proposals",
                        search:
                          "?subContext=action&action=No&past=" +
                          this.state.timeInterval,
                      }}
                      className="side-links"
                    >
                      <Meta
                        avatar={<Avatar src={Nobids} />}
                        title="No"
                        description={
                          RfpAction.filter((value: any) => {
                            return value.name === "No";
                          }).map((data: any) => {
                            return data.count;
                          })[0]
                        }
                      />
                    </NavLink>
                  </Card>
                </Col>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 12 }}
                  lg={{ span: 6 }}
                >
                  <Card className="box-03" hoverable>
                    <NavLink
                      to={{
                        pathname: "/proposals",
                        search:
                          "?subContext=action&action=Pending&past=" +
                          this.state.timeInterval,
                      }}
                      className="side-links"
                    >
                      <Meta
                        avatar={<Avatar src={Pending} />}
                        title="Pending"
                        description={
                          RfpAction.filter((value: any) => {
                            return value.name === "Pending";
                          }).map((data: any) => {
                            return data.count;
                          })[0]
                        }
                      />
                    </NavLink>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 12 }}
              lg={{ span: 5 }}
            >
              <Row gutter={16}>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 12 }}
                  lg={{ span: 24 }}
                >
                  <Card className="box-04" hoverable>
                    <NavLink
                      to={{
                        pathname: "/proposals",
                        search:
                          "?context=due&future=" + this.state.timeInterval,
                      }}
                      className="side-links"
                    >
                      <Meta
                        avatar={<Avatar src={Due} />}
                        title="Due"
                        description={
                          RfpDue.filter((value: any) => {
                            return value.name === "Due";
                          }).map((data: any) => {
                            return data.count;
                          })[0]
                        }
                      />
                    </NavLink>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 24 }}
              lg={{ span: 24 }}
            >
              <div className="site-card-wrapper dashboard-title dashboard-title1">
                <Row gutter={16}>
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 8 }}
                    className="dashboard-col"
                  >
                    <Card
                      title="By Status"
                      extra={[]}
                      bordered
                      hoverable
                      className="default-height"
                    >
                      {RfpStatus != undefined && RfpStatus.length > 0 ? (
                        <ResponsiveContainer className="graph4 graph1 graph">
                          <PieChart>
                            <Pie
                              data={RfpStatus}
                              innerRadius={60}
                              outerRadius={80}
                              cx={80}
                              cy={75}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="count"
                              onClick={(data: any, index: any) => {
                                history.push({
                                  pathname: "/proposals",
                                  search:
                                    "?subContext=status&status=" +
                                    data.name +
                                    "&past=" +
                                    this.state.timeInterval +
                                    "&region=" +
                                    this.regionValue +
                                    "&domain=" +
                                    this.domainValue,
                                });
                              }}
                            >
                              {RfpStatus.map((entry: any, index: number) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend
                              iconSize={8}
                              width={105}
                              className="legend-01"
                              layout="vertical"
                              wrapperStyle={style}
                              onClick={this.selectLeblePie}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <span className="box1">
                          Currently there is no data to display.
                        </span>
                      )}
                    </Card>
                  </Col>
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 8 }}
                    className="dashboard-col mt"
                  >
                    <Card
                      title="By Type"
                      extra={[]}
                      bordered
                      hoverable
                      className="default-height"
                    >
                      <ResponsiveContainer className="graph">
                        <BarChart
                          data={RfpType}
                          margin={{
                            top: 5,
                            right: 0,
                            left: -30,
                            bottom: 5,
                          }}
                          barSize={20}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="count"
                            stackId="a"
                            fill="#8884d8"
                            onClick={(data: any, index: any) => {
                              history.push({
                                pathname: "/proposals",
                                search:
                                  "?subContext=type&type=" +
                                  data.name +
                                  "&past=" +
                                  this.state.timeInterval,
                              });
                            }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </Col>
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 8 }}
                    className="dashboard-col mt"
                  >
                    <Card
                      title="By Domain"
                      extra={[]}
                      bordered
                      hoverable
                      className="default-height"
                    >
                      <ResponsiveContainer className="graph1 graph">
                        <AreaChart
                          data={RfpDomain}
                          margin={{
                            top: 0,
                            right: 0,
                            left: -30,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="count"
                            stackId="1"
                            stroke="#8884d8"
                            fill="#8884d8"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Card>
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
              className="dashboard-col"
            >
              <div className="site-card-wrapper dashboard-title">
                <Row gutter={16}>
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 12 }}
                    lg={{ span: 8 }}
                  >
                    <Card
                      title="Tasks"
                      bordered
                      hoverable
                      className="default-height"
                    >
                      <div className="dastboard-task">
                        <NavLink
                          to={{
                            pathname: "/tasks",
                          }}
                          className="side-links"
                        >
                          <div className="task-img">
                            <img src={Tasks} alt="Task" />
                          </div>
                          <div className="task-text">
                            <p>My Tasks</p>
                            <h3>{RfpTask}</h3>
                          </div>
                        </NavLink>
                      </div>
                      <div className="dastboard-task">
                        <NavLink
                          to={{
                            pathname: "/tasks",
                            search: "?action=open",
                          }}
                          className="side-links"
                        >
                          <div className="task-img">
                            <img src={Opentask} alt="Task" />
                          </div>
                          <div className="task-text">
                            <p>Open Tasks</p>
                            <h3>{RfpTaskOpen}</h3>
                          </div>
                        </NavLink>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
        <br></br>
        <style>
          {
            "\
            .right-sidebar{\
               display: block;\
            }\
            .logout-01{\
              display:none;}\
          "
          }
        </style>
      </>
    );
  }
}

function mapState(state: any) {
  const { filterReducer } = state;
  return {
    filterReducer,
  };
}
const actionCreators = {
  filterAction: resetFilterAction,
};

export default connect(mapState, actionCreators)(Dashboard);
