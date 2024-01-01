import { BrowserRouter } from "react-router-dom";
import { RootRouter } from "./router/rootRouter.tsx";
import "./css/common.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <RootRouter />
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
