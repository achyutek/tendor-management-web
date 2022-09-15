import React, { Component } from "react";
import { Spin, Modal, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { rfpService } from "../services/rfp-service";
import Visibility from "../../assets/img/visibility.svg";
export class PreviewDocument extends Component<any, any> {
  previewUrl = "";
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      displayPreviewModal: false,
    };
  }
  previewDocument = () => {
    let tempDocument = {
      app: this.props.app,
      path: this.props.fileStoragePath,
      status: this.props.status,
    };
    this.setPreviewUrl(tempDocument);
  };

  setPreviewUrl = (document: any) => {
    this.setState({ loading: true });
    rfpService
      .moveFileToPreviewFolder(document)
      .then((response) => {
        this.setState({ loading: false });
        const url = response.value;
        if (url !== "" && url != undefined) {
          if (
            url.includes(".jpeg") ||
            url.includes(".jpg") ||
            url.includes(".pdf") ||
            url.includes(".png") ||
            url.includes(".JPEG") ||
            url.includes(".JPG") ||
            url.includes(".PDF") ||
            url.includes(".PNG") ||
            url.includes(".txt")
          ) {
            this.previewUrl = url;
          } else {
            this.previewUrl =
              "https://view.officeapps.live.com/op/embed.aspx?src=" + url;
          }

          this.setState({
            displayPreviewModal: true,
          });
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  };
  handlePreviewDocumentCancel = () => {
    this.previewUrl = "";
    this.setState({
      displayPreviewModal: false,
    });
  };
  render() {
    return (
      <Spin spinning={this.state.loading} size="small">
        <span>
          <Modal
            zIndex={2000}
            title="View File"
            visible={this.state.displayPreviewModal}
            width={800}
            onOk={this.handlePreviewDocumentCancel}
            okButtonProps={{ style: { display: "none" } }}
            onCancel={this.handlePreviewDocumentCancel}
          >
            <iframe
              style={{ width: "100%", height: "650px" }}
              src={this.previewUrl}
            ></iframe>{" "}
          </Modal>
          <Tooltip title="Preview">
            <span className="view" onClick={() => this.previewDocument()}>
              <img src={Visibility} alt="" className="icons" />
            </span>
          </Tooltip>
        </span>
      </Spin>
    );
  }
}
export default PreviewDocument;
