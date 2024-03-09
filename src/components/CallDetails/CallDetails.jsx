import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../../contexts/StoreContext";
import styles from "./CallDetails.module.scss";

const CallDetails = observer(() => {
  const { callStore } = useContext(StoreContext);

  const [callDuration, setCallDuration] = useState("00:00");

  useEffect(() => {
    let interval = null;
    if (callStore.callStatus === "В процессе") {
      interval = setInterval(() => {
        setCallDuration(
          callStore.calculateDuration(callStore.callStartTime, new Date())
        );
      }, 1000);
    }
    return () => {
      clearInterval(interval);

      setCallDuration("00:00");
    };
  }, [callStore.callStatus, callStore.callStartTime]);

  return (
    callStore.callStatus !== "" && (
      <div className={styles.callDetails}>
        <div className={styles.contactNumber}>{callStore.contactNumber}</div>
        {callStore.callStatus === "В процессе" && (
          <div className={styles.callDuration}>{callDuration}</div>
        )}
      </div>
    )
  );
});

export default CallDetails;
