import { useState } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
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

const countries = [
  "Alemania",
  "Argentina",
  "Australia",
  "Austria",
  "Bélgica",
  "Bolivia",
  "Brasil",
  "Canadá",
  "Chile",
  "China",
  "Colombia",
  "Corea del Sur",
  "Costa Rica",
  "Cuba",
  "Dinamarca",
  "Ecuador",
  "Egipto",
  "El Salvador",
  "España",
  "Estados Unidos",
  "Filipinas",
  "Finlandia",
  "Francia",
  "Grecia",
  "Guatemala",
  "Honduras",
  "India",
  "Irlanda",
  "Islandia",
  "Italia",
  "Japón",
  "Marruecos",
  "México",
  "Noruega",
  "Nueva Zelanda",
  "Países Bajos",
  "Panamá",
  "Paraguay",
  "Perú",
  "Polonia",
  "Portugal",
  "Reino Unido",
  "República Dominicana",
  "Rumanía",
  "Suecia",
  "Suiza",
  "Ucrania",
  "Uruguay",
  "Venezuela",
].map((country) => ({ value: country, label: country }));

const documentTypes = [
  { value: "DNI", label: "DNI" },
  { value: "NIE", label: "NIE" },
  { value: "Pasaporte", label: "Pasaporte" },
  { value: "Otro", label: "Otro" },
];

const nifLetters = "TRWAGMYFPDXBNJZSQVHLCKE";
const documentPattern = (type) => {
  if (type === "DNI") return /^\d{8}[A-Z]$/;
  if (type === "NIE") return /^[XYZ]\d{7}[A-Z]$/;
  if (type === "Pasaporte") return /^[A-Z0-9]{5,20}$/;
  return /^[A-Z0-9-]{3,50}$/;
};

const validateDocumentNumber = (type, value) => {
  if (!value) return Promise.resolve();
  const normalized = value.toUpperCase().replace(/\s/g, "");
  if (!documentPattern(type).test(normalized)) {
    const formats = {
      DNI: "Formato: 8 números y una letra, por ejemplo 12345678Z.",
      NIE: "Formato: X, Y o Z, 7 números y una letra, por ejemplo X1234567L.",
      Pasaporte: "Introduce entre 5 y 20 letras o números.",
      Otro: "Introduce entre 3 y 50 letras, números o guiones.",
    };
    return Promise.reject(new Error(formats[type] || formats.Otro));
  }

  if (
    type === "DNI" &&
    nifLetters[Number(normalized.slice(0, 8)) % 23] !== normalized[8]
  ) {
    return Promise.reject(
      new Error("La letra del DNI no corresponde con el número introducido."),
    );
  }

  if (type === "NIE") {
    const number = `${{ X: 0, Y: 1, Z: 2 }[normalized[0]]}${normalized.slice(1, 8)}`;
    if (nifLetters[Number(number) % 23] !== normalized[8]) {
      return Promise.reject(
        new Error("La letra del NIE no corresponde con el número introducido."),
      );
    }
  }
  return Promise.resolve();
};

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

    const formData = {
      email: values.email.trim(),
      password: values.password,
      name: values.name?.trim() || null,
      surname: values.surname?.trim() || null,
      birthday: values.birthday
        ? values.birthday.startOf("day").valueOf()
        : null,
      documentIdentity: values.documentIdentity || null,
      documentNumber: values.documentNumber?.trim().toUpperCase() || null,
      country: values.country || null,
      address: values.address?.trim() || null,
      postalCode: values.postalCode?.trim() || null,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const responseBody = await response.json();

      if (!response.ok) {
        const errors = Array.isArray(responseBody.errors)
          ? responseBody.errors
          : [];
        const duplicateEmail = errors.some((error) =>
          error.msg?.toLowerCase().includes("email already in use"),
        );
        const fieldErrors = errors.filter((error) => error.field);
        const genericErrors = errors.filter((error) => !error.field);

        if (duplicateEmail) {
          form.setFields([
            { name: "email", errors: ["Este correo ya está registrado."] },
          ]);
        }
        if (fieldErrors.length) {
          form.setFields(
            fieldErrors.map((error) => ({
              name: error.field,
              errors: [
                error.msg?.toLowerCase().includes("email already in use")
                  ? "Este correo ya está registrado."
                  : error.msg || "Revisa este dato.",
              ],
            })),
          );
        }
        setServerError(
          (duplicateEmail
            ? ""
            : genericErrors
                .map((error) => error.msg)
                .filter(Boolean)
                .join(" ")) ||
            (fieldErrors.length
              ? "Hay datos que necesitan tu atención. Revisa los campos señalados."
              : duplicateEmail
                ? "Revisa el correo electrónico e inténtalo de nuevo."
                : "No se pudo crear la cuenta. Comprueba los datos e inténtalo de nuevo."),
        );
        return;
      }

      messageApi.success("Cuenta creada. Ya puedes iniciar sesión.");
      form.resetFields();
      await router.push("/login");
    } catch {
      setServerError(
        "No se pudo conectar con el servidor. Comprueba que está iniciado e inténtalo de nuevo.",
      );
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
              extra="Obligatoria. Debe tener entre 4 y 50 caracteres."
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
                              options={documentTypes}
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
                                  validateDocumentNumber(documentType, value),
                              },
                            ]}
                          >
                            <Input
                              allowClear
                              maxLength={50}
                              autoComplete="off"
                              placeholder={
                                documentType === "DNI"
                                  ? "Ej.: 12345678Z"
                                  : documentType === "NIE"
                                    ? "Ej.: X1234567L"
                                    : "Número de documento"
                              }
                              onChange={(event) => {
                                const type =
                                  form.getFieldValue("documentIdentity");
                                const value = event.target.value
                                  .toUpperCase()
                                  .replace(/\s/g, "");
                                if (type === "DNI") {
                                  form.setFieldValue(
                                    "documentNumber",
                                    value.replace(/[^0-9A-Z]/g, "").slice(0, 9),
                                  );
                                } else if (type === "NIE") {
                                  form.setFieldValue(
                                    "documentNumber",
                                    value
                                      .replace(/[^0-9XYZA-Z]/g, "")
                                      .slice(0, 9),
                                  );
                                } else {
                                  form.setFieldValue(
                                    "documentNumber",
                                    value.slice(0, 50),
                                  );
                                }
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
                              value && value.isAfter(dayjs(), "day")
                                ? Promise.reject(
                                    new Error(
                                      "La fecha no puede ser posterior a hoy.",
                                    ),
                                  )
                                : Promise.resolve(),
                          },
                        ]}
                        extra="Formato día/mes/año. Puedes escribirla, por ejemplo 1/1/2020, o elegirla en el calendario."
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          format={["D/M/YYYY", "DD/MM/YYYY"]}
                          placeholder="DD/MM/AAAA"
                          disabledDate={(date) => date.isAfter(dayjs(), "day")}
                          inputReadOnly={false}
                          allowClear
                        />
                      </Form.Item>

                      <Typography.Title level={5}>Direccion</Typography.Title>
                      <Form.Item label="País" name="country">
                        <AutoComplete
                          allowClear
                          options={countries}
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
                              value &&
                              country === "España" &&
                              !/^\d{5}$/.test(value)
                                ? Promise.reject(
                                    new Error(
                                      "En España, el código postal tiene 5 números.",
                                    ),
                                  )
                                : Promise.resolve(),
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
