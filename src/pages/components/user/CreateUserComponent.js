import { useState } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  AutoComplete,
  Button,
  Card,
  Col,
  Collapse,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
  message,
} from "antd";

import {
  COUNTRIES,
  DOCUMENT_FORMATS,
  DOCUMENT_TYPES,
  formatDocumentNumber,
} from "@/utils/UtilsUser";
import {
  validateRegistrationBirthday,
  validateRegistrationDocument,
  validateRegistrationPostalCode,
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
  const country = Form.useWatch("country", form);

  const clickCreate = async (values) => {
    setSubmitting(true);
    setServerError("");

    try {
      await registerUser(values);
      messageApi.success("Cuenta creada. Ya puedes iniciar sesión.");
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
    <Row justify="center" style={{ padding: "24px 0" }}>
      {contextHolder}
      <Col xs={24} sm={22} md={18} lg={14} xl={12}>
        <Card>
          <Space
            direction="vertical"
            size={4}
            style={{ width: "100%", marginBottom: 24 }}
          >
            <Typography.Title level={2} style={{ margin: 0 }}>
              Crear cuenta
            </Typography.Title>
          </Space>

          {serverError && (
            <Alert
              type="error"
              showIcon
              role="alert"
              message="No se pudo completar el registro"
              description={serverError}
              style={{ marginBottom: 20 }}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={clickCreate}
            onValuesChange={clearServerError}
            requiredMark="optional"
            scrollToFirstError
            initialValues={{ country: "España", documentIdentity: "DNI" }}
          >
            <Form.Item
              label="Correo electrónico"
              name="email"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Introduce tu correo electrónico.",
                },
                {
                  type: "email",
                  message:
                    "Introduce un correo válido, por ejemplo nombre@dominio.es.",
                },
                {
                  max: 50,
                  message: "El correo puede tener como máximo 50 caracteres.",
                },
              ]}
            >
              <Input
                type="email"
                autoComplete="email"
                maxLength={50}
                placeholder="nombre@dominio.es"
              />
            </Form.Item>

            <Form.Item
              label="Contraseña"
              name="password"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Introduce una contraseña.",
                },
                {
                  min: 4,
                  message: "La contraseña debe tener más de 3 caracteres.",
                },
                {
                  max: 50,
                  message:
                    "La contraseña puede tener como máximo 50 caracteres.",
                },
              ]}
              extra="Con logitud mayor a 4 caracteres."
            >
              <Input.Password
                autoComplete="new-password"
                maxLength={50}
                placeholder="Al menos 4 caracteres"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Nombre"
                  name="name"
                  rules={[{ max: 50, message: "Máximo 50 caracteres." }]}
                >
                  <Input
                    autoComplete="given-name"
                    maxLength={50}
                    placeholder="Ej.: Ana"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Apellidos"
                  name="surname"
                  rules={[{ max: 50, message: "Máximo 50 caracteres." }]}
                >
                  <Input
                    autoComplete="family-name"
                    maxLength={50}
                    placeholder="Ej.: García López"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Collapse
              style={{ marginTop: 8 }}
              items={[
                {
                  key: "optional-details",
                  label: <strong>Datos adicionales</strong>,
                  children: (
                    <>
                      <Typography.Title level={5}>
                        Datos personales
                      </Typography.Title>
                      <Row gutter={16}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            label="Tipo de documento"
                            name="documentIdentity"
                          >
                            <Select
                              allowClear
                              options={DOCUMENT_TYPES}
                              placeholder="Selecciona un tipo"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            label="Número de documento"
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
                                "Número de documento"
                              }
                              onChange={(event) => {
                                const type =
                                  form.getFieldValue("documentIdentity");
                                form.setFieldValue(
                                  "documentNumber",
                                  formatDocumentNumber(
                                    type,
                                    event.target.value,
                                  ),
                                );
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item
                        label="Fecha de nacimiento"
                        name="birthday"
                        rules={[
                          {
                            validator: (_, value) =>
                              validateRegistrationBirthday(value),
                          },
                        ]}
                        extra="Formato día/mes/año, por ejemplo 1/1/2020. Escribela o elígela en el calendario."
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          format={["D/M/YYYY", "DD/MM/YYYY"]}
                          placeholder="DD/MM/AAAA"
                          disabledDate={isDateInFuture}
                          inputReadOnly={false}
                          allowClear
                        />
                      </Form.Item>

                      <Typography.Title level={5}>Direccion</Typography.Title>
                      <Form.Item label="País" name="country">
                        <AutoComplete
                          allowClear
                          options={COUNTRIES}
                          filterOption={(input, option) =>
                            option.label
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          placeholder="Escribe o elige un país"
                        />
                      </Form.Item>

                      <Form.Item
                        label="Dirección"
                        name="address"
                        rules={[{ max: 50, message: "Máximo 50 caracteres." }]}
                      >
                        <Input
                          allowClear
                          autoComplete="street-address"
                          maxLength={50}
                          placeholder="Ej.: Calle de la Alegría, 13"
                        />
                      </Form.Item>

                      <Form.Item
                        label="Código postal"
                        name="postalCode"
                        dependencies={["country"]}
                        rules={[
                          { max: 50, message: "Máximo 50 caracteres." },
                          {
                            validator: (_, value) =>
                              validateRegistrationPostalCode(country, value),
                          },
                        ]}
                      >
                        <Input
                          allowClear
                          autoComplete="postal-code"
                          maxLength={50}
                          placeholder={
                            country === "España"
                              ? "Ej.: 28013"
                              : "Código postal (opcional)"
                          }
                        />
                      </Form.Item>
                    </>
                  ),
                },
              ]}
            />

            <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={submitting}
              >
                Crear cuenta
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default CreateUserComponent;
