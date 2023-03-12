import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


export default function ButtonAppBar({ token, setToken, adminToken, setAdminToken}) {
  
  const { href } = window.location;
  const BASE_URL = 'http://localhost:3000/'

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    setToken('');
    setAdminToken('');
  }
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Puppy Paradise
          </Typography>
            {
              href !== BASE_URL + 'home' 
              && 
              <Button color="inherit" href="/home">Home</Button>
            }
            {
              adminToken 
              && 
              href !== BASE_URL + 'admin' 
              && 
              <Button color="inherit" href="/admin">Admin</Button>
            }
            {
              token 
              &&
              href !== BASE_URL + 'profile' 
              && 
              <Button color="inherit" href="/profile">Profile</Button>
            }
            {
              token 
              &&
              <Button color="inherit" href="/home"onClick={logout}>Logout</Button>
            }
            {
              !token 
              && 
              href !== BASE_URL + 'register' 
              && 
              <Button color="inherit" href="/register">Register</Button>
            }
            {
              !token 
              &&
              href !== BASE_URL + 'login' 
              && 
              <Button color="inherit" href="/login">Login</Button>
            }
            {
              <IconButton
                size="large"
                color="inherit"
                aria-label="cart"
                href="/cart"
              >
                <ShoppingCartIcon />
              </IconButton>
            } 
        </Toolbar>
      </AppBar>
    </Box>
  );
}