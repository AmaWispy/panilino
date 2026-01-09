import React from "react";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Show, TextField, DateField, TagField } from "@refinedev/antd";
import { Typography, Divider, Row, Col } from "antd";

const { Title, Text } = Typography;

export const OrderShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Row gutter={24}>
        <Col span={12}>
          <Title level={5}>Client</Title>
          <Text>{record?.client?.name} {record?.client?.surname}</Text>
          <Title level={5}>Status</Title>
          <TagField value={record?.status} />
        </Col>
        <Col span={12}>
          <Title level={5}>Total Sum</Title>
          <Text strong style={{ fontSize: '20px' }}>{record?.total_sum} MDL</Text>
        </Col>
      </Row>
      
      <Divider />
      <Row gutter={24}>
        <Col span={8}>
          <Title level={5}>Event Type</Title>
          <TextField value={record?.event_type} />
        </Col>
        <Col span={8}>
          <Title level={5}>Event Date</Title>
          <DateField value={record?.event_date} />
        </Col>
        <Col span={8}>
          <Title level={5}>Invited Count</Title>
          <TextField value={record?.invited_count} />
        </Col>
      </Row>

      <Divider />
      <Title level={5}>Delivery Address</Title>
      <TextField value={record?.delivery_address} />
      <Title level={5}>Delivery Time</Title>
      <TextField value={record?.delivery_time} />
      
      <Divider />
      <Row gutter={24}>
        <Col span={8}>
          <Title level={5}>Cake Shape</Title>
          <TextField value={record?.cake_shape} />
        </Col>
        <Col span={8}>
          <Title level={5}>Cake Levels</Title>
          <TextField value={record?.cake_levels} />
        </Col>
        <Col span={8}>
          <Title level={5}>Filling</Title>
          <TextField value={record?.filling} />
        </Col>
      </Row>

      <Divider />
      <Row gutter={24}>
        <Col span={12}>
          <Title level={5}>Description in box</Title>
          <TextField value={record?.description_in_box} />
        </Col>
        <Col span={12}>
          <Title level={5}>Inscription</Title>
          <TextField value={record?.inscription} />
        </Col>
      </Row>
    </Show>
  );
};
