import { PAGE_WIDTH_BY_ROUTE } from "@/models/PageLayout";
import Head from "next/head";
import SiteBreadcrumbs from "@/components/SiteBreadcrumbs";
import "@/styles/globals.css";
import Link from "next/link";
import "antd/dist/reset.css";
import { Layout, Menu, Avatar, Typography, Col, Row, notification } from "antd";
import {
  HomeOutlined,
  ShopOutlined,
  PlusCircleOutlined,
  ShoppingOutlined,
  UserAddOutlined,
  LogoutOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import store from "../reducers/store";

const { Text } = Typography;

export default function App({ Component, pageProps }) {
  const [api, contextHolder] = notification.useNotification();

  const pathname = usePathname();
  let router = useRouter();
  let [login, setLogin] = useState(false);
  let [charUser, setCharUser] = useState("a");

  const [checkedPath, setCheckedPath] = useState(null);
  const guestOnly = ["/login", "/register"].includes(router.pathname);
  const publicPage = router.pathname === "/";
  const canRenderPage =
    publicPage ||
    (checkedPath === router.asPath && (guestOnly ? !login : login));

  useEffect(() => {
    if (!router.isReady) return;
    let cancelled = false;
    const controller = new AbortController();
    const checkSession = async () => {
      const apiKey = localStorage.getItem("apiKey");
      let active = false;
      if (apiKey) {
        try {
          const response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/users/isActiveApiKey",
            {
              headers: { apikey: apiKey },
              signal: controller.signal,
            },
          );
          active = response.ok && (await response.json()).activeApiKey === true;
        } catch {
          if (cancelled) return;
        }
      }

      if (cancelled) return;

      setLogin(active);
      setCharUser(active ? localStorage.getItem("email")?.charAt(0) : "");
      setCheckedPath(router.asPath);

      if (active && guestOnly) void router.replace("/products");
      else if (!active && !publicPage && !guestOnly)
        void router.replace("/login");
    };
    void checkSession();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [router.isReady, router.asPath, guestOnly, publicPage]);

  const disconnect = async (e) => {
    e.preventDefault();
    const apiKey = localStorage.getItem("apiKey");
    localStorage.removeItem("apiKey");
    localStorage.removeItem("email");
    setLogin(false);
    setCheckedPath(null);
    setCharUser("");
    void router.replace("/login");
    try {
      await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/users/disconnect",
        {
          method: "GET",
          headers: { apikey: apiKey },
        },
      );
    } catch {
      // Local logout must succeed even when the server is unavailable.
    }
  };
  let callBackOnFinishLogin = (loginUser) => {
    console.log("Cambiado " + loginUser.email);
  };

  let { Header, Content, Footer } = Layout;

  const openNotification = (placement, text, type) => {
    api[type]({
      message: "Notification",
      description: text,
      placement,
    });
  };

  return (
    <Provider store={store}>
      <Head>
        <title>Wallapep | Buy and sell</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout className="layout" style={{ minHeight: "100vh" }}>
        {contextHolder}
        <Header className="site-header">
          <Row>
            <Col xs={18} sm={19} md={20} lg={21} xl={22}>
              {!login && (
                <Menu
                  selectedKeys={[
                    {
                      "/": "menuHome",
                      "/products": "menuProducts",
                      "/createProduct": "menuCreateProduct",
                      "/myProducts": "menuMyProduct",
                      "/myTransactions": "menuMyTransactions",
                      "/login": "menuLogin",
                      "/register": "menuRegister",
                    }[pathname],
                  ]}
                  theme="dark"
                  mode="horizontal"
                  items={[
                    {
                      key: "logo",
                      label: (
                        <Link href="/" aria-label="Wallapep home">
                          <img
                            src="/logo.png"
                            alt="Wallapep"
                            width="40"
                            height="40"
                          />
                        </Link>
                      ),
                    },
                    {
                      key: "menuHome",
                      icon: <HomeOutlined />,
                      label: <Link href="/">Home</Link>,
                    },
                    {
                      key: "menuLogin",
                      icon: <LoginOutlined />,
                      label: <Link href="/login">Login</Link>,
                    },
                    {
                      key: "menuRegister",
                      icon: <UserAddOutlined />,
                      label: <Link href="/register">Register</Link>,
                    },
                  ]}
                ></Menu>
              )}
              {login && (
                <Menu
                  selectedKeys={[
                    {
                      "/": "menuHome",
                      "/products": "menuProducts",
                      "/createProduct": "menuCreateProduct",
                      "/myProducts": "menuMyProduct",
                      "/myTransactions": "menuMyTransactions",
                      "/login": "menuLogin",
                      "/register": "menuRegister",
                    }[pathname],
                  ]}
                  theme="dark"
                  mode="horizontal"
                  items={[
                    {
                      key: "logo",
                      label: (
                        <Link href="/" aria-label="Wallapep home">
                          <img
                            src="/logo.png"
                            alt="Wallapep"
                            width="40"
                            height="40"
                          />
                        </Link>
                      ),
                    },
                    {
                      key: "menuHome",
                      icon: <HomeOutlined />,
                      label: <Link href="/">Home</Link>,
                    },
                    {
                      key: "menuProducts",
                      icon: <ShoppingOutlined />,
                      label: <Link href="/products">Products</Link>,
                    },
                    {
                      key: "menuCreateProduct",
                      icon: <PlusCircleOutlined />,
                      label: <Link href="/createProduct">Sell</Link>,
                    },
                    {
                      key: "menuMyProduct",
                      icon: <ShopOutlined />,
                      label: <Link href="/myProducts">My Products</Link>,
                    },
                    {
                      key: "menuMyTransactions",
                      icon: <ShoppingOutlined />,
                      label: (
                        <Link href="/myTransactions">My transactions</Link>
                      ),
                    },
                    {
                      key: "menuDisonnect",
                      icon: <LogoutOutlined />,
                      label: (
                        <Link
                          href="#"
                          onClick={(e) => {
                            disconnect(e);
                          }}
                        >
                          Disconnect
                        </Link>
                      ),
                    },
                  ]}
                ></Menu>
              )}
            </Col>
            <Col
              xs={6}
              sm={5}
              md={4}
              lg={3}
              xl={2}
              style={{ display: "flex", flexDirection: "row-reverse" }}
            >
              {login ? (
                <Avatar
                  size="large"
                  style={{
                    backgroundColor: "var(--primary)",
                    verticalAlign: "middle",
                    marginTop: 12,
                  }}
                >
                  {charUser}
                </Avatar>
              ) : (
                <Link href="/login">
                  {" "}
                  <Text style={{ color: "var(--surface)" }}>Login</Text>
                </Link>
              )}
            </Col>
          </Row>
        </Header>
        <Content className="site-content">
          <div
            className={`page-shell page-shell--${PAGE_WIDTH_BY_ROUTE[router.pathname] || "wide"}`}
          >
            <SiteBreadcrumbs />
            {canRenderPage ? (
              <Component
                {...pageProps}
                isLoggedIn={login}
                setLogin={setLogin}
                openNotification={openNotification}
              />
            ) : (
              <p role="status">Checking session...</p>
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}> Wallapep </Footer>
      </Layout>
    </Provider>
  );
}
