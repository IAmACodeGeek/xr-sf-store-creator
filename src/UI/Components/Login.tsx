import {
  Box,
  Button,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import MailIcon from "@mui/icons-material/Mail";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 1) Parse brandName from query params
  const urlParams = new URLSearchParams(window.location.search);
  const brandNameFromQuery = urlParams.get("brandName");

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      console.log("Google Login Success:", response);

      try {
        // A) Fetch user profile using the Google access token
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
          {
            headers: { Authorization: `Bearer ${response.access_token}` },
          }
        );
        const userProfile = await res.json();
        console.log("User Profile:", userProfile);

        // B) Store user data in localStorage (optional)
        localStorage.setItem("user", JSON.stringify(userProfile));

        // C) Store Access Token in Cookies
        Cookies.set("accessToken", response.access_token, {
          expires: 1 / 24, // 1 hour
          secure: true,
          sameSite: "Strict",
        });

        const user = JSON.parse(localStorage.getItem("user") || "{}");

        // D) Now call your POST API with the user’s email (from input or userProfile)
        const postResponse = await fetch(
          "https://function-15-934416248688.us-central1.run.app",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email }),
          }
        );

        if (!postResponse.ok) {
          throw new Error(`API returned status ${postResponse.status}`);
        }

        const data = await postResponse.json();

        console.log(data);

        // E) Compare brandName from response with brandNameFromQuery
        if (brandNameFromQuery && data["brand_name"] === brandNameFromQuery) {
          console.log(brandNameFromQuery);
          console.log(data["brand_name"]);
          // MATCH => brand environment is correct
          toast.success("Successful: brand configuration matches!");
          // Optionally navigate to /canvas or /dashboard
          navigate("/canvas");
        } else {
          // MISMATCH => Clear localStorage + remove cookies + show error
          localStorage.removeItem("user");
          Cookies.remove("accessToken");

          toast.error("It is not your configuration");
        }
      } catch (error) {
        console.error("Failed to handle Google login flow:", error);
        toast.error("Something went wrong during login");
      }
    },
    onError: () => {
      console.log("Google Login Failed");
    },
    scope: "openid email profile",
  });

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          width: "100%",
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="black">
          Welcome to XR Store
        </Typography>
        <Typography variant="body2" color="gray" marginBottom="20px">
          Please login or sign up to continue
        </Typography>

        <TextField
          fullWidth
          placeholder="Your Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          }}
        >
          Sign Up
        </Button>

        {/* 🔹 Google Login Button */}
        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon />}
          sx={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "15px",
            marginY: "20px",
            textTransform: "none",
          }}
          onClick={() => googleLogin()}
        >
          Continue with Google
        </Button>

        <Typography variant="body2" color="black" sx={{ marginTop: "15px" }}>
          Already have an account? <a href="/auth">Login</a>
        </Typography>
        <ToastContainer />
      </Box>
    </Container>
  );
}
