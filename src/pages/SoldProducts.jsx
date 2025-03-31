import React, { useEffect, useState } from "react";
import { Table, Select, Spin, message } from "antd";

const { Option } = Select;

const SoldProducts = () => {
    const [products, setProducts] = useState([]);
    const [year, setYear] = useState(2025);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [loading, setLoading] = useState(false);

    const fetchProducts = async (year, page, size) => {
        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:7979/products/sold?year=${year}&pageNum=${page}&pageSize=${size}`
            );
            const data = await res.json();
            setProducts(data.contents || []);
            setPagination({
                current: page,
                pageSize: size,
                total: data.paging.totalRecord,
            });
        } catch (err) {
            message.error("Không thể tải dữ liệu sản phẩm!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(year, 1, pagination.pageSize);
    }, [year]);

    return (
        <div style={{ padding: 24 }}>
            <h2>Danh sách sản phẩm đã bán</h2>

            <div style={{ marginBottom: 16 }}>
                <span style={{ marginRight: 8 }}>Chọn năm:</span>
                <Select
                    value={year}
                    onChange={(value) => {
                        setYear(value);
                        setPagination((prev) => ({ ...prev, current: 1 }));
                    }}
                    style={{ width: 120 }}
                >
                    <Option value={2022}>2022</Option>
                    <Option value={2023}>2023</Option>
                    <Option value={2024}>2024</Option>
                    <Option value={2025}>2025</Option>
                </Select>
            </div>

            <Spin spinning={loading}>
                <Table
                    dataSource={products}
                    rowKey="id"
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        onChange: (page) =>
                            fetchProducts(year, page, pagination.pageSize),
                    }}
                    columns={[
                        { title: "Tên sản phẩm", dataIndex: "name" },
                        { title: "Giá", dataIndex: "price" },
                        { title: "Ngày bán", dataIndex: "soldAt" },
                    ]}
                />
            </Spin>
        </div>
    );
};

export default SoldProducts;
