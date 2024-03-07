import JsSIP from "jssip";

let ua;

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

  ua.start();
};
