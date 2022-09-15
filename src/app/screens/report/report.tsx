import React, { Component } from "react";
import { rfpService } from "../../services/rfp-service";
import {
  Input,
  message,
  Row,
  Button,
  Col,
  PageHeader,
  Select,
  Form,
  Table,
  Spin,
} from "antd";
import { Table1 } from "../../component/table";
import { Link } from "react-router-dom";
import {
  PlusCircleOutlined,
  LeftOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { proposalsAction, resetFilterAction } from "../../_redux/_actions";

import DailogComponent from "../../component/DailogComponent";
import Moment from "moment";
import { Attribute, RfpTarget } from "../../_models";
import { AttributeType } from "../../_redux/_constants/AttributeType.constants";
import { notifications } from "../../_helpers/notifications";
import { userService } from "../../services/user-service";
import { MessageProp } from "../../_globals/constants/message.constants";
import history from "../../_helpers/history";
const { TextArea } = Input;
const Option = Select.Option;
const d: Date = new Date();
const validateMessages = {
  required: "${label}  is required!",
};
class Report extends Component<any, any> {
  month: any;
  year: any;
  weekly: any;
  region: any;

  columns = [
    {
      key: "name",
      title: "Domain",
      dataIndex: "name",
      render: (text: any, record: any) => {
        return (
          <>
            <b>{record.name}</b>
          </>
        );
      },
    },
    {
      key: "context",
      title: "Region",
      dataIndex: "context",
      render: (text: any, record: any) => {
        return (
          <>
            <b>{record.context}</b>
          </>
        );
      },
    },
    {
      title: "Scrubbed RFPs",
      dataIndex: "scrapped",
      render: (text: any, record: any) => {
        if (this.month && this.year) {
          text =
            "/proposals?domain=" +
            record.name +
            "&action=all&month=" +
            this.month +
            "&year=" +
            this.year +
            "&region=" +
            record.context;
        } else {
          text =
            "/proposals?domain=" +
            record.name +
            "&action=all&weekly=" +
            encodeURIComponent(this.weekly) +
            "&region=" +
            record.context;
        }
        return (
          <>
            <b>
              {record.scrapped == 0 ? (
                record.scrapped
              ) : (
                <Link to={text} style={{ color: "#13b4ca" }}>
                  {record.scrapped}
                </Link>
              )}
            </b>
          </>
        );
      },
    },
    {
      title: "Bidded RFPs",
      dataIndex: "bid",
      render: (text: any, record: any) => {
        if (this.month && this.year) {
          text =
            "/proposals?domain=" +
            record.name +
            "&action=Yes&month=" +
            this.month +
            "&year=" +
            this.year +
            "&region=" +
            record.context;
        } else {
          text =
            "/proposals?domain=" +
            record.name +
            "&action=Yes&weekly=" +
            encodeURIComponent(this.weekly) +
            "&region=" +
            record.context;
        }
        return (
          <>
            <b>
              {record.bid == 0 ? (
                record.bid
              ) : (
                <Link to={text} style={{ color: "#13b4ca" }}>
                  {record.bid}
                </Link>
              )}
            </b>
          </>
        );
      },
    },
    {
      title: "Submitted RFPs",
      dataIndex: "submitted",
      render: (text: any, record: any) => {
        if (this.month && this.year) {
          text =
            "/proposals?domain=" +
            record.name +
            "&status=Submitted&month=" +
            this.month +
            "&year=" +
            this.year +
            "&region=" +
            record.context;
        } else {
          text =
            "/proposals?domain=" +
            record.name +
            "&status=Submitted&weekly=" +
            encodeURIComponent(this.weekly) +
            "&region=" +
            record.context;
        }
        return (
          <>
            <b>
              {record.submitted == 0 ? (
                record.submitted
              ) : (
                <Link to={text} style={{ color: "#13b4ca" }}>
                  {record.submitted}
                </Link>
              )}
            </b>
          </>
        );
      },
    },
    {
      title: "Won/Lost/Cancelled RFPs",
      dataIndex: "won",
      render: (text: any, record: any) => {
        let wonUrl = "";
        let lostUrl = "";
        let cancelledUrl = "";
        if (this.month && this.year) {
          wonUrl =
            "/proposals?domain=" +
            record.name +
            "&status=Won&month=" +
            this.month +
            "&year=" +
            this.year +
            "&region=" +
            record.context;
          lostUrl =
            "/proposals?domain=" +
            record.name +
            "&status=Lost&month=" +
            this.month +
            "&year=" +
            this.year +
            "&region=" +
            record.context;
          cancelledUrl =
            "/proposals?domain=" +
            record.name +
            "&status=Cancelled&month=" +
            this.month +
            "&year=" +
            this.year +
            "&region=" +
            record.context;
        } else {
          wonUrl =
            "/proposals?domain=" +
            record.name +
            "&status=Won&weekly=" +
            encodeURIComponent(this.weekly) +
            this.year +
            "&region=" +
            record.context;
          lostUrl =
            "/proposals?domain=" +
            record.name +
            "&status=Lost&weekly=" +
            encodeURIComponent(this.weekly) +
            this.year +
            "&region=" +
            record.context;
          cancelledUrl =
            "/proposals?domain=" +
            record.name +
            "&status=Cancelled&weekly=" +
            encodeURIComponent(this.weekly) +
            this.year +
            "&region=" +
            record.context;
        }

        return (
          <>
            <b>
              {record.won == 0 ? (
                record.won
              ) : (
                <Link to={wonUrl} style={{ color: "#13b4ca" }}>
                  {record.won}
                </Link>
              )}
            </b>
            <b> / </b>
            <b>
              {record.lost == 0 ? (
                record.lost
              ) : (
                <Link to={lostUrl} style={{ color: "#13b4ca" }}>
                  {record.lost}
                </Link>
              )}
            </b>
            <b> / </b>
            <b>
              {record.cancelled == 0 ? (
                record.cancelled
              ) : (
                <Link to={cancelledUrl} style={{ color: "#13b4ca" }}>
                  {record.cancelled}
                </Link>
              )}
            </b>
          </>
        );
      },
    },
  ];

  columnsTarget = [
    {
      key: "id",
      title: "Domain",
      dataIndex: "name",
      render: (text: any, record: any) => {
        return (
          <>
            <b>{record.name}</b>
          </>
        );
      },
    },
    {
      title: "Scrubbed RFPs",
      dataIndex: "scrapped",
    },
    {
      title: "Submitted RFPs",
      dataIndex: "submitted",
    },
  ];
  columnsTargetForAdd = [
    {
      key: "id",
      title: "Domain",
      dataIndex: "name",
      render: (text: any, record: any) => {
        return (
          <>
            <b>{record}</b>
          </>
        );
      },
    },
    {
      title: "Scrubbed RFPs",
      dataIndex: "scrapped",
      render: (text: any, record: any, index: number) => {
        return (
          <>
            <Input
              type="text"
              style={{ textAlign: "right" }}
              onKeyPress={this.isNumberKeySc.bind(this, index)}
              onBlur={this.onScrubTotal.bind(this, index)}
              pattern="[0-9]*"
              maxLength={3}
            />
          </>
        );
      },
    },
    {
      title: "Submitted RFPs",
      dataIndex: "submitted",
      render: (text: any, record: any, index: number) => {
        return (
          <>
            <Input
              type="text"
              onKeyPress={this.isNumberKeySu.bind(this, index)}
              style={{ textAlign: "right" }}
              pattern="[0-9]*"
              maxLength={3}
              onBlur={this.onSubmitTotal.bind(this, index)}
            />
          </>
        );
      },
    },
  ];
  weeksObj: any[] = [];
  yearList: Number[] = [];
  monthList: any[] = [];
  domainListAttr: Attribute[] = [];
  dataTarget: any[] = [];
  monthName: string = "";

  addTargetData: RfpTarget = new RfpTarget();
  constructor(props: any) {
    super(props);
    this.state = {
      analytical: "",
      rfpTarget: "",
      loadingweekly: "",
      visible: false,
      content: "",
      title: "",
      targetReport: new RfpTarget(),
      target: new RfpTarget(),
      loadingfTarget: false,
      loadingReport: false,
      allowAddDelete: false,
      loadingfAddTarget: false,
      usReport: [],
      indiaReport: [],
      region: [],
    };
  }
  componentDidMount = async () => {
    this.props.filterAction();
    document.title = "RFP Report";
    this.region = "US";
    this.setAccess();
    this.getMonthList();
    this.month = d.getMonth();
    this.year = d.getFullYear();
    this.weekPopulate();
    this.getYearList();
    this.getRegion();
    this.loadRfpTargetReport();
    await this.getloadAnalytical();
    this.handlRegionChange(this.region);

    this.monthName = this.monthList[this.month - 1].text;
  };

  handlRegionChange = (region: any) => {
    this.region = region;
    const newData = this.state.analytical.filter(
      (regionDt: any) => regionDt.context === region
    );
    this.setState({
      usReport: newData,
    });
  };

  getRegion = async () => {
    this.setState({
      region: await rfpService
        .getRfpByAttribute(AttributeType.REGION)
        .then()
        .catch(notifications.openErrorNotification),
      loading: false,
    });
  };

  get footer() {
    return (
      <>
        <div className="button-right">
          {" "}
          <Button
            className="fr"
            type="primary"
            htmlType="submit"
            onClick={() => message.success("Processing complete!")}
          >
            Submit
          </Button>{" "}
          <Button className="cancel fr" onClick={this.props.closeModal}>
            <LeftOutlined /> Back
          </Button>
        </div>
      </>
    );
  }
  getloadAnalytical = async () => {
    this.setState({ loadingReport: true });
    if (this.month === 0) {
      this.month = this.month + 12;
      this.year = this.year - 1;
    }
    this.setState({
      analytical: await rfpService
        .getAnalytical(this.month, this.year)
        .then()
        .catch(notifications.openErrorNotification),
      loadingReport: false,
    });
  };

  loadRfpTargetReport = async () => {
    this.setState({ rfpTarget: new RfpTarget(), loadingfTarget: true });
    this.setState({
      rfpTarget: await rfpService
        .getRfpTarget(this.month, this.year)
        .then()
        .catch(notifications.openErrorNotification),
      loadingfTarget: false,
    });
  };

  weekPopulate = () => {
    for (var i = 0; i < 4; i++) {
      if (i === 0) {
        this.getlastFourWeek(new Date());
      } else {
        this.getlastFourWeek(this.weeksObj[i - 1]["lastMonday"]);
      }
    }
  };

  loadWeeklyReport = async () => {
    this.setState({ loadingReport: true });
    this.setState({
      analytical: await rfpService
        .getWeekReport(this.weekly)
        .then()
        .catch(notifications.openErrorNotification),
      loadingReport: false,
      rfpTarget: new RfpTarget(),
    });
  };

  getYearList = async () => {
    var year = d.getFullYear();
    this.yearList.push(year - 2);
    this.yearList.push(year - 1);
    this.yearList.push(year);
    this.yearList.push(year + 1);
    this.yearList.push(year + 2);
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
  };
  getStringDate = (start: any, end: any, str: any, separator: any) => {
    return Moment(start).format(str) + separator + Moment(end).format(str);
  };
  onMonthChange = async (value: string) => {
    this.weekly = undefined;
    this.month = value;
    this.monthName = this.monthList[this.month - 1].text;
    if (this.year != null && this.year != undefined) {
      await this.getloadAnalytical();
    } else {
      this.setState({
        analytical: [],
        rfpTarget: new RfpTarget(),
      });
    }
    this.handlRegionChange(this.region);
    await this.loadRfpTargetReport();
  };
  onYearChange = async (value: string) => {
    this.weekly = undefined;
    this.year = value;
    if (this.month != null && this.month != undefined) {
      await this.getloadAnalytical();
      await this.loadRfpTargetReport();
    } else {
      this.setState({
        analytical: [],
        rfpTarget: new RfpTarget(),
      });
    }
    this.handlRegionChange(this.region);
  };
  onWeekChange = async (value: string) => {
    this.month = undefined;
    this.year = undefined;
    this.weekly = value;
    await this.loadWeeklyReport();
    this.handlRegionChange(this.region);
  };

  closeModal = () => {
    this.setState({ visible: false });
  };

  getFields = (input: any, field: any) => {
    var output = [];
    for (var i = 0; i < input.length; ++i) output.push(input[i][field]);
    return output.reduce(function (a, b) {
      if (a.indexOf(b) < 0) a.push(b);
      return a;
    }, []);
  };

  loadDomains = async () => {
    await rfpService
    .getDomain("All")
    .then((response) => {
      this.setState({
        domainListAttr: this.getFields(response, "name"),
      });
    })
    .catch(notifications.openErrorNotification);
  };
  isNumberKeySc = (i: number, event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    if (!(charCode >= 48 && charCode < 57)) {
      event.preventDefault();
      return false;
    }
    this.dataTarget[i]["scrapped"] = event.target.value;
    return true;
  };
  isNumberKeySu = (i: number, event: any) => {
    var charCode = event.which ? event.which : event.keyCode;
    if (!(charCode >= 48 && charCode < 57)) {
      event.preventDefault();
      return false;
    }
    this.dataTarget[i]["submitted"] = event.target.value;
    let value = this.dataTarget;
    this.setState({
      target: { ...this.state.target, value },
    });
    return true;
  };
  onSubmitTotal = (i: number, event: any) => {
    this.dataTarget[i]["submitted"] = event.target.value;
  };
  onScrubTotal = (i: number, event: any) => {
    this.dataTarget[i]["scrapped"] = event.target.value;
  };
  onFinish = (value: any) => {
    this.setState({ loadingfAddTarget: true });
    let comment = value.comment;
    this.setState({
      target: {
        ...this.state.target,
        comment,
      },
    });

    let dataTarget = this.state.target.value;
    let errorMessage = "";

    for (var i = 0; i < dataTarget.length; i++) {
      if (
        dataTarget[i]["scrapped"] == undefined ||
        dataTarget[i]["scrapped"] == "" ||
        dataTarget[i]["scrapped"] < 0
      ) {
        if (errorMessage !== "") {
          errorMessage += ",scrapped of " + dataTarget[i]["name"];
        } else {
          errorMessage += "scrapped of " + dataTarget[i]["name"];
        }
      }
      if (
        dataTarget[i]["submitted"] == undefined ||
        dataTarget[i]["submitted"] == "" ||
        dataTarget[i]["submitted"] < 0
      ) {
        if (errorMessage !== "") {
          errorMessage += ",submitted of " + dataTarget[i]["name"];
        } else {
          errorMessage += "submitted of " + dataTarget[i]["name"];
        }
      }
    }
    if (errorMessage == undefined || errorMessage == "") {
      rfpService
        .addRfpTarget(value.month, value.year, this.state.target)
        .then((response) => {
          notifications.openSuccessNotification(
            MessageProp.getCreatedSuccessMessage("Add Target")
          );

          this.closeModal();
        })
        .catch(notifications.openErrorNotification);
    } else {
      notifications.openWarningNotification(
        "Please fill in the required fields:" + errorMessage
      );
    }
    this.setState({ loadingfAddTarget: false });
  };

  setAccess() {
    const { user } = this.props;
    if (user.role && (user.role === "Manager" || user.role === "Super Admin")) {
      this.setState({
        allowAddDelete: true,
      });
    }
  }
  addTarget = async () => {
    await this.loadDomains();
    for (var i = 0; i < this.state.domainListAttr?.length; i++) {
      this.dataTarget[i] = {
        
        name: this.state.domainListAttr[i],
        scrapped: 0,
        submitted: 0,
      };
    }
    let value = this.dataTarget;
    this.setState({
      target: { ...this.state.target, value },
    });

    let content = (
      <>
        <Spin size="large" spinning={this.state.loadingfAddTarget}>
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
                  validateMessages={validateMessages}
                  scrollToFirstError
                >
                  <div>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                      <Col className="gutter-row" span={12}>
                        <Form.Item
                          label={"Month"}
                          name={["month"]}
                          rules={[{ required: true }]}
                        >
                          <Select value={this.state.target.domain}>
                            {this.monthList.map((data: any) => {
                              return (
                                <Option value={data.value}>{data.text}</Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={12}>
                        <Form.Item
                          label={"Year"}
                          name={["year"]}
                          rules={[{ required: true }]}
                        >
                          <Select value={this.year}>
                            {this.yearList.map((data: any) => {
                              return <Option value={data}>{data}</Option>;
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                      <Col className="gutter-row" span={24}>
                        <Table1
                          data={this.state.domainListAttr}
                          columns={this.columnsTargetForAdd}
                          loading={false}
                        />
                      </Col>
                    </Row>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                      <Col className="gutter-row" span={24}>
                        <br></br>
                        <Form.Item
                          label={<span> Note</span>}
                          name={["comment"]}
                        >
                          <TextArea maxLength={100} rows={4} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <div className="button-right">
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="success-button fr"
                      >
                        Submit
                      </Button>{" "}
                      <Button className="cancel fr" onClick={this.closeModal}>
                        <LeftOutlined /> Back
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Spin>
      </>
    );

    this.setState({ visible: true, content, title: "RFP Target" });
  };

  getMonthList = () => {
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    months.map((data: string, index: number) => {
      this.monthList.push({ value: index + 1, text: data });
    });
  };

  render() {
    const { yearList } = this.state;
    return (
      <>
        <style>
          {"\
          .ant-pagination{\
            display:none; }\
        "}
        </style>
        <DailogComponent
          setIsModalVisible={this.state.visible}
          closeModal={this.closeModal}
          content={this.state.content}
          title={this.state.title}
          footer={this.footer}
          loading={false}
        ></DailogComponent>
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
                lg={{ span: 6 }}
              >
                <Select
                  className="select-class"
                  onChange={this.handlRegionChange}
                  value={this.region}
                  id="rc_select_region"
                >
                  {this.state.region.map((data: any) => {
                    return <Option value={data.name}>{data.name}</Option>;
                  })}
                </Select>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 6 }}
              >
                {" "}
                <Select
                  className="select-class"
                  placeholder="Select Year"
                  onChange={this.onYearChange}
                  value={this.year}
                  id="yearSelect"
                >
                  {this.yearList.map((data: any) => {
                    return <Option value={data}>{data}</Option>;
                  })}
                </Select>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 6 }}
              >
                <Select
                  className="select-class"
                  onChange={this.onMonthChange}
                  placeholder="Select Month"
                  value={this.month}
                  id="monthSelect"
                >
                  {this.monthList.map((data: any) => {
                    return <Option value={data.value}>{data.text}</Option>;
                  })}
                </Select>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 6 }}
              >
                <Select
                  className="select-class"
                  placeholder="Select Weeks"
                  onChange={this.onWeekChange}
                  value={this.weekly}
                  id="weeklySelect"
                >
                  {this.weeksObj.map((data: any) => {
                    return <Option value={data.value}>{data.text}</Option>;
                  })}
                </Select>
              </Col>
            </Row>
          </Col>
          {this.state.allowAddDelete ? (
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 24 }}
              lg={{ span: 12 }}
            >
              <Button
                type="primary"
                className="fr"
                onClick={this.addTarget}
                icon={<PlusCircleOutlined />}
              >
                RFP Target
              </Button>
            </Col>
          ) : (
            ""
          )}
        </Row>
        <Row>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 24 }}
          >
            <div className="site-page-header-ghost-wrapper">
              <PageHeader
                className="top-heading"
                ghost={false}
                title="Monthly Progress"
              ></PageHeader>
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
            <h1></h1>
            <Table1
              data={this.state.usReport}
              columns={this.columns}
              loading={this.state.loadingReport}
            />
          </Col>
        </Row>
        {this.state.rfpTarget.value && this.weekly == undefined ? (
          <>
            <PageHeader
              className="top-heading"
              ghost={false}
              title={"Defined Targets [" + this.monthName + "]"}
            ></PageHeader>
            <Row>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 24 }}
              >
                <Table1
                  data={this.state.rfpTarget.value}
                  columns={this.columnsTarget}
                  loading={this.state.loadingfTarget}
                />
              </Col>
            </Row>
          </>
        ) : (
          <></>
        )}
      </>
    );
  }
}
function mapState(state: any) {
  const { getRfpByDomain } = state;
  const { rfpByDomainData } = getRfpByDomain;
  const { authentication } = state;
  const { filterReducer } = state;
  const { user } = authentication;
  return {
    rfpByDomainData,
    user,
    filterReducer,
  };
}
const actionCreators = {
  getRfpByDomain: proposalsAction.getRfpByDomain,
  filterAction: resetFilterAction,
};
export default connect(mapState, actionCreators)(Report);
// export default Report;
