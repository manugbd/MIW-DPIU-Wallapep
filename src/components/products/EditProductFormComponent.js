import { Alert } from "antd";
import ProductEditor from "./CreateProductComponent";

export default function EditProductFormComponent({ id }) {

  if (!Number.isSafeInteger(Number(id)) || Number(id) <= 0)
    return (
      <Alert type="error" showIcon message="This product could not be found." />
    );
    
  return <ProductEditor id={id} />;
}
