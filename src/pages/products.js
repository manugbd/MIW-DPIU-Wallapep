import Head from "next/head";
import ListProductsComponent from "@/components/products/ListProductsComponent";

export default function ProductsPage() {
  return (
    <>
      <Head>
        <title>Products | Wallapep</title>
      </Head>
      <ListProductsComponent />
    </>
  );
}
