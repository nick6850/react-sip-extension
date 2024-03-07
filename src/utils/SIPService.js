import JsSIP from "jssip";
import callStore from "../stores/CallStore";
import { EventEmitter } from "events";

let ua;
const sipEventEmitter = new EventEmitter();

export const getSipEventEmitter = () => sipEventEmitter;

export const initializeSIP = (
  uri,
  serverAddress,
  user,
  password,
  onRegistered,
  onRegistrationFailed
) => {
  const socket = new JsSIP.WebSocketInterface(serverAddress);

  const configuration = {
    sockets: [socket],
    uri,
    password,
    display_name: user,
  };

  ua = new JsSIP.UA(configuration);

  ua.on("registered", onRegistered);
  ua.on("registrationFailed", onRegistrationFailed);

  ua.on("newRTCSession", (data) => {
    const { session } = data;
    const number = session.local_identity.uri.user;

    if (session.direction === "incoming") {
      callStore.setCallSession(session, number, "incoming");
    } else {
      callStore.setCallStatus("Звоним...");
    }

    session.on("confirmed", () => {
      callStore.setCallStart();
    });
    session.on("ended", () => {
      callStore.addToCallHistory("Завершился");
      setTimeout(() => {
        callStore.setCallStatus("");
      }, 3000);
    });
    session.on("failed", () => {
      callStore.addToCallHistory("Не получилось");
      setTimeout(() => {
        callStore.setCallStatus("");
      }, 3000);
    });
  });

  ua.start();
};

export const makeCall = (number) => {
  const domain = String(ua.configuration.uri).split("@")[1];
  const callUri = `sip:${number.trim()}@${domain}`;

  const options = {
    mediaConstraints: { audio: true, video: false },
  };

  const session = ua.call(callUri, options);

  session.connection.addEventListener("addstream", (event) => {
    sipEventEmitter.emit("addStream", event.stream);
  });

  callStore.setCallSession(session, number, "outgoing");
};

export const answerCall = (session) => {
  session.answer();

  session.connection.addEventListener("addstream", (event) => {
    sipEventEmitter.emit("addStream", event.stream);
  });
};

export const endCall = (session) => {
  session.terminate();
};
