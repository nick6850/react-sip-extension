import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Table, Tag } from "antd";
import { StoreContext } from "../../contexts/StoreContext";
import styles from "./CallHistory.module.scss";

const CallHistory = observer(() => {
  const { callStore } = useContext(StoreContext);

  const columns = [
    {
      title: "Информация",
      key: "info",
      render: (record) => (
        <>
          <div>
            <strong>Тип:</strong> {record.type}
          </div>
          <div>
            <strong>Номер:</strong> {record.phoneNumber}
          </div>
          <div>
            <strong>Дата:</strong> {record.date}
          </div>
        </>
      ),
    },
    {
      title: "Детали",
      key: "details",
      render: (record) => (
        <>
          <div>
            <strong>Длительность:</strong> {record.duration}
          </div>
          <div>
            <strong>Результат:</strong>{" "}
            <Tag
              color={record.result === "Не получилось" ? "volcano" : "green"}
            >
              {record.result}
            </Tag>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className={styles.callHistoryTable}>
      <h2>История звонков</h2>
      <Table
        columns={columns}
        dataSource={callStore.callHistory}
        pagination={{ pageSize: 3, showSizeChanger: false }}
      />
    </div>
  );
});

export default CallHistory;
