import React from "react";
import { IResourceComponentsProps, BaseRecord } from "@refinedev/core";
import {
  useTable,
  List,
  EditButton,
  ShowButton,
  DeleteButton,
  DateField,
} from "@refinedev/antd";
import { Table, Space, Input, Tag } from "antd";

export const OrderList: React.FC<IResourceComponentsProps> = () => {
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
          placeholder="Search by client name or event type"
          onSearch={(value) => searchFormProps.onFinish({ q: value })}
          allowClear
          style={{ width: 300 }}
        />
      </div>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column
          dataIndex={["client", "name"]}
          title="Client"
          render={(value, record: any) => `${record.client?.name} ${record.client?.surname}`}
        />
        <Table.Column dataIndex="event_type" title="Event Type" />
        <Table.Column
          dataIndex="event_date"
          title="Event Date"
          render={(value) => <DateField value={value} format="YYYY-MM-DD" />}
        />
        <Table.Column
          dataIndex="total_sum"
          title="Total Sum"
          render={(value) => `${value} MDL`}
        />
        <Table.Column
          dataIndex="status"
          title="Status"
          render={(value) => (
            <Tag color={value === "cancelled" ? "red" : "blue"}>
              {value?.toUpperCase()}
            </Tag>
          )}
        />
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
