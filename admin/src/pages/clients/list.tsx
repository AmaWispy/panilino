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

export const ClientList: React.FC<IResourceComponentsProps> = () => {
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
          placeholder="Search by name, phone or email"
          onSearch={(value) => searchFormProps.onFinish({ q: value })}
          allowClear
        />
      </div>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column dataIndex="name" title="First Name" />
        <Table.Column dataIndex="surname" title="Last Name" />
        <Table.Column dataIndex="phone" title="Phone" />
        <Table.Column dataIndex="email" title="Email" />
        <Table.Column
          title="Actions"
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
