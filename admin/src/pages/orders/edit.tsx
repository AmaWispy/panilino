import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { IResourceComponentsProps, useNotification } from "@refinedev/core";
import { Edit, useForm, useSelect, useModalForm } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, InputNumber, Button, Divider, Checkbox, Row, Col, Image, Card } from "antd";
import { PlusOutlined, MinusCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { EVENT_TYPES, CAKE_SHAPES, CAKE_LEVELS, FILLINGS, FRUIT_ADDONS, DECOR_ADDONS, ORDER_STATUSES, getStorageUrl } from "../../constants";
import { ClientModal } from "../../components/ClientModal";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const OrderEdit: React.FC<IResourceComponentsProps> = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { open } = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [refComment, setRefComment] = useState("");
  const [uploading, setUploading] = useState(false);
  const { formProps, saveButtonProps, queryResult, form } = useForm({
    action: "edit",
  });
  const record = queryResult?.data?.data;
  const references = (record?.references ?? []) as { path: string; comment?: string }[];

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

  const { selectProps: clientSelectProps } = useSelect({
    resource: "clients",
    optionLabel: (item) => `${item.name} ${item.surname}`,
    optionValue: "id",
  });

  const {
    modalProps: clientModalProps,
    formProps: clientFormProps,
    show: showClientModal,
  } = useModalForm({
    resource: "clients",
    action: "create",
    redirect: false,
    onMutationSuccess: (data) => {
      form.setFieldsValue({ client_id: data.data.id });
    }
  });

  const handleUploadReference = async (fileFromInput?: File) => {
    const file = fileFromInput ?? fileInputRef.current?.files?.[0];
    if (!file || !id) {
      open?.({ type: "error", message: t("orders.fields.add_reference"), description: "Select a photo" });
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("comment", refComment);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/orders/${id}/references`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Upload failed");
      }
      setRefComment("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      queryResult?.refetch();
      open?.({ type: "success", message: t("orders.fields.upload_reference") });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Upload failed";
      open?.({ type: "error", message: t("orders.fields.upload_reference"), description: msg });
    } finally {
      setUploading(false);
    }
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUploadReference(file);
    e.target.value = "";
  };

  const handleDeleteReference = async (index: number) => {
    if (!id) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/orders/${id}/references/${index}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Delete failed");
      queryResult?.refetch();
      open?.({ type: "success", message: t("orders.fields.delete_reference") });
    } catch (e) {
      open?.({ type: "error", message: "Error", description: "Delete failed" });
    }
  };

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
      <Edit saveButtonProps={saveButtonProps}>
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
              <Form.Item label={t("orders.fields.status")} name="status">
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
              <Form.Item label={t("orders.fields.delivery_price")} name="delivery_price">
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
              <Form.Item label={t("orders.fields.stand_levels")} name="stand_layers">
                <Select options={[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => ({ label: String(n), value: n }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t("orders.fields.stand_fee")} name="stand_fee">
                <InputNumber disabled style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">{t("orders.fields.references")}</Divider>
          <Row gutter={16}>
            <Col span={24}>
              {references.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                  {references.map((ref, index) => (
                    <Card key={index} size="small" style={{ width: 160 }}>
                      <Image
                        src={getStorageUrl(ref.path)}
                        alt=""
                        width={140}
                        height={140}
                        style={{ objectFit: "cover" }}
                        fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Crect fill='%23f0f0f0' width='140' height='140'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3EError%3C/text%3E%3C/svg%3E"
                      />
                      <div style={{ marginTop: 8, fontSize: 12 }}>{ref.comment || "—"}</div>
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteReference(index)}
                        style={{ marginTop: 4 }}
                      >
                        {t("orders.fields.delete_reference")}
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
                  style={{ display: "none" }}
                  onChange={onFileSelected}
                />
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => fileInputRef.current?.click()}
                  loading={uploading}
                  disabled={uploading}
                >
                  {t("orders.fields.add_reference")}
                </Button>
                <Input
                  placeholder={t("orders.fields.references_comment")}
                  value={refComment}
                  onChange={(e) => setRefComment(e.target.value)}
                  style={{ width: 200 }}
                  onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                />
                <Button type="primary" loading={uploading} onClick={() => handleUploadReference()} disabled={uploading}>
                  {t("orders.fields.upload_reference")}
                </Button>
              </div>
            </Col>
          </Row>

          <Divider />
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label={t("orders.fields.advance_sum")} name="advance_sum" getValueProps={(v) => ({ value: v ?? 0 })}>
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t("orders.fields.deposit_sum")} name="deposit_sum" getValueProps={(v) => ({ value: v ?? 0 })}>
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
      </Edit>

      <ClientModal modalProps={clientModalProps} formProps={clientFormProps} />
    </>
  );
};
