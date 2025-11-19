"use client";

import { createTheme } from "@mui/material/styles";

const coalaColors = {
  primary: "#6A3AB2",
  secondary: "#FEE500",
  gradientStart: "#FF69B4",
  gradientEnd: "#FF8C00",
  background: "#FFFFFF",
  text: "#171717",
};

const theme = createTheme({
  colorSchemes: { light: true },
  cssVariables: {
    colorSchemeSelector: "class",
  },
  palette: {
    primary: {
      main: coalaColors.primary,
      light: "#8A5ED9",
      dark: "#4A2A7F",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: coalaColors.secondary,
      light: "#FFEB3B",
      dark: "#FBC02D",
      contrastText: "#171717",
    },
    background: {
      default: coalaColors.background,
      paper: "#FFFFFF",
    },
    text: {
      primary: coalaColors.text,
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: "var(--font-roboto), Arial, Helvetica, sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          fontSize: "1rem",
        },
      },
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            backgroundColor: coalaColors.primary,
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#583095",
            },
          },
        },
      ],
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "&:hover fieldset": {
              borderColor: coalaColors.primary,
            },
            "&.Mui-focused fieldset": {
              borderColor: coalaColors.primary,
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { severity: "info" },
              style: {
                backgroundColor: "#60a5fa",
              },
            },
          ],
        },
      },
    },
  },
});

export default theme;
