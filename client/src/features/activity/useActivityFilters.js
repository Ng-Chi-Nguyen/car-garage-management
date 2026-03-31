import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

export function useActivityFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    return {
      period: searchParams.get("period") || "today",
      user: searchParams.get("user") || "all",
      actionType: searchParams.get("actionType") || "all",
      page: Number(searchParams.get("page")) || 1,
    };
  }, [searchParams]);

  const setFilter = (key, value) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === undefined || value === null || value === "") {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        if (key !== "page") {
          next.set("page", "1");
        }
        return next;
      },
      { replace: true }
    );
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  return { filters, setFilter, resetFilters };
}
