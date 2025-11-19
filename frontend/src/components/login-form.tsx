"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
} from "@mui/material";

import { useAuth } from "@/hooks/useAuth";
import { isValidRole } from "@/lib/role-utils";
import { getDashboardRoute } from "@/lib/get-dashboard-route";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email é obrigatório");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email inválido");
      return;
    }

    if (!password.trim()) {
      setError("Senha é obrigatória");
      return;
    }

    if (password.length < 8) {
      setError("Senha deve ter no mínimo 8 caracteres");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn(email.trim(), password);

      if (result.success && result.user) {
        if (isValidRole(result.user.role)) {
          const dashboardRoute = getDashboardRoute(result.user.role);
          router.push(dashboardRoute);
        } else {
          setError("Role não reconhecido");
        }
      } else {
        setError(result.error || "Credenciais inválidas");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
        maxWidth: 400,
      }}
    >
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Box
          component="h1"
          sx={{
            fontSize: "2.5rem",
            fontWeight: 800,
            color: "primary.main",
            mb: 1,
            letterSpacing: "-0.02em",
          }}
        >
          HealthFlow
        </Box>
        <Box sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
          Faça login para continuar
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        variant="outlined"
        disabled={loading}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "background.paper",
          },
        }}
      />

      <TextField
        label="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        variant="outlined"
        disabled={loading}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "background.paper",
          },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        sx={{
          py: 1.5,
          fontSize: "1rem",
          fontWeight: 600,
          mt: 1,
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
      </Button>
    </Box>
  );
}
