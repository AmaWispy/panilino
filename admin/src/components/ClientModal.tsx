import React from "react";
import { Form, Input, Modal } from "antd";

interface ClientModalProps {
  modalProps: any;
  formProps: any;
}

export const ClientModal: React.FC<ClientModalProps> = ({ modalProps, formProps }) => {
  return (
    <Modal {...modalProps} title="Create New Client" width={500}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="First Name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="surname"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ type: "email" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
