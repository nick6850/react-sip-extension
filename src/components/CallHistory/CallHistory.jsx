import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Table, Tag } from "antd";
import { StoreContext } from "../../contexts/StoreContext";

const CallHistory = observer(() => {
  const { callStore } = useContext(StoreContext);

  const columns = [
    {
      title: "Тип",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "Входящий" ? "blue" : "green"}>{type}</Tag>
      ),
    },
    {
      title: "Номер",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Длительность",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Результат",
      dataIndex: "result",
      key: "result",
      render: (result) => {
        let color = result === "Не получилось" ? "volcano" : "green";
        return <Tag color={color}>{result}</Tag>;
      },
    },
  ];

  return (
    <div>
      <h2>История звонков</h2>
      <Table columns={columns} dataSource={callStore.callHistory} />
    </div>
  );
});

export default CallHistory;
