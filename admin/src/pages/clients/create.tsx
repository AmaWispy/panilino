import React from "react";
import { IResourceComponentsProps } from "@refinedev/core";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker } from "antd";
import { useTranslation } from "react-i18next";

export const ClientCreate: React.FC<IResourceComponentsProps> = () => {
  const { t } = useTranslation();
  const { formProps, saveButtonProps } = useForm();

  const onFinish = async (values: any) => {
    const formatted = {
      ...values,
      date_of_birth: values.date_of_birth?.format?.("YYYY-MM-DD") ?? values.date_of_birth,
      wedding_date: values.wedding_date?.format?.("YYYY-MM-DD") ?? values.wedding_date,
    };
    return formProps.onFinish?.(formatted);
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
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
          <Input placeholder="e.g. 12.05.2010, 03.08.2015" />
        </Form.Item>
        <Form.Item label={t("clients.fields.profession")} name="profession">
          <Input />
        </Form.Item>
        <Form.Item label={t("clients.fields.notes")} name="notes">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Create>
  );
};
