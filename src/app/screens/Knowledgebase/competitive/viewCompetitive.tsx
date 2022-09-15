import React, { Component } from "react";
import "antd/dist/antd.css";
import {
  Table,
  Input,
  Button,
  Row,
  Col,
  PageHeader,
  Select,
  List,
  Modal,
  Tooltip,
} from "antd";
import { Link } from "react-router-dom";
import {
  PlusCircleOutlined,
  GlobalOutlined,
  PhoneOutlined,
  CaretDownOutlined,
  DeleteFilled,
} from "@ant-design/icons";

import DailogComponent from "../../../component/DailogComponent";
import { Table1 } from "../../../component/table";
import { connect } from "react-redux";
import { proposalsAction } from "../../../_redux/_actions";
import { rfpService } from "../../../services/rfp-service";
import globe from "../../../../assets/images/globe.png";
import { notifications } from "../../../_helpers/notifications";
import { MessageProp } from "../../../_globals/constants/message.constants";
import { AttributeType } from "../../../_redux/_constants";
const { Option } = Select;
const { Search } = Input;
export class ViewCompetitive extends Component<any, any> {
  // domain: string = "";
  regionValue: string = "";
  domainValue: string = "";
  currentPage = 1;
  columns = [
    {
      key: "id",
      title: "Title, ID & Name",
      dataIndex: "id",
      render: (text: any, record: any) => {
        return (
          <span>
            <h3>
              <b>
                <Link
                  to={"/detialsCompetitve?id=" + record.id}
                  style={{ color: "#13b4ca" }}
                >
                  {record.title}
                </Link>
              </b>
            </h3>
            <div>
              <b>ID : </b>
              {record.requestId}
            </div>
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
            <div>
              <b>{record.agency.name}</b>
            </div>
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
      title: "Domain",
      dataIndex: "domain",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Source",
      dataIndex: "source",
    },
    {
      title: "WebSite",
      dataIndex: "agency",
      render: (text: any, record: any) => {
        return (
          <>
            {record.agency.webSite === undefined ? (
              ""
            ) : (
              <span>
                <a
                  href={"https://" + record.agency.webSite}
                  rel="noopener noreferrer"
                  className="proposal-web"
                  target="_Blank"
                >
                  {" "}
                  {<img src={globe} alt="" />}{" "}
                </a>
              </span>
            )}
          </>
        );
      },
    },
  ];
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: true,
    visible: false,
    title: "",
    content: "",
    comppetitive: "",
    selectedRow: [],
    region: [],
    domain: [],
  };

  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };

  closeModal = () => {
    this.setState({ visible: false });
  };

  redirectToProposals = (id: any) => {
    // history.push("/viewproposal?id"+id )
  };

  onSelectChange = (selectedRowKeys: any) => {
    this.setState({ selectedRowKeys });
  };

  componentDidMount() {
    document.title = "Competitive";
    this.regionValue ="US";
    this.domainValue = "Staffing";
    // this.props.getRfpByDomain();
    this.getRegion();
    this.getCompetitive();
    this.handlRegionChange(this.regionValue);
  }

  getRegion = async () => {
    this.setState({
      region: await rfpService.getRfpByAttribute(AttributeType.REGION).then().catch(notifications.openErrorNotification),
      loading: false,
    });
  };

  handleSelect = (RwoId: any) => {
    this.setState({ selectedRow: RwoId });
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

  confirmDelete = () => {
    rfpService
      .deleteResponseIntelligent(this.state.selectedRow)
      .then((response) => {
        this.getCompetitive();
        notifications.openSuccessNotification(
          MessageProp.getDeletedSucessMessage("Proposal")
        );
      })
      .catch(notifications.openErrorNotification);
  };

  getCompetitive = async () => {
    this.setState({
      comppetitive: await rfpService
        .getCompetitive(this.regionValue, "Staffing")
        .then().catch(notifications.openErrorNotification),
      loading: false,
    });
  };

  getSerachCompetitive = async () => {
    this.setState({
      comppetitive: await rfpService
        .getCompetitive(this.regionValue, this.domainValue)
        .then()
        .catch(notifications.openErrorNotification),
      loading: false,
    });
  };

  handlePageChange = (pageNumber: any) => {
    this.callData(pageNumber);
  };

  callData = (pageNumber: any) => {
    this.currentPage = pageNumber;
    this.props.getRfpProposals(-1, pageNumber);
  };

  handledomainChange = async (domain: any) => {
    this.domainValue = domain;
    this.setState({ loading: true });
    this.setState({
      comppetitive: await rfpService
        .getCompetitive(this.regionValue, domain)
        .then().catch(notifications.openErrorNotification),
      loading: false,
    });
  };

  handlRegionChange = async (region: any) => {
      this.regionValue = region;
      let response = await rfpService.getDomain(region).then().catch();
      if (response != "") {
        let domainName = response[0].name;
        this.domainValue = domainName;
        this.setState({
          domain: response,
        });
        this.handledomainChange(domainName);
      } else {
        this.clean();
        this.setState({
          domain: [],
          comppetitive: [],
        });
      }
  };

  searchData = async (event: any) => {
    let val = event.target.value;
    if (val === "") {
      this.getSerachCompetitive();
    } else if (val != undefined && val.trim().length > 3) {
      let response = await rfpService
        .getSearchCompetitive(this.regionValue, this.domainValue, val.trim())
        .then()
        .catch(notifications.openErrorNotification);
      this.setState({
        serachTable: true,
        comppetitive: response,
      });
    }
  };

  clean = () => {
    this.domainValue = "";
  };

  render() {
    const { loading, selectedRowKeys } = this.state;
    const { proposalsData } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

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
                      <Select
                        className="select-class"
                        placeholder="Select Region"
                        onChange={this.handlRegionChange}
                        value={this.regionValue}
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
                      lg={{ span: 8 }}
                    >
                      <Select
                        className="select-class"
                        placeholder="Select Domain"
                        onChange={this.handledomainChange}
                        value={this.domainValue}
                        id="rc_select_domain"
                      >
                        {this.state.domain.map((data: any) => {
                          return <Option value={data.name}>{data.name}</Option>;
                        })}
                      </Select>
                    </Col>
                    {/* <Col
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
                    </Col> */}
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
                  <Link className="fr" to={"/add-Competitive"}>
                    <Button type="primary" icon={<PlusCircleOutlined />}>
                      Add Proposals
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
              data={this.state.comppetitive}
              columns={this.columns}
              //   handlePageChange={this.handlePageChange}
              //   currentPage={this.currentPage}
              //   totalPages={this.props.proposalsPagesData}
              loading={this.state.loading}
              handleSelect={this.handleSelect}
              checkBox={true}
            />
          </Col>
        </Row>
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
export default connect(mapState, actionCreators)(ViewCompetitive);

// export default ViewCompetitive;
