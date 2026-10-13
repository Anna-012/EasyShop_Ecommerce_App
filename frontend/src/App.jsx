import { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import ClientRoutes from "./routes/ClientRoutes";
import SellerRoutes from "./routes/SellerRoutes";
import AdminRoutes from "./routes/AdminRoutes";

const HideBirdLoaderOnRoute = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // HomePage handles its own initial loading.
    // Other routes should not leave the full-screen loader visible.
    if (pathname !== "/") {
      window.hideBirdLoader?.();
    }
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <BrowserRouter>
      <HideBirdLoaderOnRoute />
      <ClientRoutes />
      <SellerRoutes />
      <AdminRoutes />
    </BrowserRouter>
  );
};

export default App;
