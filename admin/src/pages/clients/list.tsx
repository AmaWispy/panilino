import React from "react";
import { IResourceComponentsProps, BaseRecord } from "@refinedev/core";
import {
  useTable,
  List,
  EditButton,
  ShowButton,
  DeleteButton,
} from "@refinedev/antd";
import { Table, Space, Input } from "antd";
import { useTranslation } from "react-i18next";

export const ClientList: React.FC<IResourceComponentsProps> = () => {
  const { t } = useTranslation();
  const { tableProps, searchFormProps } = useTable({
    syncWithLocation: true,
    onSearch: (values: any) => {
      return [
        {
          field: "q",
          operator: "contains",
          value: values.q,
        },
      ];
    },
  });

  return (
    <List>
      <div style={{ marginBottom: "16px" }}>
        <Input.Search
          placeholder={t("buttons.search") || "Search..."}
          onSearch={(value) => searchFormProps.onFinish({ q: value })}
          allowClear
        />
      </div>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column dataIndex="name" title={t("clients.fields.name")} />
        <Table.Column dataIndex="surname" title={t("clients.fields.surname")} />
        <Table.Column dataIndex="phone" title={t("clients.fields.phone")} />
        <Table.Column dataIndex="email" title={t("clients.fields.email")} />
        <Table.Column
          title={t("buttons.actions")}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
