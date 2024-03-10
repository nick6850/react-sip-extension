import React, { useContext, useEffect } from "react";
import { StoreContext } from "../../contexts/StoreContext";
import { Form, Input, Button, message } from "antd";

const RegistrationForm = () => {
  const { userStore } = useContext(StoreContext);

  useEffect(() => {
    message.config({
      top: 85,
      duration: 2,
      maxCount: 3,
    });

    if (userStore.connectionFailed) {
      message.error("Сервер по указанному адресу недоступен");
    }

    if (userStore.registrationFailed) {
      message.error("Неправильный логин или пароль");
    }
  }, [userStore.connectionFailed, userStore.registrationFailed]);

  const onFinish = (values) => {
    userStore.setUserDetails(values);
  };

  return (
    <Form
      name="registration"
      onFinish={onFinish}
      layout="vertical"
      initialValues={{
        name: "Владимир",
        server: "voip.uiscom.ru",
        user: "0337861",
        password: "dd8F9Cyge9",
      }}
    >
      <Form.Item
        label="Имя"
        name="name"
        rules={[{ required: true, message: "Пожалуйста, введите ваше имя!" }]}
        style={{ marginBottom: "4px" }}
      >
        <Input style={{ marginBottom: "8px" }} />
      </Form.Item>

      <Form.Item
        label="Сервер"
        name="server"
        rules={[{ required: true, message: "Пожалуйста, введите сервер!" }]}
        style={{ marginBottom: "4px" }}
      >
        <Input style={{ marginBottom: "8px" }} />
      </Form.Item>

      <Form.Item
        label="Порт"
        name="port"
        rules={[
          {
            pattern: /^[0-9]+$/,
            message: "Порт должен содержать только цифры",
          },
        ]}
        style={{ marginBottom: "4px" }}
      >
        <Input
          placeholder="Порт (опционально)"
          style={{ marginBottom: "8px" }}
        />
      </Form.Item>

      <Form.Item
        label="Логин"
        name="user"
        rules={[{ required: true, message: "Пожалуйста, введите логин!" }]}
        style={{ marginBottom: "0px" }}
      >
        <Input style={{ marginBottom: "8px" }} />
      </Form.Item>

      <Form.Item
        label="Пароль"
        name="password"
        rules={[{ required: true, message: "Пожалуйста, введите пароль!" }]}
        style={{ marginBottom: "4px" }}
      >
        <Input.Password style={{ marginBottom: "14px" }} />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: "100%",
            backgroundColor: "inherit",
            marginBottom: "14px",

            boxShadow: "none",
          }}
        >
          Зарегистрироваться
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegistrationForm;
