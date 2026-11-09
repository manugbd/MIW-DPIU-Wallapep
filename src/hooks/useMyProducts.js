import { useUndoableActions } from "@/components/UndoableActionsProvider";
import { useEffect, useMemo, useState } from "react";
import {
  getMyProducts,
  updateProduct,
  deleteProduct,
} from "@/services/productsService";

export const useMyProducts = () => {
  const { schedule, hiddenKeys } = useUndoableActions();
  const [products, setProducts] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [feedback, setFeedback] = useState(""),
    [text, setText] = useState(""),
    [category, setCategory] = useState(),
    [status, setStatus] = useState("all"),
    [editing, setEditing] = useState(null),
    [price, setPrice] = useState(null),
    [editingField, setEditingField] = useState("price"),
    [title, setTitle] = useState(""),
    [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    setError("");
    setFeedback("");

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
    if (
      editingField === "title" &&
      (title.trim().length < 5 || title.trim().length > 50)
    ) {
      setError("Use between 5 and 50 characters for the product title.");
      return;
    }
    if (
      editingField === "price" &&
      (price == null || !Number.isFinite(Number(price)) || Number(price) < 0)
    ) {
      setError("Enter a non-negative price.");
      return;
    }

    setSaving(true);
    setError("");
    setFeedback("");

    try {
      const changes =
        editingField === "title" ? { title: title.trim() } : { price };
      await updateProduct(product.id, {
        ...product,
        ...changes,
      });
      setProducts((current) =>
        current.map((p) =>
          p.id === product.id
            ? {
                ...p,
                ...changes,
              }
            : p,
        ),
      );
      setEditing(null);
      setFeedback(
        editingField === "title" ? "Product name updated." : "Price updated.",
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const removeMany = (ids) => {
    const requested = new Set(ids);

    const targets = filtered.filter(
      (product) =>
        requested.has(product.id) &&
        product.buyerId == null &&
        !hiddenKeys.has("product:" + product.id),
    );

    if (!targets.length) return;

    setError("");
    setFeedback("");
    setEditing(null);

    schedule({
      key: "delete-products:" + targets.map((product) => product.id).join(","),
      keys: targets.map((product) => "product:" + product.id),
      label:
        targets.length === 1
          ? targets[0].title
          : targets.length + " selected products",
      execute: async () => {
        const results = [];
        for (const product of targets) {
          try {
            await deleteProduct(product.id);
            results.push({ status: "fulfilled" });
          } catch (error) {
            results.push({ status: "rejected", reason: error });
          }
        }

        const deletedIds = new Set(
          targets
            .filter((_, index) => results[index].status === "fulfilled")
            .map((product) => product.id),
        );

        setProducts((current) =>
          current.filter((product) => !deletedIds.has(product.id)),
        );
        
        return {
          errorMessage: results.find((result) => result.status === "rejected")
            ?.reason?.message,
          failedKeys: targets
            .filter((_, index) => results[index].status === "rejected")
            .map((product) => "product:" + product.id),
        };
      },
    });
  };

  const remove = (id) => removeMany([id]);

  const visibleProducts = products.filter(
    (product) => !hiddenKeys.has("product:" + product.id),
  );

  return {
    products: visibleProducts,
    loading,
    error,
    feedback,
    clearFeedback: () => setFeedback(""),
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
    editingField,
    setEditingField,
    title,
    setTitle,
    saving,
    load,
    filtered: filtered.filter(
      (product) => !hiddenKeys.has("product:" + product.id),
    ),
    save,
    remove,
    removeMany,
  };
};
