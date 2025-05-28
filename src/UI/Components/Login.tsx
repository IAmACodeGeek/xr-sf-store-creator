import {
  Box,
  Button,
  Container,
  InputAdornment,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import MailIcon from "@mui/icons-material/Mail";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from "../../api/LoginApi";
import useAutoLogin from "../../autoLoginHook";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const brandNameFromQuery = urlParams.get("brandName");

  const { isChecking } = useAutoLogin("/canvas");

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      console.log("Google Login Success:", response);
      setIsLoading(true);

      try {
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
          {
            headers: { Authorization: `Bearer ${response.access_token}` },
          }
        );
        const userProfile = await res.json();
        console.log("User Profile:", userProfile);

        localStorage.setItem("user", JSON.stringify(userProfile));

        Cookies.set("accessToken", response.access_token, {
          expires: 1 / 24, // 1 hour
          secure: true,
          sameSite: "Strict",
          domain: "strategyfox.in"
        });

        const postResponse = await fetch(
          "https://function-15-201137466588.asia-south1.run.app",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userProfile.email }),
          }
        );

        if (!postResponse.ok) {
          throw new Error(`API returned status ${postResponse.status}`);
        }

        const data = await postResponse.json();
        console.log("Brand verification response:", data);

        if (brandNameFromQuery) {
          if (data["brand_name"] === brandNameFromQuery) {
            Cookies.set("brandName", brandNameFromQuery, {
              expires: 1 / 24, // 1 hour
              secure: true,
              sameSite: "Strict",
            });
            toast.success("Successful: brand configuration matches!");
            navigate("/canvas");
          } else {
            localStorage.removeItem("user");
            Cookies.remove("accessToken");
            toast.error("This is not your configuration");
          }
        } else {
          localStorage.removeItem("user");
          Cookies.remove("accessToken");
          toast.error("This is not your configuration");
        }
      } catch (error) {
        console.error("Failed to handle Google login flow:", error);
        toast.error("Something went wrong during login");
        localStorage.removeItem("user");
        Cookies.remove("accessToken");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      console.log("Google Login Failed");
      toast.error("Google login failed");
      setIsLoading(false);
    },
    scope: "openid email profile",
  });

  if (isChecking) {
    return (
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}>
        <Box
          sx={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            width: "100%",
          }}>
          <CircularProgress
            size={50}
            sx={{ color: "#FF7F32", marginBottom: "20px" }}
          />
          <Typography variant="h6" color="black">
            Checking authentication...
          </Typography>
          <Typography variant="body2" color="gray">
            Please wait while we verify your session
            {brandNameFromQuery && ` for ${brandNameFromQuery}`}
          </Typography>
        </Box>
      </Container>
    );
  }

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginUser({ email, password });

      if (result.success) {
        toast.success(result.message || "Login successful ✅");

        Cookies.set("accessToken", result.token, {
          expires: 1 / 24,
          secure: true,
          sameSite: "None",
          domain: "strategyfox.in"
        });

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            authType: result.user.authType,
            createdAt: result.user.createdAt,
          })
        );

        const postResponse = await fetch(
          "https://function-15-201137466588.asia-south1.run.app",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: result.user.email }),
          }
        );

        if (!postResponse.ok) {
          throw new Error(`API returned status ${postResponse.status}`);
        }

        const data = await postResponse.json();
        console.log("Brand verification response:", data);

        if (brandNameFromQuery) {
          if (data["brand_name"] === brandNameFromQuery) {
            Cookies.set("brandName", brandNameFromQuery, {
              expires: 1 / 24, // 1 hour
              secure: true,
              sameSite: "Strict",
            });
            toast.success("Successful: brand configuration matches!");
            navigate("/canvas");
          } else {
            localStorage.removeItem("user");
            Cookies.remove("accessToken");
            toast.error("This is not your configuration");
          }
        } else {
          localStorage.removeItem("user");
          Cookies.remove("accessToken");
          toast.error("This is not your configuration");
        }
      } else {
        toast.error(result.message || "Login failed ❌");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}>
      <Box
        sx={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          width: "100%",
        }}>
        <Typography variant="h5" fontWeight="bold" color="black">
          Welcome to XR Store
        </Typography>
        <Typography variant="body2" color="gray" marginBottom="20px">
          Please login or sign up to continue
          {brandNameFromQuery && (
            <>
              <br />
              Brand: <strong>{brandNameFromQuery}</strong>
            </>
          )}
        </Typography>

        <TextField
          fullWidth
          placeholder="Your Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          sx={{
            backgroundColor: "#f7f5f4",
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          placeholder="Your Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          sx={{
            backgroundColor: "#f7f5f4",
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          disabled={isLoading}
          sx={{
            backgroundColor: "#FF7F32",
            color: "white",
            marginTop: "15px",
            padding: "10px",
            fontSize: "16px",
            "&:hover": {
              backgroundColor: "#e66b28",
            },
            borderRadius: "15px",
          }}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon />}
          disabled={isLoading}
          sx={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "15px",
            marginY: "20px",
            textTransform: "none",
          }}
          onClick={() => googleLogin()}>
          Continue with Google
        </Button>

        <Typography variant="body2" color="black" sx={{ marginTop: "15px" }}>
          Don't have an account? <a href="/register">Sign Up</a>
        </Typography>
        <ToastContainer />
      </Box>
    </Container>
  );
}
