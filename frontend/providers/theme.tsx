import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0777D9",
      contrastText: "#d4faff",
    },
    secondary: {
      main: "#8072c2",
      contrastText: "#f1f1f8",
    },
    success: {
      main: "#00a14c",
      contrastText: "#e4f8e8",
    },
    warning: {
      main: "#de9a00",
      contrastText: "#261800",
    },
    error: {
      main: "#f9423d",
      contrastText: "#ffebe7",
    },
    info: {
      main: "#068DE4",
      contrastText: "#def6ff",
    },
    background: {
      default: "#FFFFFF",
      paper: "#F3F5F6",
    },
    text: {
      primary: "#0f1216",
      secondary: "#3a3d42",
    },
    divider: "#d5d8db",
    mode: "light",
  },
  spacing: 7,
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily:
      '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
});

export default function ThemeProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
