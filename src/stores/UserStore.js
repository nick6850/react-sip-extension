import { makeAutoObservable } from "mobx";
import { initializeSIP } from "../utils/SIPService";

class UserStore {
  isRegistered = false;
  isSIPConnecting = false;
  connectionFailed = false;
  registrationFailed = false;

  userDetails = {
    name: "",
    serverAddress: "",
    uri: "",
    user: "",
    password: "",
  };

  constructor() {
    makeAutoObservable(this);
    this.loadUserDetails();
    // Automatically establish SIP connection if user details are in local storage
    if (this.userDetails.uri && this.userDetails.serverAddress) {
      this.establishSIPConnection();
    }
  }

  loadUserDetails() {
    // Load user details from local storage
    const storedDetails = localStorage.getItem("userDetails");
    if (storedDetails) {
      this.userDetails = JSON.parse(storedDetails);
    }
  }

  setUserDetails({ name, server, port, user, password }) {
    this.resetUserStore();

    let serverAddress = server.startsWith("wss://")
      ? server
      : `wss://${server.trim()}`;

    let uri = `sip:${user.trim()}@${server.trim()}`;

    // Port validation
    if (port) {
      const portNum = parseInt(port, 10);
      if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
        this.connectionFailed = true;
        return;
      }
      serverAddress += `:${port}`;
      uri += `:${port}`;
    }

    // Update user details
    this.userDetails = { name, serverAddress, uri, user, password };

    // Establish the SIP connection with the updated user details
    this.establishSIPConnection();
  }

  resetUserStore() {
    // Clear user details and call history from localStorage
    localStorage.removeItem("userDetails");
    localStorage.removeItem("callHistory");
    // Reset store states
    this.isRegistered = false;
    this.isSIPConnecting = false;
    this.connectionFailed = false;
    this.registrationFailed = false;
    this.userDetails = {
      name: "",
      serverAddress: "",
      uri: "",
      user: "",
      password: "",
    };
  }

  establishSIPConnection() {
    this.isSIPConnecting = true;
    this.registrationFailed = false;
    initializeSIP(
      this.userDetails.uri,
      this.userDetails.serverAddress,
      this.userDetails.user,
      this.userDetails.password,
      this.handleConnectionFailed.bind(this),
      this.handleRegistrationSuccess.bind(this),
      this.handleRegistrationFailed.bind(this)
    );
  }

  handleConnectionFailed() {
    console.log("SIP connection failed");
    this.isSIPConnecting = false;
    this.connectionFailed = true;
  }

  handleRegistrationFailed() {
    console.log("SIP registration failed");
    this.isSIPConnecting = false;
    this.registrationFailed = true;
  }

  handleRegistrationSuccess() {
    console.log("SIP registration succeeded");
    this.isRegistered = true;
    this.isSIPConnecting = false;

    localStorage.setItem("userDetails", JSON.stringify(this.userDetails));
  }
}

export default new UserStore();
