import React, { Component } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { Spin, Tooltip } from "antd";
import { rfpService } from "../services/rfp-service";
import { MessageProp } from "../_globals/constants/message.constants";
import { notifications } from "../_helpers/notifications";
import Download from "../../assets/img/download.svg";

export class DownloadComponent extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { loading: false };
  }

  // displaySuccessDialog = (msg) => {
  //     notifications.successMessage(msg);
  // };
  // displayErrorDialog = (msg) => {
  //     notifications.openErrorNotification(msg);
  // };
  // displayWarningDialog = (msg) => {
  //     notifications.openWarningNotification(msg);
  // };
  downloadDocumnet = () => {
    let tempDocument = {
      id: null,
      app: this.props.app,
      type: null,
      audit: null,
      title: null,
      status: this.props.status,
      ownerId: null,
      ownerEmail: null,
      ownerName: null,
      ownerType: null,
      contextId: null,
      path: this.props.fileStoragePath,
      metadata: null,
      content: null,
      tagss: null,
      issueDate: "",
      expiryDate: "",
      expriyMandatory: null,
      issueMandatory: null,
    };
    this.setState({ loading: true });
    rfpService.fileDownload(tempDocument).then(
      (blob) => {
        this.setState({ loading: false });
        var a = document.createElement("a");
        // a.style = "display:none";
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = this.props.fileStoragePath;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        notifications.openSuccessNotification(
          MessageProp.getDownloadedSucessMessage("Document")
        );
      },
      (error: any) => {
        // this.displayErrorDialog(error.toString());
      }
    );
  };
  render() {
    return (
      <Spin spinning={this.state.loading} size="small">
        <Tooltip title="Download">
          <span
            className="download"
            onClick={() => {
              this.downloadDocumnet();
            }}
          >
            <img src={Download} alt="" className="icons" />
          </span>
        </Tooltip>
      </Spin>
    );
  }
}

export default DownloadComponent;
