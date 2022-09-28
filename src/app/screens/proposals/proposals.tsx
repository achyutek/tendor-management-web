import React, { Component } from "react";
import "antd/dist/antd.css";

import {
  Input,
  Button,
  Row,
  Col,
  Select,
  Modal,
  Tooltip,
  Pagination,
} from "antd";
import { Link } from "react-router-dom";
import {
  PlusCircleOutlined,
  ReconciliationOutlined,
  FileAddOutlined,
  HomeOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { filterAction, proposalsAction } from "../../_redux/_actions";
import { Table1 } from "../../component/table";
import DailogComponent from "../../component/DailogComponent";
import { rfpService } from "../../services/rfp-service";
import computer from "../../../assets/images/computer.png";
import phone from "../../../assets/images/phone.png";
import globe from "../../../assets/images/globe.png";
import { notifications } from "../../_helpers/notifications";
import { MessageProp } from "../../_globals/constants/message.constants";
import { AttributeType } from "../../_redux/_constants";
const { Option } = Select;
const { Search } = Input;
const qs = require("query-string");
const pageSize = 1;
export class Proposals extends Component<any, any> {
  Pars = qs.parse(window.location.search);
  currentPage = 1;
  successMsg: any;
  errorMsg: any;
  warningMsg: any;
  domainValue: string = "All";
  regionValue: string = "All";
  typeValue: string = "All";
  actionValue: string = "All";
  submissionValue: string = "All";
  contractValue: string = "All";
  statusValue: string = "All";
  actionSetDropValue: string = "";
  get columns() {
    return [
      {
        key: "id",
        title: "Details",
        dataIndex: "id",
        render: (text: any, record: any) => {
          return (
            <span>
              <span
                onClick={() => {
                  this.getDetails(record);
                }}
                className="icon proposal-contact-01"
              >
                {" "}
                <a className="proposal-contact">
                  <FileAddOutlined />
                </a>
              </span>
              <Tooltip title={record.title}>
                <h3 className="proposal-contact-01 ml">
                  <b>
                    <Link
                      to={"/viewproposal?id=" + record.id}
                      style={{ color: "#13b4ca" }}
                    >
                      {record.title.length > 15
                        ? record.title.substring(0, 15 - 3) + "..."
                        : record.title}
                    </Link>
                  </b>
                </h3>
              </Tooltip>
            </span>
          );
        },
      },
      {
        title: "Agency",
        dataIndex: "agency",
        render: (text: any, record: any) => {
          return (
            <span>
              <span
                onClick={() => {
                  this.getAddress(record);
                }}
                className="proposal-contact-01"
              >
                <a className="proposal-contact">
                  <HomeOutlined />
                </a>
              </span>
              <Tooltip title={record.agency.name}>
                <b className="ml">
                  {record.agency.name.length > 15
                    ? record.agency.name.substring(0, 15 - 3) + "..."
                    : record.agency.name}
                </b>
              </Tooltip>
            </span>
          );
        },
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
      },
      {
        title: "Region",
        dataIndex: "region",
      },
      {
        title: "State",
        dataIndex: "agency",
        render: (text: any, record: any) => {
          return(
            <>{record.agency.address.state}</>
          )
        }
      },
      {
        title: "Contract Type",
        dataIndex: "contractType",
      },
      {
        title: "Bid",
        dataIndex: "action",
      },
      {
        title: "Due Date",
        dataIndex: "dueDate",
        key: "dueDate",
      },
      {
        title: "Submission Type",
        dataIndex: "submissionType",
      },
      {
        title: "Status",
        dataIndex: "status",
      },
      {
        title: "Assigned To",
        dataIndex: "ownerName",
      },
      {
        title: "Contact",
        dataIndex: "contacts",
        render: (text: any, record: any) => {
          return (
            <>
              {record.agency.webSite === undefined ||
              record.agency.webSite === "" ? (
                ""
              ) : (
                <span>
                  <a>
                    {record.agency.webSite.substring(0, 8) == "https://" ? (
                      <a
                        href={record.agency.webSite}
                        rel="noopener noreferrer"
                        className="proposal-web"
                        target="_Blank"
                      >
                        {" "}
                        {<img src={globe} />}{" "}
                      </a>
                    ) : (
                      <a
                        href={record.agency.webSite}
                        rel="noopener noreferrer"
                        className="proposal-web"
                        target="_Blank"
                      >
                        {" "}
                        {<img src={globe} />}{" "}
                      </a>
                    )}
                  </a>
                </span>
              )}

              {!record.contacts[0] ? (
                ""
              ) : (
                <span
                  onClick={() => {
                    this.getContactListData(record);
                  }}
                >
                  <a className="proposal-contact">
                    <img src={phone} alt="phone" className="img-fluid" />
                  </a>
                </span>
              )}
            </>
          );
        },
      },
    ];
  }

  state = {
    selectedRowKeys: [],
    loading: true,
    visible: false,
    title: "",
    content: "",
    proposalsData: [],
    proposalsDataPages: 1,
    status: "",
    type: "",
    domain: "",
    action: "",
    contractType: "",
    submissionType: "",
    past: -1,
    future: -1,
    context: "created",
    interval: "-1",
    selectedRow: [],
    allowAddDelete: true,
    allowDelete: false,
    hiddenSerach: false,
    hiddenSerachPart1: true,
    serachTable: false,
    filterValue: "",
    subContext: "",
    followupLoading: false,
    allowfollowup: false,
    current: 1,
    minIndex: 0,
    maxIndex: 0,
    pagenumberContactList: 1,
    totalPage: 0,
    record: "",
    region: "",
    regions: [],
    domains: [],
  };

  handleChange = async (page: any) => {
    await this.setState({
      current: page,
      minIndex: (page - 1) * pageSize,
      maxIndex: page * pageSize,
    });
    this.getContact(this.state.record);
  };

  start = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: true,
      });
    }, 1000);
  };

  getAddress = (record: any) => {
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
              <span className="label">
                Line 1 : {record.agency.address.line1}
              </span>
            </div>
            <div className="person-contact">
              <span className="label">
                Line 2 : {record.agency.address.line2}
              </span>
            </div>
            <div className="person-contact">
              <span className="label">
                Line 3 : {record.agency.address.line3}
              </span>
            </div>
            <div className="person-contact">
              <span className="label">City : {record.agency.address.city}</span>
            </div>
            <div className="person-contact">
              <span className="label">
                State : {record.agency.address.state}
              </span>
            </div>
            <div className="person-contact">
              <span className="label">
                Country : {record.agency.address.country}
              </span>
            </div>
            <div className="person-contact">
              <span className="label">
                PinCode : {record.agency.address.pinCode}
              </span>
            </div>
          </Col>
        </Row>
      </>
    );
    this.setState({ visible: true, content, title: "Agency Address" });
  };

  getDetails = (record: any) => {
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
              <span className="label">ID</span>{" "}
              <span className="label-01">{record.requestId}</span>
            </div>
            <div className="person-contact">
              <span className="label">Issue Date</span>{" "}
              <span className="label-01"> {record.issueDate}</span>
            </div>
            <div className="person-contact">
              <span className="label">Due Date</span>{" "}
              <span className="label-01">{record.dueDate}</span>
            </div>
          </Col>
        </Row>
      </>
    );
    this.setState({ visible: true, content, title: "Proposal Details" });
  };

  getContactListData = async (record: any) => {
    let maxValuecontactList = record.contacts.length;
    await this.setState({
      totalPage: maxValuecontactList / pageSize,
      minIndex: 0,
      maxIndex: pageSize,
      pagenumberContactList: maxValuecontactList,
    });
    await this.getContact(record);
  };

  getContact = (record: any) => {
    this.setState({ record: record });
    let content = (
      <>
        {record.contacts !== undefined
          ? record.contacts.map((data: any, index: any) => {
              return (
                index >= this.state.minIndex &&
                index < this.state.maxIndex && (
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
                          <span className="label">Name</span>{" "}
                          <span className="label-01">{data.name}</span>
                        </div>
                        <div className="person-contact">
                          <span className="label">Email</span>{" "}
                          <span className="label-01">{data.email}</span>
                        </div>
                        <div className="person-contact">
                          <span className="label">Phone Number</span>{" "}
                          <span className="label-01">{data.contactNo}</span>
                        </div>
                        <div className="person-contact">
                          <span className="label">Title</span>{" "}
                          <span className="label-01">{data.title}</span>
                        </div>
                      </Col>
                    </Row>
                  </>
                )
              );
            })
          : ""}
        <div className="arrow">
          {" "}
          <Pagination
            className="raa"
            pageSize={pageSize}
            current={this.state.current}
            total={this.state.pagenumberContactList}
            onChange={this.handleChange}
          />
        </div>
      </>
    );
    this.setState({ visible: true, content, title: "Person Contact Details" });
  };

  closeModal = () => {
    this.setState({ visible: false });
  };

  async componentDidMount() {
    let {
      month,
      year,
      weekly,
      domain,
      action,
      status,
      past,
      type,
      future,
      context,
      submissionType,
      region,
    } = this.Pars;

    const { filterReducer } = this.props;
    if (
      filterReducer.context === "created" &&
      filterReducer.interval === "-1" &&
      filterReducer.domain === "All" &&
      filterReducer.type === "All" &&
      filterReducer.status === "All" &&
      filterReducer.contractType === "All" &&
      filterReducer.submissionType === "All" &&
      filterReducer.action === "All" &&
      filterReducer.region === "All" &&
      filterReducer.pageNumber === 1 &&
      filterReducer.past === -1
    ) {
    } else {
      await this.setState({
        context: filterReducer.context,
        interval: filterReducer.interval,
      });
      this.domainValue = filterReducer.domain;
      this.typeValue = filterReducer.type;
      this.statusValue = filterReducer.status;
      this.contractValue = filterReducer.contractType;
      this.submissionValue = filterReducer.submissionType;
      this.actionSetDropValue = action;
      this.actionValue = filterReducer.action;
      this.regionValue = filterReducer.region;
      this.currentPage = filterReducer.pageNumber;
      this.getRfpProposolsPagesByAll(
        filterReducer.context,
        filterReducer.interval
      );
      this.getRfpProposolsByAll(filterReducer.context, filterReducer.interval);
    }
    document.title = "Proposals";
    this.loadRefData();
    this.getRegion();
    this.setAccess();
    this.handlRegionChanges("US");
    if (
      filterReducer.context === "created" &&
      filterReducer.interval === "-1" &&
      filterReducer.domain === "All" &&
      filterReducer.type === "All" &&
      filterReducer.status === "All" &&
      filterReducer.contractType === "All" &&
      filterReducer.submissionType === "All" &&
      filterReducer.action === "All" &&
      filterReducer.region === "All" &&
      filterReducer.pageNumber === 1 &&
      filterReducer.past === -1
    ) {
      status = status ? status : "all";
      type = type ? type : "all";
      domain = domain ? domain : "all";
      this.actionSetDropValue = action;
      action = action ? action : "all";
      submissionType = submissionType ? submissionType : "all";
      past = past ? past : -1;
      future = future ? future : -1;
      context = context ? context : "created";
    } else {
      status = this.statusValue ? status : "all";
      type = this.typeValue ? type : "all";
      domain = this.domainValue ? domain : "all";
      action = this.actionValue ? action : "all";
      submissionType = this.submissionValue ? submissionType : "all";
      past = past ? past : -1;
      future = future ? future : -1;
      context = this.state.context ? context : "created";
    }
    let blockStatus = false;
    let query = undefined;
    if (
      month != undefined &&
      month != null &&
      year != undefined &&
      year != null
    ) {
      query = month + "/" + year;
      blockStatus = true;
    } else if (weekly != undefined) {
      blockStatus = true;
      query = weekly;
    }
    if (blockStatus && query != undefined) {
      if (status != "all" && status === "Submitted") {
        await this.getProposalRequestsForReportByStatus(
          "due",
          region,
          domain,
          status,
          query
        );
      } else if (
        status != "all" &&
        (status === "Won" || status === "Lost" || status === "Cancelled")
      ) {
        await this.getProposalRequestsForReportByStatusPages(
          "statusUpdatedOn",
          region,
          domain,
          status,
          query
        );
        await this.getProposalRequestsForReportByStatus(
          "statusUpdatedOn",
          region,
          domain,
          status,
          query
        );
      } else if (action != "all") {
        await this.getProposalRequestsForReportByActionPages(
          "actionUpdatedOn",
          region,
          domain,
          action,
          query
        );
        await this.getProposalRequestsForReportByAction(
          "actionUpdatedOn",
          region,
          domain,
          action,
          query
        );
      } else {
        await this.getProposalRequestsForReportByActionPages(
          "created",
          region,
          domain,
          action,
          query
        );
        await this.getProposalRequestsForReportByAction(
          "created",
          region,
          domain,
          action,
          query
        );
      }
    } else {
      if (
        filterReducer.context === "created" &&
        filterReducer.interval === "-1" &&
        filterReducer.domain === "All" &&
        filterReducer.type === "All" &&
        filterReducer.status === "All" &&
        filterReducer.contractType === "All" &&
        filterReducer.submissionType === "All" &&
        filterReducer.action === "All" &&
        filterReducer.region === "All" &&
        filterReducer.pageNumber === 1 &&
        filterReducer.past === -1
      ) {
        if (context === "due") {
          const Action = {
            label: "context",
            value: "due",
          };
          this.props.filterAction(Action);
          await this.getRfpProposolsPages(context, future);
          await this.getRfpProposols(context, future);
          this.setState({
            interval: future,
          });
        } else {
          await this.getRfpProposolsPages(context, past);
          await this.getRfpProposols(context, past);
          this.setState({
            interval: past,
          });
        }
        this.setState({
          status,
          type,
          domain,
          action,
          submissionType,
          past,
          future,
          context,
          region,
        });
      }
    }
    this.filterData();
  }

  getRegion = async () => {
    this.setState({
      regions: await rfpService
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

  filterData = async () => {
    let { subContext } = this.Pars;
    this.setState({ subContext });
    if (this.state.subContext === "status") {
      this.filterStatus(this.state.status, this.currentPage);
    } else if (this.state.subContext === "action") {
      this.filterActions(this.state.action, this.currentPage);
    } else if (this.state.subContext === "type") {
      this.filterTypes(this.state.type, this.currentPage);
    } else if (this.state.subContext === "region") {
      this.filterDomains(this.state.region, this.currentPage);
    } else if (this.state.subContext === "domain") {
      this.filterDomains(this.state.domain, this.currentPage);
    } else if (this.state.subContext === "contractType") {
      this.filterComnractTypes(this.state.contractType, this.currentPage);
    } else if (this.state.subContext === "submissionType") {
      this.filterSubmissionType(this.state.submissionType, this.currentPage);
    }
  };

  loadRefData = () => {
    if (this.state.domains) rfpService.getDomain(this.regionValue);
    if (this.props.rfpByStatusData) this.props.getRfpByStatus();
    if (this.props.rfpByTypeData) this.props.getRfpBytype();
    if (this.props.rfpByContractData) this.props.getRfpByContract();
    if (this.props.rfpByActionData) this.props.getRfpByAction();
    if (this.props.rfpBySubmissionData) this.props.getRFPBYSubmission();
  };

  getRfpProposols = async (attribute: string, interval: any) => {
    this.setState({ loading: true });
    if (attribute == "due") {
      if (this.statusValue == "All") {
        var statusdata: string[] = ["Created", "InProgress"];
      } else {
        statusdata = [this.statusValue];
      }
      this.setState({
        proposalsData: await rfpService
          .getRfpProposalsByAll(
            attribute,
            interval,
            statusdata,
            "All",
            "All",
            "All",
            "All",
            "All",
            "All",
            "All",
            this.currentPage
          )
          .then()
          .catch((error)=>{
            if(error !== "Forbidden"){
              notifications.openErrorNotification(error.toString());
            }
          }),
        loading: false,
      });
    } else {
      this.setState({
        proposalsData: await rfpService
          .getRfpProposalsByAllString(
            attribute,
            interval,
            this.statusValue,
            "All",
            "All",
            "All",
            "All",
            "All",
            "All",
            "All",
            this.currentPage
          )
          .then()
          .catch((error)=>{
            if(error !== "Forbidden"){
              notifications.openErrorNotification(error.toString());
            }
          }),
        loading: false,
      });
    }
  };
  getProposalRequestsForReportByStatus = async (
    attribute: string,
    region: string,
    domain: string,
    status: string,
    query: string
  ) => {
    this.setState({ loading: true });
    this.setState({
      proposalsData: await rfpService
        .getProposalRequestsForReportByStatus(
          attribute,
          region,
          domain,
          status,
          query,
          this.currentPage
        )
        .then()
        .catch(notifications.openErrorNotification),
      loading: false,
    });
  };
  getProposalRequestsForReportByStatusPages = async (
    attribute: string,
    region: string,
    domain: string,
    status: string,
    query: string
  ) => {
    this.setState({ loading: true });
    this.setState({
      proposalsDataPages: await rfpService
        .getProposalRequestsForReportByStatusPages(
          attribute,
          region,
          domain,
          status,
          query
        )
        .then()
        .catch(notifications.openErrorNotification),

      loading: false,
    });
  };
  getProposalRequestsForReportByAction = async (
    attribute: string,
    region: string,
    domain: string,
    action: string,
    query: string
  ) => {
    this.setState({ loading: true });
    this.setState({
      proposalsData: await rfpService
        .getProposalRequestsForReportByAction(
          attribute,
          region,
          domain,
          action,
          query,
          this.currentPage
        )
        .then()
        .catch((error)=>{
          if(error !== "Forbidden"){
            notifications.openErrorNotification(error.toString());
          }
        }),

      loading: false,
    });
  };
  getProposalRequestsForReportByActionPages = async (
    attribute: string,
    region: string,
    domain: string,
    action: string,
    query: string
  ) => {
    this.setState({ loading: true });
    this.setState({
      proposalsDataPages: await rfpService
        .getProposalRequestsForReportByActionPages(
          attribute,
          region,
          domain,
          action,
          query
        )
        .then()
        .catch((error)=>{
          if(error !== "Forbidden"){
            notifications.openErrorNotification(error.toString());
          }
        }),
      loading: false,
    });
  };
  getRfpProposolsPages = async (attribute: string, interval: any) => {
    this.setState({ loading: true });
    if (attribute == "due") {
      if (this.statusValue == "All") {
        var statusdata: string[] = ["Created", "InProgress"];
      } else {
        statusdata = [this.statusValue];
      }
      this.setState({
        proposalsDataPages: await rfpService
          .getRfpProposalsPagesByAll(
            attribute,
            interval,
            statusdata,
            "All",
            "All",
            "All",
            "All",
            "All",
            "All",
            "All"
          )
          .then()
          .catch((error)=>{
            if(error !== "Forbidden"){
              notifications.openErrorNotification(error.toString());
            }
          }),
        loading: false,
      });
    } else {
      this.setState({
        proposalsDataPages: await rfpService
          .getRfpProposalsPagesByAllString(
            attribute,
            interval,
            this.statusValue,
            "All",
            "All",
            "All",
            "All",
            "All",
            "All",
            "All"
          )
          .then()
          .catch((error)=>{
            if(error !== "Forbidden"){
              notifications.openErrorNotification(error.toString());
            }
          }),
        loading: false,
      });
    }
  };
  getRfpProposolsPagesByAll = async (attribute: string, interval: any) => {
    this.setState({ loading: true });
    if (attribute == "due") {
      if (this.statusValue == "All") {
        var statusdata: string[] = ["Created", "InProgress"];
      } else {
        statusdata = [this.statusValue];
      }
      this.setState({
        proposalsDataPages: await rfpService
          .getRfpProposalsPagesByAll(
            attribute,
            interval,
            statusdata,
            this.typeValue,
            this.actionValue,
            this.regionValue,
            this.domainValue,
            this.submissionValue,
            this.contractValue,
            "All"
          )
          .then()
          .catch((error)=>{
            if(error !== "Forbidden"){
              notifications.openErrorNotification(error.toString());
            }
          }),

        loading: false,
      });
    } else {
      this.setState({
        proposalsDataPages: await rfpService
          .getRfpProposalsPagesByAllString(
            attribute,
            interval,
            this.statusValue,
            this.typeValue,
            this.actionValue,
            this.regionValue,
            this.domainValue,
            this.submissionValue,
            this.contractValue,
            "All"
          )
          .then()
          .catch((error)=>{
            if(error !== "Forbidden"){
              notifications.openErrorNotification(error.toString());
            }
          }),
        loading: false,
      });
    }
  };

  getRfpProposolsByAll = async (attribute: string, interval: any) => {
    this.setState({ loading: true });
    if (attribute == "due") {
      if (this.statusValue == "All") {
        var statusdata: string[] = ["Created", "InProgress"];
      } else {
        statusdata = [this.statusValue];
      }
      this.setState({
        proposalsData: await rfpService
          .getRfpProposalsByAll(
            attribute,
            interval,
            statusdata,
            this.typeValue,
            this.actionValue,
            this.regionValue,
            this.domainValue,
            this.submissionValue,
            this.contractValue,
            "All",
            this.currentPage
          )
          .then()
          .catch((error)=>{
            if(error !== "Forbidden"){
              notifications.openErrorNotification(error.toString());
            }
          }),
        loading: false,
      });
    } else {
      this.setState({
        proposalsData: await rfpService
          .getRfpProposalsByAllString(
            attribute,
            interval,
            this.statusValue,
            this.typeValue,
            this.actionValue,
            this.regionValue,
            this.domainValue,
            this.submissionValue,
            this.contractValue,
            "All",
            this.currentPage
          )
          .then()
          .catch((error)=>{
            if(error !== "Forbidden"){
              notifications.openErrorNotification(error.toString());
            }
          }),
        loading: false,
      });
    }
  };
  handlePageChange = async (pageNumber: any) => {
    this.setState({
      doFilter: true,
    });
    const Action = {
      label: "pageNumber",
      value: pageNumber,
    };
    this.props.filterAction(Action);
    this.currentPage = pageNumber;
    this.doFilter();
  };

  callData = async (pageNumber: any) => {
    this.currentPage = pageNumber;
    if (this.state.subContext) {
      await this.filterData();
    } else if (this.state.context === "due") {
      await this.getRfpProposols(this.state.context, this.state.future);
    } else {
      await this.getRfpProposols(this.state.context, this.state.past);
    }
  };

  openNotificationWithIcon = (type: string) => {
    let msg = "";
    let title = "";
    switch (type) {
      case "success":
        msg = this.successMsg;
        title = "Success";
        break;
      case "warning":
        msg = this.warningMsg;
        title = "Warning";
        break;
      case "error":
        msg = this.errorMsg;
        title = "Error";
        break;
      default:
        break;
    }
  };

  displaySuccessDialog = (msg: any) => {
    this.successMsg = msg;
    this.openNotificationWithIcon("success");
  };
  displayErrorDialog = (msg: any) => {
    this.errorMsg = msg;
    this.openNotificationWithIcon("error");
  };
  displayWarningDialog = (msg: any) => {
    this.warningMsg = msg;
    this.openNotificationWithIcon("warning");
  };

  handleDeleteButton = () => {
    if (this.state.selectedRow.length === 0) {
      notifications.openErrorNotification("Please Select Row");
    } else {
      Modal.confirm({
        title: "Delete Proposals",
        content: "Are you sure you want to delete Proposals?",
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
          this.confirmDelete();
        },
      });
    }
  };

  handleSelect = (RwoId: any) => {
    this.setState({ selectedRow: RwoId });
  };

  confirmDelete = () => {
    rfpService
      .deleteProposal(this.state.selectedRow)
      .then(async (response) => {
        await this.getRfpProposolsPages(
          this.state.context,
          this.state.interval
        );
        await this.getRfpProposols(this.state.context, this.state.interval);
        notifications.openSuccessNotification(
          MessageProp.getDeletedSucessMessage("Proposal")
        );
      })
      .catch((error)=>{
        if(error !== "Forbidden"){
          notifications.openErrorNotification(error.toString());
        }
      });
  };

  setAccess() {
    const { user } = this.props;
    if (
      user.role &&
      (user.role === "Admin" ||
        user.role === "Super Admin" ||
        user.role === "Creator" ||
        user.role === "Manager" ||
        user.role === "Owner")
    ) {
      this.state.allowAddDelete = false;
    }
    if (
      user.role &&
      (user.role === "Manager" ||
        user.role === "Admin" ||
        user.role === "Super Admin" ||
        user.role === "Owner")
    ) {
      this.setState({ allowfollowup: true });
    }
    if(user.role && (user.role === "Manager" || user.role === "Admin") ) { this.setState({allowDelete: true})}
  }

  handleCreateDueChange = async (event: string) => {
    const Action = {
      label: "context",
      value: event,
    };
    this.props.filterAction(Action);
    this.domainValue = "All";
    this.typeValue = "All";
    this.statusValue = "All";
    this.submissionValue = "All";
    this.contractValue = "All";
    this.actionValue = "All";
    if (event === "due") {
      this.setState({
        hiddenSerach: true,
        hiddenSerachPart1: false,
      });
    }
    this.currentPage = 1;
    this.setState({
      context: event,
      proposalsDataPages: 0,
    });
    await this.getRfpProposolsPages(event, this.state.interval);
    await this.getRfpProposols(event, this.state.interval);
  };
  handleWeekMonthChange = async (event: string) => {
    const Action = {
      label: "interval",
      value: event,
    };
    this.props.filterAction(Action);
    const ActionPast = {
      label: "past",
      value: event,
    };
    this.props.filterAction(ActionPast);

    this.currentPage = 1;
    this.domainValue = "All";
    this.typeValue = "All";
    this.statusValue = "All";
    this.submissionValue = "All";
    this.contractValue = "All";
    this.actionValue = "All";
    this.regionValue = "All";
    this.setState({
      interval: event,
      past: event,
      future: event,
      proposalsDataPages: 0,
    });
    await this.getRfpProposolsPages(this.state.context, event);
    await this.getRfpProposols(this.state.context, event);
  };

  searchData = async (event: any) => {
    let val = event.target.value;
    if (val === "") {
      await this.getRfpProposolsPages(this.state.context, this.state.interval);
      await this.getRfpProposols(this.state.context, this.state.interval);
    } else if (val != undefined && val.trim().length > 3) {
      let inte = "-1";
      let response = await rfpService
        .searchProposalCreated(val.trim(), inte)
        .then()
        .catch((error)=>{
          if(error !== "Forbidden"){
            notifications.openErrorNotification(error.toString());
          }
        });
      this.setState({
        serachTable: true,
        proposalsData: response,
      });
    }
  };

  searchDueData = async (event: any) => {
    let val = event.target.value;
    if (val === "") {
      await this.getRfpProposolsPages(this.state.context, this.state.interval);
      await this.getRfpProposols(this.state.context, this.state.interval);
    }
    if (val != undefined && val.trim().length > 3) {
      let inte = "-1";
      let response = await rfpService
        .searchProposaldue(val.trim(), inte)
        .then()
        .catch((error)=>{
          if(error !== "Forbidden"){
            notifications.openErrorNotification(error.toString());
          }
        });
      this.setState({
        proposalsData: response,
      });
    }
  };

  handelChangeType = (event: string) => {
    this.filterTypes(event, 1);
    const Action = {
      label: "type",
      value: event,
    };
    this.props.filterAction(Action);
  };

  filterTypes = async (type: string, pageNumber: number) => {
    this.setState({ loading: true });
    this.typeValue = type;
    this.setState({
      type: type,
      subContext: "type",
    });
    this.currentPage = pageNumber;
    await this.doFilter();
  };

  handelChangeDomain = (event: string) => {
    this.filterDomains(event, 1);
    const Action = {
      label: "domain",
      value: event,
    };
    this.props.filterAction(Action);
  };

  filterDomains = async (domain: string, pageNumber: number) => {
    this.setState({ loading: true });
    this.domainValue = domain;
    this.setState({ domain: domain, subContext: "domain" });
    this.currentPage = pageNumber;
    await this.doFilter();
  };

  getFields = (input: any, field: any) => {
    var output = [];
    for (var i = 0; i < input.length; ++i) output.push(input[i][field]);
    return output.reduce(function (a, b) {
      if (a.indexOf(b) < 0) a.push(b);
      return a;
    }, []);
  };

  handlRegionChange = async (event: string) => {
    const Action = {
      label: "region",
      value: event,
    };
    this.props.filterAction(Action);
    rfpService.getDomain(event).then((response) => {
      this.setState({
        domains: this.getFields(response, "name"),
      });
    });

    this.filterRegion(event, 1);
  };

  filterRegion = async (regionValue: string, pageNumber: number) => {
    this.setState({ loading: true });
    this.regionValue = regionValue;
    this.setState({ region: regionValue, subContect: "region" });
    this.currentPage = pageNumber;
    await this.doFilter();
  };

  handelChangeContactType = (event: string) => {
    this.filterComnractTypes(event, 1);
    const Action = {
      label: "contractType",
      value: event,
    };
    this.props.filterAction(Action);
  };

  filterComnractTypes = async (contractType: string, pageNumber: number) => {
    this.setState({ loading: true });
    this.contractValue = contractType;
    this.setState({ contractType: contractType, subContext: "contractType" });
    this.currentPage = pageNumber;
    await this.doFilter();
  };

  handelChangeAction = (event: string) => {
    this.filterActions(event, 1);
    const Action = {
      label: "action",
      value: event,
    };
    this.props.filterAction(Action);
  };

  filterActions = async (action: string, pageNumber: number) => {
    this.setState({ loading: true });
    if(action === ""){
      this.actionValue = this.actionSetDropValue;
    }else{
      this.actionValue = action;
    }
    
    this.setState({ action: action, subContext: "action" });
    this.currentPage = pageNumber;
    await this.doFilter();
  };

  handelChangeSubmission = (event: string) => {
    this.filterSubmissionType(event, 1);
    const Action = {
      label: "submissionType",
      value: event,
    };
    this.props.filterAction(Action);
  };

  filterSubmissionType = async (submissionType: string, pageNumber: number) => {
    this.setState({ loading: true });
    this.submissionValue = submissionType;
    this.setState({
      submissionType: submissionType,
      subContext: "submissionType",
    });
    this.currentPage = pageNumber;
    await this.doFilter();
  };

  handelChangeStatus = (event: string) => {
    this.filterStatus(event, 1);
    const Action = {
      label: "status",
      value: event,
    };
    const pageAction = {
      label: "pageNumber",
      value: 1,
    };

    this.props.filterAction(Action);
    this.props.filterAction(pageAction);
  };
  filterStatus = async (status: string, pageNumber: number) => {
    this.setState({ loading: true });
    this.statusValue = status;
    this.setState({ status: status, subContext: "status" });
    this.currentPage = pageNumber;
    await this.doFilter();
  };
  async doFilter() {
    await this.getRfpProposolsPagesByAll(
      this.state.context,
      this.state.interval
    );
    await this.getRfpProposolsByAll(this.state.context, this.state.interval);
  }
  doFollowUp = async () => {
    this.setState({
      followupLoading: true,
    });
    if (this.state.selectedRow.length > 0) {
      await rfpService
        .doFollowUp(this.state.selectedRow)
        .then((response: any) => {
          notifications.openSuccessNotification(
            "Successfully send the proposal follow up request"
          );
        })
        .catch((error)=>{
            if(error !== "Forbidden"){
              notifications.openErrorNotification(error.toString());
            }
          });
    } else {
      notifications.openErrorNotification(
        "Please Select Any Submitted Proposal."
      );
    }
    this.setState({
      followupLoading: false,
    });
  };

  handlRegionChanges = async (region: any) => {
    let response = await rfpService.getDomain(region);
    this.setState({
      domains: this.getFields(response, "name"),
    });
  };

  render() {
    let rfpByDomain = this.state.domains;
    if (rfpByDomain != undefined) {
      rfpByDomain = rfpByDomain.filter((x: any) => x.name != "ALL");
    }
    return (
      <>
        <DailogComponent
          setIsModalVisible={this.state.visible}
          closeModal={this.closeModal}
          content={this.state.content}
          title={this.state.title}
          loading={false}
          footer={null}
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
                      <Select
                        showSearch
                        className="select-class"
                        placeholder="Created / Due In"
                        optionFilterProp="children"
                        onChange={this.handleCreateDueChange}
                        value={this.state.context}
                      >
                        <Option value="created">Created</Option>
                        <Option value="due">Due In</Option>
                      </Select>
                    </Col>
                    <Col
                      xs={{ span: 24 }}
                      sm={{ span: 24 }}
                      md={{ span: 24 }}
                      lg={{ span: 8 }}
                    >
                      <Select
                        value={this.state.interval}
                        showSearch
                        className="select-class"
                        placeholder="Week/Month"
                        optionFilterProp="children"
                        onChange={this.handleWeekMonthChange}
                      >
                        <Option value="-1">ALL</Option>
                        <Option value="7">1 Week</Option>
                        <Option value="14">2 Weeks</Option>
                        <Option value="21">3 Weeks</Option>
                        <Option value="30">1 Month</Option>
                      </Select>
                    </Col>
                    <Col
                      hidden={this.state.hiddenSerach}
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
                    <Col
                      hidden={this.state.hiddenSerachPart1}
                      xs={{ span: 24 }}
                      sm={{ span: 24 }}
                      md={{ span: 24 }}
                      lg={{ span: 8 }}
                    >
                      <Search
                        placeholder="Search"
                        allowClear
                        className="search"
                        onChange={this.searchDueData}
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
                    {this.state.allowDelete ? (
                        <Button
                        danger
                        className="fr ml1"
                        onClick={this.handleDeleteButton}
                        icon={<DeleteFilled />}
                        >
                        Delete
                        </Button>
                    ):('')}
                    {!this.state.allowAddDelete ? ( 
                    <Link to={"/add-proposal"}>
                      <Button
                        type="primary"
                        className="fr fl mr-top"
                        icon={<PlusCircleOutlined />}
                      >
                        Add Proposals
                      </Button>
                    </Link>):('')}
                   
                    {this.state.allowfollowup ? (
                      <Button
                        type="primary"
                        className="fr mr1"
                        onClick={this.doFollowUp}
                        icon={<ReconciliationOutlined />}
                        loading={this.state.followupLoading}
                      >
                        Follow Up
                      </Button>
                    ) : (
                      ""
                    )}
                  </Col>
              </Row>
              <Row gutter={24} className="headeing-padding">
                
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 3 }}
                  lg={{ span: 3 }}
                >
                  <span className="span-lbl">Type</span>
                  <Select
                    className="select-class"
                    placeholder="Select Type"
                    onChange={this.handelChangeType}
                    value={this.typeValue}
                    id="rc_select_type"
                  >
                    <Option value="All">ALL</Option>
                    {this.props.rfpByTypeData.map((data: any) => {
                      return <Option value={data.name}>{data.name}</Option>;
                    })}
                  </Select>
                </Col>

                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 3 }}
                  lg={{ span: 3 }}
                >
                  <span className="span-lbl">Region</span>
                  <Select
                    className="select-class"
                    placeholder="Select Region"
                    onChange={this.handlRegionChange}
                    value={this.regionValue}
                    id="rc_select_region"
                  >
                    <Option value="All">ALL</Option>
                    {this.state?.regions.map((data: any) => {
                      return <Option value={data.name}>{data.name}</Option>;
                    })}
                  </Select>
                </Col>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 3 }}
                  lg={{ span: 3 }}
                >
                  <span className="span-lbl">Domain</span>
                  <Select
                    className="select-class"
                    placeholder="Select Domain"
                    onChange={this.handelChangeDomain}
                    value={this.domainValue}
                    id="rc_select_domain"
                  >
                    <Option value="All">ALL</Option>
                    {this.state.domains.map((data: any) => {
                      return <Option value={data}>{data}</Option>;
                    })}
                  </Select>
                </Col>

                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 3 }}
                  lg={{ span: 3 }}
                >
                  <span className="span-lbl">Contract Type</span>
                  <Select
                    className="select-class"
                    placeholder="Select Contact Type"
                    onChange={this.handelChangeContactType}
                    value={this.contractValue}
                    id="rc_select_contractType"
                  >
                    <Option value="All">ALL</Option>
                    {this.props.rfpByContractData.map((data: any) => {
                      return <Option value={data.name}>{data.name}</Option>;
                    })}
                  </Select>
                </Col>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 3 }}
                  lg={{ span: 3 }}
                >
                  <span className="span-lbl">Action</span>
                  <Select
                    className="select-class"
                    placeholder="Select Bid"
                    onChange={this.handelChangeAction}
                    value={this.actionValue}
                    id="rc_select_action"
                  >
                    <Option value="All">ALL</Option>
                    {this.props.rfpByActionData.map((data: any) => {
                      return <Option value={data.name}>{data.name}</Option>;
                    })}
                  </Select>
                </Col>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 3 }}
                  lg={{ span: 3 }}
                >
                  <span className="span-lbl">Submission Type</span>
                  <Select
                    className="select-class"
                    placeholder="Select Submission Type"
                    onChange={this.handelChangeSubmission}
                    value={this.submissionValue}
                    id="rc_select_submission"
                  >
                    <Option value="All">ALL</Option>
                    {this.props.rfpBySubmissionData.map((data: any) => {
                      return <Option value={data.name}>{data.name}</Option>;
                    })}
                  </Select>
                </Col>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 3 }}
                  lg={{ span: 3 }}
                >
                  <span className="span-lbl">Status</span>
                  {this.state.context === "due" ? (
                    <Select
                      className="select-class"
                      placeholder="Select Status"
                      onChange={this.handelChangeStatus}
                      value={this.statusValue}
                      id="rc_select_status"
                    >
                      <Option value="All">ALL</Option>
                      <Option value="Created">Created</Option>
                      <Option value="InProgress">In Progress</Option>
                    </Select>
                  ) : (
                    <Select
                      className="select-class"
                      placeholder="Select Status"
                      onChange={this.handelChangeStatus}
                      value={this.statusValue}
                      id="rc_select_status"
                    >
                      <Option value="All">ALL</Option>
                      {this.props.rfpByStatusData.map((data: any) => {
                        return <Option value={data.name}>{data.name}</Option>;
                      })}
                    </Select>
                  )}
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {this.state.serachTable === true ? (
          <Row>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 24 }}
              lg={{ span: 24 }}
            >
              <Table1
                data={this.state.proposalsData}
                columns={this.columns}
                rowIdentifier="id"
                loading={this.state.loading}
                handleSelect={this.handleSelect}
                checkBox={true}
                enableDelete={false}
              />
            </Col>
          </Row>
        ) : (
          <Row>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 24 }}
              lg={{ span: 24 }}
            >
              <Table1
                data={this.state.proposalsData}
                columns={this.columns}
                rowIdentifier="id"
                handlePageChange={this.handlePageChange}
                currentPage={this.currentPage}
                totalPages={this.state.proposalsDataPages}
                loading={this.state.loading}
                handleSelect={this.handleSelect}
                checkBox={true}
                enableDelete={false}
              />
            </Col>
          </Row>
        )}
      </>
    );
  }
}

