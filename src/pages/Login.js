import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { getCart, loginUser, removeResetPassword } from '../utils/API';
import { useOutletContext, useNavigate } from 'react-router-dom';
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

const theme = createTheme();

export default function Login() {
    const navigate = useNavigate();
    const [needsReset, setNeedsReset] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken, adminToken, setAdminToken, cartItems, setCartItems, checkoutId, setCheckoutId] = useOutletContext();
    const [passwordError, setPasswordError] = useState(false);
    const [passwordConfirmError, setPasswordConfirmError] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [userId, setUserId] = useState(0);

    useEffect(() => {
        if (adminToken) {
            navigate('/admin');
        } else if (token) {
            navigate('/home');
        }
    }, [token, adminToken, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const data = new FormData(event.currentTarget);
        const password = data.get('password');
        const email = data.get('email');
        const user = await loginUser(email, password);

        if (user.userId) {
            setUserId(user.userId)
        }

        if (user.needsReset) {
            setErrorMessage('');
            setNeedsReset(true);
        }

        if (user.status === 'inactive') {
            setErrorMessage(user.message)
        } else if (user.error) {
            setErrorMessage(user.message)
        }

        if (user.token) {
            const userCart = await getCart(user.token);
            localStorage.removeItem('cartItems');
            setCartItems(userCart.cartItems)
            localStorage.setItem('token', user.token);
            setToken(user.token)
        }

        if (user.adminToken) {
            localStorage.setItem('adminToken', user.adminToken);
            setAdminToken(user.adminToken);
        }

        setIsLoading(false);
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const data = new FormData(event.currentTarget);
        const password = data.get('passwordNew');
        const passwordConfirm = data.get('passwordConfirm');

        if (password.length < 8) {
            setPasswordError(true);
        } else if (password.length >= 8) {
            setPasswordError(false);
        }
        
        if (passwordConfirm.length < 8) {
            setPasswordConfirmError(true);
        } else if (passwordConfirm.length >= 8) {
            setPasswordConfirmError(false);
        }
        
        if (passwordError || passwordConfirmError) {
            setIsLoading(false);
            return;
        }

        if (password !== passwordConfirm) {
            setPasswordsMatch(false);
            setIsLoading(false);
            return;
        } else {
            setPasswordsMatch(true);
        }

        const user = await removeResetPassword(userId, password);

        if (user.error) {
            setErrorMessage(user.message);
        } else {
            if (user.token) {
                localStorage.setItem('token', user.token);
                setToken(user.token)
            }
    
            if (user.adminToken) {
                localStorage.setItem('adminToken', user.adminToken);
                setAdminToken(user.adminToken);
            }
        }

        setIsLoading(false);
    };

    return (
    <>
        {
            isLoading && <Loading />
        }
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    {
                        !needsReset ?
                        <>
                            <Typography component="h1" variant="h5">
                                Sign in
                            </Typography>
                            {
                                errorMessage && <Typography component="p" variant="h6" sx={{ color: 'red' }}>
                                    {errorMessage}
                                </Typography>
                            }
                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                />
                                <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                >
                                Sign In
                                </Button>
                                <Grid container>
                                    <Grid item>
                                        <Link href="/register" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </>
                        :
                        <>
                            <Typography component="h1" variant="h5">
                                Please Reset Your Password
                            </Typography>
                            {
                                errorMessage && <Typography component="p" variant="h6" sx={{ color: 'red' }}>
                                    {errorMessage}
                                </Typography>
                            }
                            <Box component="form" onSubmit={handlePasswordSubmit} noValidate sx={{ mt: 1 }}>
                                {
                                    passwordError ?
                                        <TextField
                                            margin="normal"
                                            error
                                            helperText="Password too short"
                                            required
                                            fullWidth
                                            name="passwordNew"
                                            label="New Password"
                                            type="password"
                                            id="passwordNew"
                                            autoComplete="new-password"
                                        />
                                    :
                                        !passwordsMatch ? 
                                            <TextField
                                                margin="normal"
                                                error
                                                helperText="Passwords don't match"
                                                required
                                                fullWidth
                                                name="passwordNew"
                                                label="New Password"
                                                type="password"
                                                id="passwordNew"
                                                autoComplete="new-password"
                                            />
                                        :
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                name="passwordNew"
                                                label="New Password"
                                                type="password"
                                                id="passwordNew"
                                                autoComplete="new-password"
                                            />
                                }
                                {
                                    passwordConfirmError ?
                                            <TextField
                                                error
                                                helperText="Password too short"
                                                required
                                                fullWidth
                                                name="passwordConfirm"
                                                label="Confirm Password"
                                                type="password"
                                                id="passwordConfirm"
                                                autoComplete="new-password"
                                            />
                                    :
                                        !passwordsMatch ? 
                                            <TextField
                                                error
                                                helperText="Passwords don't match"
                                                required
                                                fullWidth
                                                name="passwordConfirm"
                                                label="Confirm Password"
                                                type="password"
                                                id="passwordConfirm"
                                                autoComplete="new-password"
                                            />
                                        :
                                            <TextField
                                                required
                                                fullWidth
                                                name="passwordConfirm"
                                                label="Confirm Password"
                                                type="password"
                                                id="passwordConfirm"
                                                autoComplete="new-password"
                                            />
                                }
                                <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                >
                                Reset Password
                                </Button>
                                <Grid container>
                                    <Grid item>
                                        <Link href="/register" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </>
                    }
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    </>
    );
}