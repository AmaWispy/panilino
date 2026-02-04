import React from "react";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Show, TextField, EmailField, DateField } from "@refinedev/antd";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export const ClientShow: React.FC<IResourceComponentsProps> = () => {
  const { t } = useTranslation();
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{t("clients.fields.name")}</Title>
      <TextField value={record?.name} />
      <Title level={5}>{t("clients.fields.surname")}</Title>
      <TextField value={record?.surname} />
      <Title level={5}>{t("clients.fields.phone")}</Title>
      <TextField value={record?.phone} />
      <Title level={5}>{t("clients.fields.email")}</Title>
      <EmailField value={record?.email} />
      <Title level={5}>{t("clients.fields.date_of_birth")}</Title>
      <DateField value={record?.date_of_birth} />
      <Title level={5}>{t("clients.fields.wedding_date")}</Title>
      <DateField value={record?.wedding_date} />
      <Title level={5}>{t("clients.fields.children_birthdays")}</Title>
      <TextField value={record?.children_birthdays} />
      <Title level={5}>{t("clients.fields.profession")}</Title>
      <TextField value={record?.profession} />
      <Title level={5}>{t("clients.fields.notes")}</Title>
      <TextField value={record?.notes} />
    </Show>
  );
};
