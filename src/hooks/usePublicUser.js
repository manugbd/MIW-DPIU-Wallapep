import { useEffect, useState } from "react";
import { getPublicUser } from "@/services/usersService";

export const usePublicUser = (id, { enabled = true } = {}) => {
  const [state, setState] = useState({
    user: null,
    loading: true,
    error: "",
  });
  
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    if (!enabled || id == null) return;

    if (!Number.isSafeInteger(Number(id)) || Number(id) <= 0) {
      setState({
        user: null,
        loading: false,
        error: "Choose a valid user.",
      });
      return;
    }

    let active = true;

    setState({
      user: null,
      loading: true,
      error: "",
    });

    getPublicUser(id, {
      force: revision > 0,
    })
      .then((user) => {
        if (active)
          setState({
            user,
            loading: false,
            error: "",
          });
      })
      .catch((error) => {
        if (active)
          setState({
            user: null,
            loading: false,
            error: error.message,
          });
      });

    return () => {
      active = false;
    };
  }, [id, enabled, revision]);

  const reload = () => setRevision((value) => value + 1);
  
  return {
    ...state,
    reload,
  };
};
