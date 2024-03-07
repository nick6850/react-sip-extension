import { makeAutoObservable } from "mobx";
import { initializeSIP } from "../utils/SIPService";

class UserStore {
  isRegistered = false;
  isSIPConnecting = false;

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
    let serverAddress = server.startsWith("wss://")
      ? server
      : `wss://${server.trim()}`;

    let uri = `sip:${user.trim()}@${server.trim()}`;

    if (port) {
      serverAddress += `:${port}`;
      uri += `:${port}`;
    }

    // Update user details and save them to local storage
    this.userDetails = { name, serverAddress, uri, user, password };
    localStorage.setItem("userDetails", JSON.stringify(this.userDetails));

    // Establish the SIP connection with the updated user details
    this.establishSIPConnection();
  }

  logOut() {
    // Clear user details from localStorage
    localStorage.removeItem("userDetails");

    // Reset store states
    this.isRegistered = false;
    this.userDetails = {
      name: "",
      serverAddress: "",
      uri: "",
      user: "",
      password: "",
    };
  }

  establishSIPConnection() {
    // Initialize SIP connection using stored URI and server address
    this.isSIPConnecting = true;

    initializeSIP(
      this.userDetails.uri,
      this.userDetails.serverAddress,
      this.userDetails.user,
      this.userDetails.password,
      () => {
        console.log("SIP registration succeeded");
        this.isRegistered = true;
        this.isSIPConnecting = false;
      },
      () => {
        console.log("SIP registration failed");
        this.isSIPConnecting = false;
      }
    );
  }
}

export default new UserStore();
