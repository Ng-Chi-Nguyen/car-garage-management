import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

export function useActivityFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateSearchParams = (updater) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        updater(next);
        return next;
      },
      { replace: true }
    );
  };

  const filters = useMemo(() => {
    return {
      period: searchParams.get("period") || "today",
      user: searchParams.get("user") || "all",
      actionType: searchParams.get("actionType") || "all",
      status: searchParams.get("status") || "all",
      search: searchParams.get("search") || "",
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
    };
  }, [searchParams]);

  const setFilter = (key, value) => {
    updateSearchParams((next) => {
      if (value === undefined || value === null || value === "") {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }

      if (key !== "page") {
        next.set("page", "1");
      }
    });
  };

  const setFilters = (nextValues = {}) => {
    updateSearchParams((next) => {
      Object.entries(nextValues).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          next.delete(key);
          return;
        }

        next.set(key, String(value));
      });

      if (!Object.prototype.hasOwnProperty.call(nextValues, "page")) {
        next.set("page", "1");
      }
    });
  };

  const resetFilters = () => {
    setSearchParams(
      new URLSearchParams({
        period: "today",
        user: "all",
        actionType: "all",
        status: "all",
        page: "1",
        limit: "10",
      }),
      { replace: true }
    );
  };

  return { filters, setFilter, setFilters, resetFilters };
}
