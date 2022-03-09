import {
  UserOutlined,
  PieChartOutlined,
  DesktopOutlined,
  TeamOutlined,
  FileOutlined,
  WalletOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Breadcrumb } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
// import UnlockButton from "../UnlockButton";
import { useRouter } from "next/router";
import UserBlock from "../components/UserBlock";
import cookie from "cookie";

const { SubMenu } = Menu;

const MainLayout: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  const [isSiderCollapsed, setIsSiderCollapsed] = useState(false);
  const [selectedMenuKeys, setSelectedMenuKeys] = useState(["1"]);
  const [logged, setLogged] = useState(true);

  // const { signIn, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (routes.filter((route) => route.pathname === router.pathname)) {
      setSelectedMenuKeys([
        routes.filter((route) => route.pathname === router.pathname)[0]?.key,
      ]);
    }
  }, [router]);

  const routes = [
    { key: "1", pathname: "/", title: "" },
    { key: "2", pathname: "/bot", title: "Bot" },
    { key: "3", pathname: "/list-user", title: "Danh sách tài khoản" },
    {
      key: "4",
      pathname: "/list-buy-ico",
      title: "Danh sách tài khoản mua ICO",
    },
    { key: "5", pathname: "/leader-board", title: "Bảng xếp hạng Leader" },
  ];

  const { signOut } = useAuth();

  useEffect(() => {
    let cookieObj = cookie.parse(window.document.cookie);
    if (!cookieObj?.token) {
      signOut();
    }
  }, []);

  return (
    <Layout>
      <>
        <Sider
          // collapsible
          // collapsed={isSiderCollapsed}
          // onCollapse={() => setIsSiderCollapsed(!isSiderCollapsed)}
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            // console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            // console.log(collapsed, type);
          }}
          style={{
            height: "100vh",
            position: "fixed",
            left: 0,
            zIndex: 3,
          }}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            selectedKeys={selectedMenuKeys}
            mode="inline"
          >
            <Menu.Item key="1" icon={<WalletOutlined />}>
              <Link href="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>
              <Link href="/user">User</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<UserOutlined />}>
              <Link href="/character">Character</Link>
            </Menu.Item>

            {/* <SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9" icon={<FileOutlined />}>
              Files
            </Menu.Item> */}
          </Menu>
          {/* <div
              className="absolute bottom-0 block w-full md:hidden"
              onClick={signOut}
            >
              <p className="py-6 text-lg font-semibold text-center text-gray-50">
                Đăng xuất
              </p>
            </div> */}
        </Sider>
        <Layout className="site-layout ml-0 lg:ml-[200px] min-h-screen">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            <div className="flex items-center justify-start h-full">
              {/* <p className="mx-6 text-xl font-medium">
              {
                routes.filter((route) => route.pathname === router.pathname)[0]
                  ?.title
              }
            </p> */}
              {/* <Menu mode="horizontal">
              <Menu.Item key="mmm">
                <UserBlock
                  login={signIn}
                  logout={signOut}
                  account={"account"}
                />
              </Menu.Item>
            </Menu> */}
              {/* <UserBlock
                  login={signIn}
                  logout={signOut}
                  account={"account"}
                /> */}
            </div>
          </Header>
          <Content
            className="px-1 py-0 md:px-4"
            style={{ overflow: "initial" }}
          >
            {/* <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb> */}
            <div
            // className="site-layout-background"
            // style={{ padding: 24, minHeight: 360 }}
            >
              {children}
            </div>
          </Content>
          {/* <Footer style={{ textAlign: "center" }}>©2021</Footer> */}
        </Layout>
      </>
    </Layout>
  );
};

export default MainLayout;
