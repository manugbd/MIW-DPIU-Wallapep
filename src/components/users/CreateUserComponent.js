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
  Select,
  Space,
  Typography,
  message,
} from "antd";
import {
  DOCUMENT_FORMATS,
  DOCUMENT_TYPES,
  formatDocumentNumber,
} from "@/utils/UtilsUser";
import {
  validateRegistrationBirthday,
  validateRegistrationDocument,
} from "@/utils/UtilsUserRegistrationValidation";
import { registerUser } from "@/services/usersService";
import { isDateInFuture } from "@/utils/UtilsValidations";

const CreateUserComponent = () => {
  const router = useRouter();

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const documentType = Form.useWatch("documentIdentity", form);

  const clickCreate = async (values) => {
    setSubmitting(true);
    setServerError("");

    try {
      await registerUser(values);
      messageApi.success("Account created. You can now sign in.");
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
      {contextHolder}

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
            level={2}
            style={{
              margin: 0,
            }}
          >
            Create account
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
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Document type"
                          name="documentIdentity"
                        >
                          <Select
                            allowClear
                            options={DOCUMENT_TYPES}
                            placeholder="Choose a document type"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Document number"
                          name="documentNumber"
                          dependencies={["documentIdentity"]}
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
                          <Input
                            allowClear
                            maxLength={50}
                            autoComplete="off"
                            placeholder={
                              DOCUMENT_FORMATS[documentType]?.placeholder ||
                              "Document number"
                            }
                            onChange={(event) => {
                              const type =
                                form.getFieldValue("documentIdentity");
                              form.setFieldValue(
                                "documentNumber",
                                formatDocumentNumber(type, event.target.value),
                              );
                            }}
                          />
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
                      extra="Day/month/year, for example 1/1/2020. Type a date or choose it from the calendar."
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