function mapState(state: any) {
  const {
    getProposalsByDomain,
    getRfpByStatus,
    getRfpByType,
    getRfpByContract,
    getRfpByAction,
    getRfpBySumission,
    authentication,
    filterReducer,
  } = state;
  const { user } = authentication;
  const { proposalsByDomainData } = getProposalsByDomain;
  const { rfpByStatusData } = getRfpByStatus;
  const { rfpByTypeData } = getRfpByType;
  const { rfpByContractData } = getRfpByContract;
  const { rfpByActionData } = getRfpByAction;
  const { rfpBySubmissionData } = getRfpBySumission;
  return {
    proposalsByDomainData,
    rfpByStatusData,
    rfpByTypeData,
    rfpByContractData,
    rfpByActionData,
    rfpBySubmissionData,
    user,
    filterReducer,
  };
}
const actionCreators = {
  getRfpByDomain: proposalsAction.getRfpByDomain,
  getRfpProposalsByDomain: proposalsAction.getRfpProposalsByDomain,
  getRfpByStatus: proposalsAction.getRfpByStatus,
  getRfpBytype: proposalsAction.getRfpByType,
  getRfpByContract: proposalsAction.getRfpByContract,
  getRfpByAction: proposalsAction.getRfpByAction,
  getRFPBYSubmission: proposalsAction.getRfpBySubmission,
  filterAction: filterAction,
};
export default connect(mapState, actionCreators)(Proposals);
