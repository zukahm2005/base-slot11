import React, { useState } from "react";
import { Upload, Button, Progress, Table, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const ImportInvoices = () => {
  const [progress, setProgress] = useState(0);
  const [errorRows, setErrorRows] = useState([]);

  const handleUpload = (file) => {
    setProgress(0);
    setErrorRows([]);
    message.info("Bắt đầu xử lý file...");

    const fakeProcessing = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(fakeProcessing);
          const mockErrors = [
            { line: 5, message: "Thiếu ngày chứng từ" },
            { line: 21, message: "Số tiền không hợp lệ" },
          ];
          setErrorRows(mockErrors);
          message.warning("Xử lý xong. Có một số dòng lỗi.");
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return false;
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>📥 Nhập chứng từ từ Excel</h2>

      <Upload
        maxCount={1}
        showUploadList={false}
        beforeUpload={(file) => {
          handleUpload(file);
          return false;
        }}
      >
        <Button icon={<UploadOutlined />}>Chọn file Excel</Button>
      </Upload>

      <Progress percent={progress} style={{ marginTop: 16, width: 300 }} />

      {errorRows.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h4>Lỗi trong file:</h4>
          <Table
            dataSource={errorRows}
            rowKey={(row) => row.line}
            columns={[
              { title: "Dòng", dataIndex: "line" },
              { title: "Lỗi", dataIndex: "message" },
            ]}
            pagination={false}
          />
        </div>
      )}
    </div>
  );
};

export default ImportInvoices;
