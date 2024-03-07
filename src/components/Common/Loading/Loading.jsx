import React from "react";
import { Spin } from "antd";

const Loading = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <Spin size="large" tip="Загрузка..." />
  </div>
);

export default Loading;
