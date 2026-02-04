import React, { useEffect } from "react";
import { IResourceComponentsProps } from "@refinedev/core";
import { Create, useForm, useSelect, useModalForm } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, InputNumber, Button, Divider, Space, Checkbox, Row, Col } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { EVENT_TYPES, CAKE_SHAPES, CAKE_LEVELS, FILLINGS, FRUIT_ADDONS, DECOR_ADDONS, ORDER_STATUSES } from "../../constants";
import { ClientModal } from "../../components/ClientModal";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

export const OrderCreate: React.FC<IResourceComponentsProps> = () => {
  const { t } = useTranslation();
  const { formProps, saveButtonProps, form } = useForm();

  // Handle date formatting and additional_contacts before submission
  const onFinish = async (values: any) => {
    const contacts = (values.additional_contacts || [])
      .map((c: any) => ({ name: (c?.name ?? "").trim(), phone: (c?.phone ?? "").trim() }))
      .filter((c: { name: string; phone: string }) => c.name || c.phone);
    const formattedValues = {
      ...values,
      additional_contacts: contacts.length ? contacts : null,
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
    const cakeLevels = Number(values.cake_levels) || 0;

    let standFee = 0;
    if (levels === 1) standFee = 300;
    else if (levels === 2) standFee = 500;
    else if (levels >= 3) standFee = 800;

    const fruitsFee = fruits.length * 100;
    const decorFee = decors.length * 200;
    const cakeLevelsFee = cakeLevels * 100;
    const basePrice = mass * pricePerKg;

    const total = basePrice + standFee + fruitsFee + decorFee + cakeLevelsFee + deliveryPrice;

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
              <Divider orientation="left">{t("orders.fields.client_info")}</Divider>
              <Form.Item
                label={t("orders.fields.client")}
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
                        {t("orders.fields.add_new_client")}
                      </Button>
                    </>
                  )}
                />
              </Form.Item>
              <Form.Item label={t("orders.fields.additional_contacts")}>
                <Form.List name="additional_contacts" initialValue={[]}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Row key={key} gutter={8} align="middle" style={{ marginBottom: 8 }}>
                          <Col span={9}>
                            <Form.Item {...restField} name={[name, "name"]} noStyle>
                              <Input placeholder={t("clients.fields.name")} />
                            </Form.Item>
                          </Col>
                          <Col span={9}>
                            <Form.Item {...restField} name={[name, "phone"]} noStyle>
                              <Input placeholder={t("clients.fields.phone")} />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                          </Col>
                        </Row>
                      ))}
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        {t("orders.fields.add_contact")}
                      </Button>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Divider orientation="left">{t("orders.fields.status_info")}</Divider>
              <Form.Item label={t("orders.fields.status")} name="status" initialValue="inregistrata">
                <Select options={ORDER_STATUSES.map(s => ({ label: t(`options.statuses.${s.value}`), value: s.value }))} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">{t("orders.fields.event_details")}</Divider>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label={t("orders.fields.event_type")} name="event_type" rules={[{ required: true }]}>
                <Select options={EVENT_TYPES.map(t_val => ({ label: t(`options.event_types.${t_val}`), value: t_val }))} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={t("orders.fields.invited_count")} name="invited_count">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={t("orders.fields.event_date")}
                name="event_date"
                rules={[{ required: true }]}
                getValueProps={(value) => ({
                  value: value ? dayjs(value, "YYYY-MM-DD") : undefined,
                })}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={t("orders.fields.event_time")} name="event_time">
                <Input placeholder={t("orders.placeholders.delivery_time") || "ex. 14:00"} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">{t("orders.fields.delivery_info")}</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("orders.fields.delivery_address")} name="delivery_address" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={t("orders.fields.delivery_time")} name="delivery_time" rules={[{ required: true }]}>
                <Input placeholder={t("orders.placeholders.delivery_time") || "e.g. 14:00"} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={t("orders.fields.delivery_price")} name="delivery_price" initialValue={0}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label={t("orders.fields.production_end_time")}
            name="production_end_time"
            getValueProps={(value) => ({
              value: value ? dayjs(value, "YYYY-MM-DD HH:mm:ss") : undefined,
            })}
          >
             <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <Divider orientation="left">{t("orders.fields.cake_specs")}</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label={t("orders.fields.cake_shape")} name="cake_shape" rules={[{ required: true }]}>
                <Select options={CAKE_SHAPES.map(s => ({ label: t(`options.cake_shapes.${s}`), value: s }))} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("orders.fields.cake_levels")} name="cake_levels" rules={[{ required: true }]}>
                <Select options={CAKE_LEVELS.map(l => ({ label: String(l), value: typeof l === 'string' ? 7 : l }))} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("orders.fields.filling")} name="filling" rules={[{ required: true }]}>
                <Select options={FILLINGS.map(f => ({ label: t(`options.fillings.${f}`), value: f }))} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("orders.fields.product_mass")} name="product_mass" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} step={0.1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t("orders.fields.price_per_kg")} name="price_per_kg" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("orders.fields.fruits_addons")} name="add_ons_fruits">
                <Checkbox.Group options={FRUIT_ADDONS.map(f => ({ label: t(`options.fruit_addons.${f}`), value: f }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t("orders.fields.decor_addons")} name="add_ons_decor">
                <Checkbox.Group options={DECOR_ADDONS.map(d => ({ label: t(`options.decor_addons.${d}`), value: d }))} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("orders.fields.description_in_box")} name="description_in_box">
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t("orders.fields.inscription")} name="inscription">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">{t("orders.fields.stand_info")}</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("orders.fields.stand_levels")} name="stand_layers" initialValue={0}>
                <Select options={[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => ({ label: String(n), value: n }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t("orders.fields.stand_fee")} name="stand_fee">
                <InputNumber disabled style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label={t("orders.fields.advance_sum")} name="advance_sum" initialValue={0}>
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("orders.fields.deposit_sum")} name="deposit_sum" initialValue={0}>
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("orders.fields.total_sum_calculated")} name="total_sum">
                <InputNumber disabled size="large" style={{ width: "100%", fontWeight: "bold" }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Create>

      <ClientModal modalProps={clientModalProps} formProps={clientFormProps} />
    </>
  );
};
