import { Refine } from "@refinedev/core";
import {
  ThemedLayoutV2,
  ErrorComponent,
  useNotificationProvider,
  RefineThemes,
} from "@refinedev/antd";
import { ConfigProvider, App as AntdApp } from "antd";
import routerBindings, {
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { TeamOutlined, ShoppingCartOutlined } from "@ant-design/icons";

import "@refinedev/antd/dist/reset.css";
import "./style.css";

import { ClientList } from "./pages/clients/list";
import { ClientCreate } from "./pages/clients/create";
import { ClientEdit } from "./pages/clients/edit";
import { ClientShow } from "./pages/clients/show";

import { OrderList } from "./pages/orders/list";
import { OrderCreate } from "./pages/orders/create";
import { OrderEdit } from "./pages/orders/edit";
import { OrderShow } from "./pages/orders/show";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Blue}>
        <AntdApp>
          <Refine
            dataProvider={dataProvider(API_URL)}
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
                  label: "Orders",
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
                  label: "Clients",
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              <Route
                element={
                  <ThemedLayoutV2
                    Title={({ collapsed }) => (
                      <div style={{ 
                        height: '64px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        padding: collapsed ? '0' : '0 24px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#1677ff',
                        background: '#fff',
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        {collapsed ? 'P' : 'PANILINO'}
                      </div>
                    )}
                  >
                    <Outlet />
                  </ThemedLayoutV2>
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
