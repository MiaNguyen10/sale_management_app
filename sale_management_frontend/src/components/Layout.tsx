import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import React from "react";
import logo from "../assets/Logo.png";
import { useAppDispatch } from "../store/store";
import { logout } from "../store/slices/authSlice";
import { Link, useNavigate } from "react-router";
import { path } from "../utils/Constants";
import { decodeToken } from "../utils/jwtUtils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const decodedToken = decodeToken(token!);
  const name = decodedToken ? decodedToken.name : "";

  const handleLogout = () => {
    dispatch(logout());
    navigate(path.login);
  };

  return (
    <div className="h-screen">
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ backgroundColor: "#D9DFC6" }}>
          <Toolbar>
            {/* Use a Link component to make the logo clickable without using a button */}
            <Box
              component={Link}
              to={path.homepage}
              sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
            >
              <img
                src={logo}
                alt="Logo"
                className="w-20 cursor-pointer"
              />
            </Box>
            <Typography
              variant="h5"
              component="div"
              sx={{ flexGrow: 1 }}
              style={{ color: "#4B5945", fontWeight: "bold" }}
            >
              {name}
            </Typography>
            <Box className="flex items-center space-x-1">
              <IconButton
                style={{ color: "#4B5945", cursor: "pointer" }}
                onClick={() => navigate(path.profile)}
                aria-label="Profile"
              >
                <PersonIcon />
              </IconButton>
              <IconButton
                style={{ color: "#4B5945", cursor: "pointer" }}
                aria-label="Settings"
              >
                <SettingsIcon />
              </IconButton>
              <IconButton
                style={{ color: "#4B5945", cursor: "pointer" }}
                aria-label="Shopping Cart"
              >
                <ShoppingCartIcon />
              </IconButton>
              <IconButton
                style={{ color: "#4B5945", cursor: "pointer" }}
                onClick={handleLogout}
                aria-label="Logout"
              >
                <LogoutIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {children}
    </div>
  );
};

export default Layout;
