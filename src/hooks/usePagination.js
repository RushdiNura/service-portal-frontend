import { useState, useCallback } from "react";

export const usePagination = (fetchFunction, initialPage = 1, limit = 10) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchFunction(page, limit);
      setData(result);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, fetchFunction]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return {
    data,
    loading,
    page,
    totalPages: data?.pages || 1,
    handlePageChange,
    refetch: fetchData,
  };
};
