import React, { useState, useContext } from "react";
import { StoreContext } from "../../contexts/StoreContext";
StoreContext;

const RegistrationForm = () => {
  const [name, setName] = useState("Владимир");
  const [server, setServer] = useState("voip.uiscom.ru");
  const [port, setPort] = useState("");
  const [user, setUser] = useState("0337861");
  const [password, setPassword] = useState("dd8F9Cyge9");
  const { userStore } = useContext(StoreContext);

  const handleRegister = (e) => {
    e.preventDefault();
    userStore.setUserDetails({ name, server, port, user, password });
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Имя"
        required={true}
      />
      <input
        type="text"
        value={server}
        onChange={(e) => setServer(e.target.value)}
        placeholder="Сервер"
        required={true}
      />
      <input
        type="text"
        value={port}
        onChange={(e) => setPort(e.target.value)}
        placeholder="Порт (опционально)"
      />
      <input
        type="text"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        placeholder="Логин"
        required={true}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
        required={true}
      />
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};

export default RegistrationForm;
