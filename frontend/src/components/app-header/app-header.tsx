"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";

import { useAuth } from "@/hooks/useAuth";
import { CoalaLogo } from "@/icons/coala-logo";
import styles from "./app-header.module.css";

export function AppHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      className={styles.header}
      sx={{
        backgroundColor: "background.paper",
        borderBottom: "3px solid",
        borderColor: "primary.main",
      }}
    >
      <Toolbar className={styles.toolbar}>
        <Box className={styles.logoContainer}>
          <Box className={styles.logoWrapper}>
            <Link href="/">
              <CoalaLogo
                style={{
                  height: "100%",
                  width: "auto",
                }}
              />
            </Link>
          </Box>
        </Box>

        {user && (
          <Box className={styles.userInfoContainer}>
            <Box className={styles.userInfo}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.primary",
                  fontWeight: 600,
                }}
              >
                {user.email}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  display: "block",
                }}
              >
                {user.role === "ATTENDANT" ? "Atendente" : "Médico"}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={handleLogout}
              sx={{
                width: 80,
                height: 40,
                borderColor: "primary.main",
                borderRadius: 6,
                transition: "all 0.2s ease",
                "&:hover": {
                  border: "none",
                  backgroundColor: "primary.light",
                  color: "secondary.light",
                  transform: "scale(0.9)",
                },
              }}
            >
              Sair
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
