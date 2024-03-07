import React from "react";
import { observer } from "mobx-react-lite";
import { Modal, Button } from "antd";
import { PhoneOutlined, CloseCircleOutlined } from "@ant-design/icons";
import useIncomingCall from "../../hooks/useIncomingCall";

const IncomingCall = observer(() => {
  const { handleAnswer, handleRefuse, audioRef, callStore } = useIncomingCall();

  return (
    <>
      <Modal
        title="Входящий звонок"
        open={
          callStore.direction === "Входящий" &&
          callStore.callStatus === "Входящий звонок"
        }
        onOk={handleAnswer}
        onCancel={handleRefuse}
        okText={
          <>
            <PhoneOutlined /> Принять
          </>
        }
        cancelText={
          <>
            <CloseCircleOutlined /> Сбросить
          </>
        }
        okButtonProps={{ type: "primary" }}
        cancelButtonProps={{ type: "danger" }}
        style={{ maxWidth: 300 }}
      >
        <p
          style={{ fontSize: "1.5em", margin: 0 }}
        >{`Звонок от ${callStore.contactNumber}`}</p>{" "}
      </Modal>
      <audio ref={audioRef} loop>
        <source src="assets/ringtone.mp3" type="audio/mp3" />
      </audio>
    </>
  );
});

export default IncomingCall;
