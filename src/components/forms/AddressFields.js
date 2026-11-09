import { AutoComplete, Form, Input } from "antd";
import { COUNTRIES } from "@/utils/UtilsUser";
import { validateRegistrationPostalCode } from "@/utils/UtilsUserRegistrationValidation";

export default function AddressFields({ form, required = false }) {
  const country = Form.useWatch("country", form);
  const rules = [
    {
      required,
      whitespace: true,
      message: "Complete this field.",
    },
    {
      max: 50,
      message: "Maximum 50 characters.",
    },
  ];
  return (
    <>
      <Form.Item label="Country" name="country" rules={rules}>
        <AutoComplete
          allowClear
          options={COUNTRIES}
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
          placeholder="Type or choose a country"
        />
      </Form.Item>
      <Form.Item label="Address" name="address" rules={rules}>
        <Input allowClear autoComplete="street-address" maxLength={50} />
      </Form.Item>
      <Form.Item
        label="Postal code"
        name="postalCode"
        dependencies={["country"]}
        rules={[
          ...rules,
          {
            validator: (_, value) =>
              validateRegistrationPostalCode(country, value),
          },
        ]}
      >
        <Input allowClear autoComplete="postal-code" maxLength={50} />
      </Form.Item>
    </>
  );
}
