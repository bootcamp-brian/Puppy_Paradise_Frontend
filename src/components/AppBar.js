import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Badge } from '@mui/material';
import { useState, useEffect } from 'react';


export default function ButtonAppBar({ token, setToken, adminToken, setAdminToken, cartItems, setCartItems}) {
  const { href } = window.location;
  const BASE_URL = 'http://localhost:3000/'

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('cartItems');
    setToken('');
    setAdminToken('');
    setCartItems([]);
  }

  const matches = useMediaQuery('(max-width:800px)');

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Puppy Paradise
          </Typography>
            {
              matches && <MenuIcon /> 
            }
            {
              !matches
              &&
              href !== BASE_URL + 'home' 
              && 
              <Button color="inherit" href="/home">Home</Button>
            }
            {
              !matches
              &&
              adminToken 
              && 
              href !== BASE_URL + 'admin' 
              && 
              <Button color="inherit" href="/admin">Admin</Button>
            }
            {
              !matches
              &&
              token 
              &&
              href !== BASE_URL + 'profile' 
              && 
              <Button color="inherit" href="/profile">Profile</Button>
            }
            {
              !matches
              &&
              token 
              &&
              <Button color="inherit" href="/home"onClick={logout}>Logout</Button>
            }
            {
              !matches
              &&
              !token 
              && 
              href !== BASE_URL + 'register' 
              && 
              <Button color="inherit" href="/register">Register</Button>
            }
            {
              !matches
              &&
              !token 
              &&
              href !== BASE_URL + 'login' 
              && 
              <Button color="inherit" href="/login">Login</Button>
            }
            {
              !matches
              &&
              <IconButton
                size="large"
                color="inherit"
                aria-label="cart"
                href="/cart"
              >
                <Badge badgeContent={cartItems.length} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            } 
        </Toolbar>
      </AppBar>
    </Box>
  );
}