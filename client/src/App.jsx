import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./app/router";

const retryQuery = (failureCount, error) => {
  const status = error?.response?.status;

  if (status && status >= 400 && status < 500) {
    return false;
  }

  return failureCount < 2;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: retryQuery,
    },
    mutations: {
      retry: retryQuery,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
