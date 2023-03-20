import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItems from '../components/ListItems';
import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import AdminOrders from '../components/AdminOrders';
import AdminPuppies from '../components/AdminPuppies';
import AdminUsers from '../components/AdminUsers';
import Loading from '../components/Loading';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/home">
        Puppy Paradise
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

function DashboardContent() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const [currentView, setCurrentView] = useState('orders');
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken, adminToken, setAdminToken, cartItems, setCartItems, checkoutId, setCheckoutId] = useOutletContext();

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const renderAdmin = () => {
        setIsLoading(true);
        setIsLoading(false);
    }

    useEffect(() => {
      if (!adminToken) {
        navigate('/home')
      }
      renderAdmin();
    }, [currentView])

    return (
      <>
        {
            isLoading && <Loading />
        }
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Drawer variant="permanent" open={open}>
                <Toolbar
                    sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: [1],
                    }}
                >
                    <IconButton onClick={toggleDrawer}>
                        {
                            !open 
                            ?
                            <ChevronRightIcon />
                            :
                            <ChevronLeftIcon />
                        }
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component="nav">
                    <ListItems setCurrentView={setCurrentView} />
                    <Divider sx={{ my: 1 }} />
                </List>
                </Drawer>
                <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
                >
                    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                        {
                            currentView === 'orders' && <AdminOrders adminToken={adminToken} setIsLoading={setIsLoading} />
                        }
                        {
                            currentView === 'users' && <AdminUsers adminToken={adminToken} setIsLoading={setIsLoading} />
                        }
                        {
                            currentView === 'puppies' && <AdminPuppies adminToken={adminToken} setIsLoading={setIsLoading} />
                        }
                    </Container>
                    <Copyright sx={{ pt: 4 }} />
                </Box>
            </Box>
        </ThemeProvider>
      </>
    );
}

export default function Admin() {
  return <DashboardContent />;
}