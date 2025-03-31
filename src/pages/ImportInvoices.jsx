import React, { useState, useEffect } from "react";
import { Upload, Button, Progress, Table, message as AntMessage, Select, Spin } from "antd";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const { Option } = Select;

const ImportInvoices = () => {
    const [progress, setProgress] = useState(0);
    const [errorRows, setErrorRows] = useState([]);
    const [client, setClient] = useState(null);
    const [messageApi, contextHolder] = AntMessage.useMessage();

    const [invoices, setInvoices] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [year, setYear] = useState(2023);
    const [loading, setLoading] = useState(false);

    const fetchInvoices = async (year, page, size) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:7979/import/invoices?page=${page - 1}&size=${size}&year=${year}`);
            const data = await res.json();
            setInvoices(data.contents);
            setPagination({
                current: page,
                pageSize: size,
                total: data.paging.totalRecord,
            });
        } catch (error) {
            messageApi.error("Lỗi khi tải dữ liệu");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchInvoices(year, 1, pagination.pageSize);
    }, [year]);

    useEffect(() => {
        const socket = new SockJS("http://localhost:7979/ws-progress");
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("STOMP connected");
                stompClient.subscribe("/topic/import-progress", (message) => {
                    const data = JSON.parse(message.body);
                    setProgress(data.percent || 0);

                    if (data.error) {
                        setErrorRows((prev) => [...prev, data]);
                    }

                    if (data.done) {
                        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
                        (async () => {
                            await messageApi.success("Hoàn tất import");
                            await delay(500);
                            setProgress(0);
                            setErrorRows([]);
                            fetchInvoices(year, 1, pagination.pageSize); // reload data sau khi import
                        })();
                    }
                });
            },
            onStompError: (frame) => {
                console.error("STOMP error", frame);
            },
        });

        stompClient.activate();
        setClient(stompClient);
    }, []);

    const handleUpload = async (file) => {
        setProgress(0);
        setErrorRows([]);
        messageApi.info("Đang gửi file");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://localhost:7979/import/excel", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                messageApi.success("File đã được gửi lên. Đang xử lý");
            } else {
                const text = await res.text();
                messageApi.error("Lỗi khi gửi file: " + text);
            }
        } catch (error) {
            messageApi.error("Lỗi kết nối tới server");
        }

        return false;
    };

    return (
        <div style={{ padding: 24 }}>
            {contextHolder}
            <h2>Nhập chứng từ từ Excel</h2>

            <Upload maxCount={1} showUploadList={false} beforeUpload={handleUpload}>
                <Button>Chọn file Excel</Button>
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
                            { title: "Lỗi", dataIndex: "error" },
                        ]}
                        pagination={false}
                    />
                </div>
            )}

            <div style={{ marginTop: 48 }}>
                <h3>Danh sách chứng từ</h3>
                <div style={{ marginBottom: 12 }}>
                    <span>Chọn năm:</span>{" "}
                    <Select value={year} onChange={setYear} style={{ width: 120, marginLeft: 8 }}>
                        <Option value={2019}>2019</Option>
                        <Option value={2020}>2020</Option>
                        <Option value={2021}>2021</Option>
                        <Option value={2022}>2022</Option>
                        <Option value={2023}>2023</Option>
                        <Option value={2024}>2024</Option>
                        <Option value={2025}>2025</Option>
                    </Select>
                </div>

                <Spin spinning={loading}>
                    <Table
                        dataSource={invoices}
                        rowKey="id"
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total,
                            onChange: (page) => fetchInvoices(year, page, pagination.pageSize),
                        }}
                        columns={[
                            { title: "Mã chứng từ", dataIndex: "code" },
                            { title: "Tên khách hàng", dataIndex: "customerName" },
                            { title: "Ngày", dataIndex: "date" },
                            { title: "Số tiền", dataIndex: "amount" },
                        ]}
                    />
                </Spin>
            </div>
        </div>
    );
};

export default ImportInvoices;
