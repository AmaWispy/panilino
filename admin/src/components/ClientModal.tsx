import React from "react";
import { Form, Input, Modal, DatePicker } from "antd";
import { useTranslation } from "react-i18next";

interface ClientModalProps {
  modalProps: any;
  formProps: any;
}

export const ClientModal: React.FC<ClientModalProps> = ({ modalProps, formProps }) => {
  const { t } = useTranslation();

  const onFinish = async (values: any) => {
    const formatted = {
      ...values,
      date_of_birth: values.date_of_birth?.format?.("YYYY-MM-DD") ?? values.date_of_birth,
      wedding_date: values.wedding_date?.format?.("YYYY-MM-DD") ?? values.wedding_date,
    };
    return formProps.onFinish?.(formatted);
  };

  return (
    <Modal {...modalProps} title={t("orders.fields.add_new_client")} width={500}>
      <Form {...formProps} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={t("clients.fields.name")}
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t("clients.fields.surname")}
          name="surname"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t("clients.fields.phone")}
          name="phone"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t("clients.fields.email")}
          name="email"
          rules={[{ type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={t("clients.fields.date_of_birth")} name="date_of_birth">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label={t("clients.fields.wedding_date")} name="wedding_date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label={t("clients.fields.children_birthdays")} name="children_birthdays">
          <Input />
        </Form.Item>
        <Form.Item label={t("clients.fields.profession")} name="profession">
          <Input />
        </Form.Item>
        <Form.Item label={t("clients.fields.notes")} name="notes">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
