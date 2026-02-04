import React from "react";
import { useTranslation } from "react-i18next";
import { Layout, Menu, Dropdown, Button, Space } from "antd";
import { GlobalOutlined, DownOutlined } from "@ant-design/icons";

export const Header: React.FC = () => {
  const { i18n } = useTranslation();

  const menu = (
    <Menu
      selectedKeys={[i18n.language]}
      onClick={({ key }) => i18n.changeLanguage(key)}
      items={[
        {
          key: "en",
          label: "English",
          icon: <span role="img" aria-label="en">🇺🇸</span>,
        },
        {
          key: "ro",
          label: "Română",
          icon: <span role="img" aria-label="ro">🇲🇩</span>,
        },
      ]}
    />
  );

  return (
    <Layout.Header
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 24px",
        background: "#fff",
        height: "64px",
      }}
    >
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button type="text" onClick={(e) => e.preventDefault()}>
          <Space>
            <GlobalOutlined />
            {i18n.language === "en" ? "English" : "Română"}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </Layout.Header>
  );
};
