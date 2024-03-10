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
  onConnectionFailed,
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
  ua.start();

  ua.on("connected", () => {
    console.log("Connected to the WebSocket server");
  });

  ua.on("disconnected", () => {
    onConnectionFailed();
    ua.stop();
  });

  ua.on("registered", onRegistered);

  ua.on("registrationFailed", onRegistrationFailed);

  ua.on("newRTCSession", (data) => {
    const { session } = data;
    const number = session.remote_identity.uri.user;

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
      }, 1500);
    });
    session.on("failed", () => {
      callStore.addToCallHistory("Не удалось");
      setTimeout(() => {
        callStore.setCallStatus("");
      }, 1500);
    });
  });
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
