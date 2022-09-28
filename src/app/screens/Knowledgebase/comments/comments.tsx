import React, { Component } from "react";
import { Input,  Row, Col, Select } from "antd";
import { Table1 } from "../../../component/table";
import { rfpService } from "../../../services/rfp-service";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { proposalsAction } from "../../../_redux/_actions";
import { notifications } from "../../../_helpers/notifications";
import { AttributeType } from "../../../_redux/_constants";
import DailogComponent from "../../../component/DailogComponent";
import { FileAddOutlined } from "@ant-design/icons";
const { Search } = Input;
const Option = Select.Option;
class Comments extends Component<any, any> {
  regionValue: string = "";
  domainValue: string = "";

  columns = [
    {
      title: "History",
      dataIndex: "title",
      render: (text: any, record: any) => {
        return (
          <span>
            <Link
              to={"/viewproposal?id=" + record.id}
              style={{ color: "#000" }}
            >
              {record.title}
            </Link>
          </span>
        );
      },
    },
    {
      title: "Reason",
      dataIndex: "wonProposalRequest",
      render: (text: any, record: any) => {
        return (
          <>
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
          </>
        );
      },
    },
  ];
  constructor(props: any) {
    super(props);
    this.state = {
      comments: [],
      loading: true,
      region: [],
      domain: [],
      visible: false,
      content: "",
    };
  }

  getDetails = (record: any) => {
    let content = (
      <>
        <Row>
          <Col
            span={24}
            xs={{ order: 24 }}
            sm={{ order: 24 }}
            md={{ order: 24 }}
            lg={{ order: 24 }}
          >
            <div className="person-contact">
              <span className="label-01">
                {record.wonProposalRequest.comments[0].text}
              </span>
            </div>
          </Col>
        </Row>
      </>
    );
    this.setState({ visible: true, content, title: "Details" });
  };

  async componentDidMount() {
    this.regionValue ="US";
    document.title = "Learning";
    await this.getRegion();
    await this.handlRegionChange(this.regionValue);
    await this.getWonComment();
    // this.props.getRfpByDomain();
    
    this.setState({ loading: false });
  }

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
        comments: [],
      });
    }
  };

  clean = () => {
    this.domainValue = "";
  };

  handledomainChange = async (domain: any) => {
    this.domainValue = domain;
    this.setState({
      comments: await rfpService
        .getWonComments(this.regionValue, domain)
        .then()
        .catch(notifications.openErrorNotification),
      loading: false,
    });
  };
  getWonComment = async () => {
    this.setState({
      comments: await rfpService
        .getWonComments(this.regionValue, "Staffing")
        .then()
        .catch(notifications.openErrorNotification),
      loading: false,
    });
  };

  getSearchWonComment = async () => {
    this.setState({
      comments: await rfpService
        .getWonComments(this.regionValue, this.domainValue)
        .then()
        .catch(notifications.openErrorNotification),
      loading: false,
    });
  };

  getRegion = async () => {
    this.setState({
      region: await rfpService
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

  searchData = async (event: any) => {
    let val = event.target.value;
    if (val === "") {
      this.getSearchWonComment();
    } else if (val != undefined && val.trim().length > 3) {
      let response = await rfpService
        .getSearchWomComments(this.regionValue, this.domainValue, val.trim())
        .then()
        .catch(notifications.openErrorNotification);
      this.setState({
        serachTable: true,
        comments: response,
      });
    }
  };

  closeModal = () => {
    this.setState({ visible: false });
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
          footer={null}
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
        </Row>

        <Row>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 24 }}
          >
            <div className="site-page-header-ghost-wrapper">
              <Table1
                data={this.state.comments}
                columns={this.columns}
                loading={this.state.loading}
              />
            </div>
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
export default connect(mapState, actionCreators)(Comments);
