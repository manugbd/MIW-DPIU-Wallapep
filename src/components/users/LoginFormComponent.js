import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Alert, Button, Card, Col, Form, Input, Row } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import { loginUser } from "@/services/usersService";

export default function LoginFormComponent({ setLogin, openNotification }) {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (values) => {
    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      await loginUser(values);
      setLogin(true);

      openNotification("top", "You are now signed in.", "success");

      await router.push("/products");
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <Card>
        <h1>
          <LoginOutlined /> Sign in
        </h1>

        {error && <Alert type="error" showIcon role="alert" message={error} />}

        <Form
          layout="vertical"
          onFinish={submit}
          disabled={submitting}
          requiredMark={false}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Enter your email.",
              },
              {
                type: "email",
                message: "Enter a valid email address.",
              },
            ]}
          >
            <Input
              allowClear
              autoComplete="username"
              type="email"
              maxLength={50}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Enter your password.",
              },
            ]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={submitting} block>
            Sign in
          </Button>

          <p>
            New to Wallapep? <Link href="/register">Create an account</Link>
          </p>
        </Form>
      </Card>
    </div>
  );
}
