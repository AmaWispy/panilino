import React from "react";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Show } from "@refinedev/antd";
import { Typography, Row, Col, Button, Checkbox, Space } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { EVENT_TYPES, CAKE_SHAPES, CAKE_LEVELS, FILLINGS, FRUIT_ADDONS, DECOR_ADDONS, getStorageUrl } from "../../constants";
import dayjs from "dayjs";
import logoImg from "../../img/logo.png";

const { Title, Text } = Typography;

export const OrderShow: React.FC<IResourceComponentsProps> = () => {
  const { t } = useTranslation();
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <Show isLoading={isLoading} />;
  }

  return (
    <Show
      isLoading={isLoading}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Button
            icon={<PrinterOutlined />}
            onClick={handlePrint}
            type="default"
          >
            {t("buttons.print")}
          </Button>
        </>
      )}
    >
      <div className="print-container" style={{ 
        padding: '20px', 
        border: '2px solid #000', 
        maxWidth: '1000px', 
        margin: '0 auto', 
        backgroundColor: '#fff',
        fontFamily: 'serif'
      }}>
        <div style={{ position: 'relative', minHeight: 72, marginBottom: '20px', borderBottom: '2px solid #000', paddingBottom: '10px', display: 'flex', alignItems: 'center' }}>
          <img src={logoImg} alt="Panilino" style={{ position: 'absolute', left: 0, height: 56, width: 'auto', maxWidth: '25%', objectFit: 'contain' }} />
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
            <Title level={3} style={{ margin: 0, textTransform: 'uppercase' }}>CONTRACT-TIP № {record?.id}</Title>
            <Text style={{ display: 'block', marginTop: 4 }}>{t("orders.fields.event_date")}: {record?.event_date ? dayjs(record?.event_date).format("DD MMMM YYYY") : "__________"}</Text>
          </div>
        </div>

        <div style={{ borderBottom: '1px solid #000', paddingBottom: '10px', marginBottom: '10px' }}>
          <Row gutter={24}>
            <Col span={16}>
              <Text strong>{t("clients.fields.name")}, {t("clients.fields.surname")}: </Text>
              <Text underline>{record?.client?.name} {record?.client?.surname}</Text>
            </Col>
            <Col span={8}>
              <Text strong>{t("clients.fields.phone")}: </Text>
              <Text underline>{record?.client?.phone}</Text>
            </Col>
          </Row>
          <Row gutter={24} style={{ marginTop: '5px' }}>
            <Col span={24}>
              <Text strong>{t("clients.fields.email")}: </Text>
              <Text underline>{record?.client?.email}</Text>
            </Col>
          </Row>
          {record?.additional_contacts?.length > 0 && (
            <>
              <Row gutter={24} style={{ marginTop: '8px' }}>
                <Col span={24}>
                  <Text strong>{t("orders.fields.additional_contacts")}:</Text>
                </Col>
              </Row>
              {((record?.additional_contacts ?? []) as { name?: string; phone?: string }[]).map((c, i) => (
                <Row gutter={24} key={i} style={{ marginTop: '2px' }}>
                  <Col span={12}>
                    <Text underline>{c?.name}</Text>
                  </Col>
                  <Col span={12}>
                    <Text underline>{c?.phone}</Text>
                  </Col>
                </Row>
              ))}
            </>
          )}
        </div>

        {(record?.references?.length ?? 0) > 0 && (
          <div style={{ borderBottom: '1px solid #000', paddingBottom: '10px', marginBottom: '10px' }}>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>{t("orders.fields.references")}:</Text>
            <Row gutter={16}>
              {((record?.references ?? []) as { path?: string; comment?: string }[]).map((ref, i) => (
                <Col key={i} span={6}>
                  <div style={{ marginBottom: 8 }}>
                    <img
                      src={getStorageUrl(ref?.path ?? '')}
                      alt=""
                      style={{ width: '100%', maxWidth: 120, height: 120, objectFit: 'cover', border: '1px solid #ddd' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <Text type="secondary" style={{ display: 'block', marginTop: 4, fontSize: 12 }}>{ref?.comment || "—"}</Text>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}

        <div style={{ borderBottom: '1px solid #000', paddingBottom: '10px', marginBottom: '10px' }}>
          <Text strong style={{ display: 'block', marginBottom: '5px' }}>{t("orders.fields.event_type")}:</Text>
          <Row gutter={[8, 8]}>
            {EVENT_TYPES.map((type) => (
              <Col key={type} span={6}>
                <Checkbox checked={record?.event_type === type} disabled>
                  {t(`options.event_types.${type}`)}
                </Checkbox>
              </Col>
            ))}
          </Row>
        </div>

        <div style={{ borderBottom: '1px solid #000', paddingBottom: '10px', marginBottom: '10px' }}>
          <Row gutter={24}>
            <Col span={6}>
              <Text strong>{t("orders.fields.invited_count")}: </Text>
              <Text underline>{record?.invited_count || "____"}</Text>
            </Col>
            <Col span={6}>
              <Text strong>{t("orders.fields.event_date")}: </Text>
              <Text underline>{record?.event_date ? dayjs(record?.event_date).format("DD.MM.YYYY") : "________"}</Text>
            </Col>
            <Col span={6}>
              <Text strong>{t("orders.fields.event_time")}: </Text>
              <Text underline>{record?.event_time || "________"}</Text>
            </Col>
            <Col span={6}>
              <Text strong>{t("orders.fields.delivery_address")}: </Text>
              <Text underline>{record?.delivery_address || "____"}</Text>
            </Col>
          </Row>
          <Row gutter={24} style={{ marginTop: '5px' }}>
            <Col span={12}>
              <Text strong>{t("orders.fields.delivery_time")}: </Text>
              <Text underline>{record?.delivery_time || "________"}</Text>
            </Col>
            <Col span={12}>
              <Text strong>{t("orders.fields.production_end_time")}: </Text>
              <Text underline>{record?.production_end_time ? dayjs(record?.production_end_time).format("HH:mm") : "________"}</Text>
            </Col>
          </Row>
        </div>

        <div style={{ borderBottom: '1px solid #000', paddingBottom: '10px', marginBottom: '10px' }}>
          <Row gutter={24}>
            <Col span={24}>
              <Text strong>{t("orders.fields.cake_shape")}: </Text>
              <Space size="middle">
                {CAKE_SHAPES.map(shape => (
                  <Checkbox key={shape} checked={record?.cake_shape === shape} disabled>
                    {t(`options.cake_shapes.${shape}`)}
                  </Checkbox>
                ))}
              </Space>
            </Col>
          </Row>
          <Row gutter={24} style={{ marginTop: '10px' }}>
            <Col span={24}>
              <Text strong>{t("orders.fields.cake_levels")}: </Text>
              <Space size="middle">
                {CAKE_LEVELS.map(level => (
                  <Checkbox key={level} checked={record?.cake_levels === (typeof level === 'string' ? 7 : level)} disabled>
                    {level}
                  </Checkbox>
                ))}
              </Space>
            </Col>
          </Row>
          <Row gutter={24} style={{ marginTop: '10px' }}>
            <Col span={12}>
              <Text strong>{t("orders.fields.product_mass")}: </Text>
              <Text underline>{record?.product_mass || "________"}</Text>
            </Col>
            <Col span={12}>
              <Text strong>{t("orders.fields.price_per_kg")}: </Text>
              <Text underline>{record?.price_per_kg || "________"}</Text>
            </Col>
          </Row>
        </div>

        <div style={{ borderBottom: '1px solid #000', paddingBottom: '10px', marginBottom: '10px' }}>
          <Text strong style={{ display: 'block', marginBottom: '5px' }}>{t("orders.fields.filling")} ({t("orders.fields.mark_with_check") || "отметьте галочкой"}):</Text>
          <Row gutter={[8, 4]}>
            {FILLINGS.map(filling => (
              <Col key={filling} span={6}>
                <Checkbox checked={record?.filling === filling} disabled>
                  {t(`options.fillings.${filling}`)}
                </Checkbox>
              </Col>
            ))}
          </Row>
        </div>

        <div style={{ borderBottom: '1px solid #000', paddingBottom: '10px', marginBottom: '10px' }}>
          <Text strong style={{ display: 'block', marginBottom: '5px' }}>{t("orders.fields.fruits_addons")}:</Text>
          <Row gutter={[8, 8]}>
            {FRUIT_ADDONS.map(addon => (
              <Col key={addon} span={4}>
                <Checkbox checked={record?.add_ons_fruits?.includes(addon)} disabled>
                  {t(`options.fruit_addons.${addon}`)}
                </Checkbox>
              </Col>
            ))}
          </Row>
        </div>

        <div style={{ borderBottom: '1px solid #000', paddingBottom: '10px', marginBottom: '10px' }}>
          <Row gutter={24}>
            <Col span={12}>
              <Text strong style={{ display: 'block', marginBottom: '5px' }}>{t("orders.fields.decor_addons")}:</Text>
              <Space size="middle">
                {DECOR_ADDONS.map(addon => (
                  <Checkbox key={addon} checked={record?.add_ons_decor?.includes(addon)} disabled>
                    {t(`options.decor_addons.${addon}`)}
                  </Checkbox>
                ))}
              </Space>
            </Col>
            <Col span={12}>
              <Text strong>{t("orders.fields.inscription")}: </Text>
              <Text underline>{record?.inscription || "___________________________________________________"}</Text>
            </Col>
          </Row>
          <Row gutter={24} style={{ marginTop: '5px' }}>
            <Col span={24}>
              <Text strong>{t("orders.fields.description_in_box")}: </Text>
              <Text underline>{record?.description_in_box || "___________________________________________________"}</Text>
            </Col>
          </Row>
        </div>

        <div style={{ borderBottom: '1px solid #000', paddingBottom: '10px', marginBottom: '10px' }}>
          <Row gutter={24}>
            <Col span={6}>
              <Text strong>{t("orders.fields.stand_info")}: </Text>
              <Checkbox checked={record?.stand_layers > 0} disabled>{t("options.stand_types.Metal")}</Checkbox>
            </Col>
            <Col span={18}>
              <Text strong>{t("orders.fields.stand_levels")}: </Text>
              <Space size="small">
                {[1, 2, 3, 4, 5].map(level => (
                  <Checkbox key={level} checked={record?.stand_layers === level || (level === 5 && record?.stand_layers >= 5)} disabled>
                    {level} {level === 5 ? "+" : ""}
                  </Checkbox>
                ))}
              </Space>
            </Col>
          </Row>
          <Row gutter={24} style={{ marginTop: '5px' }}>
            <Col span={24}>
              <Text strong>{t("orders.fields.stand_fee")}: </Text>
              <Text underline>{record?.stand_fee || "0"} MDL</Text>
            </Col>
          </Row>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Text strong>{t("orders.fields.advance_sum")}: </Text>
            <Text underline>{record?.advance_sum ?? 0} MDL</Text>
          </div>
          <div>
            <Text strong>{t("orders.fields.deposit_sum")}: </Text>
            <Text underline>{record?.deposit_sum ?? 0} MDL</Text>
          </div>
          <div>
            <Title level={4} style={{ margin: 0 }}>{t("orders.fields.total_sum")}: {record?.total_sum} MDL</Title>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Make disabled checkboxes and labels black and clearly visible */
        .print-container .ant-checkbox-disabled + span {
          color: #000 !important;
          cursor: default;
        }
        .print-container .ant-checkbox-disabled .ant-checkbox-inner {
          background-color: #fff !important;
          border-color: #000 !important;
          cursor: default;
        }
        .print-container .ant-checkbox-disabled.ant-checkbox-checked .ant-checkbox-inner::after {
          border-color: #000 !important;
        }
        .print-container .ant-typography {
          color: #000 !important;
        }
        
        @media print {
          @page {
            margin: 5mm;
          }
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            padding: 0 !important;
          }
          .ant-btn, .ant-tag, .ant-layout-header, .ant-layout-sider {
            display: none !important;
          }
        }
      `}} />
    </Show>
  );
};
