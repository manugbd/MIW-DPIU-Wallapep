import { useRouter } from "next/router";
import { Skeleton } from "antd";
import EditProductFormComponent from "@/components/products/EditProductFormComponent";
export default function EditProductPage() {
  const router = useRouter();
  if (!router.isReady) return <Skeleton active />;
  return <EditProductFormComponent id={router.query.id} />;
}
