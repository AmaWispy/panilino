import React, { useEffect } from "react";
import { IResourceComponentsProps } from "@refinedev/core";
import { Create, useForm, useSelect, useModalForm } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, TimePicker, InputNumber, Button, Divider, Space, Checkbox, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { EVENT_TYPES, CAKE_SHAPES, CAKE_LEVELS, FILLINGS, FRUIT_ADDONS, DECOR_ADDONS, ORDER_STATUSES } from "../../constants";
import { ClientModal } from "../../components/ClientModal";
import dayjs from "dayjs";

export const OrderCreate: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps, form } = useForm();

  // Handle date formatting before submission
  const onFinish = async (values: any) => {
    const formattedValues = {
      ...values,
      event_date: values.event_date?.format ? values.event_date.format("YYYY-MM-DD") : values.event_date,
      production_end_time: values.production_end_time?.format ? values.production_end_time.format("YYYY-MM-DD HH:mm:ss") : values.production_end_time,
    };
    return formProps.onFinish?.(formattedValues);
  };

  const { selectProps: clientSelectProps, queryResult: clientQueryResult } = useSelect({
    resource: "clients",
    optionLabel: (item) => `${item.name} ${item.surname}`,
    optionValue: "id",
  });

  const {
    modalProps: clientModalProps,
    formProps: clientFormProps,
    show: showClientModal,
    onFinish: onClientFinish,
  } = useModalForm({
    resource: "clients",
    action: "create",
    redirect: false,
    onMutationSuccess: (data) => {
      // After client is created, select it in the order form
      form.setFieldsValue({ client_id: data.data.id });
    }
  });

  // Calculation Logic
  const values = Form.useWatch([], form);

  useEffect(() => {
    if (!values) return;

    const mass = Number(values.product_mass) || 0;
    const pricePerKg = Number(values.price_per_kg) || 0;
    const deliveryPrice = Number(values.delivery_price) || 0;
    const levels = Number(values.stand_layers) || 0;
    const fruits = values.add_ons_fruits || [];
    const decors = values.add_ons_decor || [];

    const standFee = levels * 100;
    const fruitsFee = fruits.length * 100;
    const decorFee = decors.length * 200;
    const basePrice = mass * pricePerKg;

    const total = basePrice + standFee + fruitsFee + decorFee + deliveryPrice;

    form.setFieldsValue({ 
      stand_fee: standFee,
      total_sum: total
    });
  }, [values, form]);

  return (
    <>
      <Create saveButtonProps={saveButtonProps}>
        <Form {...formProps} onFinish={onFinish} layout="vertical">
          <Row gutter={24}>
            <Col span={12}>
              <Divider orientation="left">Client Information</Divider>
              <Form.Item
                label="Client"
                name="client_id"
                rules={[{ required: true }]}
              >
                <Select
                  {...clientSelectProps}
                  popupRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: "8px 0" }} />
                      <Button
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={() => showClientModal()}
                        style={{ width: "100%", textAlign: "left" }}
                      >
                        Add New Client
                      </Button>
                    </>
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Divider orientation="left">Status</Divider>
              <Form.Item label="Status" name="status" initialValue="pending">
                <Select options={ORDER_STATUSES} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Event Details</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Event Type" name="event_type" rules={[{ required: true }]}>
                <Select options={EVENT_TYPES.map(t => ({ label: t, value: t }))} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Invited Count" name="invited_count">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Event Date"
                name="event_date"
                rules={[{ required: true }]}
                getValueProps={(value) => ({
                  value: value ? dayjs(value, "YYYY-MM-DD") : undefined,
                })}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Delivery Information</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Delivery Address" name="delivery_address" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Delivery Time" name="delivery_time" rules={[{ required: true }]}>
                <Input placeholder="e.g. 14:00" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Delivery Price" name="delivery_price" initialValue={0}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Production End Time"
            name="production_end_time"
            getValueProps={(value) => ({
              value: value ? dayjs(value, "YYYY-MM-DD HH:mm:ss") : undefined,
            })}
          >
             <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <Divider orientation="left">Cake Specifications</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Cake Shape" name="cake_shape" rules={[{ required: true }]}>
                <Select options={CAKE_SHAPES.map(s => ({ label: s, value: s }))} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Cake Levels" name="cake_levels" rules={[{ required: true }]}>
                <Select options={CAKE_LEVELS.map(l => ({ label: String(l), value: typeof l === 'string' ? 7 : l }))} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Filling" name="filling" rules={[{ required: true }]}>
                <Select options={FILLINGS.map(f => ({ label: f, value: f }))} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Product Mass (kg)" name="product_mass" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} step={0.1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Price per kg" name="price_per_kg" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Fruits Add-ons" name="add_ons_fruits">
                <Checkbox.Group options={FRUIT_ADDONS} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Decor Add-ons" name="add_ons_decor">
                <Checkbox.Group options={DECOR_ADDONS} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Description in box" name="description_in_box">
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Inscription" name="inscription">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Stand Information</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Stand Levels" name="stand_layers" initialValue={0}>
                <Select options={[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => ({ label: String(n), value: n }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Stand Fee" name="stand_fee">
                <InputNumber disabled style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          <Row justify="end">
            <Col>
              <Form.Item label="Total Sum (calculated)" name="total_sum">
                <InputNumber disabled size="large" style={{ width: "200px", fontWeight: "bold" }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Create>

      <ClientModal modalProps={clientModalProps} formProps={clientFormProps} />
    </>
  );
};
