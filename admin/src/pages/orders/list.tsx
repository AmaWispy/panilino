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
import { useTranslation } from "react-i18next";

export const OrderList: React.FC<IResourceComponentsProps> = () => {
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
          style={{ width: 300 }}
        />
      </div>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column
          dataIndex={["client", "name"]}
          title={t("orders.fields.client")}
          render={(value, record: any) => `${record.client?.name} ${record.client?.surname}`}
        />
        <Table.Column dataIndex="event_type" title={t("orders.fields.event_type")} />
        <Table.Column
          dataIndex="event_date"
          title={t("orders.fields.event_date")}
          render={(value) => <DateField value={value} format="YYYY-MM-DD" />}
        />
        <Table.Column
          dataIndex="total_sum"
          title={t("orders.fields.total_sum")}
          render={(value) => `${value} MDL`}
        />
        <Table.Column
          dataIndex="status"
          title={t("orders.fields.status")}
          render={(value) => (
            <Tag color={value === "cancelled" ? "red" : "blue"}>
              {t(`options.statuses.${value}`)}
            </Tag>
          )}
        />
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
