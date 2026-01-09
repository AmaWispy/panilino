import React from "react";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Show, TextField, EmailField } from "@refinedev/antd";
import { Typography } from "antd";

const { Title } = Typography;

export const ClientShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>First Name</Title>
      <TextField value={record?.name} />
      <Title level={5}>Last Name</Title>
      <TextField value={record?.surname} />
      <Title level={5}>Phone</Title>
      <TextField value={record?.phone} />
      <Title level={5}>Email</Title>
      <EmailField value={record?.email} />
    </Show>
  );
};
