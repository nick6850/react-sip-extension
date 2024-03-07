import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../../contexts/StoreContext";

const CallDetails = observer(() => {
  const { callStore } = useContext(StoreContext);
  const [callDuration, setCallDuration] = useState(null);

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
      setCallDuration(0);
    };
  }, [callStore.callStatus]);

  return (
    callStore.callStatus === "В процессе" && (
      <div>
        <div>{callStore.contactNumber}</div>
        <div>{callDuration}</div>
      </div>
    )
  );
});

export default CallDetails;
