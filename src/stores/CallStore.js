import { makeAutoObservable } from "mobx";

class CallStore {
  currentCall = null;
  callStatus = "";
  callHistory = [];
  direction = "";
  callStartTime = null;
  contactNumber = null;

  constructor() {
    makeAutoObservable(this);
    this.loadCallHistory();
  }

  formatDate(date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  setCallSession(call, number, direction = "outgoing") {
    this.currentCall = call;
    this.contactNumber = number;
    this.direction = direction;

    if (direction === "incoming") {
      this.setCallStatus("Входящий звонок");
    }
  }

  setCallStatus(status) {
    this.callStatus = status;
  }

  setCallStart() {
    this.callStartTime = new Date();
    this.setCallStatus("В процессе");
  }

  setCallEnd() {
    this.callStartTime = null;
    this.currentCall = null;
    this.direction = "";
  }

  calculateDuration(startTime, endTime) {
    const durationInSeconds = Math.floor((endTime - startTime) / 1000);
    if (durationInSeconds < 60) {
      return `${durationInSeconds} сек`;
    } else if (durationInSeconds < 3600) {
      return `${Math.floor(durationInSeconds / 60)} мин`;
    } else {
      return `${Math.floor(durationInSeconds / 3600)} ч ${Math.floor(
        (durationInSeconds % 3600) / 60
      )} мин`;
    }
  }

  addToCallHistory(finishReason) {
    if (!this.currentCall) return;
    this.callStatus = finishReason;
    const endTime = new Date();
    const duration = this.callStartTime
      ? Math.floor((endTime - this.callStartTime) / 1000)
      : 0;

    let callDetails = {
      type: this.direction,
      phoneNumber: this.contactNumber || "Неизвестный номер",
      startTime: this.formatDate(this.callStartTime || new Date()),
      duration,
      result: finishReason,
    };

    this.callHistory.unshift(callDetails);
    this.saveCallHistory();
    this.setCallEnd();
  }

  saveCallHistory() {
    localStorage.setItem("callHistory", JSON.stringify(this.callHistory));
  }

  loadCallHistory() {
    const storedHistory = localStorage.getItem("callHistory");
    if (storedHistory) {
      this.callHistory = JSON.parse(storedHistory);
    }
  }

  clearCallHistory() {
    this.callHistory = [];
    this.saveCallHistory();
  }
}

export default new CallStore();
