import React, { Component } from "react";
import { Row, Col, Spin } from "antd";
import { rfpService } from "../services/rfp-service";
import { MessageProp } from "../_globals/constants/message.constants";
import { notifications } from "../_helpers/notifications";
import { Upload, Button, message, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const ColStyle = {
  padding: "0 5px 0 5px",
  marginBottom: "0px",
};

export class UploadComponent extends Component<any, any> {
  previewPath: any;
  formData: FormData | undefined;

  constructor(props: any) {
    super(props);
    this.state = { previewPath: "", loading: false, fileList: [] };
  }

  getFileExtension = (filename: any) => {
    const ext = /^.+\.([^.]+)$/.exec(filename);
    return ext === null ? "" : ext[1];
  };

  uploadFile = async () => {
    const { fileList } = this.state;
    if (fileList.length > 0) {
      var file = fileList[0];
      this.formData = new FormData();
      this.formData.append("file", file, file.name);
      if (this.formData != undefined) {
        if (
          this.getFileExtension(file.name) === "pdf" ||
          this.getFileExtension(file.name) === "PDF" ||
          this.getFileExtension(file.name) === "png" ||
          this.getFileExtension(file.name) === "PNG" ||
          this.getFileExtension(file.name) === "jpeg" ||
          this.getFileExtension(file.name) === "JPEG" ||
          this.getFileExtension(file.name) === "doc" ||
          this.getFileExtension(file.name) === "DOC" ||
          this.getFileExtension(file.name) === "docx" ||
          this.getFileExtension(file.name) === "DOCx" ||
          this.getFileExtension(file.name) === "xls" ||
          this.getFileExtension(file.name) === "XLS" ||
          this.getFileExtension(file.name) === "xlsx" ||
          this.getFileExtension(file.name) === "XLSX" ||
          this.getFileExtension(file.name) === "jpg" ||
          this.getFileExtension(file.name) === "JPG"
        ) {
          let docType = await this.props.getType();
          if (
            docType.type === undefined ||
            docType.type === null ||
            docType.type === ""
          ) {
            notifications.openErrorNotification(
              "Please select type of document"
            );
            this.setState({ loading: false, filename: undefined, fileList: [] });
          } else if (Math.round(file.size / 1024) > 10240) {
            notifications.openErrorNotification(
              "File size cannot be more than 10Mb"
            );
            this.setState({ loading: false, filename: undefined, fileList: [] });
          } else {
            this.setState({ loading: true });

            rfpService
              .uploadDocument(this.formData, this.props.ownerId)
              .then((response: any) => {
                if (response != undefined) {
                  this.props.callback(response, file.name, this.props.index);
                  this.setState({ loading: false });
                  this.previewPath = response.path.split(
                    this.props.ownerId + "_"
                  )[1];
                  notifications.openSuccessNotification(
                    "Document has been uploaded successfully"
                  );
                }
              })
              .catch(notifications.openErrorNotification);
          }
        } else {
          notifications.openErrorNotification(
            "Document needs to be in .doc/ .pdf/ .png/ .jpeg/ .jpg/ .xls/ .xlsx format."
          );

          this.setState({ loading: false, filename: undefined, fileList: [] });
        }
      } else {
        notifications.openErrorNotification(
          "No document selected, please upload document again."
        );
        this.setState({ loading: false, filename: undefined, fileList: [] });
      }
    }
  };

  render() {
    const { fileList } = this.state;
    const props = {
      beforeUpload: (file: any) => {
        this.setState({
          fileList: [file],
          filename: file.name
        });
        return true;
      },
      fileList,
      showUploadList: false,
      multiple: false
    };
    return (
      <Spin spinning={this.state.loading} size="large">
        <Row>
          <Col sm={24} style={ColStyle}>
            <Upload {...props} customRequest={this.uploadFile}>
              <Input
                placeholder="Select File"
                suffix={<UploadOutlined />}
                value={this.state.filename}
                readOnly
              />
            </Upload>
          </Col>
        </Row>
      </Spin>
    );
  }
}
export default UploadComponent;
