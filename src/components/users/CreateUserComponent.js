import DocumentNumberInput from "@/components/forms/DocumentNumberInput";
import { UserAddOutlined } from "@ant-design/icons";
import { BIRTHDAY_INPUT_FORMATS } from "@/utils/UtilsDates";
import AddressFields from "@/components/forms/AddressFields";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  Button,
  Card,
  Col,
  Collapse,
  DatePicker,
  Form,
  Input,
  Row,
  Radio,
  Space,
  Typography,
} from "antd";
import { DOCUMENT_TYPES, getDniCheckLetter } from "@/utils/UtilsUser";
import {
  validateRegistrationBirthday,
  validateRegistrationDocument,
} from "@/utils/UtilsUserRegistrationValidation";
import { registerUser } from "@/services/usersService";
import { isDateInFuture } from "@/utils/UtilsValidations";

const CreateUserComponent = ({ openNotification }) => {
  const router = useRouter();

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const documentType = Form.useWatch("documentIdentity", form);
  const documentNumber = Form.useWatch("documentNumber", form) || "";
  const dniLetter = getDniCheckLetter(documentNumber.slice(0, 8));

  const clickCreate = async (values) => {
    setSubmitting(true);
    setServerError("");

    try {
      await registerUser(values);
      openNotification?.(
        "top",
        "Account created. You can now sign in.",
        "success",
      );
      form.resetFields();
      await router.push("/login");
    } catch (error) {
      const fieldErrors = error.fieldErrors || {};

      form.setFields(
        Object.entries(fieldErrors).map(([name, errors]) => ({
          name,
          errors: [errors],
        })),
      );

      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const clearServerError = () => {
    if (serverError) setServerError("");
  };

  return (
    <div className="form-page">
      <Card>
        <Space
          direction="vertical"
          size={4}
          style={{
            width: "100%",
            marginBottom: 24,
          }}
        >
          <Typography.Title
            level={1}
            style={{
              margin: 0,
            }}
          >
            <UserAddOutlined /> Create account
          </Typography.Title>
        </Space>

        {serverError && (
          <Alert
            type="error"
            showIcon
            role="alert"
            message="Registration could not be completed"
            description={serverError}
            style={{
              marginBottom: 20,
            }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={clickCreate}
          onValuesChange={clearServerError}
          requiredMark="optional"
          scrollToFirstError
          initialValues={{
            country: "Spain",
            documentIdentity: "DNI",
          }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Enter your email address.",
              },
              {
                type: "email",
                message:
                  "Enter a valid email address, for example name@example.com.",
              },
              {
                max: 50,
                message: "Your email address must be 50 characters or fewer.",
              },
            ]}
          >
            <Input
              allowClear
              type="email"
              autoComplete="email"
              maxLength={50}
              placeholder="name@example.com"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Enter a password.",
              },
              {
                min: 4,
                message: "Use at least 4 characters.",
              },
              {
                max: 50,
                message: "Your password must be 50 characters or fewer.",
              },
            ]}
            extra="At least 4 characters."
          >
            <Input.Password
              autoComplete="new-password"
              maxLength={50}
              placeholder="At least 4 characters"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="First name"
                name="name"
                rules={[
                  {
                    max: 50,
                    message: "Maximum 50 characters.",
                  },
                ]}
              >
                <Input
                  allowClear
                  autoComplete="given-name"
                  maxLength={50}
                  placeholder="e.g. Anna"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Last name"
                name="surname"
                rules={[
                  {
                    max: 50,
                    message: "Maximum 50 characters.",
                  },
                ]}
              >
                <Input
                  allowClear
                  autoComplete="family-name"
                  maxLength={50}
                  placeholder="e.g. Smith"
                />
              </Form.Item>
            </Col>
          </Row>

          <Collapse
            style={{
              marginTop: 8,
            }}
            items={[
              {
                key: "optional-details",
                label: <strong>Additional details</strong>,
                children: (
                  <>
                    <Typography.Title level={5}>
                      Personal details
                    </Typography.Title>
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          label="Document type"
                          name="documentIdentity"
                        >
                          <Radio.Group
                            className="document-options"
                            optionType="button"
                            options={[
                              ...DOCUMENT_TYPES,
                              { value: "", label: "Not provided" },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          label="Document number"
                          name="documentNumber"
                          dependencies={["documentIdentity"]}
                          hasFeedback={documentType === "DNI"}
                          extra={
                            documentType === "DNI" ? (
                              <span role="status" aria-live="polite">
                                {dniLetter
                                  ? "Check letter " +
                                    dniLetter +
                                    " calculated automatically."
                                  : "Enter 8 digits. The check letter is calculated automatically and cannot be edited."}
                              </span>
                            ) : undefined
                          }
                          rules={[
                            {
                              validator: (_, value) =>
                                validateRegistrationDocument(
                                  documentType,
                                  value,
                                ),
                            },
                          ]}
                        >
                          <DocumentNumberInput documentType={documentType} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      label="Date of birth"
                      name="birthday"
                      rules={[
                        {
                          validator: (_, value) =>
                            validateRegistrationBirthday(value),
                        },
                      ]}
                      extra="DD/MM/YYYY. Type a date or use the calendar."
                    >
                      <DatePicker
                        style={{
                          width: "100%",
                        }}
                        format={BIRTHDAY_INPUT_FORMATS}
                        placeholder="DD/MM/YYYY"
                        disabledDate={isDateInFuture}
                        inputReadOnly={false}
                        allowClear
                      />
                    </Form.Item>

                    <Typography.Title level={5}>Address</Typography.Title>
                    <AddressFields form={form} />
                  </>
                ),
              },
            ]}
          />

          <Form.Item
            style={{
              marginTop: 24,
              marginBottom: 0,
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={submitting}
            >
              Create account
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default CreateUserComponent;
