import React, { useState } from "react";
import SoldProducts from "./pages/SoldProducts";
import ImportInvoices from "./pages/ImportInvoices";
import "antd/dist/reset.css";
import { Button } from "antd";

function App() {
  const [page, setPage] = useState("sold");

  return (
    <div>
      <div style={{ padding: 16 }}>
        <Button
          onClick={() => setPage("sold")}
          type={page === "sold" ? "primary" : "default"}
          style={{ marginRight: 8 }}
        >
          🛒 Sản phẩm đã bán
        </Button>
        <Button
          onClick={() => setPage("import")}
          type={page === "import" ? "primary" : "default"}
        >
          📥 Nhập chứng từ
        </Button>
      </div>

      {page === "sold" ? <SoldProducts /> : <ImportInvoices />}
    </div>
  );
}

export default App;
