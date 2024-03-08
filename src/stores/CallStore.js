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
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  setCallSession(call, number, direction = "outgoing") {
    this.currentCall = call;
    this.contactNumber = number;
    this.direction = direction === "incoming" ? "Входящий" : "Исходящий";

    if (direction === "incoming") {
      this.setCallStatus("Входящий звонок");
    } else {
      this.setCallStatus("Вызов");
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
    if (this.callStatus === "Не удалось") {
      return "00:00";
    }

    let hours = Math.floor(durationInSeconds / 3600);
    let minutes = Math.floor((durationInSeconds % 3600) / 60);
    let seconds = durationInSeconds % 60;

    // Padding numbers to two digits
    const pad = (num) => (num < 10 ? `0${num}` : num);

    let formattedTime = `${pad(minutes)}:${pad(seconds)}`;

    if (hours > 0) {
      formattedTime = `${pad(hours)}:${formattedTime}`;
    }

    return formattedTime;
  }

  addToCallHistory(finishReason) {
    this.setCallStatus(finishReason);
    const duration = this.calculateDuration(this.callStartTime, new Date());

    let callDetails = {
      key: this.currentCall.id,
      type: this.direction,
      phoneNumber: this.contactNumber || "Неизвестный номер",
      date: this.formatDate(this.callStartTime || new Date()),
      duration,
      result: finishReason,
    };

    this.callHistory = [callDetails, ...this.callHistory];
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
