import React, { Component } from "react";
import "antd/dist/antd.css";
import { Input, Row, Col, PageHeader } from "antd";
import WonImage from "../../../assets/img/wonimage.png";
import { Link } from "react-router-dom";
import { Table1 } from "../../component/table";
import phone from "../../../assets/images/phone.png";
import globe from "../../../assets/images/globe.png";
import computer from "../../../assets/images/computer.png";
import { notifications } from "../../_helpers/notifications";
import { rfpService } from "../../services/rfp-service";
import DailogComponent from "../../component/DailogComponent";

const { Search } = Input;
class Wonproposals extends Component<any, any> {
  pageNo = -1;
  startWorkAgreement = [];
  endWorkAgreement = [];
  columns = [
    {
      key: "id",
      title: "Title, ID & Date",
      dataIndex: "id",
      render: (text: any, record: any) => {
        return (
          <span>
            <h3>
              <b>
                <Link
                  to={"/viewproposal?id=" + record.id}
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
            <div>
              <b>Issue Date : </b>
              {record.issueDate}
            </div>
            <div>
              <b>Due Date : </b>
              {record.dueDate}
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
            <div>{record.agency.address.line1}</div>
            <div>{record.agency.address.line2}</div>
            <div>{record.agency.address.line3}</div>
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
      title: "Domain",
      dataIndex: "domain",
    },
    {
      title: "Contract Type",
      dataIndex: "contractType",
    },
    {
      title: "Bid",
      dataIndex: "action",
      key: "action",
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
      title: "Complexity",
      dataIndex: "complexity",
    },
    {
      title: "Contact",
      dataIndex: "contact",
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

            {!record.contacts[0] ? (
              ""
            ) : (
              <span
                onClick={() => {
                  this.getContact(record);
                }}
              >
                <a className="proposal-contact">
                  <img src={phone} alt="" />
                </a>
              </span>
            )}
          </>
        );
      },
    },
  ];
  constructor(props: any) {
    super(props);
    this.state = {
      wonproposals: [],
      loading: true,
      totalPage: 0,
      visible: false,
      title: "",
      content: "",
    };
  }
  async componentDidMount() {
    document.title = "Won Proposals";
    await this.getWonProposals(this.pageNo);
    this.setState({ loading: false });
    await this.getDocumentStartDate();
    await this.getDocumentEndDate();
  }

  getDocumentEndDate =() =>{
    rfpService.getDocumentEndDate("Project Agreement","20").then((response)=>{
      if(response.length > 0) {
        this.endWorkAgreement = response;
        this.getProposalWorkReminder();
      }
    })
  }

  getDocumentStartDate = () =>{
    rfpService.getDocumentStartDate("Project Agreement","20").then((response)=>{
      if(response.length > 0) {
        this.startWorkAgreement = response;
        this.getProposalWorkReminder();
      }
    })
  }

  getProposalWorkReminder = () => {
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
            <div>
              <h2 style={{textDecoration : "underLine" }}>Work Start Date Notifiy</h2>
            </div>
            {this.startWorkAgreement ? this.startWorkAgreement.map((agreement:any)=>{
             return <>
              <div className="person-contact">
              <span className="label">Start Work Agreement Date : {agreement.issueDate} </span>
              </div>
              <div className="person-contact">
              <span className="label">Title : {agreement.title} </span>
              </div>
              <div className="person-contact">
              <Link
                  to={"/viewproposal?id=" + agreement.ownerId
                }
                  style={{ color: "#13b4ca" }}
                >
                  View
                </Link>
              </div>
              -------------------------------------------------------
              </>
            }) : ""}
          </Col>
          <Col
            span={12}
            xs={{ order: 12 }}
            sm={{ order: 12 }}
            md={{ order: 12 }}
            lg={{ order: 12 }}
          >
            <div>
              <h2 style={{textDecoration : "underLine" }}>Work End Date Notifiy</h2>
            </div>
            {this.endWorkAgreement ? this.endWorkAgreement.map((agreement:any)=>{
             return <>
              <div className="person-contact">
              <span className="label">End Work Agreement Date : {agreement.expiryDate} </span>
              </div>
              <div className="person-contact">
              <span className="label">Title : {agreement.title} </span>
              </div>
              <div className="person-contact">
              <Link
                  to={"/viewproposal?id=" + agreement.ownerId
                }
                  style={{ color: "#13b4ca" }}
                >
                  View
                </Link>
              </div>
              -------------------------------------------------------
              </>
            }): ""}
           
          </Col>
        </Row>
      </>
    );
    this.setState({ visible: true, content, title: "Work Agreement Date Reminder" });
  };

  getContact = (record: any) => {
    let content = (
      <>
        {record.contacts.map((data: any) => {
          return (
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
          );
        })}
      </>
    );
    this.setState({ visible: true, content, title: "Person Contact Details" });
  };

  getWonProposals = async (pageNo: number) => {
    this.setState({
      wonproposals: await rfpService
        .getWonProposals(pageNo)
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
    if(val === ""){
      this.getWonProposals(this.pageNo);
    }else if (val != undefined && val.trim().length > 3) {
      let response = await rfpService
        .wonProposalSearch(-1,val.trim())
        .then()
        .catch(notifications.openErrorNotification);
      this.setState({
        serachTable: true,
        wonproposals: response,
      });
    } 
  };

  closeModal = () => {
    this.setState({ visible: false });
  };

  getNoOfPageForWonProposals = async () => {
    this.setState({
      totalPage: await rfpService
        .getNoOfPageForWonProposals()
        .then()
        .catch(notifications.openErrorNotification),
      loading: false,
    });
  };
  handlePageChange = async (pageNo: number) => {
    this.pageNo = pageNo;
    this.getWonProposals(pageNo);
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
            <div className="site-page-header-ghost-wrapper">
              <PageHeader
                className="top-heading won-title"
                ghost={false}
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
            <Table1
              data={this.state.wonproposals}
              columns={this.columns}
              loading={this.state.loading}
            />
          </Col>
          <img src={WonImage} alt="Won Image" className="img-center" />
        </Row>
      </>
    );
  }
}

export default Wonproposals;
