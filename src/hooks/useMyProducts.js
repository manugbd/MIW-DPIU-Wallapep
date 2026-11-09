import { useEffect, useMemo, useState } from "react";
import {
  getMyProducts,
  updateProduct,
  deleteProduct,
} from "@/services/productsService";

export const useMyProducts = () => {

  const [products, setProducts] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [text, setText] = useState(""),
    [category, setCategory] = useState(),
    [status, setStatus] = useState("all"),
    [editing, setEditing] = useState(null),
    [price, setPrice] = useState(null),
    [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    setError("");

    getMyProducts()
      .then((data) =>
        setProducts(data.sort((a, b) => Number(b.date) - Number(a.date))),
      )
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (!text ||
            `${p.title} ${p.description || ""}`
              .toLowerCase()
              .includes(text.toLowerCase())) &&
          (!category || p.category === category) &&
          (status === "all" ||
            (status === "sold" ? p.buyerId != null : p.buyerId == null)),
      ),
    [products, text, category, status],
  );

  const save = async (product) => {
    if (price == null || !Number.isFinite(Number(price)) || Number(price) < 0) {
      setError("Enter a non-negative price.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await updateProduct(product.id, {
        ...product,
        price,
      });
      setProducts((current) =>
        current.map((p) =>
          p.id === product.id
            ? {
                ...p,
                price,
              }
            : p,
        ),
      );
      setEditing(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    setError("");
    try {
      await deleteProduct(id);
      setProducts((current) => current.filter((p) => p.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };
  
  return {
    products,
    loading,
    error,
    text,
    setText,
    category,
    setCategory,
    status,
    setStatus,
    editing,
    setEditing,
    price,
    setPrice,
    saving,
    load,
    filtered,
    save,
    remove,
  };
};
