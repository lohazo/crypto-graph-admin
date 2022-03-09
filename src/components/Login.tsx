// @ts-nocheck
import { useAuth0 } from "@auth0/auth0-react";
import { Form, Input, Button, Checkbox, notification } from "antd";
// import { useLoginMutation } from "../generated/graphql";
// import { useAuth } from "../hooks/useAuth";
// import {
//   ProFormCaptcha,
//   ProFormCheckbox,
//   ProFormText,
//   LoginForm,
//   ModalForm
// } from "@ant-design/pro-form";

const Login = () => {
  // const [loginM, login] = useLoginMutation();
  // const { signIn } = useAuth();

  const { isLoading, isAuthenticated, error, user, loginWithRedirect, logout } =
    useAuth0();

  const onFinish = async (values: any) => {
    // try {
    //   const r = await login({
    //     username: values.username,
    //     password: values.password,
    //     capchaToken: "",
    //   });
    //   if (r.error) {
    //     notification.error({
    //       message: "Login Error",
    //       description: r.error.message,
    //     });
    //   } else {
    //     notification.success({
    //       message: "Login Success",
    //     });
    //     if (!r.data?.login?.token) {
    //       notification.warning({
    //         message: "Login 2FA",
    //       });
    //     } else {
    //       signIn(r.data?.login.token);
    //     }
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen login-bg"
      // style={{
      //   // background: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
      //   // background: "#282537",
      //   // backgroundImage:
      //   //   "radial-gradient(top, circle cover, #3c3b52 0%, #252233 80%)",
      //   background: "rgb(105,155,200)",
      //   background: "radial-gradient(ellipse at top left, rgba(105,155,200,1) 0%,rgba(181,197,216,1) 57%)",
      //   filter: "progid:DXImageTransform.Microsoft.gradient( startColorstr='#699bc8', endColorstr='#b5c5d8',GradientType=1 )"
      // }}
    >
      <a
        href={
          "https://" +
          process.env.NEXT_PUBLIC_DOMAIN +
          "/authorize?client_id=" +
          process.env.NEXT_PUBLIC_CLIENT_ID +
          `&response_type=token%20id_token&redirect_uri=${process.env.NEXT_PUBLIC_CALLBACK_URL}&scope=openid%20profile&nonce=mynonce`
        }
      >
        <div
          className="w-[150px] h-[150px] p-8 rounded-[50%] bg-[rgba(1,1,1,.8)] opacity-40 cursor-pointer flex justify-center items-center flex-col"
          style={{
            boxShadow: "10px 10px 30px #333",
          }}
          // onClick={loginWithRedirect}
        >
          <img src="/images/icons/login-w-icon.png" alt="login icon" />
          <p className="text-xs text-white">Login</p>
        </div>
      </a>

      {/* <LoginForm>
        <ProFormText
          name="username"
          fieldProps={{
            size: "large",
            // prefix: <UserOutlined className={styles.prefixIcon} />,
          }}
          placeholder="admin or user"
          rules={[
            {
              required: true,
              message: "required",
            },
          ]}
        />
      </LoginForm> */}
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        {/* <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item> */}

        {/* <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={false}>
            Login
          </Button>
        </Form.Item> */}
      </Form>
    </div>
  );
};

export default Login;
