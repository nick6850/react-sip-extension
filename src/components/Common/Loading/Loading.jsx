import React from "react";
import { Spin } from "antd";

const Loading = () => (
  <div>
    <Spin size="large" tip="Загрузка..." />
    <span style={{ color: "white", marginLeft: "15px" }}>Загрузка</span>
  </div>
);

export default Loading;
