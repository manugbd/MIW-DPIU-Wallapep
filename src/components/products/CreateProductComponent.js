import PriceInput from "@/components/forms/PriceInput";
import { getProductImageUrl } from "@/utils/UtilsProductDisplay";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  InboxOutlined,
  PlusCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Image,
  Result,
  Row,
  Select,
  Typography,
  Upload,
} from "antd";
import {
  DEFAULT_PRODUCT_CATEGORY,
  PRODUCT_CATEGORY_OPTIONS,
} from "@/models/ProductCategories";
import {
  PRODUCT_FORM_RULES,
  getProductImageError,
} from "@/utils/UtilsProductValidation";
import {
  createProduct,
  updateProduct,
  getProduct,
  uploadProductImage,
} from "@/services/productsService";

const CreateProductComponent = ({ id }) => {
  const editing = id != null;
  const [loading, setLoading] = useState(editing);
  const [editable, setEditable] = useState(!editing);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fileList, setFileList] = useState([]);
  const [imageError, setImageError] = useState("");
  const [createdProductId, setCreatedProductId] = useState(null);
  const [imageUploadError, setImageUploadError] = useState("");
  const [retryingImage, setRetryingImage] = useState(false);
  const selectedImage = fileList[0]?.originFileObj || fileList[0];

  useEffect(() => {
    if (!editing) return;

    let active = true;

    setLoading(true);

    getProduct(id)
      .then((product) => {
        if (active) {
          form.setFieldsValue({
            ...product,
            price: Number(product.price),
          });
          setEditable(product.buyerId == null);
          if (product.buyerId != null)
            setServerError("Sold products cannot be edited.");
        }
      })
      .catch((error) => {
        if (active) setServerError(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, editing, form]);

  const beforeImageUpload = (file) => {
    const error = getProductImageError(file);
    setImageError(error || "");
    return error ? Upload.LIST_IGNORE : false;
  };

  const changeImage = ({ fileList: nextFiles }) => {
    setFileList(nextFiles.slice(-1));
    setImageError("");
  };

  const submitProduct = async (values) => {
    if (submitting) return;
    setSubmitting(true);
    setServerError("");
    try {
      const { productId } = editing
        ? await updateProduct(id, values)
        : await createProduct(values);
      if (selectedImage) {
        try {
          await uploadProductImage(productId, selectedImage);
        } catch (error) {
          setImageUploadError(error.message);
        }
      }
      setCreatedProductId(productId);
    } catch (error) {
      form.setFields(error.fieldErrors || []);
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const retryImageUpload = async () => {
    setRetryingImage(true);
    try {
      await uploadProductImage(createdProductId, selectedImage);
      setImageUploadError("");
    } catch (error) {
      setImageUploadError(error.message);
    } finally {
      setRetryingImage(false);
    }
  };

  const startAnotherProduct = () => {
    form.resetFields();
    setFileList([]);
    setImageError("");
    setImageUploadError("");
    setServerError("");
    setCreatedProductId(null);
  };

  const clearServerError = () => setServerError("");

  return (
    <div className="form-page">
      <Card>
        {createdProductId !== null ? (
          <>
            <Result
              status="success"
              title={
                editing ? "Your product was updated" : "Your product is listed"
              }
              subTitle="You can find it in My products."
              extra={[
                <Link key="products" href="/myProducts">
                  <Button type="primary">View my products</Button>
                </Link>,
                <Button
                  key="another"
                  onClick={startAnotherProduct}
                  disabled={editing}
                >
                  List another product
                </Button>,
              ]}
            />
            {imageUploadError && (
              <Alert
                type="warning"
                showIcon
                role="alert"
                message="Your product was saved, but its image was not uploaded"
                description={imageUploadError}
                action={
                  <Button loading={retryingImage} onClick={retryImageUpload}>
                    Retry image upload
                  </Button>
                }
              />
            )}
          </>
        ) : (
          <>
            <Typography.Title
              level={2}
              style={{
                marginTop: 0,
              }}
            >
              {editing ? (
                <>
                  <EditOutlined /> Edit product
                </>
              ) : (
                <>
                  <PlusCircleOutlined /> Create product
                </>
              )}
            </Typography.Title>

            {serverError && (
              <Alert
                type="error"
                showIcon
                role="alert"
                message="Your product could not be listed"
                description={serverError}
                style={{
                  marginBottom: 24,
                }}
              />
            )}

            <Form
              form={form}
              layout="vertical"
              requiredMark={false}
              initialValues={{
                category: DEFAULT_PRODUCT_CATEGORY,
              }}
              onFinish={submitProduct}
              onValuesChange={clearServerError}
              scrollToFirstError
              disabled={submitting || loading || !editable}
            >
              <Form.Item
                label="Title"
                name="title"
                rules={PRODUCT_FORM_RULES.title}
              >
                <Input
                  maxLength={50}
                  showCount
                  placeholder="Nintendo Switch (Must be between 5 and 50 characters)"
                />
              </Form.Item>
              <Form.Item
                label="Category"
                name="category"
                rules={PRODUCT_FORM_RULES.category}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  options={PRODUCT_CATEGORY_OPTIONS}
                  placeholder="Search or choose a category"
                  notFoundContent="No matching categories"
                />
              </Form.Item>
              <Form.Item
                label="Price"
                name="price"
                rules={PRODUCT_FORM_RULES.price}
              >
                <PriceInput
                  placeholder="25.00"
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
              <Form.Item label="Description (optional)" name="description">
                <Input.TextArea
                  autoSize={{
                    minRows: 2,
                    maxRows: 12,
                  }}
                  placeholder="Used for six months, in good condition. Includes the dock and original charger."
                />
              </Form.Item>

              {editing && (
                <div
                  style={{
                    marginBottom: 16,
                  }}
                >
                  <p>Current photo</p>
                  <Image
                    width={160}
                    src={getProductImageUrl(id)}
                    fallback="/imageMockup.png"
                    alt="Current product photo"
                  />
                  <p>Upload a photo below to replace it.</p>
                </div>
              )}
              <Form.Item
                label="Photo (optional)"
                validateStatus={imageError ? "error" : undefined}
                help={
                  imageError ||
                  "One JPG, PNG or WebP image, up to 5 MB. You can remove or replace it before publishing."
                }
              >
                <Upload.Dragger
                  name="image"
                  accept="image/jpeg,image/png,image/webp"
                  maxCount={1}
                  multiple={false}
                  listType="picture"
                  fileList={fileList}
                  beforeUpload={beforeImageUpload}
                  onChange={changeImage}
                  disabled={submitting || loading || !editable}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Drop a photo here or click to choose
                  </p>
                  <p className="ant-upload-hint">
                    Your photo will be uploaded when you publish.
                  </p>
                </Upload.Dragger>
              </Form.Item>
              <Form.Item
                style={{
                  marginTop: 32,
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
                  {editing
                    ? "Save changes"
                    : submitting
                      ? "Publishing…"
                      : "Publish product"}
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Card>
    </div>
  );
};

export default CreateProductComponent;
