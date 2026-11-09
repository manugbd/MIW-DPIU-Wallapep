import Link from "next/link";
import { useRouter } from "next/router";
import { Breadcrumb } from "antd";

const LABELS = {
  products: "Products",
  createProduct: "Create product",
  myProducts: "My products",
  myTransactions: "My transactions",
  register: "Create account",
  login: "Sign in",
  detailProduct: "Product details",
  editProduct: "Edit product",
  user: "User profile",
};

export default function SiteBreadcrumbs() {
  const { pathname } = useRouter();

  if (pathname === "/") return null;
  
  const section = pathname.split("/")[1];
  const items = [
    {
      title: <Link href="/">Home</Link>,
    },
  ];

  if (["detailProduct", "editProduct"].includes(section))
    items.push({
      title: (
        <Link href={section === "editProduct" ? "/myProducts" : "/products"}>
          {section === "editProduct" ? "My products" : "Products"}
        </Link>
      ),
    });

  items.push({ title: LABELS[section] || section });

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        marginBottom: 20,
      }}
    >
      <Breadcrumb items={items} />
    </nav>
  );
}
