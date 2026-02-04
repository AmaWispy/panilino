import { Refine, Authenticated, I18nProvider } from "@refinedev/core";
import {
  ThemedLayoutV2,
  ErrorComponent,
  useNotificationProvider,
  RefineThemes,
  AuthPage,
} from "@refinedev/antd";
import { ConfigProvider, App as AntdApp } from "antd";
import routerBindings, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { TeamOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import axios from "axios";
import { useTranslation } from "react-i18next";

import "@refinedev/antd/dist/reset.css";
import "./style.css";
import "./i18n";

import { authProvider } from "./authProvider";
import { Header } from "./components/Header";
import logoImg from "./img/logo.png";

import { ClientList } from "./pages/clients/list";
import { ClientCreate } from "./pages/clients/create";
import { ClientEdit } from "./pages/clients/edit";
import { ClientShow } from "./pages/clients/show";

import { OrderList } from "./pages/orders/list";
import { OrderCreate } from "./pages/orders/create";
import { OrderEdit } from "./pages/orders/edit";
import { OrderShow } from "./pages/orders/show";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (config.headers && token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

const App: React.FC = () => {
  const { t, i18n } = useTranslation();

  const i18nProvider: I18nProvider = {
    translate: (key: string, params: any) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Blue}>
        <AntdApp>
          <Refine
            dataProvider={dataProvider(API_URL, axiosInstance)}
            authProvider={authProvider}
            i18nProvider={i18nProvider}
            notificationProvider={useNotificationProvider}
            routerProvider={routerBindings}
            resources={[
              {
                name: "orders",
                list: "/orders",
                create: "/orders/create",
                edit: "/orders/edit/:id",
                show: "/orders/show/:id",
                meta: {
                  canDelete: true,
                  icon: <ShoppingCartOutlined />,
                  label: t("orders.orders"),
                },
              },
              {
                name: "clients",
                list: "/clients",
                create: "/clients/create",
                edit: "/clients/edit/:id",
                show: "/clients/show/:id",
                meta: {
                  canDelete: true,
                  icon: <TeamOutlined />,
                  label: t("clients.clients"),
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              title: "Panilino",
            }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-routes"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <ThemedLayoutV2
                      Header={() => <Header />}
                      Title={({ collapsed }) => (
                        <div style={{ 
                          height: '64px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: collapsed ? 'center' : 'flex-start',
                          padding: collapsed ? '4px' : '0 24px',
                          background: '#fff',
                          borderBottom: '1px solid #f0f0f0'
                        }}>
                          <img
                            src={logoImg}
                            alt="Panilino"
                            style={{
                              maxHeight: collapsed ? 48 : 56,
                              width: collapsed ? 48 : 'auto',
                              objectFit: 'contain',
                            }}
                          />
                        </div>
                      )}
                    >
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route index element={<NavigateToResource resource="orders" />} />
                <Route path="/orders">
                  <Route index element={<OrderList />} />
                  <Route path="create" element={<OrderCreate />} />
                  <Route path="edit/:id" element={<OrderEdit />} />
                  <Route path="show/:id" element={<OrderShow />} />
                </Route>
                <Route path="/clients">
                  <Route index element={<ClientList />} />
                  <Route path="create" element={<ClientCreate />} />
                  <Route path="edit/:id" element={<ClientEdit />} />
                  <Route path="show/:id" element={<ClientShow />} />
                </Route>
              </Route>
              
              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    <NavigateToResource resource="orders" />
                  </Authenticated>
                }
              >
                <Route
                  path="/login"
                  element={
                    <AuthPage
                      type="login"
                      registerLink={false}
                      forgotPasswordLink={false}
                      formProps={{
                        initialValues: {
                          email: "test@example.com",
                          password: "password",
                        },
                      }}
                    />
                  }
                />
              </Route>

              <Route
                element={
                  <Authenticated key="catch-all">
                    <ThemedLayoutV2>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
