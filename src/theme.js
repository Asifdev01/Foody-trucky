import { createTheme } from "@mui/material/styles";

// ─── Design tokens ───────────────────────────────────────────────────────────
// One accent pairing, used everywhere: a confident warm terracotta/orange for
// primary actions + an olive-green for secondary/success states. Both already
// existed in scattered, inconsistent shades across the old codebase
// (#df6d2d, #87A920, #b1dd2b) — this formalizes them into one system instead
// of introducing an unrelated new palette.
const colors = {
  cream: "#FBF6EC",
  paper: "#FFFFFF",
  ink: "#241F1B",
  inkSoft: "#6B6259",
  orange: {
    main: "#E2672B",
    light: "#F0916A",
    dark: "#B44F1F",
  },
  olive: {
    main: "#7C9A3C",
    light: "#A3C167",
    dark: "#5C7A26",
  },
  border: "rgba(36, 31, 27, 0.1)",
};

// Donation/status color mapping, kept as a plain export (not shoehorned into
// MUI's palette API) so StatusChip and anything else can look statuses up
// directly: theme.custom.status.Pending, etc.
const status = {
  Pending: { color: "#C68A00", bg: "#FCEFD1" },
  Accepted: { color: "#2F6F82", bg: "#E1EEF1" },
  Distributed: { color: colors.olive.dark, bg: "#E9F0DC" },
  Rejected: { color: "#B23A2E", bg: "#F6DFDB" },
  Expired: { color: "#8A8580", bg: "#EDEBE8" },
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.orange.main,
      light: colors.orange.light,
      dark: colors.orange.dark,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: colors.olive.main,
      light: colors.olive.light,
      dark: colors.olive.dark,
      contrastText: "#FFFFFF",
    },
    background: {
      default: colors.cream,
      paper: colors.paper,
    },
    text: {
      primary: colors.ink,
      secondary: colors.inkSoft,
    },
    divider: colors.border,
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",
    h1: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "3.25rem", lineHeight: 1.1, letterSpacing: "-0.02em" },
    h2: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "2.5rem", lineHeight: 1.15, letterSpacing: "-0.01em" },
    h3: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "2rem", lineHeight: 1.2 },
    h4: { fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "1.5rem", lineHeight: 1.25 },
    h5: { fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "1.25rem", lineHeight: 1.3 },
    h6: { fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "1.1rem", lineHeight: 1.35 },
    body1: { fontSize: "1rem", lineHeight: 1.65 },
    body2: { fontSize: "0.9rem", lineHeight: 1.6 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: colors.cream },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          padding: "10px 24px",
          fontWeight: 600,
          boxShadow: "none",
        },
        containedPrimary: {
          "&:hover": { boxShadow: "0 8px 20px rgba(226, 103, 43, 0.35)" },
        },
        containedSecondary: {
          "&:hover": { boxShadow: "0 8px 20px rgba(124, 154, 60, 0.35)" },
        },
        outlined: {
          borderWidth: 2,
          "&:hover": { borderWidth: 2 },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: colors.paper,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 4px 24px rgba(36, 31, 27, 0.06)",
          border: `1px solid ${colors.border}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 9999,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.cream,
          color: colors.ink,
          boxShadow: "none",
          borderBottom: `1px solid ${colors.border}`,
        },
      },
    },
  },
});

theme.custom = { colors, status };

export default theme;
export { colors, status };
