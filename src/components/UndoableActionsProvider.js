import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Button, notification } from "antd";
import { UndoOutlined } from "@ant-design/icons";

const UndoableActionsContext = createContext(null);
const UNDO_SECONDS = 8;

export function UndoableActionsProvider({ children }) {
  const [api, contextHolder] = notification.useNotification({
    placement: "bottomRight",
  });
  const [hiddenKeys, setHiddenKeys] = useState(() => new Set());
  const pending = useRef(new Map());

  const showAgain = (keys) =>
    setHiddenKeys((current) => {
      const next = new Set(current);
      keys.forEach((key) => next.delete(key));
      return next;
    });

  useEffect(
    () => () => {
      pending.current.forEach((timer) => clearTimeout(timer));
      pending.current.clear();
    },
    [],
  );

  const schedule = ({ key, keys = [key], label, execute, onSuccess }) => {
    if (keys.some((item) => hiddenKeys.has(item)) || pending.current.has(key))
      return;

    setHiddenKeys((current) => new Set([...current, ...keys]));

    const undo = () => {
      if (!pending.current.has(key)) return;
      clearTimeout(pending.current.get(key));
      pending.current.delete(key);
      showAgain(keys);
      api.destroy(key);
      api.success({ message: "Deletion undone.", duration: 3 });
    };

    const timer = setTimeout(async () => {
      pending.current.delete(key);
      api.open({
        key,
        message: "Deleting...",
        description: label,
        duration: 0,
        closable: false,
        btn: null,
      });

      try {
        const result = await execute();
        api.destroy(key);
        
        if (result?.failedKeys?.length) {
          showAgain(result.failedKeys);
          api.error({
            message: "Some products could not be deleted.",
            description:
              result.errorMessage ||
              "They have been restored to your list. Please try again.",
            duration: 0,
          });
        }

        if (!result?.failedKeys?.length)
          api.success({
            message: keys.length > 1 ? "Products deleted." : "Product deleted.",
            duration: 3,
          });

        onSuccess?.();
      } catch (error) {
        api.destroy(key);

        showAgain(keys);
        
        api.error({
          message: "Could not delete the product.",
          description: error.message,
          duration: 0,
        });
      }
    }, UNDO_SECONDS * 1000);

    pending.current.set(key, timer);
    
    api.open({
      key,
      message:
        keys.length > 1
          ? "Products removed from your list"
          : "Product removed from your list",
      description:
        label + ". Permanent deletion in " + UNDO_SECONDS + " seconds.",
      duration: 0,
      closable: false,
      btn: (
        <Button icon={<UndoOutlined />} onClick={undo}>
          Undo
        </Button>
      ),
    });
  };

  return (
    <UndoableActionsContext.Provider value={{ schedule, hiddenKeys }}>
      {contextHolder}
      {children}
    </UndoableActionsContext.Provider>
  );
}

export const useUndoableActions = () => useContext(UndoableActionsContext);
