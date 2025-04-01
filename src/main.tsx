import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Cookies from "js-cookie";
import Login from "./UI/Components/Login";
import CanvasWrapper from "./canvaswrapper";
import "./index.scss";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

// 🔍 Hook to get full query string (e.g. ?env=Castle&brandName=krishna)
const useQueryString = () => {
  const location = useLocation();
  return location.search;
};

// 📦 Optional: Parse query string into an object
export const useQueryParamsObject = () => {
  const search = useQueryString();
  return React.useMemo(() => {
    const params = new URLSearchParams(search);
    return Object.fromEntries(params.entries());
  }, [search]);
};

// 🔄 Component to preserve query params across all routes
// eslint-disable-next-line react-refresh/only-export-components
const QueryParamsPreserver = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [initialQuery] = useState(() => location.search);

  useEffect(() => {
    if (initialQuery && location.search !== initialQuery) {
      navigate(`${location.pathname}${initialQuery}`, { replace: true });
    }
  }, [location.pathname, location.search, navigate, initialQuery]);

  return <>{children}</>;
};

// 🔐 Protected route that preserves query params
// eslint-disable-next-line react-refresh/only-export-components
const ProtectedRoute = ({ component: Component }: { component: React.FC }) => {
  const token = Cookies.get("accessToken");
  const query = useQueryString();

  if (!token) {
    return <Navigate to={`/auth${query}`} replace />;
  }

  return <Component />;
};

// 🔄 Redirect fallback with query param preservation
// eslint-disable-next-line react-refresh/only-export-components
const RedirectToAuth = () => {
  const query = useQueryString();
  return <Navigate to={`/auth${query}`} replace />;
};

// eslint-disable-next-line react-refresh/only-export-components
function AppRouter() {
  // Check if mobile
  const checkIfMobile = () => {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|Opera Mini|Kindle|Silk|Mobile|Tablet|Touch/i.test(navigator.userAgent)
    );
  }
  const [isMobile, setIsMobile] = useState(checkIfMobile);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if(!isMobile) {
    return (
      <GoogleOAuthProvider clientId={clientId}>
        <Router>
          <QueryParamsPreserver>
            <Routes>
              <Route path="/auth" element={<Login />} />
              <Route
                path="/canvas"
                element={<ProtectedRoute component={CanvasWrapper} />}
              />
              <Route path="*" element={<RedirectToAuth />} />
            </Routes>
          </QueryParamsPreserver>
        </Router>
      </GoogleOAuthProvider>
    );
  }
  else{
    return (
      <div style={{
        padding: 20, boxSizing: "border-box",
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        width: "100vw", height: "100vh"
      }}>
        <h3 style={{
          fontFamily: "Poppins, sans-seriff", fontWeight: "bold", textAlign: "center",
          color: "#f26e02"
        }}>Please open the store builder on your desktop!</h3>
      </div>
    );
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
