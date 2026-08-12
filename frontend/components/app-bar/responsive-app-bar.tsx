"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

import { User } from "@/features/users/users.type";
import styles from "./responsive-app-bar.module.css";
import api from "@/utils/api/api";

const pages = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Tags", href: "/tags" },
  { label: "My Feedback", href: "/my-feedbacks" },
];

interface ResponsiveAppBarProps {
  user: User | null;
}

function ResponsiveAppBar({ user }: ResponsiveAppBarProps) {
  const router = useRouter();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    const { data } = await api.post("/auth/signout");
    if (data.status === "success") {
      setAnchorElUser(null);
      router.push("/login");
      router.refresh();
    }
  };

  const avatarLetter = user?.username?.charAt(0).toUpperCase() ?? "U";

  return (
    <AppBar position="static" className={styles.appBar}>
      <Container maxWidth="xl">
        <Toolbar disableGutters className={styles.toolbar}>
          {/* Desktop Logo */}
          <Typography
            component={Link}
            href="/"
            className={`${styles.logo} ${styles.desktopLogo}`}
          >
            Feedloop
          </Typography>

          {/* Mobile Menu */}
          <Box className={styles.mobileMenu}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
              aria-label="open navigation"
            >
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              className={styles.mobileNav}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.href}
                  component={Link}
                  href={page.href}
                  onClick={handleCloseNavMenu}
                >
                  {page.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <Typography
            component={Link}
            href="/"
            className={`${styles.logo} ${styles.mobileLogo}`}
          >
            Feedloop
          </Typography>

          {/* Desktop Navigation */}
          <Box className={styles.desktopNav}>
            {pages.map((page) => (
              <Button
                key={page.href}
                component={Link}
                href={page.href}
                className={styles.navButton}
              >
                {page.label}
              </Button>
            ))}
          </Box>

          {/* Auth Section */}
          <Box className={styles.authSection}>
            {user ? (
              <>
                <Tooltip title={user.username}>
                  <IconButton onClick={handleOpenUserMenu}>
                    <Avatar className={styles.avatar}>{avatarLetter}</Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem disabled>
                    <div>
                      <strong>{user.username}</strong>
                      <div className={styles.email}>{user.email}</div>
                    </div>
                  </MenuItem>

                  <MenuItem
                    component={Link}
                    href="/my-feedbacks"
                    onClick={handleCloseUserMenu}
                  >
                    My Feedback
                  </MenuItem>

                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                href="/login"
                variant="contained"
                className={styles.loginButton}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
