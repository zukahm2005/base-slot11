import React, { useEffect, useState } from "react";
import { Table, Select, Spin } from "antd";

const { Option } = Select;

// Tạo mock dữ liệu có cả năm 2024 và 2025
const mockData = Array.from({ length: 100 }, (_, i) => {
  const year = i % 2 === 0 ? 2024 : 2025; // Chẵn: 2024, lẻ: 2025
  const month = (i % 12) + 1;
  const day = (i % 28) + 1;

  return {
    id: i + 1,
    name: `Sản phẩm ${i + 1}`,
    price: 100 + i * 5,
    soldDate: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  };
});

const SoldProducts = () => {
  const [products, setProducts] = useState([]);
  const [year, setYear] = useState(2025);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [loading, setLoading] = useState(false);

  // Hàm lọc và phân trang dữ liệu theo năm
  const fetchProducts = (year, page, size) => {
    setLoading(true);
    setTimeout(() => {
      const filtered = mockData.filter((item) => item.soldDate.startsWith(`${year}`));
      const paginated = filtered.slice((page - 1) * size, page * size);
      setProducts(paginated);
      setPagination({
        current: page,
        pageSize: size,
        total: filtered.length,
      });
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    fetchProducts(year, 1, pagination.pageSize);
  }, [year]);

  return (
    <div style={{ padding: 24 }}>
      <h2>🛒 Danh sách sản phẩm đã bán</h2>

      <div style={{ marginBottom: 16 }}>
        <span style={{ marginRight: 8 }}>Chọn năm:</span>
        <Select
          defaultValue={year}
          style={{ width: 120 }}
          onChange={(value) => {
            setYear(value);
            setPagination((prev) => ({ ...prev, current: 1 }));
          }}
        >
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
            onChange: (page) => fetchProducts(year, page, pagination.pageSize),
          }}
          columns={[
            { title: "Tên sản phẩm", dataIndex: "name" },
            { title: "Giá", dataIndex: "price" },
            { title: "Ngày bán", dataIndex: "soldDate" },
          ]}
        />
      </Spin>
    </div>
  );
};

export default SoldProducts;
